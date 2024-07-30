'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/app/components/button';
import { ButtonType } from '@/app/components/button';
import { colors } from '@/app/views/shared-components/customColors';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      mode={ButtonType.PRIMARY}
      disabled={pending}
      size="lg"
      width={120}
      type="submit"
      text={pending ? 'Saving...' : 'Save'}
      hoverBtnColor={colors.moongray[1000]}
      pressedBtnColor={colors.moongray[900]}
    />
  );
}

export { SubmitButton };
