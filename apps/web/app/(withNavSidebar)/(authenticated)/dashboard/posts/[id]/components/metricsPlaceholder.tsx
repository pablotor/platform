import { BarChart3 } from 'lucide-react';

const MetricsPlaceholder = () => (
  <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-10 text-center">
    <BarChart3 className="size-6 text-muted-foreground/50" />
    <p className="text-body-sm text-muted-foreground">
      Post metrics are coming soon.
    </p>
  </div>
);

export default MetricsPlaceholder;
