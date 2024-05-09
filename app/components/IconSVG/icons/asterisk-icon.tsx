type AsteriskIconProps = {
  outlineColor?: string;
  fillColor?: string;
  width?: number;
  height?: number;
};

function AsteriskIcon(props: AsteriskIconProps) {
  const {
    outlineColor = 'none',
    fillColor = '#FFFFFF',
    width = 30,
    height = 30,
  } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 68 64"
      fill={fillColor}
      stroke={outlineColor}
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M34.0496 2V62M57.5828 9.5L10.5163 54.5M65.4273 32H2.67188M57.5828 54.5L10.5163 9.5"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export { AsteriskIcon };
