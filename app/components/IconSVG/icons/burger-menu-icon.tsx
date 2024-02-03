/*
  TODO - find another svg
*/

type BurgerMenuIconProps = {
  outlineColor: string;
  width?: number;
  height?: number;
};

function BurgerMenuIcon(props: BurgerMenuIconProps) {
  const { outlineColor = '#FFFFFF', width = 50, height = 50 } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 12">
      <g>
        <rect
          fill={outlineColor}
          height="1"
          width="11"
          x="0.5"
          y="0"
        />
        <rect
          fill={outlineColor}
          height="1"
          width="11"
          x="0.5"
          y="4.2"
        />
        <rect
          fill={outlineColor}
          height="1"
          width="11"
          x="0.5"
          y="8.5"
        />
      </g>
    </svg>
  );
}

export { BurgerMenuIcon };
