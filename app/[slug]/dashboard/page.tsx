'use client'
import React, { useState } from 'react';
import { FaBoxesPacking, FaMoneyBillWave } from 'react-icons/fa6';
import { MdWidgets } from "react-icons/md";
import RevenueChart from '@/components/RevenueChart';
import SalesByCategoryChart from '@/components/SalesByCategoryChart';
import StatsCard from '@/components/StatsCard';
import { useDashboardData } from '@/hook/useDashboardData';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { DatePickerWithRange } from '@/components/ui/DatePicker';
import Loading from '@/components/ui/Loading';

const DashboardPage = () => {
    const [selectedDate, setSelectedDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 20)
    });

    const {
        loading,
        error,
        buildingSupplySalesData,
        categories,
        revenueData,
        itemsSold,
        itemsRestocked,
        totalRevenue,
        refetch
    } = useDashboardData(
        selectedDate ? selectedDate.from?.toISOString() : undefined,
        selectedDate ? selectedDate.to?.toISOString() : undefined
    );

    const handleDateChange = (date: DateRange | undefined) => {
        if (date) {
            // Adjust date format or timezone here if needed
            setSelectedDate(date);
            refetch({
                startDate: date.from?.toISOString(),
                endDate: date.to?.toISOString()
            });
        }
    };
    

    if (loading) return <Loading/>;
    if (error) return <div>Error loading data</div>;

    return (
        <div>
            <DatePickerWithRange selectedDate={selectedDate} onDateChange={handleDateChange} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12">
                <div>
                    <StatsCard icon={<FaBoxesPacking className='h-9 w-9' />} desc={'Items Sold'} value={itemsSold.toString()} />
                </div>
                <div>
                    <StatsCard icon={<MdWidgets className='h-9 w-9' />} desc={'Items restocked'} value={itemsRestocked.toString()} />
                </div>
                <div>
                    <StatsCard icon={<FaMoneyBillWave className='h-9 w-9' />} desc={'Sales Revenue'} value={`IDR ${totalRevenue.toLocaleString()}`} />
                </div>
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
