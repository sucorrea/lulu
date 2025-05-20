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

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div>
        <h2 className="text-xl text-center font-semibold mb-2 text-rose-600 animate-fade-in font-baloo">
          Distribuição por Signo
        </h2>
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
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2 text-rose-600 animate-fade-in font-baloo">
          Aniversários por mês
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={birthdayStats}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="total" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
