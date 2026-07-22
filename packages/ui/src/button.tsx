import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import {
  ComponentProps,
  ComponentPropsWithRef,
  ElementType,
  PropsWithChildren,
} from 'react';

const buttonVariants = cva(
  clsx(
    'group/button inline-flex shrink-0 items-center justify-center rounded-lg border bg-clip-padding text-ui whitespace-nowrap select-none cursor-pointer outline-none',
    // shared timing token — every interactive state (hover/focus/press) animates at this rate
    'transition-all duration-200 ease-out',
    // focus-visible — identical ring treatment across every variant
    'focus-visible:focusable',
    // pressed — tactile feedback independent of hover
    'active:not-aria-[haspopup]:translate-y-px active:not-aria-[haspopup]:scale-[0.98]',
    // disabled — one rule, never reinvented per variant
    'disabled:pointer-events-none disabled:opacity-50',
    // invalid (form contexts)
    'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ),
  {
    variants: {
      variant: {
        // Primary: brand gradient. Hover intensifies via saturate/brightness —
        // gradients can't crossfade between two different backgrounds, so we
        // push the existing one rather than swap it.
        default:
          'border-transparent gradient-primary text-background hover:saturate-150 hover:brightness-110 aria-expanded:saturate-150 aria-expanded:brightness-110',
        // Same idea, opposite brand gradient — use where gradient-secondary carries
        // meaning elsewhere on the page (e.g. a secondary CTA family).
        accent:
          'border-transparent gradient-secondary text-background hover:saturate-150 hover:brightness-110 aria-expanded:saturate-150 aria-expanded:brightness-110',
        // Outline: the only variant with a real visible border.
        outline:
          'border-border bg-background hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground',
        // Secondary: switches to accent on hover, now that accent is a
        // genuinely distinct interaction color from secondary/muted.
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground',
        ghost:
          'border-transparent hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground',
        // Destructive: darken on hover/press rather than lighten — signals
        // weight/caution instead of inviting the click.
        destructive:
          'border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20 hover:brightness-90 focus-visible:focusable-destructive! dark:bg-destructive/20 dark:hover:bg-destructive/30',
      },
      size: {
        default:
          'h-9 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 rounded-[min(var(--radius-md),12px)] px-3 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-10 gap-1.5 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4',
        icon: 'size-9',
        'icon-xs':
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        'icon-sm':
          'size-8 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type AsProp<C extends ElementType> = {
  as?: C;
};

// Omit props that will be overridden by our own explicit props
type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProp<
  C extends ElementType,
  Props = object,
> = PropsWithChildren<Props & AsProp<C>> &
  Omit<ComponentProps<C>, PropsToOmit<C, Props>>;

export type ButtonProps<C extends ElementType = 'button'> =
  PolymorphicComponentProp<
    C,
    VariantProps<typeof buttonVariants> & {
      className?: string;
      ref?: ComponentPropsWithRef<C>['ref'];
    }
  >;

const Button = <C extends ElementType = 'button'>({
  variant = 'default',
  size = 'default',
  as,
  children,
  className,
  ref,
  ...props
}: ButtonProps<C>) => {
  const Component = as ?? 'button';

  return (
    <Component
      ref={ref}
      className={clsx(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;
