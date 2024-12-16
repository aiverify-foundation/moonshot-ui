type ThinArrowRightIconProps = {
  fillColor: string;
  width?: number;
  height?: number;
};

function ThinArrowRightIcon(props: ThinArrowRightIconProps) {
  const { fillColor = '#FFFFFF', width = 30, height = 30 } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 1200 1200"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="m833.62 303.38c-6.1562 0-12.531 2.4062-17.25 7.125-9.4375 9.4375-9.4375 24.688 0 34.125l231.38 231.38h-963.75c-13.344 0-24 10.652-24 24 0 13.344 10.656 24 24 24h963.75l-231.38 231.38c-9.4375 9.4336-9.4375 24.688 0 34.125 9.4375 9.4336 24.688 9.4336 34.125 0l289.5-289.5-289.5-289.5c-4.7188-4.7188-10.715-7.125-16.875-7.125z"
        fill={fillColor}
        fillRule="evenodd"
      />
    </svg>
  );
}

export { ThinArrowRightIcon };
