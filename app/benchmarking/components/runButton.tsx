'use client';

import { useFormStatus } from 'react-dom';
import { IconName } from '@/app/components/IconSVG';
import { Button } from '@/app/components/button';
import { ButtonType } from '@/app/components/button';
import { colors } from '@/app/customColors';

function RunButton({
  disabled,
  className,
}: {
  disabled: boolean;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <div className={className}>
      <Button
        type="submit"
        disabled={disabled || pending}
        mode={ButtonType.TEXT}
        text={pending ? 'Please wait...' : 'RUN'}
        textSize="1.3rem"
        textColor={colors.moonpurplelight}
        rightIconName={!pending ? IconName.ThinArrowRight : undefined}
        iconSize={24}
        iconColor={colors.moonpurplelight}
      />
    </div>
  );
}

export { RunButton };
