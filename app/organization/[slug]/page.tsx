import { clerkClient, currentUser } from '@clerk/nextjs/server';
import SalesByCategoryChart from '../../components/SalesByCategoryChart';
import RevenueChart from '../../components/RevenueChart';
import StatsCard from '../../components/StatsCard';
import { FaBoxesPacking, FaMoneyBillWave } from 'react-icons/fa6';
import { MdWidgets } from "react-icons/md";

export default async function Page({ params }: { params: { slug: string } }) {
    const user = await currentUser();

    if (!user) return <div>Not signed in</div>;
    const slug = params.slug

    const response = await clerkClient.organizations.getOrganization({ slug });

    const orgName = response.name

    const buildingSupplySalesData = [
        { value: 1500, name: 'Lumber' },
        { value: 1200, name: 'Plumbing Supplies' },
        { value: 900, name: 'Electrical Supplies' },
        { value: 800, name: 'Hand Tools' },
        { value: 700, name: 'Power Tools' },
        { value: 600, name: 'Paint' },
        { value: 500, name: 'Flooring' },
        { value: 400, name: 'Lighting' },
        { value: 300, name: 'Garden Supplies' },
        { value: 200, name: 'Hardware' }
    ];

    const categories = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const data = [
        200, 300, 290, 350, 320, 310,
        330, 380, 360, 390, 450, 420
    ];

    return (
        <div>
            <h1 className='text-3xl font-bold pb-8'> Welcome back to {orgName}, {user.firstName}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12">
                <div>
                    <StatsCard icon={<FaBoxesPacking className='h-9 w-9' />} desc={'Items Sold'} value={'10,632'} />
                </div>
                <div>
                    <StatsCard icon={<MdWidgets  className='h-9 w-9' />} desc={'Items restocked'} value={'564'} />
                </div>
                <div>
                    <StatsCard icon={<FaMoneyBillWave className='h-9 w-9' />} desc={'Sales Revenue'} value={'IDR 1,567,430'} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="p-6 rounded-lg shadow-md">
                    <h2>Revenue Stats</h2>
                    <RevenueChart categories={categories} data={data} />
                </div>
                <div className="p-6 rounded-lg shadow-md">
                    <h2>Sales by Category</h2>
                    <SalesByCategoryChart data={buildingSupplySalesData} />
                </div>
            </div>
        </div>
    );
}
