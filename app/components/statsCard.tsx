import React, { ElementType, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from './ui/card';

type StatsCardProps = {
    icon: ReactNode; 
    desc: string;
    value: string;
};

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, desc, value }) => {
    return (
        <Card className='flex flex-col gap-5'>
            <CardHeader>
                {Icon}
            </CardHeader>
            <CardContent>
                <CardDescription>{desc}</CardDescription>
                <CardTitle>{value}</CardTitle>
            </CardContent>
        </Card>
    );
};

export default StatsCard;
