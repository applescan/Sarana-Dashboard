'use client'
import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_DATA } from '../graphql/queries';

export const useDashboardData = () => {
  const { loading, error, data, refetch } = useQuery(GET_DASHBOARD_DATA);

  // Log error if present
  useEffect(() => {
    if (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, [error]);

  const buildingSupplySalesData = data?.categories.map((category: any) => ({
    value: data.itemsSold
      .filter((item: any) => item.product && item.product.category && item.product.category.name === category.name)
      .reduce((sum: number, item: any) => sum + item.quantity * item.product.price, 0),
    name: category.name,
  }));

  const categories = data?.revenues.map((revenue: any) =>
    new Date(revenue.date).toLocaleString('default', { month: 'short' })
  );

  const revenueData = data?.revenues.map((revenue: any) => revenue.amount);

  const itemsSold = data?.itemsSold.reduce((sum: number, item: any) => item.product ? sum + item.quantity : sum, 0);

  const itemsRestocked = data?.itemsRestocked.reduce((sum: number, item: any) => sum + item.quantity, 0);

  const totalRevenue = data?.revenues.reduce((sum: number, revenue: any) => sum + revenue.amount, 0);

  // Ensure `products` is always an array
  const categoriesWithProducts = data?.categories.map((category: any) => ({
    ...category,
    products: category.products ?? [], // Fallback to an empty array if `products` is null
  }));

  return {
    loading,
    error,
    buildingSupplySalesData,
    categories,
    revenueData,
    itemsSold,
    itemsRestocked,
    totalRevenue,
    refetch,
    categoriesWithProducts,
  };
};
