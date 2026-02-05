import {
  Tooltip as TooltipRoot,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const Tooltip = ({
  children,
  content,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any, any>;
  content: string;
}) => {
  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
};

export default Tooltip;
