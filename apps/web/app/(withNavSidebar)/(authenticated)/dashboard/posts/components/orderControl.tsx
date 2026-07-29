'use client';
import Button from '@repo/ui/button';
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react';
import { useQueryState } from 'nuqs';

import { postsSearchParamsParsers } from '../postsSearchParams';

const OrderControl = () => {
  const [order, setOrder] = useQueryState(
    'order',
    postsSearchParamsParsers.order,
  );
  const isDesc = order === 'desc';

  return (
    <Button
      type="button"
      onClick={() => setOrder(isDesc ? 'asc' : 'desc')}
      variant="outline"
      className="w-34 justify-between!"
    >
      {isDesc ? (
        <ArrowDownNarrowWide className="size-4" />
      ) : (
        <ArrowUpNarrowWide className="size-4" />
      )}
      {isDesc ? 'Newest first' : 'Oldest first'}
    </Button>
  );
};

export default OrderControl;
