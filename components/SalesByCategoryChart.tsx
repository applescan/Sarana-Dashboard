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
        avoidLabelOverlap: true,
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
        data: data,
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

export default SalesByCategoryChart;
