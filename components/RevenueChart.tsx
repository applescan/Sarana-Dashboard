'use client';

import ReactECharts from 'echarts-for-react';
import React, { FC } from 'react';

type RevenueChartProps = {
  categories: string[];
  data: number[];
};

const RevenueChart: FC<RevenueChartProps> = ({ categories, data }) => {
  const option = {
    backgroundColor: 'transparent',
    textStyle: {
      color: '#E2E8F0',
      fontFamily: 'var(--font-jakarta, Inter)',
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15,23,42,0.9)',
      borderColor: 'rgba(129,140,248,0.4)',
      textStyle: { color: '#F8FAFC' },
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: { top: 30, left: 40, right: 10, bottom: 40 },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        rotate: -35,
        color: '#94A3B8',
      },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.35)' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#94A3B8' },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.2)' } },
    },
    series: [
      {
        name: 'Revenue',
        type: 'line',
        data,
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
        itemStyle: {
          color: '#C084FC',
        },
        lineStyle: {
          width: 4,
          color: 'rgba(129,140,248,0.85)',
        },
        areaStyle: {
          color: 'rgba(129,140,248,0.2)',
          shadowColor: 'rgba(129,140,248,0.25)',
          shadowBlur: 30,
        },
      },
    ],
  };

  return (
    <div className="w-full px-2">
      <ReactECharts
        option={option}
        style={{ height: '320px', width: '100%' }}
        notMerge
        lazyUpdate
      />
    </div>
  );
};

export default RevenueChart;
