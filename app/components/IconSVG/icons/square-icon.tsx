/*
  Source: https://feathericons.com/?query=square
  License: The MIT License (MIT)
  License URL: https://github.com/feathericons/feather/blob/main/LICENSE
*/

type PlusIconProps = {
  outlineColor: string;
  width?: number;
  height?: number;
};

function SquareIcon(props: PlusIconProps) {
  const { outlineColor, width, height } = props;
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
      stroke-linejoin="round">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        ry="2"
      />
    </svg>
  );
}

export { SquareIcon };
