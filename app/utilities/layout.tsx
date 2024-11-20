import Link from 'next/link';
import React from 'react';
import LeftNav from '@/app/components/leftNav';
import { MicroLayout } from '@/app/components/microLayout';
import Notifications from '@/app/components/notifications';
import { Logo } from '@/app/logo';

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
          <Logo />
        </Link>
        <Notifications />
      </header>
      <main className="h-full">
        <div className="flex flex-col h-full">{children}</div>
      </main>
    </MicroLayout>
  );
}
