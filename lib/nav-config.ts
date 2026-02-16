import type { ComponentType } from 'react';
import {
  Camera,
  FileText,
  History,
  Info,
  LayoutDashboard,
  Users,
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  shortLabel?: string;
  icon: ComponentType<{ className?: string; size?: number }>;
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Participantes', shortLabel: 'Particip.', icon: Users },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/galeria', label: 'Galeria', icon: Camera },
  { href: '/historico', label: 'Histórico', icon: History },
  { href: '/auditoria', label: 'Auditoria', icon: FileText },
  { href: '/sobre', label: 'Sobre', icon: Info },
];

export const isCurrentRoute = (pathname: string, href: string): boolean => {
  if (href === '/') {
    return pathname === '/';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
};
