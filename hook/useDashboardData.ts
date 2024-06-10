import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_DATA } from '../graphql/queries';
import { ItemsRestocked, ItemsSold, Revenue } from '@/lib/types/types';

export const useDashboardData = (startDate?: string, endDate?: string) => {
    const { loading, error, data, refetch } = useQuery(GET_DASHBOARD_DATA, {
        variables: { startDate, endDate },
    });

    // Log error if present
    useEffect(() => {
        if (error) {
            console.error('Error fetching dashboard data:', error);
        }
    }, [error]);

    const buildingSupplySalesData = data?.categories.map((category: any) => ({
        value: data.itemsSold
            .filter((item: any) => item.product && item.product.category && item.product.category.name === category.name)
            .reduce((sum: number, item: any) => sum + item.quantity, 0),
        name: category.name,
    }));

    const categories = data?.revenues.map((revenue: any) => {
        const timestamp = Number(revenue.date);
        const date = new Date(timestamp * 1000);
        return date.toLocaleString('default', { month: 'short' });
    });

    const revenueData = data?.revenues.map((revenue: Revenue) => revenue.amount);

    const itemsSold = data?.itemsSold.reduce((sum: number, item: ItemsSold) => item.product ? sum + item.quantity : sum, 0);

    const itemsRestocked = data?.itemsRestocked.reduce((sum: number, item: ItemsRestocked) => sum + item.quantity, 0);

    const totalRevenue = data?.revenues.reduce((sum: number, revenue: Revenue) => sum + revenue.amount, 0);

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
    };
};
