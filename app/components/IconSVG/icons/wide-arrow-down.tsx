type WideArrowDownIconProps = {
  outlineColor: string;
  width?: number;
  height?: number;
};

function WideArrowDownIcon(props: WideArrowDownIconProps) {
  const { outlineColor = '#FFFFFF', width = 30, height = 30 } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 26"
      fill="none"
      stroke={outlineColor}
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 2L24 23L46 2"
        strokeWidth="3"
      />
    </svg>
  );
}

export { WideArrowDownIcon };
