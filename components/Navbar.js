'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    setMenuOpen(false)
  }

  const links = [
    { href: '/browse', label: 'Pool' },
    { href: '/about', label: 'How it works' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80">
        <div className="mx-auto flex h-16 md:h-20 w-full max-w-[1200px] items-center justify-between px-10 md:px-16 lg:px-20">
          <div className="hidden md:flex items-center gap-8 h-full">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`flex h-full items-center border-b-2 text-xs font-mono uppercase tracking-[0.3em] transition ${
                  pathname === l.href
                    ? 'border-red-500 text-red-500'
                    : 'border-transparent text-white/40 hover:text-white'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <Link href="/" className="text-xl md:text-2xl font-black uppercase tracking-tighter">
            BEAT<span className="text-red-600">POOL</span>
          </Link>

          <div className="hidden md:flex items-center gap-4 h-full">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className={`flex h-full items-center border-b-2 text-xs font-mono uppercase tracking-[0.3em] transition ${
                    pathname === '/profile'
                      ? 'border-red-500 text-red-500'
                      : 'border-transparent text-white/40 hover:text-white'
                  }`}
                >
                  Profile
                </Link>
                <Link
                  href="/request/new"
                  className="bg-red-600 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white transition hover:bg-red-700"
                >
                  + Post
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`flex h-full items-center border-b-2 text-xs font-mono uppercase tracking-[0.3em] transition ${
                    pathname === '/login'
                      ? 'border-red-500 text-red-500'
                      : 'border-transparent text-white/40 hover:text-white'
                  }`}
                >
                  Sign in
                </Link>
                <Link
                  href="/login"
                  className="bg-red-600 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white transition hover:bg-red-700"
                >
                  Join free
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-3">
            {!user && (
              <>
                <Link
                  href="/login"
                  className="text-xs font-mono uppercase tracking-[0.3em] text-white/40 transition hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  href="/login"
                  className="bg-red-600 px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-red-700"
                >
                  Join
                </Link>
              </>
            )}

            {user && (
              <Link
                href="/profile"
                className="text-xs font-mono uppercase tracking-[0.3em] text-white/40 transition hover:text-white"
              >
                Profile
              </Link>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col justify-center gap-[4px] p-2"
              aria-label="Toggle menu"
            >
              <span className={`block h-px w-5 bg-white transition-all duration-300 ${menuOpen ? 'translate-y-[5px] rotate-45' : ''}`} />
              <span className={`block h-px w-5 bg-white transition-all duration-300 ${menuOpen ? 'scale-x-0 opacity-0' : ''}`} />
              <span className={`block h-px w-5 bg-white transition-all duration-300 ${menuOpen ? '-translate-y-[5px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-black transition-all duration-300 md:hidden ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.04] pointer-events-none" />
        <div className="relative z-10 flex h-full flex-col justify-between px-8 pt-24 pb-12">
          <div className="flex flex-col gap-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`text-5xl font-black uppercase tracking-tighter leading-tight transition ${
                  pathname === l.href ? 'text-red-500' : 'text-white/60 hover:text-white'
                }`}
              >
                {l.label}
              </Link>
            ))}

            {user && (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className={`text-5xl font-black uppercase tracking-tighter leading-tight transition ${
                    pathname === '/profile' ? 'text-red-500' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Profile
                </Link>
                <Link
                  href="/request/new"
                  onClick={() => setMenuOpen(false)}
                  className="text-5xl font-black uppercase tracking-tighter leading-tight text-white/60 transition hover:text-white"
                >
                  + Post
                </Link>
              </>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {user ? (
              <button
                onClick={handleSignOut}
                className="text-left text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 transition hover:text-white"
              >
                Sign out
              </button>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 border border-white/20 px-4 py-3 text-center text-xs font-black uppercase tracking-widest text-white transition hover:border-white/50"
                >
                  Sign in
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 bg-red-600 px-4 py-3 text-center text-xs font-black uppercase tracking-widest text-white transition hover:bg-red-700"
                >
                  Join free
                </Link>
              </div>
            )}

            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">
              © 2026 BEATPOOL
            </p>
          </div>
        </div>
      </div>
    </>
  )
}