'use client';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';
import React, { useState } from 'react';
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

const DashboardPage: React.FC = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>({
    from: startOfMonth(today),
    to: endOfMonth(today),
  });
  const [isRange, setIsRange] = useState(true);
  const [showAIInsight, setShowAIInsight] = useState(false);

  const formatStartDate = (date: Date | undefined): string =>
    date ? startOfDay(date).toISOString() : '';
  const formatEndDate = (date: Date | undefined): string =>
    date ? endOfDay(date).toISOString() : '';

  const {
    loading,
    error,
    buildingSupplySalesData,
    categories,
    revenueData,
    itemsSold,
    itemsRestocked,
    totalRevenue,
    refetch,
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
  console.log(selectedDate);

  return (
    <div>
      <div className="relative flex justify-between mb-2">
        <div>
          <div className="mb-4">
            <input
              type="checkbox"
              id="range-checkbox"
              checked={isRange}
              onChange={handleRangeToggle}
              className="mr-2"
            />
            <label htmlFor="range-checkbox" className="text-xs">
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
      <div className="relative mb-4">
        {showAIInsight && (
          <div>
            <Button
              onClick={toggleAIInsight}
              className="absolute -top-12 right-2 text-gray-800"
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
            className="absolute -top-12 right-2 text-gray-800 font-medium"
          >
            ✨ Show AI Sales Insights
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8">
        <StatsCard
          icon={<FaBoxesPacking className="h-9 w-9" />}
          desc="Items Sold"
          value={itemsSold.toString()}
        />
        <StatsCard
          icon={<MdWidgets className="h-9 w-9" />}
          desc="Items Restocked"
          value={itemsRestocked.toString()}
        />
        <StatsCard
          icon={<FaMoneyBillWave className="h-9 w-9" />}
          desc="Sales Revenue"
          value={`IDR ${totalRevenue.toLocaleString()}`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="p-6 rounded-lg shadow-md bg-secondary border border-gray-200">
          <h2>All Time Revenue Stats</h2>
          <RevenueChart categories={categories} data={revenueData} />
        </div>
        <div className="p-6 rounded-lg shadow-md bg-secondary border border-gray-200">
          <h2>Sales by Category</h2>
          <SalesByCategoryChart data={buildingSupplySalesData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
