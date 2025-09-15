import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface AnimationProps {
  src?: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
}

const Animation = ({
  src = '/animation/confetti.lottie',
  loop = true,
  autoplay = true,
  className,
  style,
  width,
  height,
}: AnimationProps) => {
  return (
    <DotLottieReact
      src={src}
      loop={loop}
      autoplay={autoplay}
      className={className}
      style={style}
      width={width}
      height={height}
    />
  );
};

export default Animation;
