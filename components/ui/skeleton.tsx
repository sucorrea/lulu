import { type PropsWithChildren, type HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const Skeleton = ({
  className,
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => {
  return (
    <div
      className={twMerge(
        'animate-pulse rounded-md bg-muted [&>*]:!opacity-0 text-transparent',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Skeleton };
