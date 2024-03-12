type KeyValueDisplayProps = {
  label: string;
  value: string;
  layoutColumn?: boolean;
};

function KeyValueDisplay(props: KeyValueDisplayProps) {
  const { label, value, layoutColumn = true } = props;
  return (
    <div
      className={`flex ${layoutColumn ? 'flex-col' : 'flex-row'} mr-1 mb-3 text-[0.96rem]`}>
      <div className="mr-2 font-semibold">
        {label}
        {!layoutColumn ? ':' : ''}
      </div>
      <div className="text-sky-700">{value}</div>
    </div>
  );
}

export { KeyValueDisplay };
