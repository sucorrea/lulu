import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Animation from './animation';

vi.mock('@lottiefiles/dotlottie-react', () => ({
  setWasmUrl: vi.fn(),
  DotLottieReact: ({
    src,
    loop,
    autoplay,
    className,
    style,
    width,
    height,
  }: {
    src: string;
    loop: boolean;
    autoplay: boolean;
    className?: string;
    style?: React.CSSProperties;
    width?: number | string;
    height?: number | string;
  }) => (
    <div
      data-testid="dotlottie-react"
      data-src={src}
      data-loop={String(loop)}
      data-autoplay={String(autoplay)}
      className={className}
      style={{ ...style }}
      data-width={width}
      data-height={height}
    />
  ),
}));

describe('Animation', () => {
  it('should render with default props', () => {
    render(<Animation />);

    const animation = screen.getByTestId('dotlottie-react');
    expect(animation).toBeInTheDocument();
    expect(animation).toHaveAttribute('data-src', '/animation/confetti.lottie');
    expect(animation).toHaveAttribute('data-loop', 'true');
    expect(animation).toHaveAttribute('data-autoplay', 'true');
  });

  it('should render with custom src', () => {
    render(<Animation src="/custom/animation.lottie" />);

    const animation = screen.getByTestId('dotlottie-react');
    expect(animation).toHaveAttribute('data-src', '/custom/animation.lottie');
  });

  it('should render with loop disabled', () => {
    render(<Animation loop={false} />);

    const animation = screen.getByTestId('dotlottie-react');
    expect(animation).toHaveAttribute('data-loop', 'false');
  });

  it('should render with autoplay disabled', () => {
    render(<Animation autoplay={false} />);

    const animation = screen.getByTestId('dotlottie-react');
    expect(animation).toHaveAttribute('data-autoplay', 'false');
  });

  it('should render with custom className', () => {
    render(<Animation className="custom-class" />);

    const animation = screen.getByTestId('dotlottie-react');
    expect(animation).toHaveClass('custom-class');
  });

  it('should render with numeric width', () => {
    render(<Animation width={200} />);

    const animation = screen.getByTestId('dotlottie-react');
    expect(animation).toHaveAttribute('data-width', '200');
  });

  it('should render with string width', () => {
    render(<Animation width="100%" />);

    const animation = screen.getByTestId('dotlottie-react');
    expect(animation).toHaveAttribute('data-width', '100%');
  });

  it('should render with numeric height', () => {
    render(<Animation height={300} />);

    const animation = screen.getByTestId('dotlottie-react');
    expect(animation).toHaveAttribute('data-height', '300');
  });

  it('should render with string height', () => {
    render(<Animation height="50vh" />);

    const animation = screen.getByTestId('dotlottie-react');
    expect(animation).toHaveAttribute('data-height', '50vh');
  });

  it('should render with all custom props', () => {
    const props = {
      src: '/test.lottie',
      loop: false,
      autoplay: false,
      className: 'test-class',
      width: 400,
      height: '80%',
    };

    render(<Animation {...props} />);

    const animation = screen.getByTestId('dotlottie-react');
    expect(animation).toHaveAttribute('data-src', '/test.lottie');
    expect(animation).toHaveAttribute('data-loop', 'false');
    expect(animation).toHaveAttribute('data-autoplay', 'false');
    expect(animation).toHaveClass('test-class');
    expect(animation).toHaveAttribute('data-width', '400');
    expect(animation).toHaveAttribute('data-height', '80%');
  });

  it('should render with undefined optional props', () => {
    render(<Animation className={undefined} style={undefined} />);

    const animation = screen.getByTestId('dotlottie-react');
    expect(animation).toBeInTheDocument();
  });

  it('should render with zero width and height', () => {
    render(<Animation width={0} height={0} />);

    const animation = screen.getByTestId('dotlottie-react');
    expect(animation).toHaveAttribute('data-width', '0');
    expect(animation).toHaveAttribute('data-height', '0');
  });

  it('should render with empty className', () => {
    render(<Animation className="" />);

    const animation = screen.getByTestId('dotlottie-react');
    expect(animation).toBeInTheDocument();
  });
});
