interface NextBirthdayBannerProps {
  daysUntil: number;
}

const LABEL_PREFIX = 'Próxima aniversariante';

export const getNextBirthdayLabel = (daysUntil: number): string => {
  if (daysUntil === 0) {
    return `${LABEL_PREFIX} · é hoje!`;
  }
  if (daysUntil === 1) {
    return `${LABEL_PREFIX} · falta 1 dia`;
  }
  return `${LABEL_PREFIX} · faltam ${daysUntil} dias`;
};

const NextBirthdayBanner = ({ daysUntil }: NextBirthdayBannerProps) => (
  <span className="inline-block rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
    {getNextBirthdayLabel(daysUntil)}
  </span>
);

export default NextBirthdayBanner;
