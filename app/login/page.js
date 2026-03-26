'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const router = useRouter()
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [legalName, setLegalName] = useState('')
  const [role, setRole] = useState('artist')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    setMessage(null)

    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      const userId = data.user?.id

      if (!userId) {
        setError('Could not create account.')
        setLoading(false)
        return
      }

      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        username,
        role,
        legal_name: legalName,
      })

      if (profileError) {
        setError(profileError.message)
        setLoading(false)
        return
      }

      setMessage('Account created! Check your email to confirm, then log in.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      router.push('/browse')
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white flex">
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-red-600 p-16">
        <Link href="/" className="text-2xl font-black tracking-tighter uppercase text-white">
          BEATPOOL
        </Link>

        <div>
          <h2 className="text-6xl font-black uppercase tracking-tighter leading-none text-white mb-6">
            YOUR
            <br />
            VISION.
            <br />
            THEIR
            <br />
            BEATS.
          </h2>

          <p className="text-white/70 text-sm leading-relaxed max-w-xs">
            The platform where artists post requests and producers compete with custom snippets.
          </p>
        </div>

        <p className="text-white/40 text-xs uppercase tracking-widest">© 2026 BeatPool</p>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-16">
        <div className="max-w-sm w-full mx-auto">
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">
            {isSignup ? 'Create account' : 'Welcome back'}
          </h1>

          <p className="text-white/30 text-sm uppercase tracking-widest mb-10">
            {isSignup ? 'Join the pool' : 'Sign in to continue'}
          </p>

          {isSignup && (
            <div className="flex gap-px mb-8">
              {['artist', 'producer'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition ${
                    role === r
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-white/40 hover:bg-white/10'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {isSignup && (
              <>
                <div>
                  <label className="text-xs uppercase tracking-widest text-white/30 block mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="yourname"
                    className="w-full bg-transparent border border-white/10 hover:border-white/20 focus:border-white/40 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-white/30 block mb-2">
                    Legal name
                  </label>
                  <input
                    type="text"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    placeholder="Your full legal name"
                    className="w-full bg-transparent border border-white/10 hover:border-white/20 focus:border-white/40 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-xs uppercase tracking-widest text-white/30 block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent border border-white/10 hover:border-white/20 focus:border-white/40 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-white/30 block mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent border border-white/10 hover:border-white/20 focus:border-white/40 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition"
              />

              {!isSignup && (
                <div className="mt-3 text-right">
                  <Link
                    href="/forgot-password"
                    className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 hover:text-white transition"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-xs uppercase tracking-widest mt-4">{error}</p>
          )}

          {message && (
            <p className="text-green-400 text-xs uppercase tracking-widest mt-4">{message}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-black uppercase tracking-widest py-4 text-sm transition mt-8"
          >
            {loading ? 'Please wait...' : isSignup ? 'Create account →' : 'Sign in →'}
          </button>

          <p className="text-center text-white/30 text-xs uppercase tracking-widest mt-8">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => {
                setIsSignup(!isSignup)
                setError(null)
                setMessage(null)
              }}
              className="text-white hover:text-red-400 transition underline"
            >
              {isSignup ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </main>
  )
}