import { useSliderContext } from './SliderContext';
import styles from './styles/Slider.module.css';

export function SliderTrack() {
  const { trackColor, trackWidth, trackHeight } = useSliderContext();
  return (
    <div
      className={styles.track}
      style={{ backgroundColor: trackColor, width: trackWidth, height: trackHeight }}
    />
  );
}
