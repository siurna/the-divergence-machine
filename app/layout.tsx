import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Make Your Own Bubble',
  description: 'Interactive filter bubble demonstration',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/sha8jpb.css" />
      </head>
      <body className="font-body bg-bg-dark text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
