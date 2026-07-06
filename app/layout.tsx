import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Scholar Browser',
  description: 'Secure research-first browser for academic workflows'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
