'use client';

import Header from '@/components/layout/header';
import PageLayout from '@/components/layout/page-layout';
import { Person } from '@/components/lulus/types';
import { cn } from '@/lib/utils';
import { monthDashboard, signsStats, ZODIAC_ICONS } from '../../lulus/utils';
import ZodiacIcon from '../../lulus/zodiac-icon';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import BirthdayCalendar from './birthday-calendar';

type DashboardPageProps = {
  participants: Person[];
};

const DashboardPage = ({ participants }: DashboardPageProps) => (
  <PageLayout>
    <Header
      title="Dashboard das Lulus"
      description="Visão geral dos aniversários e signos das participantes, em um painel simples e visual."
    />
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
          <CardTitle className="lulu-header mb-2 flex items-center gap-2 text-xl">
            Distribuição por Signo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-2">
          {(() => {
            const stats = signsStats(participants).sort(
              (a, b) => b.total - a.total
            );
            const max = Math.max(...stats.map((s) => s.total), 1);
            return (
              <ul aria-label="Distribuição por signo" className="list-none p-0 m-0">
                {stats.map((s) => (
                  <li
                    key={s.name}
                    className="flex items-center gap-2"
                  >
                    <div className="flex w-36 shrink-0 items-center gap-2">
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md
                   p-1 bg-primary shadow-md"
                        aria-hidden="true"
                      >
                        {ZODIAC_ICONS[s.name] && (
                          <ZodiacIcon
                            icon={ZODIAC_ICONS[s.name]}
                            className="text-white"
                          />
                        )}
                      </div>
                      <span className="text-sm">{s.name}</span>
                    </div>
                    <meter
                      className="h-2 w-full flex-1 overflow-hidden rounded-full bg-primary/20 [&::-webkit-meter-bar]:rounded-full [&::-webkit-meter-bar]:bg-primary/20 [&::-webkit-meter-optimum-value]:rounded-full [&::-webkit-meter-optimum-value]:bg-primary [&::-moz-meter-bar]:rounded-full [&::-moz-meter-bar]:bg-primary"
                      value={s.total}
                      min={0}
                      max={max}
                      aria-label={`${s.name}: ${s.total} participante${s.total === 1 ? '' : 's'}`}
                    />
                    <span
                      className="w-4 shrink-0 text-right text-sm font-bold text-primary"
                      aria-hidden="true"
                    >
                      {s.total}
                    </span>
                  </li>
                ))}
              </ul>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  </PageLayout>
);

export default DashboardPage;
