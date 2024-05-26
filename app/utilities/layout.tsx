import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import LeftNav from '@/app/components/leftNav';
import Notifications from '@/app/views/notifications/notifications';
import { MicroLayout } from '@/app/views/quickstart-home/components/microLayout';

export default function BenchmarkingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MicroLayout>
      <nav className="pt-[5rem]">
        <LeftNav activeItem="utils" />
      </nav>
      <header className="flex justify-between items-center px-4 mb-5">
        <Link href="/">
          <Image
            src="/aivmoonshot-logo.svg"
            height={80}
            width={310}
            alt="AIVerify Moonshot Logo"
          />
        </Link>
        <Notifications />
      </header>
      <main className="h-full">
        <div className="flex flex-col h-full">{children}</div>
      </main>
    </MicroLayout>
  );
}
