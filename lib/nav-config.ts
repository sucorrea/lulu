import type { ComponentType } from 'react';
import {
  ImageIcon,
  FileText,
  History,
  Info,
  LayoutDashboard,
  Users,
  Shield,
  UserCircle,
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  shortLabel?: string;
  icon: ComponentType<{ className?: string; size?: number }>;
  requiredRole?: 'admin' | 'lulu';
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Participantes', shortLabel: 'Particip.', icon: Users },
  {
    href: '/dashboard',
    label: 'Dashboard',
    shortLabel: 'Dash.',
    icon: LayoutDashboard,
  },
  { href: '/galeria', label: 'Galeria', icon: ImageIcon },
  {
    href: '/historico',
    label: 'Histórico',
    shortLabel: 'Hist.',
    icon: History,
  },
  {
    href: '/auditoria',
    label: 'Auditoria',
    shortLabel: 'Audit.',
    icon: FileText,
  },
  { href: '/sobre', label: 'Sobre', icon: Info },
  {
    href: '/meu-perfil',
    label: 'Meu Perfil',
    shortLabel: 'Perfil',
    icon: UserCircle,
    requiredRole: 'lulu',
  },
  {
    href: '/admin',
    label: 'Admin',
    icon: Shield,
    requiredRole: 'admin',
  },
];

export const isCurrentRoute = (pathname: string, href: string): boolean => {
  if (href === '/') {
    return pathname === '/';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
};
