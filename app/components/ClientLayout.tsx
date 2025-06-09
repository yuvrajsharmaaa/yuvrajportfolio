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
      <body className="font-sans bg-black text-white min-h-screen">
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-12">
          <div className="w-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
} 