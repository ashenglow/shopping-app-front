import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Grid, Typography, Box, Stack, Tabs, Tab, 
  CircularProgress } from '@mui/material';
import { LineChart, XAxis, YAxis, Tooltip, Legend, Line, BarChart, Bar, PieChart, Pie, ResponsiveContainer } from 'recharts';
import axiosInstance from '../../utils/axiosInstance';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const UnifiedDashboard = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [data, setData] = useState({
        monitoring: null,
        analytics:null,
        loading: true,
        error:null
    });

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // refresh every minute
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try{
            const [monitoringRes, analyticsRes] = await Promise.all([
                axiosInstance.get('/api/public/monitoring/metrics'),
                axiosInstance.get('/api/public/monitoring/analytics/stats')
            ]);

            setData({
                monitoring: monitoringRes.data,
                analytics: analyticsRes.data,
                loading: false,
                error: null
            });

            console.log('Raw analytics response:', analyticsRes.data);
        }catch(error){
           setData(prev => ({
            ...prev,
            loading: false,
            error: "Failed to fetch dashboard data"
           }))
        }
        }

        const renderPerformanceMetrics = () => {
            const { monitoring } = data;
            if(!monitoring) return null;

            return (
                <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardHeader title="System Performance" />
                    <CardContent>
                      <Stack spacing={2}>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Average Response Time:</Typography>
                          <Typography>{monitoring.summary.averageResponseTime.toFixed(2)}ms</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Total Queries:</Typography>
                          <Typography>{monitoring.summary.totalQueries}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Slow Queries:</Typography>
                          <Typography color="error">{monitoring.summary.totalSlowQueries}</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
        
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardHeader title="Query Performance" />
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monitoring.timeSeriesData}>
                          <XAxis dataKey="timestamp" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="responseTime" stroke="#8884d8" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )
        }

        const renderSalesAnalytics = () => {
            const { analytics } = data;
            if(!analytics) return null;

            return (
                <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardHeader title="Today's Overview" />
                    <CardContent>
                      <Stack spacing={2}>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Total Orders:</Typography>
                          <Typography>{analytics.today?.totalOrders || 0}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Total Revenue:</Typography>
                          <Typography>₩{(analytics.today?.totalRevenue || 0).toLocaleString()}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Average Order Value:</Typography>
                          <Typography>₩{(analytics.today?.averageOrderValue || 0).toLocaleString()}</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
        
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardHeader title="Category Distribution" />
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={Object.entries(analytics.categoryTotals || {}).map(([category, value], index) => ({
                              name: category,
                              value,
                              fill: COLORS[index % COLORS.length]
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
                        <LineChart 
                          data={Object.entries(analytics.weekly || {}).map(([date, revenue]) => ({
                            date,
                            revenue
                          }))}
                        >
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
            )
        }

        if(data.loading){
            return (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                  <CircularProgress />
                </Box>
              );
            }
       if(data.error){
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <Typography color="error">{data.error}</Typography>
          </Box>
        )
       }     
       const tabs = [
        { label: "System Performance", content: renderPerformanceMetrics() },
        { label: "Sales Analytics", content: renderSalesAnalytics() }
      ];

      return (
        <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        System Dashboard
      </Typography>
      
      <Tabs
        value={selectedTab}
        onChange={(e, newValue) => setSelectedTab(newValue)}
        sx={{ mb: 3 }}
      >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>

      {tabs[selectedTab].content}

        <Box mt={4}>
          <Card>
            <CardHeader title="Development Tools" />
            <CardContent>
              <Stack direction="row" spacing={2}>
                <button 
                  onClick={() => axiosInstance.post('/api/public/monitoring/analytics/run')}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Run Analytics
                </button>
                <button 
                  onClick={() => axiosInstance.post('/api/public/monitoring/analytics/generate/10')}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Generate Sample Data
                </button>
                <button 
                  onClick={() => axiosInstance.post('/api/public/monitoring/analytics/reset')}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Reset Analytics
                </button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
  
    </Box>

      )
    
}

export default UnifiedDashboard;