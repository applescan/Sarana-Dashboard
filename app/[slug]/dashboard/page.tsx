'use client'
import React, { useState } from 'react';
import { FaBoxesPacking, FaMoneyBillWave } from 'react-icons/fa6';
import { MdWidgets } from "react-icons/md";
import RevenueChart from '@/components/RevenueChart';
import SalesByCategoryChart from '@/components/SalesByCategoryChart';
import StatsCard from '@/components/StatsCard';
import { useDashboardData } from '@/hook/useDashboardData';
import { DateRange } from 'react-day-picker';
import { startOfDay, endOfDay } from 'date-fns';
import { DatePickerWithRange } from '@/components/ui/DatePicker';
import Loading from '@/components/ui/Loading';

const DashboardPage = () => {
    const [selectedDate, setSelectedDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date()
    });
    const [isRange, setIsRange] = useState(false);

    const formatStartDate = (date: Date | undefined) => date ? startOfDay(date).toISOString() : undefined;
    const formatEndDate = (date: Date | undefined) => date ? endOfDay(date).toISOString() : undefined;

    const { loading, error, buildingSupplySalesData, categories, revenueData, itemsSold, itemsRestocked, totalRevenue, refetch } = useDashboardData(
        formatStartDate(selectedDate?.from),
        formatEndDate(selectedDate?.to)
    );

    const handleDateChange = (date: DateRange | undefined) => {
        setSelectedDate(date);
        if (date?.from && date?.to) {
            refetch({
                startDate: formatStartDate(date?.from),
                endDate: formatEndDate(date?.to)
            });
        } else if (date?.from) {
            refetch({
                startDate: formatStartDate(date?.from),
                endDate: formatEndDate(date?.from)
            });
        } else {
            refetch({
                startDate: undefined,
                endDate: undefined
            });
        }
    };

    const handleRangeToggle = () => {
        setIsRange(!isRange);
        setSelectedDate({
            from: new Date(),
            to: new Date()
        });
    };

    if (loading) return <Loading />;
    if (error) return <div>Error loading data</div>;

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
                <label htmlFor="range-checkbox" className='text-xs'>Enable Range Selection</label>
            </div>
            <DatePickerWithRange
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                isRange={isRange}
            />

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
