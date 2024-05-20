import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import LeftNav from '@/app/components/leftNav';
import { MicroLayout } from '@/app/views/quickstart-home/components/microLayout';
import { colors } from '@/app/views/shared-components/customColors';

export default function BenchmarkingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MicroLayout>
      <nav className="pt-[5rem]">
        <LeftNav activeItem="benchmarking" />
      </nav>
      <header className="flex justify-between items-center px-4 mb-5">
        <Link href="/">
          <Image
            src="/aivmoonshot-logo.svg"
            height={80}
            width={250}
            alt="AIVerify Moonshot Logo"
          />
        </Link>
        {/* <Icon
          color={colors.moongray[300]}
          name={IconName.Bell}
          size={30}
        /> */}
      </header>
      <main className="h-full">
        <div className="flex flex-col h-full">{children}</div>
      </main>
    </MicroLayout>
  );
}
