'use client';
import { endOfDay, endOfMonth, startOfDay, startOfMonth } from 'date-fns';
import React, { FC, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { FaBoxesPacking, FaMoneyBillWave } from 'react-icons/fa6';
import { MdWidgets } from 'react-icons/md';

import GlobalError from '@/app/global-error';
import RevenueChart from '@/components/RevenueChart';
import SalesByCategoryChart from '@/components/SalesByCategoryChart';
import AIInsight from '@/components/SalesInsight';
import StatsCard from '@/components/StatsCard';
import Button from '@/components/ui/Button';
import { DatePickerWithRange } from '@/components/ui/DatePicker';
import Loading from '@/components/ui/Loading';
import { useDashboardData } from '@/hook/useDashboardData';

const DashboardPage: FC = () => {
  const today = new Date();
  const [isRange, setIsRange] = useState(true);
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>({
    from: startOfMonth(today),
    to: endOfMonth(today),
  });
  const [showAIInsight, setShowAIInsight] = useState(false);

  const formatEndDate = (date: Date | undefined): string =>
    date ? endOfDay(date).toISOString() : '';
  const formatStartDate = (date: Date | undefined): string =>
    date ? startOfDay(date).toISOString() : '';

  const {
    buildingSupplySalesData,
    categories,
    error,
    itemsRestocked,
    itemsSold,
    loading,
    refetch,
    revenueData,
    totalRevenue,
  } = useDashboardData(
    formatStartDate(selectedDate?.from),
    formatEndDate(selectedDate?.to),
  );

  const handleDateChange = (date: DateRange | undefined) => {
    setSelectedDate(date);
    refetch({
      startDate: formatStartDate(date?.from),
      endDate: formatEndDate(date?.to || date?.from),
    });
  };

  const handleRangeToggle = () => {
    setIsRange(!isRange);
    setSelectedDate({
      from: new Date(),
      to: new Date(),
    });
  };

  const toggleAIInsight = () => {
    setShowAIInsight((prev) => !prev);
  };

  if (loading) return <Loading />;
  if (error) return <GlobalError />;

  return (
    <div>
      <div className="relative flex flex-col md:flex-row justify-between mb-4">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="range-checkbox"
              checked={isRange}
              onChange={handleRangeToggle}
              className="mr-2"
            />
            <label htmlFor="range-checkbox" className="text-xs md:text-sm">
              Enable Range Selection
            </label>
          </div>
          <DatePickerWithRange
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            isRange={isRange}
          />
        </div>
      </div>

      <div className="relative mb-6">
        {showAIInsight && (
          <div>
            <Button
              onClick={toggleAIInsight}
              className="absolute -top-10 right-2 text-gray-800"
            >
              {showAIInsight ? 'Hide' : 'Show'}
            </Button>
            <AIInsight
              startDate={selectedDate?.from}
              endDate={isRange ? selectedDate?.to : selectedDate?.from}
            />
          </div>
        )}
        {!showAIInsight && (
          <Button
            onClick={toggleAIInsight}
            className="absolute -top-10 right-2 text-gray-800 font-medium"
          >
            ✨ Show AI Sales Insights
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 pb-8">
        <StatsCard
          icon={<FaBoxesPacking className="h-7 w-7 md:h-9 md:w-9" />}
          desc="Items Sold"
          value={itemsSold.toString()}
        />
        <StatsCard
          icon={<MdWidgets className="h-7 w-7 md:h-9 md:w-9" />}
          desc="Items Restocked"
          value={itemsRestocked.toString()}
        />
        <StatsCard
          icon={<FaMoneyBillWave className="h-7 w-7 md:h-9 md:w-9" />}
          desc="Sales Revenue"
          value={`IDR ${totalRevenue.toLocaleString()}`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        <div className="p-4 md:p-6 rounded-lg shadow-md bg-secondary border border-gray-200">
          <h2 className="text-sm md:text-lg font-medium">
            All Time Revenue Stats
          </h2>
          <RevenueChart categories={categories} data={revenueData} />
        </div>
        <div className="p-4 md:p-6 rounded-lg shadow-md bg-secondary border border-gray-200">
          <h2 className="text-sm md:text-lg font-medium">Sales by Category</h2>
          <SalesByCategoryChart data={buildingSupplySalesData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
