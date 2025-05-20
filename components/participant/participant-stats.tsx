'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo } from 'react';
import _ from 'lodash';
import { participants } from '../lulus/mockdata';

export function ParticipantStats() {
  const cityData = useMemo(() => {
    const cityGroups = _.groupBy(participants, 'city');
    return Object.entries(cityGroups).map(([city, people]) => ({
      name: city,
      value: people.length,
    }));
  }, []);

  const monthData = useMemo(() => {
    const monthGroups = _.groupBy(participants, 'month');
    return Object.entries(monthGroups).map(([month, people]) => ({
      name: month,
      value: people.length,
    }));
  }, []);

  const COLORS = [
    '#e53935',
    '#4caf50',
    '#3f51b5',
    '#ff9800',
    '#9c27b0',
    '#00bcd4',
  ];

  return (
    <section className="grid md:grid-cols-2 gap-8 mb-8">
      <div className="lulu-card h-64">
        <h2 className="lulu-header text-xl mb-2">Friends by City</h2>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={cityData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {cityData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} friends`, 'Count']} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="lulu-card h-64">
        <h2 className="lulu-header text-xl mb-2">Birthdays by Month</h2>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={monthData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {monthData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} friends`, 'Count']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
