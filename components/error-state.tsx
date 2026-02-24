import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({
  title = 'Ops! Algo deu errado',
  message = 'Não foi possível carregar os dados. Por favor, tente novamente.',
  onRetry,
}: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
    <div className="mb-4 rounded-full bg-destructive/10 p-4">
      <AlertCircle className="h-10 w-10 text-destructive" />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
    {onRetry && (
      <Button onClick={onRetry} variant="outline">
        Tentar novamente
      </Button>
    )}
  </div>
);

export default ErrorState;
