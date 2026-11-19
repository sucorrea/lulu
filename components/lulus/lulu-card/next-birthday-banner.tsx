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
  <p
    data-testid="next-birthday-banner"
    className="bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground"
  >
    {getNextBirthdayLabel(daysUntil)}
  </p>
);

export default NextBirthdayBanner;
