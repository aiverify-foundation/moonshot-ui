'use client';

import { useRouter } from 'next/navigation';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Modal } from '@/app/components/modal';
import { colors } from '@/app/customColors';

export default function CustomErrorModal({ errorMsg }: { errorMsg: string }) {
  const router = useRouter();

  return (
    <Modal
      width={600}
      height={400}
      heading="Error Notification"
      bgColor={colors.moongray['800']}
      textColor="#FFFFFF"
      enableScreenOverlay
      onCloseIconClick={() => router.push('/')}>
      <div
        className="flex items-start gap-2 pt-4 overflow-x-hidden overflow-y-auto"
        style={{ height: '80%' }}>
        <Icon
          name={IconName.Alert}
          size={30}
          color="red"
        />
        <p className="text-[0.9rem]">{errorMsg}</p>
      </div>
    </Modal>
  );
}
