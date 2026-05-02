import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Serene',
  description: 'Private AI-powered mental wellness journal with a calm experience for daily reflections.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
