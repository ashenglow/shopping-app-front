import React from 'react';
import { Card, CardHeader, CardContent } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const TimeSeriesChart = ({ data }) => {
    return (
      <Card>
        <CardHeader title="Query Performance Timeline" />
        <CardContent>
          <LineChart width={800} height={400} data={data}>
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleString()}
            />
            <Legend />
            {/* Group by method name */}
            {Array.from(new Set(data?.map(d => d.methodName))).map((method, index) => (
              <Line
                key={method}
                type="monotone"
                dataKey="value"
                data={data.filter(d => d.methodName === method)}
                name={method}
                stroke={`hsl(${index * 137.5}, 70%, 50%)`}
              />
            ))}
          </LineChart>
        </CardContent>
      </Card>
    );
  };