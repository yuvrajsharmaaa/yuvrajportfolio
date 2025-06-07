'use client'

import { useState } from 'react'
import Head from 'next/head'

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
      <body className="font-sans">
        <nav className="flex justify-between items-center px-4 py-2 bg-black text-white">
          <div className="text-xl">TerminalCraft</div>
          <button className="md:hidden" onClick={toggleMenu}>☰</button>
          <ul className={`flex-col md:flex-row md:flex space-y-2 md:space-y-0 md:space-x-4 ${menuOpen ? 'flex' : 'hidden'} md:flex`}>
            <li><a href="#">Home</a></li>
            <li><a href="#">Game</a></li>
            <li><a href="#">About</a></li>
          </ul>
        </nav>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {children}
        </div>
      </body>
    </html>
  )
} 