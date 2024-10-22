import { useRef, useEffect } from 'react';
import { useSliderContext } from './SliderContext';
import styles from './styles/Slider.module.css';

export function SliderHandle({ children }: { children?: React.ReactNode }) {
  const { min, max, step, value, onChange, handleColor } = useSliderContext();
  const handleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;

    const onMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      const startX = event.clientX;
      const startValue = value;

      const onMouseMove = (moveEvent: MouseEvent) => {
        if (!handle.parentElement) return;
        const dx = moveEvent.clientX - startX;
        const range = max - min;
        const newValue =
          startValue + (dx / handle.parentElement.clientWidth) * range;
        const steppedValue = Math.round((newValue - min) / step) * step + min;
        onChange(Math.min(max, Math.max(min, steppedValue)));
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    handle.addEventListener('mousedown', onMouseDown);
    return () => handle.removeEventListener('mousedown', onMouseDown);
  }, [min, max, step, value, onChange]);

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div
      ref={handleRef}
      className={styles.handle}
      style={
        {
          left: `${percentage}%`,
          backgroundColor: handleColor,
          '--color-primary-200': handleColor ? `${handleColor}33` : undefined, // Add 20% opacity to the handle color for the hover effect
        } as React.CSSProperties
      }>
      {children}
    </div>
  );
}
