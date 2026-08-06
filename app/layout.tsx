import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sports & Esports Social',
  description: 'Red social PWA para deportes y eSports',
  manifest: '/manifest.json',
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
        <meta name="theme-color" content="#020617" />
      </head>
      <body>{children}</body>
    </html>
  )
}