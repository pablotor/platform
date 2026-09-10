import clsx from 'clsx';

type PablotorLogoProps = {
  variant?: 'horizontal' | 'vertical';
  text?: string;
};

const PablotorLogo = ({
  variant = 'horizontal',
  text = 'Platform',
}: PablotorLogoProps) => (
  // one-off: logo — intentional, do not refactor
  <span
    className={clsx(
      'text-lg font-bold tracking-tight',
      variant === 'vertical' && 'flex flex-col text-right',
    )}
  >
    <span className="gradient-primary text-gradient">PabloTor</span>{' '}
    <span className="text-muted-foreground font-light">{text}</span>
  </span>
);

export default PablotorLogo;
