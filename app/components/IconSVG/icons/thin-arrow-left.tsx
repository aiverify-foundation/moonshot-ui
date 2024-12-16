type ThinArrowLeftIconProps = {
  fillColor: string;
  width?: number;
  height?: number;
};

function ThinArrowLeftIcon(props: ThinArrowLeftIconProps) {
  const { fillColor = '#FFFFFF', width = 30, height = 30 } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 1200 1200"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="m366.38 303.38c-6.1562 0-12.156 2.4102-16.875 7.125l-289.5 289.5 289.5 289.5c4.7188 4.7188 10.715 7.125 16.875 7.125 6.1562 0 12.531-2.4062 17.25-7.125 9.4375-9.4375 9.4375-24.688 0-34.125l-231.38-231.38h963.75c13.344 0 24-10.652 24-24 0-13.344-10.656-24-24-24h-963.75l231.38-231.38c9.4375-9.4336 9.4375-24.688 0-34.125-4.7188-4.7148-11.094-7.125-17.25-7.125z"
        fill={fillColor}
        fillRule="evenodd"
      />
    </svg>
  );
}

export { ThinArrowLeftIcon };
