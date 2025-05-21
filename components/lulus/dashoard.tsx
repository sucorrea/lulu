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

import { COLORS } from './constants';
import { birthdayStats, signsStats } from './utils';
import { BirthdayCalendar } from '../participant/birthday-calendar';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function DashboardPage() {
  return (
    <div className="max-h-screen p-8 mb-10 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <BirthdayCalendar />
        <Card>
          <CardHeader className="p-2">
            <CardTitle className="text-xl  font-semibold mb-4 text-primary">
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
            <CardTitle className="text-xl  font-semibold mb-4 text-primary">
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
}
