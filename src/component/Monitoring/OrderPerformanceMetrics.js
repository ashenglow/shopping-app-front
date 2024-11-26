import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Grid, Typography, Box, Stack, Tabs, Tab, 
  Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { LineChart, XAxis, YAxis, Tooltip, Legend, Line, BarChart, Bar, PieChart, Pie } from 'recharts';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axiosInstance from '../../utils/axiosInstance';

const OrderPerformanceMetrics = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [metrics, setMetrics] = useState({
      orders: [],
      items: [],
      systemMetrics: null
  });
  
  useEffect(() => {
      fetchAllMetrics();
  }, []);

  const fetchAllMetrics = async () => {
      try {
          const [orderMetrics, itemMetrics, systemMetrics] = await Promise.all([
              axiosInstance.get('/api/public/monitoring/metrics/orders'),
              axiosInstance.get('/api/public/monitoring/metrics/items'),
              axiosInstance.get('/api/public/monitoring/metrics')
          ]);

          setMetrics({
              orders: orderMetrics.data,
              items: itemMetrics.data,
              systemMetrics: systemMetrics.data
          });
      } catch (error) {
          console.error('Error fetching metrics:', error);
      }
  };

  const renderPerformanceSummary = (methodMetrics) => (
      <Grid item xs={12} md={6}>
          <Card>
              <Box p={2}>
                  <Typography variant="h6" gutterBottom>
                      {methodMetrics.methodName}
                  </Typography>
                  <Stack spacing={1}>
                      <Box display="flex" justifyContent="space-between">
                          <Typography>Average Time:</Typography>
                          <Typography>{methodMetrics.averageTime.toFixed(2)} ms</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                          <Typography>Total Queries:</Typography>
                          <Typography>{methodMetrics.totalQueries}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                          <Typography>Slow Queries:</Typography>
                          <Typography color="error">{methodMetrics.slowQueries}</Typography>
                      </Box>
                  </Stack>
              </Box>
          </Card>
      </Grid>
  );

  const renderTimeSeriesChart = (data, title) => (
      <Card sx={{ mb: 4 }}>
          <CardHeader title={title} />
          <CardContent>
              <LineChart width={800} height={300} data={data}>
                  <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                  />
                  <Legend />
                  {Object.keys(data[0] || {})
                      .filter(key => key !== 'timestamp')
                      .map((key, index) => (
                          <Line
                              key={key}
                              type="monotone"
                              dataKey={key}
                              name={key}
                              stroke={`hsl(${index * 137.5}, 70%, 50%)`}
                          />
                      ))}
              </LineChart>
          </CardContent>
      </Card>
  );

  const renderOptimizationSuggestions = (suggestions) => (
      <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Optimization Suggestions</Typography>
          </AccordionSummary>
          <AccordionDetails>
              <Stack spacing={1}>
                  {suggestions.map((suggestion, index) => (
                      <Typography key={index}>• {suggestion}</Typography>
                  ))}
              </Stack>
          </AccordionDetails>
      </Accordion>
  );

  const renderSystemOverview = () => (
      <Grid container spacing={3}>
          <Grid item xs={12}>
              <Card>
                  <CardHeader title="System Performance Overview" />
                  <CardContent>
                      <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                              <Typography variant="h6">Total Methods: {metrics.systemMetrics?.summary.totalMethods}</Typography>
                              <Typography variant="h6">Average Response Time: {metrics.systemMetrics?.summary.averageResponseTime.toFixed(2)} ms</Typography>
                          </Grid>
                          <Grid item xs={12} md={8}>
                              <PieChart width={400} height={300}>
                                  <Pie
                                      data={[
                                          { name: 'Normal Queries', value: metrics.systemMetrics?.summary.totalQueries - metrics.systemMetrics?.summary.totalSlowQueries },
                                          { name: 'Slow Queries', value: metrics.systemMetrics?.summary.totalSlowQueries }
                                      ]}
                                      dataKey="value"
                                      nameKey="name"
                                      cx="50%"
                                      cy="50%"
                                  />
                                  <Tooltip />
                                  <Legend />
                              </PieChart>
                          </Grid>
                      </Grid>
                  </CardContent>
              </Card>
          </Grid>
      </Grid>
  );

  const tabContent = [
      {
          label: "System Overview",
          content: renderSystemOverview()
      },
      {
          label: "Order Metrics",
          content: (
              <Box>
                  <Grid container spacing={2}>
                      {metrics.orders.map(renderPerformanceSummary)}
                  </Grid>
                  {renderTimeSeriesChart(metrics.orders.flatMap(m => m.timeSeriesData), "Order Response Times")}
                  {metrics.orders.map(method => (
                      method.optimizationSuggestions && 
                      renderOptimizationSuggestions(method.optimizationSuggestions)
                  ))}
              </Box>
          )
      },
      {
          label: "Item Metrics",
          content: (
              <Box>
                  <Grid container spacing={2}>
                      {metrics.items.map(renderPerformanceSummary)}
                  </Grid>
                  {renderTimeSeriesChart(metrics.items.flatMap(m => m.timeSeriesData), "Item Query Response Times")}
              </Box>
          )
      }
  ];

  return (
      <Box sx={{ width: '100%', p: 3 }}>
          <Tabs
              value={selectedTab}
              onChange={(e, newValue) => setSelectedTab(newValue)}
              sx={{ mb: 3 }}
          >
              {tabContent.map((tab, index) => (
                  <Tab key={index} label={tab.label} />
              ))}
          </Tabs>
          {tabContent[selectedTab].content}
      </Box>
  );
  };

  export default OrderPerformanceMetrics;