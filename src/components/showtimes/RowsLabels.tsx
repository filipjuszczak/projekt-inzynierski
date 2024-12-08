interface RowsLabelsProps {
  numberOfRows: number;
}

export default function RowsLabels({ numberOfRows }: RowsLabelsProps) {
  return (
    <div
      className="flex flex-col items-end justify-start pt-[4.9rem] font-medium text-muted-foreground"
      aria-hidden="true"
    >
      {Array.from({ length: numberOfRows }, (_, index) => (
        <div
          key={`row-label-${index + 1}`}
          className="flex h-12 items-center text-sm"
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
}
