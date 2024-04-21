'use client';

import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { MicroLayout } from './components/microLayout';

export default function QuickstartHome() {
  return (
    <MicroLayout>
      <nav>
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
      <header>
        <h1>Moonshot</h1>
        <Icon name={IconName.Bell} />
      </header>
      <main>
        <section className="mb-[5px] border-purple-800 border">
          section 1
        </section>
        <section>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-3 border border-yellow-500 grid grid-cols-3 gap-[0.5%]">
              <div className="border border-green-500 h-[100px]">col 1</div>
              <div className="border border-green-500 h-[100px]">col 2</div>
              <div className="border border-green-500 h-[100px]">col 2</div>
            </div>
          </div>
        </section>
      </main>
    </MicroLayout>
  );
}
