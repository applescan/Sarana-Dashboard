'use client';

import ReactECharts from 'echarts-for-react';
import React from 'react';

type SalesByCategoryChartProps = {
  data: { value: number; name: string }[];
};

const SalesByCategoryChart = ({ data }: SalesByCategoryChartProps) => {
  const option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      bottom: '0%',
      left: 'center',
    },
    series: [
      {
        name: 'Sales by Category',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        padAngle: 5,
        itemStyle: {
          borderRadius: 10,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '40',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: data, // Using data from props
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 450 }} />;
};

export default SalesByCategoryChart;
