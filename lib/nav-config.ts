import type { ComponentType } from 'react';
import {
  Dices,
  FileText,
  History,
  ImageIcon,
  Info,
  LayoutDashboard,
  Users,
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string; size?: number }>;
  adminOnly?: boolean;
}

const LULUS: NavItem = { href: '/', label: 'Lulus', icon: Users };
const AGENDA: NavItem = {
  href: '/dashboard',
  label: 'Agenda',
  icon: LayoutDashboard,
};
const GALERIA: NavItem = {
  href: '/galeria',
  label: 'Galeria',
  icon: ImageIcon,
};
const HISTORICO: NavItem = {
  href: '/historico',
  label: 'Histórico',
  icon: History,
};
const AUDITORIA: NavItem = {
  href: '/auditoria',
  label: 'Auditoria',
  icon: FileText,
};
const SOBRE: NavItem = { href: '/sobre', label: 'Sobre', icon: Info };
const SORTEIO: NavItem = {
  href: '/sorteio',
  label: 'Sorteio',
  icon: Dices,
  adminOnly: true,
};

export const NAV_ITEMS: NavItem[] = [
  LULUS,
  AGENDA,
  GALERIA,
  HISTORICO,
  AUDITORIA,
  SOBRE,
  SORTEIO,
];

export const MOBILE_PRIMARY_NAV: NavItem[] = [
  LULUS,
  AGENDA,
  GALERIA,
  HISTORICO,
];

export const MORE_NAV_ITEMS: NavItem[] = [AUDITORIA, SOBRE, SORTEIO];

export const filterNavByRole = (
  items: NavItem[],
  isAdmin: boolean
): NavItem[] => items.filter((item) => !item.adminOnly || isAdmin);

export const isCurrentRoute = (pathname: string, href: string): boolean => {
  if (href === '/') {
    return pathname === '/';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
};
