import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Grid, Typography, Box, Stack, Tabs, Tab, TableBody, TableCell, Table, TableHead, TableRow  } from '@mui/material';
import { LineChart, XAxis, YAxis, Tooltip, Legend, Line, BarChart, Bar, ResponsiveContainer} from 'recharts';
import axiosInstance from '../../utils/axiosInstance';

const OrderPerformanceMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [flowMetrics, setFlowMetrics] = useState(null); 
  const [activeTab, setActiveTab] = useState(0);
  
  useEffect(() => {
    // Fetch both metrics
    Promise.all([
      axiosInstance.get('/api/public/monitoring/metrics/orders'),
      axiosInstance.get('/api/public/monitoring/metrics/orders/flow')
    ])
      .then(([metricsResponse, flowResponse]) => {
        const groupedMetrics = groupMetricsByType(metricsResponse.data);
        setMetrics(groupedMetrics);
        setFlowMetrics(flowResponse.data);
      })
      .catch(error => console.error('Error fetching metrics:', error));
  }, []);
   const groupMetricsByType = (data) => {
    return {
      orderMethods: data.filter(m => m.methodName.includes('Order') || m.methodName.includes('order')),
      memberMethods: data.filter(m => m.methodName.includes('Member')),
      itemMethods: data.filter(m => m.methodName.includes('Item')),
      deliveryMethods: data.filter(m => m.methodName.includes('Delivery') || m.methodName.includes('delivery'))
    };
  };

  if (!metrics || !flowMetrics) return null;

  const renderMethodCards = (methods) => (
    <Grid container spacing={2}>
      {methods.map((method) => (
        <Grid item xs={12} md={6} key={method.methodName}>
          <Card>
            <Box p={2}>
              <Typography variant="h6" gutterBottom>
                {method.methodName.split('.').pop()}
              </Typography>
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Average Time:</Typography>
                  <Typography>{method.averageTime.toFixed(2)} ms</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Total Queries:</Typography>
                  <Typography>{method.totalQueries}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Slow Queries:</Typography>
                  <Typography color={method.slowQueries > 0 ? "error" : "inherit"}>
                    {method.slowQueries}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderTimeSeriesChart = (methods, title) => (
    <Card sx={{ mt: 3 }}>
      <CardHeader title={`${title} Response Time Trend`} />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={methods.flatMap(m => m.timeSeriesData || [])}>
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleString()}
              formatter={(value) => `${value.toFixed(2)} ms`}
            />
            <Legend />
            {methods.map((method, index) => (
              <Line
                key={method.methodName}
                type="monotone"
                dataKey="value"
                data={method.timeSeriesData}
                name={method.methodName.split('.').pop()}
                stroke={`hsl(${index * 137.5}, 70%, 50%)`}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderExecutionBreakdown = () => {
    const allMethods = Object.values(metrics).flat();
    const executionData = allMethods.map(method => ({
      name: method.methodName.split('.').pop(),
      averageTime: method.averageTime,
      queries: method.totalQueries
    }));

    return (
      <Card sx={{ mt: 3 }}>
        <CardHeader title="Query Execution Breakdown" />
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={executionData}>
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="averageTime" name="Avg Time (ms)" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="queries" name="Query Count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const OrderFlowBreakdown = ({ flowData }) => {
    const steps = Object.keys(flowData.steps);
  
  return (
    <Card>
      <CardContent>
        {/* Step Timing Bar Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={steps.map(step => ({
            name: step,
            duration: flowData.steps[step].duration,
            percentage: flowData.steps[step].percentageOfTotal
          }))}>
            <XAxis dataKey="name" />
            <YAxis yAxisId="time" orientation="left" label={{ value: "Time (ms)", angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="percentage" orientation="right" label={{ value: "% of Total", angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="time" dataKey="duration" fill="#8884d8" name="Duration (ms)" />
            <Bar yAxisId="percentage" dataKey="percentage" fill="#82ca9d" name="% of Total" />
          </BarChart>
        </ResponsiveContainer>

        {/* Query Breakdown Table */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Step</TableCell>
              <TableCell>Queries</TableCell>
              <TableCell align="right">Duration (ms)</TableCell>
              <TableCell align="right">% of Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {steps.map(step => (
              <TableRow key={step}>
                <TableCell>{step}</TableCell>
                <TableCell>{flowData.steps[step].queries?.join(', ') || 'No queries'}</TableCell>
                <TableCell align="right">{flowData.steps[step].duration}</TableCell>
                <TableCell align="right">
                  {flowData.steps[step].percentageOfTotal.toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Query Type Breakdown */}
        {flowData.queryBreakdown && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>Query Type Breakdown</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Query Type</TableCell>
                  <TableCell>Table</TableCell>
                  <TableCell align="right">Avg Duration (ms)</TableCell>
                  <TableCell align="right">Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {flowData.queryBreakdown.map((query, index) => (
                  <TableRow key={index}>
                    <TableCell>{query.queryType}</TableCell>
                    <TableCell>{query.table}</TableCell>
                    <TableCell align="right">{query.avgDuration.toFixed(2)}</TableCell>
                    <TableCell align="right">{query.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </CardContent>
    </Card>
  );
  };

  const renderOrderFlowSection = () => (
    <Card sx={{ mt: 3, mb: 3 }}>
      <CardHeader title="Recent Order Flows" />
      <CardContent>
        {flowMetrics.map((flow, index) => (
          <Box key={index} mb={3}>
            <Typography variant="subtitle1" gutterBottom>
              Order #{flow.orderId} - {new Date(flow.timestamp).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Total Execution Time: {flow.totalTime}ms
            </Typography>
            <OrderFlowBreakdown flowData={flow} />
          </Box>
        ))}
      </CardContent>
    </Card>
  );

  const tabs = [
    { label: 'Order Operations', content: metrics.orderMethods },
    { label: 'Member Validation', content: metrics.memberMethods },
    { label: 'Item Processing', content: metrics.itemMethods },
    { label: 'Delivery Handling', content: metrics.deliveryMethods }
  ];

  return (
    <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      Order Flow Performance Metrics
    </Typography>
    
    {/* Overall Performance Summary */}
    {renderExecutionBreakdown()}

    {/* Order Flow Section */}
    {renderOrderFlowSection()}

    {/* Tab Navigation */}
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
      <Tabs 
        value={activeTab} 
        onChange={(e, newValue) => setActiveTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>
    </Box>

    {/* Tab Content */}
    <Box sx={{ mt: 3 }}>
      {renderMethodCards(tabs[activeTab].content)}
      {renderTimeSeriesChart(tabs[activeTab].content, tabs[activeTab].label)}
    </Box>
  </Box>
  );
  };

  export default OrderPerformanceMetrics;