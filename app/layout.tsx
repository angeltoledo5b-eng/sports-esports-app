import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sports & Esports Network',
  description: 'Red Social y Gestión de Torneos para Deportes y Esports',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>{children}</body>
    </html>
  )
}