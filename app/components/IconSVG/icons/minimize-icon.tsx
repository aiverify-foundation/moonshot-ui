type MinimizeIconProps = {
  outlineColor: string;
  width?: number;
  height?: number;
};

function MinimizeIcon(props: MinimizeIconProps) {
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
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line
        x1="14"
        y1="10"
        x2="21"
        y2="3"
      />
      <line
        x1="3"
        y1="21"
        x2="10"
        y2="14"
      />
    </svg>
  );
}

export { MinimizeIcon };
