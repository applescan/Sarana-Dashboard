import React, { FC, ReactNode } from 'react';
import { Card, CardDescription, CardTitle } from './ui/Card';

type StatsCardProps = {
  icon: ReactNode;
  desc: string;
  value: string;
};

const StatsCard: FC<StatsCardProps> = ({ icon: Icon, desc, value }) => {
  return (
    <Card className="relative overflow-hidden bg-card/80">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.25),_transparent_55%)]" />
      <div className="relative z-10 flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <CardDescription className="tracking-[0.4em] text-[0.6rem]">
            {desc}
          </CardDescription>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-primary-foreground">
            {Icon}
          </div>
        </div>
        <CardTitle className="text-4xl font-semibold">{value}</CardTitle>
      </div>
    </Card>
  );
};

export default StatsCard;
