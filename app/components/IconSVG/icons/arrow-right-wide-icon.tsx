type WideArrowRightIconProps = {
  outlineColor: string;
  width?: number;
  height?: number;
};

function WideArrowRightIcon(props: WideArrowRightIconProps) {
  const { outlineColor = '#FFFFFF', width = 30, height = 30 } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 26 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 46L23 24L2 2"
        stroke={outlineColor}
        strokeWidth="3"
      />
    </svg>
  );
}

export { WideArrowRightIcon };
