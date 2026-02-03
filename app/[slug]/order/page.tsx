'use client';
import { useQuery } from '@apollo/client';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';
import React, { FC, useState } from 'react';
import { DateRange } from 'react-day-picker';
import GlobalError from '@/app/global-error';
import OrderTable, { Column } from '@/components/OrderTable';
import { DatePickerWithRange } from '@/components/ui/DatePicker';
import Loading from '@/components/ui/Loading';
import { GET_ORDERS, GET_PRODUCTS, GET_CATEGORIES } from '@/graphql/queries';

const OrderPage: FC = () => {
  const today = new Date();
  const [isRange, setIsRange] = useState(true);
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>({
    from: startOfMonth(today),
    to: endOfMonth(today),
  });
  const formatEndDate = (date: Date | undefined) =>
    date ? endOfDay(date).toISOString() : undefined;
  const formatStartDate = (date: Date | undefined) =>
    date ? startOfDay(date).toISOString() : undefined;
  const handleDateChange = (date: DateRange | undefined) => {
    setSelectedDate(date);
    refetchOrders({
      startDate: formatStartDate(date?.from),
      endDate: formatEndDate(date?.to || date?.from),
    });
  };
  const handleRangeToggle = () => {
    setIsRange(!isRange);
    setSelectedDate({
      from: startOfMonth(today),
      to: endOfMonth(today),
    });
  };
  const {
    data: ordersData,
    loading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useQuery(GET_ORDERS, {
    variables: {
      startDate: formatStartDate(selectedDate?.from),
      endDate: formatEndDate(selectedDate?.to || selectedDate?.from),
    },
  });
  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
  } = useQuery(GET_PRODUCTS);
  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
  } = useQuery(GET_CATEGORIES);

  if (ordersLoading || productsLoading || categoriesLoading) return <Loading />;
  if (ordersError || productsError || categoriesError) return <GlobalError />;

  const columns: Column[] = [
    { Header: 'Order ID', accessor: 'id' },
    { Header: 'Product Name', accessor: 'orderItems.product.name' },
    { Header: 'Order Quantity', accessor: 'orderItems.quantity' },
    { Header: 'Total Amount', accessor: 'totalAmount' },
    { Header: 'Created At', accessor: 'createdAt' },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-card/70 p-6 shadow-glow">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted">
              Order window
            </p>
            <h2 className="text-2xl font-semibold text-primary-foreground">
              {isRange ? 'Compare Dates' : 'Single Day'}
            </h2>
            <p className="text-sm text-secondary-foreground/70">
              Toggle range to measure restocks across custom intervals.
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-4 sm:justify-end">
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
            <div className="w-full min-[420px]:w-48 sm:w-60">
              <DatePickerWithRange
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                isRange={isRange}
                compact
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>
      <OrderTable
        key={ordersData.orders.length}
        columns={columns}
        data={ordersData.orders}
        categories={categoriesData.categories}
        products={productsData.products}
        startDate={formatStartDate(selectedDate?.from)}
        endDate={formatEndDate(selectedDate?.to)}
      />
    </div>
  );
};

export default OrderPage;
