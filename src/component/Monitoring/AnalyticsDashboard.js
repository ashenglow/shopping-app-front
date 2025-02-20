import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Grid, Typography, Box, Stack, Tabs, Tab } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axiosInstance from '../../utils/axiosInstance';
import { object } from 'joi';
import { values } from 'core-js/core/array';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsDashboard = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            const response = await axiosInstance.get('/api/public/monitoring/analytics/stats');
            setAnalyticsData(response.data);
            
        }catch(error){
            console.error('Failed to fetch analytics:', error);
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
        const interval = setInterval(fetchAnalytics, 60000); // every minute
        return () => clearInterval(interval);
    }, []);

    if(loading || !analyticsData) return <Loading />;

    // transform data for charts

    const weeklyData = Object.entries(analyticsData.weekly || {}).map(([date, revenue]) => ({
        date,
        revenue
    }));

    const categoryData = Object.entries(analyticsData.categoryTotals || {}).map(([category, value]) => ({
        name: category,
        values
    }));
    
    return (
        <Box className="w-full p-8">
      <Typography variant="h4" className="mb-6">
        Sales Analytics Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Today's Overview */}
        <Grid item xs={12} md={6}>
          <Card className="h-full">
            <CardHeader title="Today's Overview" />
            <CardContent>
              <Stack spacing={2}>
                <Box className="flex justify-between">
                  <Typography>Total Orders:</Typography>
                  <Typography>{analyticsData.today?.totalOrders || 0}</Typography>
                </Box>
                <Box className="flex justify-between">
                  <Typography>Total Revenue:</Typography>
                  <Typography>₩{(analyticsData.today?.totalRevenue || 0).toLocaleString()}</Typography>
                </Box>
                <Box className="flex justify-between">
                  <Typography>Average Order Value:</Typography>
                  <Typography>₩{(analyticsData.today?.averageOrderValue || 0).toLocaleString()}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Breakdown */}
        <Grid item xs={12} md={6}>
          <Card className="h-full">
            <CardHeader title="Category Sales Distribution" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Weekly Revenue Trend */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Weekly Revenue Trend" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8884d8" 
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Development Tools */}
      {process.env.NODE_ENV === 'development' && (
        <Box className="mt-8">
          <Card>
            <CardHeader title="Development Tools" />
            <CardContent>
              <Stack direction="row" spacing={2}>
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={() => axiosInstance.post('/api/public/monitoring/analytics/run')}
                >
                  Run Analytics
                </button>
                <button 
                  className="px-4 py-2 bg-green-500 text-white rounded"
                  onClick={() => axiosInstance.post('/api/public/monitoring/analytics/generate/10')}
                >
                  Generate 10 Orders
                </button>
                <button 
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  onClick={() => axiosInstance.post('/api/public/monitoring/analytics/reset')}
                >
                  Reset Analytics
                </button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
    )
}

export default AnalyticsDashboard;