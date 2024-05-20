type WideArrowLeftIconProps = {
  outlineColor: string;
  width?: number;
  height?: number;
};

function WideArrowLeftIcon(props: WideArrowLeftIconProps) {
  const { outlineColor = '#FFFFFF', width = 30, height = 30 } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 26 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24 2L3 24L24 46"
        stroke={outlineColor}
        strokeWidth="3"
      />
    </svg>
  );
}

export { WideArrowLeftIcon };
