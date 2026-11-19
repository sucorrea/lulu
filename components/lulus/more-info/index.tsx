import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type MoreInfoAccordionProps = {
  text?: string;
  children: ReactNode;
  className?: string;
};

const MoreInfoAccordion = ({
  text = 'mais detalhes',
  children,
  className,
}: MoreInfoAccordionProps) => (
  <Accordion
    type="single"
    collapsible
    className={twMerge('w-full p-0 m-0', className)}
  >
    <AccordionItem value="item-1">
      <AccordionTrigger className="min-h-11 font-sans font-semibold">
        {text}
      </AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  </Accordion>
);

export default MoreInfoAccordion;
