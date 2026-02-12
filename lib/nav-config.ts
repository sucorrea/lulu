import type { ComponentType } from 'react';
import { Camera, FileText, History, LayoutDashboard, Users } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string; size?: number }>;
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Participantes', icon: Users },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/galeria', label: 'Galeria', icon: Camera },
  { href: '/auditoria', label: 'Auditoria', icon: FileText },
  { href: '/historico', label: 'Histórico', icon: History },
];

export function isCurrentRoute(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
