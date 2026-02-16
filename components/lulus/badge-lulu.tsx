import { Users } from 'lucide-react';
import { Badge } from '../ui/badge';

interface BadgeLuluProps {
  text: string;
  icon?: React.ReactNode;
}

const BadgeLulu = ({ text, icon }: BadgeLuluProps) => {
  return (
    <div className="flex md:justify-end xs:justify-center mb-2">
      <Badge
        variant="secondary"
        className="w-fit bg-primary px-3 py-2 text-sm shadow-lulu-sm"
      >
        {icon ?? <Users className="mr-2 h-4 w-4 shrink-0" />}
        <span className="font-semibold">{text}</span>
      </Badge>
    </div>
  );
};
export default BadgeLulu;
