import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import WhatsappInfo from './whatsapp-info';
import { Person } from './lulus/types';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt ?? ''} />;
  },
}));

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    target,
    rel,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    target?: string;
    rel?: string;
    className?: string;
  }) => (
    <a href={href} target={target} rel={rel} className={className}>
      {children}
    </a>
  ),
}));

vi.mock('brazilian-values', () => ({
  formatToPhone: (phone: string) => {
    if (!phone) {
      return '';
    }
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  },
}));

vi.mock('./lulus/constants', () => ({
  LINK_WHATSAPP: 'https://api.whatsapp.com/send?phone=55',
}));

describe('WhatsappInfo', () => {
  const mockParticipant: Person = {
    id: 1,
    name: 'Alice',
    fullName: 'Alice Johnson',
    date: '1990-01-15',
    month: '01',
    receives_to_id: 2,
    city: 'São Paulo',
    phone: '11999999999',
  };

  it('should render whatsapp link', () => {
    render(<WhatsappInfo participant={mockParticipant} />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      'href',
      'https://api.whatsapp.com/send?phone=5511999999999'
    );
  });

  it('should open link in new tab', () => {
    render(<WhatsappInfo participant={mockParticipant} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('should have noopener noreferrer rel attribute', () => {
    render(<WhatsappInfo participant={mockParticipant} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render whatsapp icon', () => {
    render(<WhatsappInfo participant={mockParticipant} />);

    const icon = screen.getByAltText('Whatsapp');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', '/whatsapp.svg');
  });

  it('should render formatted phone number', () => {
    render(<WhatsappInfo participant={mockParticipant} />);

    expect(screen.getByText('(11) 99999-9999')).toBeInTheDocument();
  });

  it('should apply correct classes to link', () => {
    render(<WhatsappInfo participant={mockParticipant} />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('flex', 'gap-1', 'items-end');
  });

  it('should apply correct dimensions to icon', () => {
    render(<WhatsappInfo participant={mockParticipant} />);

    const icon = screen.getByAltText('Whatsapp');
    expect(icon).toHaveAttribute('width', '20');
    expect(icon).toHaveAttribute('height', '20');
  });

  it('should apply ml-1 and text-xs to phone span', () => {
    render(<WhatsappInfo participant={mockParticipant} />);

    const phoneSpan = screen.getByText('(11) 99999-9999');
    expect(phoneSpan).toHaveClass('ml-1', 'text-xs');
  });

  it('should handle empty phone number', () => {
    const participant: Person = {
      ...mockParticipant,
      phone: '',
    };

    render(<WhatsappInfo participant={participant} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'href',
      'https://api.whatsapp.com/send?phone=55'
    );
  });

  it('should handle undefined phone number', () => {
    const participant: Person = {
      ...mockParticipant,
      phone: undefined,
    };

    render(<WhatsappInfo participant={participant} />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  it('should format different phone number patterns', () => {
    const participant: Person = {
      ...mockParticipant,
      phone: '21987654321',
    };

    render(<WhatsappInfo participant={participant} />);

    expect(screen.getByText('(21) 98765-4321')).toBeInTheDocument();
  });

  it('should concatenate LINK_WHATSAPP with phone', () => {
    render(<WhatsappInfo participant={mockParticipant} />);

    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toContain(
      'https://api.whatsapp.com/send?phone=55'
    );
    expect(link.getAttribute('href')).toContain('11999999999');
  });

  it('should render icon with w-5 h-5 classes', () => {
    render(<WhatsappInfo participant={mockParticipant} />);

    const icon = screen.getByAltText('Whatsapp');
    expect(icon).toHaveClass('w-5', 'h-5');
  });
});
