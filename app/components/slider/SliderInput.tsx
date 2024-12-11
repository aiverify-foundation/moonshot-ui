import { useSliderContext } from './SliderContext';

type SliderInputProps = {
  name: string;
  style?: React.CSSProperties;
  className?: string;
};

export function SliderInput({ name, style, className }: SliderInputProps) {
  const { value, setValue, min, max, onChange } = useSliderContext();
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(Number(e.target.value));
    if (onChange) {
      onChange(Number(e.target.value));
    }
  }
  return (
    <input
      type="number"
      min={min}
      max={max}
      value={value}
      name={name}
      style={style}
      className={className}
      onChange={handleChange}
    />
  );
}
