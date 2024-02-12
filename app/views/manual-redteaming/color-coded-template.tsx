function ColorCodedTemplateString({ template }: { template: string }) {
  const parts = template.split(/(\{\{ prompt \}\})/);

  return (
    <div>
      {parts.map((part, index) =>
        part === '{{ prompt }}' ? (
          <span
            key={index}
            style={{ color: '#be123c' }}>
            {part}
          </span>
        ) : (
          <span
            key={index}
            style={{ color: '#3b82f6' }}>
            {part}
          </span>
        )
      )}
    </div>
  );
}

export { ColorCodedTemplateString };
