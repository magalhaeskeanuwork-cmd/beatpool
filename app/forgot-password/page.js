'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleReset(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setMessage('Password reset email sent. Check your inbox.')
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-xl px-6 py-24 md:px-12">
        <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.35em] text-red-500">
          / Reset password
        </p>

        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6">
          Forgot your password?
        </h1>

        <p className="font-mono text-sm text-white/50 leading-relaxed mb-10 max-w-lg">
          Enter your email and we’ll send you a secure link to reset your password.
        </p>

        <form onSubmit={handleReset} className="space-y-6">
          <div className="border border-white/10">
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent px-4 py-4 font-mono text-sm text-white placeholder-white/20 outline-none"
            />
          </div>

          {message && (
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-green-400">
              {message}
            </p>
          )}

          {error && (
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-black uppercase tracking-widest text-xs px-6 py-4 transition"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      </div>
    </main>
  )
}