import clsx from 'clsx';
import styles from './styles/simpleStepsIndicator.module.css';

type SimpleStepsIndicator = {
  textColor?: string;
  stepColor?: string;
  steps: string[];
  currentStepIndex: number;
  className?: string;
};

function SimpleStepsIndicator({
  steps,
  textColor = '#FFFFFF',
  currentStepIndex,
  stepColor = '#d5aaea',
  className,
}: SimpleStepsIndicator) {
  return (
    <header className={clsx(styles.stepsIndicator, className)}>
      {steps.map((step, index) => (
        <div
          key={step}
          role="step"
          aria-label={`Step - ${step}`}
          className={clsx(
            styles.step,
            currentStepIndex === index ? styles.active : '',
            currentStepIndex > index ? styles.done : ''
          )}
          style={{
            borderColor: stepColor,
          }}>
          <div
            className={styles.colorBar}
            style={{
              backgroundColor: stepColor,
            }}
          />
          <span style={{ color: textColor }}>{step}</span>
        </div>
      ))}
    </header>
  );
}

export default SimpleStepsIndicator;
