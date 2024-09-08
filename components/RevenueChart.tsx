'use client';

import ReactECharts from 'echarts-for-react';
import React, { FC } from 'react';

type RevenueChartProps = {
  categories: string[];
  data: number[];
};

const RevenueChart: FC<RevenueChartProps> = ({ categories, data }) => {
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
      axisLabel: {
        rotate: -45, // Rotate labels for better readability on small screens
      },
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

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <ReactECharts
        option={option}
        style={{ height: 'calc(100vh - 200px)', maxHeight: '450px' }}
      />
    </div>
  );
};

export default RevenueChart;
