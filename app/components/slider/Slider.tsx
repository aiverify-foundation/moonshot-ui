import clsx from 'clsx';
import React, { useState, useCallback } from 'react';
import { SlideLabel } from './SlideLabel';
import { SliderProvider } from './SliderContext';
import { SliderHandle } from './SliderHandle';
import { SliderProgressTrack } from './SliderProgressTrack';
import { SliderTrack } from './SliderTrack';
import { SliderValue } from './SliderValue';
import styles from './styles/Slider.module.css';

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  initialValue?: number;
  trackColor?: string;
  handleColor?: string;
  progressColor?: string;
  trackWidth?: React.CSSProperties['width'];
  trackHeight?: React.CSSProperties['height'];
  children?: React.ReactNode;
  className?: string;
  trackClassName?: string;
  progressTrackClassName?: string;
  handleClassName?: string;
  valueSuffix?: string;
  onChange?: (value: number) => void;
}

export function Slider(props: SliderProps) {
  const {
    min = 0,
    max = 100,
    step = 1,
    initialValue = min,
    trackColor,
    handleColor,
    progressColor,
    trackWidth = '100%',
    trackHeight = 4,
    children,
    className,
    trackClassName,
    progressTrackClassName = 'bg-primary-100',
    handleClassName,
    valueSuffix,
    onChange,
  } = props;
  const [value, setValue] = useState(initialValue);
  const handleChange = useCallback(
    (newValue: number) => {
      setValue(newValue);
      onChange?.(newValue);
    },
    [min, onChange]
  );

  React.useEffect(() => {
    if (initialValue !== undefined && initialValue !== min) {
      setValue(initialValue);
    }
  }, [initialValue, min]);

  const classNames = clsx(styles.slider, className);

  return (
    <SliderProvider
      value={{
        min,
        max,
        step,
        value,
        trackColor,
        handleColor,
        progressColor,
        trackWidth,
        trackHeight,
        trackClassName,
        progressTrackClassName,
        handleClassName,
        valueSuffix,
        onChange: handleChange,
      }}>
      <div
        className={classNames}
        style={{ width: trackWidth }}>
        {children}
      </div>
    </SliderProvider>
  );
}

Slider.Track = SliderTrack;
Slider.Handle = SliderHandle;
Slider.Value = SliderValue;
Slider.Label = SlideLabel;
Slider.ProgressTrack = SliderProgressTrack;
