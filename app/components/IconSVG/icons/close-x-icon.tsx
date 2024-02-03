type CloseIconProps = {
  outlineColor: string;
  width?: number;
  height?: number;
};

function CloseIcon(props: CloseIconProps) {
  const { outlineColor = '#FFFFFF', width = 30, height = 30 } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32">
      <g id="cross">
        <line
          stroke={outlineColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          x1="7"
          x2="25"
          y1="7"
          y2="25"
        />
        <line
          stroke={outlineColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          x1="7"
          x2="25"
          y1="25"
          y2="7"
        />
      </g>
    </svg>
  );
}

export { CloseIcon };
