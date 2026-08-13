import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

/* ASSUMED_FONT: Typeform uses Segoe UI (system) as primary; Inter is the closest
   Google Fonts match. If custom .woff2 files are provided, swap here. */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Typeform — Create beautiful forms',
  description:
    'Build engaging forms, surveys, and quizzes with a clean drag-and-drop builder.',
  icons: { icon: '/icon.svg' },
};

import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="h-full antialiased">
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
