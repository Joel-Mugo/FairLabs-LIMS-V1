
import type {Metadata} from 'next';
import { Inter } from 'next/font/google'
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'FairLabs LIMS',
  description: 'Laboratory Information Management System',
};

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} font-body antialiased`}>
          {children}
          <Toaster />
      </body>
    </html>
  );
}
