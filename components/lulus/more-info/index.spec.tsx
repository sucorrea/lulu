import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MoreInfoAccordion from './index';

vi.mock('@/components/ui/accordion', () => ({
  Accordion: ({
    children,
    type,
    collapsible,
    className,
  }: {
    children: React.ReactNode;
    type: string;
    collapsible: boolean;
    className: string;
  }) => (
    <div
      data-testid="accordion"
      data-type={type}
      data-collapsible={collapsible}
      className={className}
    >
      {children}
    </div>
  ),
  AccordionItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => (
    <div data-testid="accordion-item" data-value={value}>
      {children}
    </div>
  ),
  AccordionTrigger: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="accordion-trigger">{children}</button>
  ),
  AccordionContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="accordion-content">{children}</div>
  ),
}));

describe('MoreInfoAccordion', () => {
  it('should render accordion with default text', () => {
    render(
      <MoreInfoAccordion>
        <div>Test Content</div>
      </MoreInfoAccordion>
    );

    expect(screen.getByTestId('accordion')).toBeInTheDocument();
  });

  it('should render children content', () => {
    render(
      <MoreInfoAccordion>
        <div>Test Content</div>
      </MoreInfoAccordion>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render custom text in trigger', () => {
    render(
      <MoreInfoAccordion text="Custom Text">
        <div>Test Content</div>
      </MoreInfoAccordion>
    );

    expect(screen.getByText('Custom Text')).toBeInTheDocument();
  });

  it('should have type single', () => {
    render(
      <MoreInfoAccordion>
        <div>Test Content</div>
      </MoreInfoAccordion>
    );

    const accordion = screen.getByTestId('accordion');
    expect(accordion).toHaveAttribute('data-type', 'single');
  });

  it('should be collapsible', () => {
    render(
      <MoreInfoAccordion>
        <div>Test Content</div>
      </MoreInfoAccordion>
    );

    const accordion = screen.getByTestId('accordion');
    expect(accordion).toHaveAttribute('data-collapsible', 'true');
  });

  it('should have correct className', () => {
    render(
      <MoreInfoAccordion>
        <div>Test Content</div>
      </MoreInfoAccordion>
    );

    const accordion = screen.getByTestId('accordion');
    expect(accordion).toHaveClass('w-full', 'p-0', 'm-0');
  });

  it('should render accordion item with value item-1', () => {
    render(
      <MoreInfoAccordion>
        <div>Test Content</div>
      </MoreInfoAccordion>
    );

    const item = screen.getByTestId('accordion-item');
    expect(item).toHaveAttribute('data-value', 'item-1');
  });

  it('should render accordion trigger', () => {
    render(
      <MoreInfoAccordion>
        <div>Test Content</div>
      </MoreInfoAccordion>
    );

    expect(screen.getByTestId('accordion-trigger')).toBeInTheDocument();
  });

  it('should render accordion content', () => {
    render(
      <MoreInfoAccordion>
        <div>Test Content</div>
      </MoreInfoAccordion>
    );

    expect(screen.getByTestId('accordion-content')).toBeInTheDocument();
  });

  it('should handle complex children', () => {
    render(
      <MoreInfoAccordion>
        <div>
          <h1>Title</h1>
          <p>Paragraph</p>
          <button>Button</button>
        </div>
      </MoreInfoAccordion>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Paragraph')).toBeInTheDocument();
    expect(screen.getByText('Button')).toBeInTheDocument();
  });

  it('should handle multiple child elements', () => {
    render(
      <MoreInfoAccordion>
        <>
          <div>First</div>
          <div>Second</div>
          <div>Third</div>
        </>
      </MoreInfoAccordion>
    );

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
  });

  it('should handle empty text prop', () => {
    render(
      <MoreInfoAccordion text="">
        <div>Test Content</div>
      </MoreInfoAccordion>
    );

    const trigger = screen.getByTestId('accordion-trigger');
    expect(trigger).toBeInTheDocument();
  });
});
