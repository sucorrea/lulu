import Animation from '@/components/animation';
import { GiftIcon } from 'lucide-react';

interface NextBirthdayBannerProps {
  daysForBirthday: number;
}

const NextBirthdayBanner = ({ daysForBirthday }: NextBirthdayBannerProps) => (
  <div className="mb-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-l-4 border-primary p-4 -mx-4 -mt-4">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 shrink-0">
          <GiftIcon className="h-6 w-6 text-primary animate-pulse" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-primary">
            Próxima Aniversariante
          </h3>
          <p className="text-2xl font-bold text-foreground">
            {daysForBirthday === 1
              ? `${daysForBirthday} dia`
              : `${daysForBirthday} dias`}
          </p>
          <p className="text-xs text-muted-foreground">até o grande dia!</p>
        </div>
      </div>
      <Animation className="h-16 w-16 shrink-0" />
    </div>
  </div>
);

export default NextBirthdayBanner;
