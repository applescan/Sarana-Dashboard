import React, { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from './ui/Card';

type StatsCardProps = {
  icon: ReactNode;
  desc: string;
  value: string;
};

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, desc, value }) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>{Icon}</CardHeader>
      <CardContent>
        <CardDescription>{desc}</CardDescription>
        <CardTitle>{value}</CardTitle>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
