import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/lib/provider';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Moonshot',
  description: 'LLM Red Teaming and Benchmarking',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html
        lang="en"
        className="overflow-hidden">
        <body
          className={`${inter.className} w-screen h-screen bg-gradient-to-br from-moonwine-950 to-moonwine-700`}>
          {children}
        </body>
      </html>
    </Providers>
  );
}
