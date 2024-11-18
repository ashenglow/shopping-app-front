import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Grid, Typography, Box, Stack } from '@mui/material';
import { LineChart, XAxis, YAxis, Tooltip, Legend, Line, BarChart, Bar } from 'recharts';
import axiosInstance from '../../utils/axiosInstance';

const OrderPerformanceMetrics = () => {
    const [metrics, setMetrics] = useState(null);
    
    useEffect(() => {
        axiosInstance.get('/api/public/monitoring/metrics/orders')
          .then(response => {
            setMetrics(response.data);
          })
          .catch(error => console.error('Error fetching order metrics:', error));
      }, []);
      if (!metrics) return null;
    return (
        <Card>
          <CardHeader title="Order Performance Metrics" />
          <CardContent>
            {/* Method Performance Summary Cards */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {metrics.map((method) => (
                <Grid item xs={12} md={6} key={method.methodName}>
                  <Card>
                    <Box p={2}>
                      <Typography variant="h6" gutterBottom>
                        {method.methodName}
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
                          <Typography color="error">{method.slowQueries}</Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
    
            {/* Time Series Chart */}
            <Card sx={{ mb: 4 }}>
              <CardHeader title="Query Response Time Trend" />
              <CardContent>
                <LineChart 
                  width={800} 
                  height={300} 
                  data={metrics.flatMap(m => m.timeSeriesData)}
                >
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                  />
                  <Legend />
                  {metrics.map((method, index) => (
                    <Line
                      key={method.methodName}
                      type="monotone"
                      dataKey="value"
                      data={method.timeSeriesData}
                      name={method.methodName}
                      stroke={`hsl(${index * 137.5}, 70%, 50%)`}
                    />
                  ))}
                </LineChart>
              </CardContent>
            </Card>
    
            {/* Operation Breakdown Chart */}
            {metrics.map((method) => (
              method.operationBreakdown && (
                <Card key={`${method.methodName}-breakdown`} sx={{ mb: 4 }}>
                  <CardHeader title={`${method.methodName} Operation Breakdown`} />
                  <CardContent>
                    <BarChart
                      width={800}
                      height={300}
                      data={method.operationBreakdown}
                    >
                      <XAxis dataKey="operationName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="averageExecutionTime" fill="#8884d8" name="Avg Execution Time (ms)" />
                      <Bar dataKey="executionCount" fill="#82ca9d" name="Execution Count" />
                    </BarChart>
                  </CardContent>
                </Card>
              )
            ))}
          </CardContent>
        </Card>
    );
  };

  export default OrderPerformanceMetrics;