'use client';

import Button from '@repo/ui/button';
import ButtonGroup from '@repo/ui/buttonGroup';
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
    <ButtonGroup aria-label="View">
      {VIEWS.map(({ value, label, Icon, disabled, disabledReason }) => {
        const isActive = view === value;

        return (
          <Button
            key={value}
            type="button"
            variant={isActive ? 'pressed' : 'ghost'}
            size="sm"
            disabled={disabled}
            title={disabled ? disabledReason : label}
            aria-pressed={isActive}
            onClick={() => setView(value)}
          >
            <Icon data-icon="inline-start" />
            <span className="sr-only sm:not-sr-only">{label}</span>
          </Button>
        );
      })}
    </ButtonGroup>
  );
};

export default ViewSwitcher;
