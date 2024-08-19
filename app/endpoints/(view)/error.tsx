'use client'; // Error components must be Client Components

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Modal } from '@/app/components/modal';
import { colors } from '@/app/customColors';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Modal
      width={600}
      height={400}
      heading="Error Notification"
      bgColor={colors.moongray['800']}
      textColor="#FFFFFF"
      primaryBtnLabel="Try again"
      enableScreenOverlay
      onCloseIconClick={() => router.push('/')}
      onPrimaryBtnClick={() => reset()}>
      <div
        className="flex items-start gap-2 pt-4 overflow-x-hidden overflow-y-auto"
        style={{ height: '80%' }}>
        <Icon
          name={IconName.Alert}
          size={30}
          color="red"
        />
        <p className="text-[0.9rem]">{error.message}</p>
      </div>
    </Modal>
  );
}
