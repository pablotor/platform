import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export type BackToProps = {
  href: string;
  label: string;
};

const BackTo = ({ href, label }: BackToProps) => (
  <Link
    href={href}
    // Combination of texxt-ui and font-normal made on purpose. Do not refactor
    className="flex items-center-safe text-ui font-normal text-muted-foreground text-link gap-1"
  >
    {`Back to ${label}`} <ArrowRight className="size-4 mt-0.5" />
  </Link>
);

export default BackTo;
