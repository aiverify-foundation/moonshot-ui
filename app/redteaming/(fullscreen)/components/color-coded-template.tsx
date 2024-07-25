type ColorCodedTemplateStringProps = {
  placeHolderColor?: string;
  fontColor?: string;
  template: string
}

function ColorCodedTemplateString(props: ColorCodedTemplateStringProps) {
  const { placeHolderColor = '#be123c', fontColor = '#3b82f6', template } = props;
  const parts = template.split(/(\{\{ prompt \}\})/);

  return (
    <div>
      {parts.map((part, index) =>
        part === '{{ prompt }}' ? (
          <span
            key={index}
            style={{ color: placeHolderColor }}>
            {part}
          </span>
        ) : (
          <span
            key={index}
            style={{ color: fontColor }}>
            {part}
          </span>
        )
      )}
    </div>
  );
}

export { ColorCodedTemplateString };
