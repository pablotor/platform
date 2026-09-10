import clsx from 'clsx';
import { ComponentProps, PropsWithChildren } from 'react';

// Button's xs/sm size variants already key off data-slot="button-group"
// (in-data-[slot=button-group]:rounded-lg) to switch from their standalone
// capped radius to the full rounded-lg once grouped — this component's only
// real job is setting that attribute. Everything else is layout.
export type ButtonGroupProps = PropsWithChildren<
  Omit<ComponentProps<'div'>, 'role'> & {
    'aria-label': string;
  }
>;

const ButtonGroup = ({ className, children, ...props }: ButtonGroupProps) => (
  <div
    data-slot="button-group"
    role="group"
    className={clsx(
      'flex items-center gap-1 rounded-lg bg-muted/50 p-1',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export default ButtonGroup;
