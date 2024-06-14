import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_DATA } from '../graphql/queries';
import { ItemsRestocked, ItemsSold, Revenue } from '@/lib/types/types';

export const useDashboardData = (startDate?: string, endDate?: string) => {
    // Default to today if no date is provided
    if (!startDate) {
        const today = new Date();
        startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    }
    if (!endDate) {
        const today = new Date();
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString();
    }

    const { loading, error, data, refetch } = useQuery(GET_DASHBOARD_DATA, {
        variables: { startDate, endDate },
    });

    // Log error if present
    useEffect(() => {
        if (error) {
            console.error('Error fetching dashboard data:', error);
        }
    }, [error]);

    // Aggregate revenue data by month
    const revenueDataByMonth: { month: string; totalRevenue: number }[] = [];
    if (data?.revenues) {
        data.revenues.forEach((revenue: Revenue) => {
            const timestamp = Number(revenue.date);
            const date = new Date(timestamp);
            const monthKey = date.toLocaleString('default', { month: 'short' });
            const existingMonthData = revenueDataByMonth.find((data) => data.month === monthKey);
            if (existingMonthData) {
                existingMonthData.totalRevenue += revenue.amount;
            } else {
                revenueDataByMonth.push({ month: monthKey, totalRevenue: revenue.amount });
            }
        });
    }

    const itemsSold = data?.itemsSold?.reduce((sum: number, item: ItemsSold) => item.product ? sum + item.quantity : sum, 0);

    const itemsRestocked = data?.itemsRestocked.reduce((sum: number, item: ItemsRestocked) => sum + item.quantity, 0);

    const totalRevenue = data?.revenues.reduce((sum: number, revenue: Revenue) => sum + revenue.amount, 0);

    return {
        loading,
        error,
        buildingSupplySalesData: data?.categories.map((category: any) => ({
            value: data.itemsSold
                .filter((item: any) => item.product && item.product.category && item.product.category.name === category.name)
                .reduce((sum: number, item: any) => sum + item.quantity, 0),
            name: category.name,
        })),
        categories: revenueDataByMonth.map((data) => data.month),
        revenueData: revenueDataByMonth.map((data) => data.totalRevenue),
        itemsSold,
        itemsRestocked,
        totalRevenue,
        refetch,
    };
};
