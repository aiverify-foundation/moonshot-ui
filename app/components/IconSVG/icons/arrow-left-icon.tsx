type CircleArrowLeftIconProps = {
  outlineColor: string;
  width?: number;
  height?: number;
};

function CircleArrowLeftIcon(props: CircleArrowLeftIconProps) {
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
      strokeLinejoin="round"
      className="feather feather-arrow-left-circle">
      <circle
        cx="12"
        cy="12"
        r="10"
      />
      <polyline points="12 8 8 12 12 16" />
      <line
        x1="16"
        y1="12"
        x2="8"
        y2="12"
      />
    </svg>
  );
}

export { CircleArrowLeftIcon };
