'use client';

import ReactECharts from 'echarts-for-react';
import React from 'react';

type SalesByCategoryChartProps = {
  data: { value: number; name: string }[];
};

const SalesByCategoryChart = ({ data }: SalesByCategoryChartProps) => {
  const option = {
    backgroundColor: 'transparent',
    textStyle: {
      color: '#E2E8F0',
      fontFamily: 'var(--font-jakarta, Inter)',
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15,23,42,0.9)',
      borderColor: 'rgba(129,140,248,0.4)',
      textStyle: {
        color: '#FFFFFF',
      },
    },
    legend: {
      top: '2%',
      left: 'center',
      padding: [0, 0, 24, 0],
      textStyle: {
        color: '#94A3B8',
      },
    },
    series: [
      {
        name: 'Sales by Category',
        type: 'pie',
        center: ['50%', '58%'],
        radius: ['40%', '70%'],
        avoidLabelOverlap: true,
        padAngle: 2,
        itemStyle: {
          borderRadius: 16,
          borderColor: '#020617',
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          scale: true,
          scaleSize: 8,
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold',
            color: '#FFFFFF',
          },
        },
        labelLine: {
          show: false,
        },
        data,
      },
    ],
  };

  return (
    <div className="w-full px-2">
      <ReactECharts
        option={option}
        style={{ height: '320px', width: '100%' }}
      />
    </div>
  );
};

export default SalesByCategoryChart;
