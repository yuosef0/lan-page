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
      <body className="font-display">{children}</body>
    </html>
  )
}
