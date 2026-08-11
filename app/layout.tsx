import type { Metadata } from 'next';
import './globals.css';
import Navbar from './Navbar';

export const metadata: Metadata = {
  title: 'SportsHub - Red Social y Gestión de Torneos',
  description: 'Plataforma de competencias, torneos y comunidad para deportes y eSports.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-950 text-gray-100 min-h-screen antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}