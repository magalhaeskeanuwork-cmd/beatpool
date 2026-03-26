import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const geist = Geist({ subsets: ['latin'] })

export const metadata = {
  title: 'BeatPool — Custom beats, made for your vision',
  description: 'Post a request. Producers drop on the pool. You pick the one that hits.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-black text-white overflow-x-hidden`}>
        <Navbar />
        <main className="pt-16 md:pt-20 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}