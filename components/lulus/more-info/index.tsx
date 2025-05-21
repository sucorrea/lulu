import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type MoreInfoAccordionProps = {
  text?: string;
  children: React.ReactNode;
};

export function MoreInforAccordion({ text, children }: MoreInfoAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full p-0 m-0">
      <AccordionItem value="item-1">
        <AccordionTrigger>{text}</AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
