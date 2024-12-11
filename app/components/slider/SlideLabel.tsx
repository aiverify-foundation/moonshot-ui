import clsx from 'clsx';
import styles from './styles/Slider.module.css';

export function SlideLabel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <label className={clsx(styles.label, className)}>{children}</label>;
}
