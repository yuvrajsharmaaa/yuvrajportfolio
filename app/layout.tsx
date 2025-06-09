import type { Metadata } from 'next'
import { Inter, Cinzel } from 'next/font/google'
import './globals.css'
import ClientLayout from './components/ClientLayout'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' })

export const metadata: Metadata = {
  title: 'Yuvraj | XR & Game Developer',
  description: 'XR & Game Developer | Architecture-Tech Enthusiast | Web3 Explorer',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ClientLayout inter={inter.variable} cinzel={cinzel.variable}>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}