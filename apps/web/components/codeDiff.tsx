const DiffLine = ({
  type,
  children,
}: {
  type: 'bad' | 'good';
  children: React.ReactNode;
}) => (
  <div
    className={`flex gap-3 px-4 py-0.5 ${
      type === 'bad'
        ? 'bg-destructive/6 text-destructive'
        : 'bg-brand-primary-from/6 text-brand-primary dark:text-brand-primary-accent'
    }`}
  >
    <span className="mt-px select-none font-mono text-xs opacity-40">
      {type === 'bad' ? '−' : '+'}
    </span>
    <code className="whitespace-pre font-mono text-xs leading-6">
      {children}
    </code>
  </div>
);

const DiffBlock = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-hidden rounded-xl border border-border bg-card">
    {children}
  </div>
);

const DiffLabel = ({ label }: { label: string }) => (
  <div className="border-b border-border bg-muted/50 px-4 py-2">
    <span className="text-label text-muted-foreground">{label}</span>
  </div>
);

type CodeDiffProps = {
  badCode: string[];
  goodCode: string[];
  labels?: {
    bad: string;
    good: string;
  };
};

const CodeDiff = ({ badCode, goodCode, labels }: CodeDiffProps) => (
  <>
    <DiffBlock>
      {labels && <DiffLabel label={labels.bad} />}
      <div className="py-2">
        {badCode.map((line, i) => (
          <DiffLine key={i} type="bad">
            {line}
          </DiffLine>
        ))}
      </div>
    </DiffBlock>

    <DiffBlock>
      {labels && <DiffLabel label={labels.good} />}
      <div className="py-2">
        {goodCode.map((line, i) => (
          <DiffLine key={i} type="good">
            {line}
          </DiffLine>
        ))}
      </div>
    </DiffBlock>
  </>
);

export default CodeDiff;
