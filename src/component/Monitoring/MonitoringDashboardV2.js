import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Grid, Typography, Box, Stack, Tabs, Tab, 
  Accordion, AccordionSummary, AccordionDetails, Paper } from '@mui/material';
import { LineChart, XAxis, YAxis, Tooltip, Legend, Line, BarChart, Bar, PieChart, Pie, ResponsiveContainer } from 'recharts';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axiosInstance from '../../utils/axiosInstance';

const MonitoringDashboardV2 = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [metrics, setMetrics] = useState({
      orders: [],
      items: [],
      systemMetrics: null,
      analyticsMetrics: null
  });
  
  useEffect(() => {
      fetchAllMetrics();
  }, []);

  const fetchAllMetrics = async () => {
      try {
          const [orderMetrics, itemMetrics, systemMetrics, analyticsMetrics] = await Promise.all([
              axiosInstance.get('/api/public/monitoring/metrics/orders'),
              axiosInstance.get('/api/public/monitoring/metrics/items'),
              axiosInstance.get('/api/public/monitoring/metrics'),
              axiosInstance.get('/api/public/monitoring/metrics/analytics')
          ]);

          setMetrics({
              orders: orderMetrics.data,
              items: itemMetrics.data,
              systemMetrics: systemMetrics.data,
              analyticsMetrics: analyticsMetrics.data
          });
      } catch (error) {
          console.error('Error fetching metrics:', error);
      }
  };

  const renderSalesOverview = () => {
    const { analyticsMetrics} = metrics;
    if (!analyticsMetrics) return null;
    
    return (
      <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card className="h-full">
          <CardHeader title="Today's Sales Overview" />
          <CardContent>
            <Stack spacing={2}>
              <Box className="flex justify-between">
                <Typography>Total Orders:</Typography>
                <Typography>{analyticsMetrics.today?.total || 0}</Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography>Total Revenue:</Typography>
                <Typography>₩{analyticsMetrics.today?.revenue?.toLocaleString() || 0}</Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography>Average Order Value:</Typography>
                <Typography>₩{analyticsMetrics.today?.averageValue?.toLocaleString() || 0}</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card className="h-full">
          <CardHeader title="Category Breakdown" />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(analyticsMetrics.today?.categoryBreakdown || {}).map(([category, value]) => ({
                    name: category,
                    value
                  }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader title="Weekly Revenue Trend" />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={Object.entries(analyticsMetrics.weeklyStats || {}).map(([date, revenue]) => ({
                date,
                revenue
              }))}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    );
  };

  const renderPerformanceMetrics = () => {
    const { systemMetrics } = metrics;
    if (!systemMetrics) return null;
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card className="h-full">
            <CardHeader title="Performance Overview" />
            <CardContent>
              <Stack spacing={2}>
                <Box className="flex justify-between">
                  <Typography>Average Response Time:</Typography>
                  <Typography>{systemMetrics.summary.averageResponseTime.toFixed(2)}ms</Typography>
                </Box>
                <Box className="flex justify-between">
                  <Typography>Total Slow Queries:</Typography>
                  <Typography color="error">{systemMetrics.summary.totalSlowQueries}</Typography>
                </Box>
                <Box className="flex justify-between">
                  <Typography>Monthly Query Count:</Typography>
                  <Typography>{systemMetrics.summary.totalQueries}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="h-full">
            <CardHeader title="Query Types Distribution" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics.orders}>
                  <XAxis dataKey="methodName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalQueries" fill="#8884d8" name="Total Queries" />
                  <Bar dataKey="slowQueries" fill="#82ca9d" name="Slow Queries" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const tabContent = [
    {
      label: "Sales Analytics",
      content: renderSalesOverview()
    },
    {
      label: "Performance Metrics",
      content: renderPerformanceMetrics()
    }
  ];

  return (
    <Box className="w-full p-8">
      <Typography variant="h4" className="mb-6">
        Enhanced Monitoring Dashboard
      </Typography>
      
      <Tabs
        value={selectedTab}
        onChange={(e, newValue) => setSelectedTab(newValue)}
        className="mb-6"
      >
        {tabContent.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>
      
      {tabContent[selectedTab].content}
    </Box>
  );
    };

export default MonitoringDashboardV2;