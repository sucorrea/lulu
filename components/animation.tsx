import { CSSProperties } from 'react';
import { DotLottieReact, setWasmUrl } from '@lottiefiles/dotlottie-react';

setWasmUrl('/wasm/dotlottie-player.wasm');

interface AnimationProps {
  src?: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: CSSProperties;
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
}: AnimationProps) => (
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

export default Animation;
