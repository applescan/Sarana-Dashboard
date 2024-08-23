'use client';

import ReactECharts from 'echarts-for-react';
import React from 'react';

type revenueChartProps = {
  categories: string[];
  data: number[];
};

const RevenueChart: React.FC<revenueChartProps> = ({ categories, data }) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    xAxis: {
      type: 'category',
      data: categories,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Revenue',
        type: 'line',
        data: data,
        smooth: false,
        itemStyle: {
          color: '#5271FF',
        },
      },
    ],
  };
  return <ReactECharts option={option} style={{ height: 450 }} />;
};

export default RevenueChart;
