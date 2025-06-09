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
  return (
    <div className={`${inter} ${cinzel} min-h-screen`}>
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-12">
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  )
} 