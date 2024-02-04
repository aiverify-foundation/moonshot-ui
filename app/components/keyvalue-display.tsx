type KeyValueDisplayProps = {
  label: string;
  value: string;
};

function KeyValueDisplay(props: KeyValueDisplayProps) {
  const { label, value } = props;
  return (
    <div className="mr-1 text-sm">
      <span className="mr-2 font-semibold">{label}:</span>
      <span className="text-sky-700">{value}</span>
    </div>
  );
}

export { KeyValueDisplay };
