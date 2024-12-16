import React from 'react';

export default function RedteamChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center w-[100vw] h-[100vh] min-w-[1000px] min-h-[600px]">
      {children}
    </div>
  );
}
