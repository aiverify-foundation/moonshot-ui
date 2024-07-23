import { render } from '@testing-library/react';
import SimpleStepsIndicator from '..';

test('renders simple steps indicator', () => {
  const steps = ['step0', 'step1', 'step2'];
  const { container } = render(
    <SimpleStepsIndicator
      steps={steps}
      currentStepIndex={1}
    />
  );

  const doneStep = container.querySelector('.done');
  expect(doneStep).toHaveTextContent('step0');
  const currentStep = container.querySelector('.active');
  expect(currentStep).toHaveTextContent('step1');
});
