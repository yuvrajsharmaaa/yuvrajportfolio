'use client'

import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

interface ClientLayoutProps {
  children: React.ReactNode
  inter: string
  cinzel: string
}

export default function ClientLayout({ children, inter, cinzel }: ClientLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <html lang="en" className={`${inter} ${cinzel}`}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body className="font-sans bg-black text-white">
        <main className="max-w-4xl mx-auto px-4 pt-24 pb-12">
          {children}
        </main>
      </body>
    </html>
  )
} 