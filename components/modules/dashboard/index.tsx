'use client';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { Person } from '@/components/lulus/types';
import { COLORS } from '../../lulus/constants';
import { monthDashboard, signsStats } from '../../lulus/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import BirthdayCalendar from './birthday-calendar';
import { cn } from '@/lib/utils';

type DashboardPageProps = {
  participants: Person[];
};

const DashboardPage = ({ participants }: DashboardPageProps) => {
  return (
    <div className="min-h-screen bg-background px-4 pb-24 pt-6 md:px-8">
      <div className="mb-4">
        <h1 className="lulu-header text-2xl md:text-3xl">
          Dashboard das Lulus
        </h1>
        <p className="text-sm text-muted-foreground">
          Visão geral dos aniversários e signos das participantes, em um painel
          simples e visual.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <BirthdayCalendar participants={participants} />
        <Card className="lulu-card">
          <CardHeader className="p-2">
            <CardTitle className="lulu-header mb-2 text-xl">
              Aniversários por mês
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-6 gap-2">
              {monthDashboard.map((month, i) => {
                const monthNum = String(i + 1).padStart(2, '0');
                const count = participants.filter(
                  (p) => p.month === monthNum
                ).length;
                return (
                  <div key={month} className="text-center">
                    <div
                      className={cn(
                        'w-full aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all',
                        count > 0
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {count}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 block">
                      {month}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Card className="lulu-card">
          <CardHeader className="p-2">
            <CardTitle className="lulu-header mb-2 text-xl">
              Distribuição por Signo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={signsStats(participants)}
                  dataKey="total"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fontSize="7px"
                  legendType="diamond"
                  label={({ name, value }) => `${name} (${value})`}
                  className="text-xs"
                >
                  {signsStats(participants).map((i, index) => (
                    <Cell
                      key={`${i.name}-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default DashboardPage;
