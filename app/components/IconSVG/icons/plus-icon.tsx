/*
  Source: https://feathericons.com/?query=plus
  License: The MIT License (MIT)
  License URL: https://github.com/feathericons/feather/blob/main/LICENSE
*/

type PlusIconProps = {
  outlineColor: string;
  width?: number;
  height?: number;
};

function PlusIcon(props: PlusIconProps) {
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
      strokeLinejoin="round"
      className="feather feather-plus">
      <line
        x1="12"
        y1="5"
        x2="12"
        y2="19"
      />
      <line
        x1="5"
        y1="12"
        x2="19"
        y2="12"
      />
    </svg>
  );
}

export { PlusIcon };
