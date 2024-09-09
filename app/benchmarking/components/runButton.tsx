'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/app/components/button';
import { ButtonType } from '@/app/components/button';
import { colors } from '@/app/customColors';
import {
  resetBenchmarkCookbooks,
  resetBenchmarkModels,
  useAppDispatch,
} from '@/lib/redux';

function RunButton({ disabled }: { disabled: boolean }) {
  const dispatch = useAppDispatch();
  const { pending } = useFormStatus();
  if (pending) {
    dispatch(resetBenchmarkCookbooks());
    dispatch(resetBenchmarkModels());
  }
  return (
    <Button
      mode={ButtonType.PRIMARY}
      disabled={disabled || pending}
      size="lg"
      width={!pending ? 160 : 120}
      type="submit"
      text={pending ? 'Please wait...' : 'Run'}
      hoverBtnColor={colors.moongray[950]}
      pressedBtnColor={colors.moongray[900]}
    />
  );
}

export { RunButton };
