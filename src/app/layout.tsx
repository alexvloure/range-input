import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Range Input',
  description: 'Created by Alejandro Viño Loureiro',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        style={{
          overflowX: 'hidden',
        }}>
        <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-14">
          {children}
        </main>
      </body>
    </html>
  );
}
