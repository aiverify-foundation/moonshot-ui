import clsx from 'clsx';
import { useSliderContext } from './SliderContext';
import styles from './styles/Slider.module.css';

export function SliderProgressTrack() {
  const { min, max, value, progressColor, trackWidth, trackHeight, progressTrackClassName } =
    useSliderContext();
  const percentage = ((value - min) / (max - min)) * 100;
  const classNames = clsx(styles.progressTrack, progressTrackClassName);
  return (
    <div
      className={classNames}
      style={{
        width: `calc(${trackWidth} * ${(100 - percentage) / 100})`,
        backgroundColor: progressColor,
        height: trackHeight,
      }}
    />
  );
}
