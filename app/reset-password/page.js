'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleUpdatePassword(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setMessage('Password updated successfully. Redirecting to login...')
    setLoading(false)

    setTimeout(() => {
      router.push('/login')
    }, 1500)
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-xl px-6 py-24 md:px-12">
        <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.35em] text-red-500">
          / New password
        </p>

        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6">
          Set a new password
        </h1>

        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <div className="border border-white/10">
            <input
              type="password"
              required
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent px-4 py-4 font-mono text-sm text-white placeholder-white/20 outline-none"
            />
          </div>

          <div className="border border-white/10">
            <input
              type="password"
              required
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </div>
    </main>
  )
}