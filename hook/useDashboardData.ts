import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { GET_DASHBOARD_DATA, GET_REVENUES } from '../graphql/queries';
import {
  Category,
  ItemsRestocked,
  ItemsSold,
  Revenue,
} from '@/lib/types/types';

export const useDashboardData = (startDate?: string, endDate?: string) => {
  const today = new Date();
  const startOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1,
  ).toISOString();
  const endOfMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
  ).toISOString();

  if (!startDate) {
    startDate = startOfMonth;
  }
  if (!endDate) {
    endDate = endOfMonth;
  }

  const { loading, error, data, refetch } = useQuery(GET_DASHBOARD_DATA, {
    variables: { startDate, endDate },
  });

  const { data: monthlyRevenueData } = useQuery(GET_REVENUES);

  useEffect(() => {
    if (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, [error]);

  const revenueDataByMonth: { month: string; totalRevenue: number }[] = [];
  if (monthlyRevenueData?.revenues) {
    monthlyRevenueData.revenues.forEach((revenue: Revenue) => {
      const timestamp = Number(revenue.date);
      const date = new Date(timestamp);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      const existingMonthData = revenueDataByMonth.find(
        (data) => data.month === monthKey,
      );
      if (existingMonthData) {
        existingMonthData.totalRevenue += revenue.amount;
      } else {
        revenueDataByMonth.push({
          month: monthKey,
          totalRevenue: revenue.amount,
        });
      }
    });
  }

  const itemsSold =
    data?.itemsSold?.reduce(
      (sum: number, item: ItemsSold) =>
        item.product ? sum + item.quantity : sum,
      0,
    ) || 0;

  const itemsRestocked =
    data?.itemsRestocked?.reduce(
      (sum: number, item: ItemsRestocked) => sum + item.quantity,
      0,
    ) || 0;

  // Calculate total revenue filtered by the selected date range
  const totalRevenue =
    data?.revenues?.reduce(
      (sum: number, revenue: Revenue) => sum + revenue.amount,
      0,
    ) || 0;

  return {
    loading,
    error,
    buildingSupplySalesData:
      data?.categories?.map((category: Category) => ({
        value:
          data.itemsSold
            ?.filter(
              (item: ItemsSold) =>
                item.product &&
                item.product.category &&
                item.product.category.name === category.name,
            )
            .reduce((sum: number, item: ItemsSold) => sum + item.quantity, 0) ||
          0,
        name: category.name,
      })) || [],
    categories: revenueDataByMonth.map((data) => data.month),
    revenueData: revenueDataByMonth.map((data) => data.totalRevenue),
    itemsSold,
    itemsRestocked,
    totalRevenue,
    refetch,
  };
};
