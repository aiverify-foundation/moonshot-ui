type ArrowLeftIconProps = {
  outlineColor: string;
  width?: number;
  height?: number;
};

function ArrowLeftIcon(props: ArrowLeftIconProps) {
  const { outlineColor = '#FFFFFF', width = 30, height = 30 } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={outlineColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <line
        x1="19"
        y1="12"
        x2="5"
        y2="12"
      />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

export { ArrowLeftIcon };
