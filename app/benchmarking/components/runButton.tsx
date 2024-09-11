'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/app/components/button';
import { ButtonType } from '@/app/components/button';
import { colors } from '@/app/customColors';

function RunButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      mode={ButtonType.PRIMARY}
      disabled={disabled || pending}
      size="lg"
      width={pending ? 160 : 120}
      type="submit"
      text={pending ? 'Please wait...' : 'Run'}
      hoverBtnColor={colors.moongray[950]}
      pressedBtnColor={colors.moongray[900]}
    />
  );
}

export { RunButton };
