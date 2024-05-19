import React from 'react';

export default function RedteamChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center w-[100vw] h-[100vh] min-w-[1440px] min-h-[900px]">
      {children}
    </div>
  );
}
