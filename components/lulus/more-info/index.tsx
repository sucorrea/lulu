import { ReactNode } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type MoreInfoAccordionProps = {
  text?: string;
  children: ReactNode;
};

const MoreInfoAccordion = ({ text, children }: MoreInfoAccordionProps) => (
  <Accordion type="single" collapsible className="w-full p-0 m-0">
    <AccordionItem value="item-1">
      <AccordionTrigger>{text}</AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  </Accordion>
);

export default MoreInfoAccordion;
