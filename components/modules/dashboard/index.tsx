'use client';
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Person } from '@/components/lulus/types';
import { COLORS } from '../../lulus/constants';
import { birthdayStats, signsStats } from '../../lulus/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import BirthdayCalendar from './birthday-calendar';

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
              Número de Aniversários por mês
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={birthdayStats(participants)}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#4BBF73" />
              </BarChart>
            </ResponsiveContainer>
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
                  {signsStats(participants).map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
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
