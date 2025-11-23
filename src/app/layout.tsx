import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Apex & Base Constructions Company L.L.C',
  description: 'Building Beyond Construction - Professional construction services with integrity, quality, and innovation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="font-display">{children}</body>
    </html>
  )
}
