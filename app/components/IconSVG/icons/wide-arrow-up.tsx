type WideArrowUpIconProps = {
  outlineColor: string;
  width?: number;
  height?: number;
};

function WideArrowUpIcon(props: WideArrowUpIconProps) {
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
        d="M46 24L24 3L2 24"
        strokeWidth="3"
      />
    </svg>
  );
}

export { WideArrowUpIcon };
