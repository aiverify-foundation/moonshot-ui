import React from 'react';

export const ImdaStarterKitLink = ({ children = "Starter Kit" }: { children?: React.ReactNode }) => (
  <a
    className="text-blue-300 hover:text-blue-400 underline"
    href="https://aiverify-foundation.github.io/moonshot/detailed_guide/starter_kit_cookbooks/"
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
);