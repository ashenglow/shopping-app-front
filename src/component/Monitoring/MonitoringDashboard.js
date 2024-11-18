import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import TimerIcon from '@mui/icons-material/Timer';
import WarningIcon from '@mui/icons-material/Warning';
import TimeSeriesChart from './TimeSeriesChart';
import MethodPerformanceTable from './MethodPerformanceTable';
import OrderPerformanceMetrics from './OrderPerformanceMetrics';
import { data } from './mockData';

const MonitoringDashboard = () => {
    return (
      <Container maxWidth="lg">
        <Box py={4}>
          <Typography variant="h4" gutterBottom>
            Performance Monitoring Dashboard
          </Typography>
          
          <Grid container spacing={3}>
            {/* Summary Cards */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <SummaryCard
                    title="Total Methods"
                    value={data?.summary?.totalMethods}
                    icon={<CodeIcon />}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <SummaryCard
                    title="Total Queries"
                    value={data?.summary?.totalQueries}
                    icon={<StorageIcon />}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <SummaryCard
                    title="Avg Response Time"
                    value={`${data?.summary?.averageResponseTime.toFixed(2)}ms`}
                    icon={<TimerIcon />}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <SummaryCard
                    title="Slow Queries"
                    value={data?.summary?.totalSlowQueries}
                    icon={<WarningIcon />}
                    color="error"
                  />
                </Grid>
              </Grid>
            </Grid>
  
            {/* Performance Timeline */}
            <Grid item xs={12}>
              <TimeSeriesChart data={data?.timeSeriesData} />
            </Grid>
  
            {/* Method Performance */}
            <Grid item xs={12}>
              <MethodPerformanceTable data={data?.methodStats?.methodPerformance} />
            </Grid>
  
            {/* Order Specific Metrics */}
            <Grid item xs={12}>
              <OrderPerformanceMetrics />
            </Grid>
          </Grid>
        </Box>
      </Container>
    );
  };