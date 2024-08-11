'use client';
import { startOfDay, endOfDay } from 'date-fns';
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { FaBoxesPacking, FaMoneyBillWave } from 'react-icons/fa6';
import { MdWidgets } from 'react-icons/md';
import GlobalError from '@/app/global-error';
import RevenueChart from '@/components/RevenueChart';
import SalesByCategoryChart from '@/components/SalesByCategoryChart';
import StatsCard from '@/components/StatsCard';
import { DatePickerWithRange } from '@/components/ui/DatePicker';
import Loading from '@/components/ui/Loading';
import { useDashboardData } from '@/hook/useDashboardData';

const DashboardPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [isRange, setIsRange] = useState(false);

  const formatStartDate = (date: Date | undefined) =>
    date ? startOfDay(date).toISOString() : undefined;
  const formatEndDate = (date: Date | undefined) =>
    date ? endOfDay(date).toISOString() : undefined;

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

  if (loading) return <Loading />;
  if (error) return <GlobalError />;

  return (
    <div>
      <div className="flex items-center mb-4">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12">
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
        <div className="p-6 rounded-lg shadow-md">
          <h2>Revenue Stats</h2>
          <RevenueChart categories={categories} data={revenueData} />
        </div>
        <div className="p-6 rounded-lg shadow-md">
          <h2>Sales by Category</h2>
          <SalesByCategoryChart data={buildingSupplySalesData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
