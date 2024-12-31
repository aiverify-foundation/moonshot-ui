'use client';

import Image from 'next/image';
import { useIsTabletDevice } from './hooks/useIsTabletDevice';

export function Logo() {
  const isTabletDevice = useIsTabletDevice();
  return (
    <Image
      src="/aivmoonshot-logo.svg"
      height={isTabletDevice ? 60 : 80}
      width={isTabletDevice ? 250 : 310}
      priority
      alt="AIVerify Moonshot Logo"
    />
  );
}
