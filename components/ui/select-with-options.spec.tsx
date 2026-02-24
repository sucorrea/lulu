import * as React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SelectWithOptions } from './select-with-options';

vi.mock('@/components/ui/select', () => {
  const MockSelectContent = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-content">{children}</div>
  );

  return {
    Select: ({
      value,
      onValueChange,
      disabled,
      children,
    }: {
      value?: string;
      onValueChange?: (value: string) => void;
      disabled?: boolean;
      children: React.ReactNode;
    }) => {
      const childArray = React.Children.toArray(children);
      const contentChild = childArray.find(
        (c) => React.isValidElement(c) && c.type === MockSelectContent
      );
      const options =
        contentChild && React.isValidElement(contentChild)
          ? React.Children.toArray(
              (contentChild.props as { children: React.ReactNode }).children
            )
          : [];
      const triggerChild = childArray.find(
        (c) => React.isValidElement(c) && c.type !== MockSelectContent
      );
      return (
        <div data-testid="select-root">
          {triggerChild}
          <select
            data-testid="select"
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
            disabled={disabled}
          >
            {options}
          </select>
        </div>
      );
    },
    SelectTrigger: ({
      children,
      id,
      className,
    }: {
      children: React.ReactNode;
      id?: string;
      className?: string;
    }) => (
      <div data-testid="select-trigger" id={id} data-classname={className}>
        {children}
      </div>
    ),
    SelectValue: ({ placeholder }: { placeholder?: string }) => (
      <span data-testid="select-value">{placeholder ?? ''}</span>
    ),
    SelectContent: MockSelectContent,
    SelectItem: ({
      value,
      children,
    }: {
      value: string;
      children: React.ReactNode;
    }) => (
      <option value={value} data-testid={`option-${value}`}>
        {children}
      </option>
    ),
  };
});

const DEFAULT_OPTIONS = [
  { value: 'a', label: 'Option A' },
  { value: 10, label: 'Option 10' },
  { value: 'b', label: 'Option B' },
];

describe('SelectWithOptions', () => {
  it('renders with options', () => {
    render(
      <SelectWithOptions
        value="a"
        onValueChange={vi.fn()}
        options={DEFAULT_OPTIONS}
      />
    );

    expect(screen.getByTestId('select')).toBeInTheDocument();
    expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option 10')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('passes value as string to Select', () => {
    render(
      <SelectWithOptions
        value={10}
        onValueChange={vi.fn()}
        options={DEFAULT_OPTIONS}
      />
    );

    const select = screen.getByTestId('select') as unknown as HTMLSelectElement;
    expect(select.value).toBe('10');
  });

  it('calls onValueChange when option is selected', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();

    render(
      <SelectWithOptions
        value="a"
        onValueChange={onValueChange}
        options={DEFAULT_OPTIONS}
      />
    );

    const select = screen.getByTestId('select');
    await user.selectOptions(select, 'b');

    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('renders placeholder in SelectValue', () => {
    render(
      <SelectWithOptions
        value="a"
        onValueChange={vi.fn()}
        options={DEFAULT_OPTIONS}
        placeholder="Choose..."
      />
    );

    expect(screen.getByTestId('select-value')).toHaveTextContent('Choose...');
  });

  it('passes disabled to Select', () => {
    render(
      <SelectWithOptions
        value="a"
        onValueChange={vi.fn()}
        options={DEFAULT_OPTIONS}
        disabled
      />
    );

    const select = screen.getByTestId('select');
    expect(select).toBeDisabled();
  });

  it('passes triggerClassName to SelectTrigger', () => {
    render(
      <SelectWithOptions
        value="a"
        onValueChange={vi.fn()}
        options={DEFAULT_OPTIONS}
        triggerClassName="w-full"
      />
    );

    const trigger = screen.getByTestId('select-trigger');
    expect(trigger).toHaveAttribute('data-classname', 'w-full');
  });

  it('passes triggerId to SelectTrigger', () => {
    render(
      <SelectWithOptions
        value="a"
        onValueChange={vi.fn()}
        options={DEFAULT_OPTIONS}
        triggerId="my-select"
      />
    );

    const trigger = screen.getByTestId('select-trigger');
    expect(trigger).toHaveAttribute('id', 'my-select');
  });

  it('wraps trigger with triggerWrapper when provided', () => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="trigger-wrapper">{children}</div>
    );

    render(
      <SelectWithOptions
        value="a"
        onValueChange={vi.fn()}
        options={DEFAULT_OPTIONS}
        triggerWrapper={Wrapper}
      />
    );

    expect(screen.getByTestId('trigger-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
  });

  it('renders without triggerWrapper when not provided', () => {
    render(
      <SelectWithOptions
        value="a"
        onValueChange={vi.fn()}
        options={DEFAULT_OPTIONS}
      />
    );

    expect(screen.queryByTestId('trigger-wrapper')).not.toBeInTheDocument();
    expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
  });

  it('renders empty options', () => {
    render(<SelectWithOptions value="" onValueChange={vi.fn()} options={[]} />);

    expect(screen.getByTestId('select')).toBeInTheDocument();
    expect(screen.queryByTestId(/^option-/)).not.toBeInTheDocument();
  });

  it('renders readonly options array', () => {
    const readonlyOptions = [{ value: 'x', label: 'Readonly X' }] as const;

    render(
      <SelectWithOptions
        value="x"
        onValueChange={vi.fn()}
        options={readonlyOptions}
      />
    );

    expect(screen.getByText('Readonly X')).toBeInTheDocument();
  });
});
