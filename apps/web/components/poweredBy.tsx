import Link from 'next/link';

const PoweredBy = () => (
  <span className="text-body-xs text-muted-foreground">
    Built on{' '}
    <Link
      href="https://github.com/pablotor/platform"
      target="_blank"
      rel="noopener noreferrer"
      className="text-link"
    >
      PabloTor Platform
    </Link>
  </span>
);

export default PoweredBy;
