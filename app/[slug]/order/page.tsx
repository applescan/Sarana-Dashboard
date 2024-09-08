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
    <div>
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

      <div className="mb-4">
        <DatePickerWithRange
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          isRange={isRange}
        />
      </div>
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
