import React from 'react';

function Badge(props: { label: string; style?: React.CSSProperties }) {
  return (
    <div
      className="inline-block bg-moongray-200 text-fuchsia-400
      text-[0.8rem] w-[25px] h-[18px] rounded-[45%] text-center"
      style={props.style}>
      {props.label}
    </div>
  );
}

function SquareBadge(props: {
  label: string;
  color: string;
  size?: React.CSSProperties['width'];
  textSize?: React.CSSProperties['fontSize'];
  textColor?: React.CSSProperties['color'];
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="text-white flex justify-center items-center text-[1.5rem] w-[50px] h-[50px] rounded-lg text-center align-middle"
      style={{
        backgroundColor: props.color,
        fontSize: props.textSize,
        color: props.textColor,
        width: props.size,
        height: props.size,
        ...props.style,
      }}>
      {props.label}
    </div>
  );
}

function RecipeGradeBadge(props: {
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  textSize: React.CSSProperties['fontSize'];
  textColor: React.CSSProperties['color'];
  size: React.CSSProperties['width'];
}) {
  const gradeColors = {
    A: '#25A167',
    B: '#669C44',
    C: '#7B94BD',
    D: '#A19227',
    E: '#C4805E',
  };
  return (
    <SquareBadge
      label={props.grade}
      color={gradeColors[props.grade]}
      size={props.size}
      textColor={props.textColor}
      textSize={props.textSize}
    />
  );
}

export { Badge, SquareBadge, RecipeGradeBadge };
