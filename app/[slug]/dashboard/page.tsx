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
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-card/70 p-6 shadow-glow">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-muted">
              Timeframe
            </p>
            <h2 className="text-xl font-semibold text-primary-foreground sm:text-2xl">
              {isRange ? 'Compare custom dates' : 'Single-day spotlight'}
            </h2>
            <p className="text-sm text-secondary-foreground/70">
              Tune the view to understand how sales, restocks, and revenue are
              trending.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <label className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-muted">
              Range
              <button
                type="button"
                onClick={handleRangeToggle}
                className={`relative h-6 w-12 rounded-full border border-white/20 transition ${
                  isRange
                    ? 'bg-gradient-to-r from-primary to-accent'
                    : 'bg-white/10'
                }`}
              >
                <span
                  className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white transition ${
                    isRange ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </label>
            <DatePickerWithRange
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              isRange={isRange}
              compact
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-card/70 p-6 shadow-glow">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted">
              Intelligence
            </p>
            <h2 className="text-2xl font-semibold text-primary-foreground">
              AI Sales Mentor
            </h2>
            <p className="text-sm text-secondary-foreground/70">
              Summaries from orders, restocks, and revenue in seconds.
            </p>
          </div>
          <Button
            variant="brand"
            onClick={toggleAIInsight}
            className="w-full shrink-0 sm:w-auto"
          >
            {showAIInsight ? 'Hide Insight' : 'Generate Insight'}
          </Button>
        </div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
          {showAIInsight ? (
            <div className="max-h-72 overflow-auto pr-2">
              <AIInsight
                startDate={selectedDate?.from}
                endDate={isRange ? selectedDate?.to : selectedDate?.from}
              />
            </div>
          ) : (
            <p className="text-sm text-secondary-foreground/70">
              Tap “Generate Insight” to let Sarana explain what changed,
              highlight risks, and surface the best opportunities for your team.
            </p>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatsCard
          icon={<FaBoxesPacking className="h-6 w-6" />}
          desc="Items Sold"
          value={itemsSold.toString()}
        />
        <StatsCard
          icon={<MdWidgets className="h-6 w-6" />}
          desc="Items Restocked"
          value={itemsRestocked.toString()}
        />
        <StatsCard
          icon={<FaMoneyBillWave className="h-6 w-6" />}
          desc="Sales Revenue"
          value={`IDR ${totalRevenue.toLocaleString()}`}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-white/10 bg-card/80 p-6 shadow-glow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary-foreground">
              Revenue Momentum
            </h2>
            <span className="text-xs uppercase tracking-[0.35em] text-muted">
              All time
            </span>
          </div>
          <RevenueChart categories={categories} data={revenueData} />
        </article>
        <article className="rounded-3xl border border-white/10 bg-card/80 p-6 shadow-glow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary-foreground">
              Sales by Category
            </h2>
            <span className="text-xs uppercase tracking-[0.35em] text-muted">
              Snapshot
            </span>
          </div>
          <SalesByCategoryChart data={buildingSupplySalesData} />
        </article>
      </section>
    </div>
  );
};

export default DashboardPage;
