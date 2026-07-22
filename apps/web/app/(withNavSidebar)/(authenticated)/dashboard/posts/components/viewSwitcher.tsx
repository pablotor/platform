'use client';

import { LayoutGrid, List, Rows3 } from 'lucide-react';
import { useQueryState } from 'nuqs';

import { postsSearchParamsParsers } from '../postsSearchParams';

const VIEWS = [
  {
    value: 'list' as const,
    label: 'List',
    Icon: List,
    disabled: false as const,
  },
  {
    value: 'compact' as const,
    label: 'Compact',
    Icon: Rows3,
    disabled: true as const,
    disabledReason: 'Coming soon',
  },
  {
    value: 'grid' as const,
    label: 'Grid',
    Icon: LayoutGrid,
    disabled: true as const,
    disabledReason: 'Needs image support',
  },
];

const ViewSwitcher = () => {
  const [view, setView] = useQueryState('view', postsSearchParamsParsers.view);

  return (
    <div
      className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1"
      role="group"
      aria-label="View"
    >
      {VIEWS.map(({ value, label, Icon, disabled, disabledReason }) => (
        <button
          key={value}
          type="button"
          disabled={disabled}
          title={disabled ? disabledReason : label}
          aria-pressed={view === value}
          onClick={() => setView(value)}
          className={`
            flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-ui
            transition-colors duration-200 disabled:cursor-not-allowed
            disabled:opacity-40 focus-visible:focusable-outline
            ${
              view === value
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }
          `}
        >
          <Icon className="size-4" />
          <span className="sr-only sm:not-sr-only">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default ViewSwitcher;
