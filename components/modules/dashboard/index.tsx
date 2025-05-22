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
    <div className="max-h-screen p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <BirthdayCalendar participants={participants} />
        <Card>
          <CardHeader className="p-2">
            <CardTitle className="lulu-header text-primary text-xl mb-2">
              Número de Aniversários por mês
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={birthdayStats}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-2">
            <CardTitle className="lulu-header text-primary text-xl mb-2">
              Distribuição por Signo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <ResponsiveContainer width="80%" height={250} minWidth={320}>
              <PieChart>
                <Pie
                  data={signsStats}
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
                  {signsStats.map((_, index) => (
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
