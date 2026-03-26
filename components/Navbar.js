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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10">
<div className="max-w-7xl mx-auto px-6 md:px-12 h-18 flex items-center justify-between">
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 h-full">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-xs font-mono uppercase tracking-[0.3em] transition flex items-center h-full border-b-2 ${
                  pathname === l.href
                    ? 'text-red-500 border-red-500'
                    : 'text-white/40 hover:text-white border-transparent'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Logo */}
          <Link 
            href="/" 
            className="text-xl font-black tracking-tighter uppercase"
          >
            BEAT<span className="text-red-600">POOL</span>
          </Link>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4 h-full">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className={`text-xs font-mono uppercase tracking-[0.3em] transition flex items-center h-full border-b-2 ${
                    pathname === '/profile'
                      ? 'text-red-500 border-red-500'
                      : 'text-white/40 hover:text-white border-transparent'
                  }`}
                >
                  Profile
                </Link>
                <Link
                  href="/request/new"
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 transition"
                >
                  + Post
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`text-xs font-mono uppercase tracking-[0.3em] transition flex items-center h-full border-b-2 ${
                    pathname === '/login'
                      ? 'text-red-500 border-red-500'
                      : 'text-white/40 hover:text-white border-transparent'
                  }`}
                >
                  Sign in
                </Link>
                <Link
                  href="/login"
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 transition"
                >
                  Join free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Side */}
          <div className="md:hidden flex items-center gap-3">
            {!user && (
              <>
                <Link
                  href="/login"
                  className="text-xs font-mono uppercase tracking-[0.3em] text-white/40 hover:text-white transition"
                >
                  Sign in
                </Link>
                <Link
                  href="/login"
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest px-4 py-2 transition"
                >
                  Join
                </Link>
              </>
            )}

            {user && (
              <Link
                href="/profile"
                className="text-xs font-mono uppercase tracking-[0.3em] text-white/40 hover:text-white transition"
              >
                Profile
              </Link>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col justify-center gap-[4px] p-2"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-px bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
              <span className={`block w-5 h-px bg-white transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block w-5 h-px bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Fullscreen Menu */}
      <div className={`fixed inset-0 z-40 bg-black transition-all duration-300 md:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.04] pointer-events-none" />
        <div className="flex flex-col justify-between h-full px-8 pt-24 pb-12 relative z-10">
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
                  className="text-5xl font-black uppercase tracking-tighter leading-tight text-white/60 hover:text-white transition"
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
                className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 hover:text-white transition text-left"
              >
                Sign out
              </button>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 border border-white/20 text-white font-black uppercase tracking-widest text-xs px-4 py-3 text-center hover:border-white/50 transition"
                >
                  Sign in
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-xs px-4 py-3 text-center transition"
                >
                  Join free
                </Link>
              </div>
            )}
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">© 2026 BEATPOOL</p>
          </div>
        </div>
      </div>
    </>
  )
}