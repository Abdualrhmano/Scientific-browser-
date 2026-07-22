import type { Metadata } from 'next';
import { Inter, Crimson_Pro, JetBrains_Mono } from 'next/font/google';
import './globals.css';

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

export const metadata: Metadata = {
  title: 'Scientific Browser – المتصفح العلمي',
  description: 'متصفح متخصص للباحثين للبحث عن الأوراق العلمية وقراءتها وتنظيمها.',
  keywords: ['بحث علمي', 'أوراق بحثية', 'AI', 'فيديو'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className="dark"
      style={{ colorScheme: 'dark' }}
      suppressHydrationWarning
    >
      <body
        className={`${inter.variable} ${crimsonPro.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
