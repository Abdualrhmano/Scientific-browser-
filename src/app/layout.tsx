import type { Metadata } from 'next';
import { Inter, Crimson_Pro, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// -------------------------------------------
// إعداد الخطوط
// -------------------------------------------
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

// -------------------------------------------
// Metadata للتطبيق
// -------------------------------------------
export const metadata: Metadata = {
  title: 'Scientific Browser',
  description:
    'A specialized browser for researchers to search, read, and organize academic papers with AI assistance and video support.',
  keywords: [
    'scientific',
    'research',
    'papers',
    'academic',
    'AI',
    'video',
    'search engine',
  ],
  authors: [{ name: 'Scientific Browser Team' }],
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
};

// -------------------------------------------
// التخطيط الجذري
// -------------------------------------------
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      className="dark"
      style={{ colorScheme: 'dark' }}
    >
      <body
        className={`${inter.variable} ${crimsonPro.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
    }
