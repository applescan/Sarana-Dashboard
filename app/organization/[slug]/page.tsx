'use client'

import RevenueChart from '@/components/RevenueChart';
import SalesByCategoryChart from '@/components/SalesByCategoryChart';
import StatsCard from '@/components/StatsCard';
import { useDashboardData } from '@/hook/useDashboardData';
import { clerkClient, currentUser } from '@clerk/nextjs/dist/types/server';
import React, { useEffect, useState } from 'react';

import { FaBoxesPacking, FaMoneyBillWave } from 'react-icons/fa6';
import { MdWidgets } from "react-icons/md";

const DashboardPage = ({ params }: { params: { slug: string } }) => {
  const { 
    loading, 
    error, 
    buildingSupplySalesData, 
    categories, 
    revenueData, 
    itemsSold, 
    itemsRestocked, 
    totalRevenue 
  } = useDashboardData();

  const [user, setUser] = useState(null);
  const [orgName, setOrgName] = useState('');

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const user = await currentUser();
//       if (user) {
//         setUser(user);
//         const response = await clerkClient.organizations.getOrganization({ slug: params.slug });
//         setOrgName(response.name);
//       }
//     };

//     fetchUserData();
//   }, [params.slug]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
//   if (!user) return <div>Not signed in</div>;

  return (
    <div>
      {/* <h1 className='text-3xl font-bold pb-8'> Welcome back to {orgName}, {user.firstName}</h1> */}

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
