import { useSliderContext } from './SliderContext';
import styles from './styles/Slider.module.css';

export function SliderValue() {
  const { value } = useSliderContext();
  return <div className={styles.value}>{value}</div>;
}
