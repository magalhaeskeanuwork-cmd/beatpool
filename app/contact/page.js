'use client'

import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'hello@beatpool.com',
        subject: `Contact: ${form.subject} — from ${form.name}`,
        html: `
          <h2>New contact form submission</h2>
          <p><strong>Name:</strong> ${form.name}</p>
          <p><strong>Email:</strong> ${form.email}</p>
          <p><strong>Subject:</strong> ${form.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${form.message}</p>
        `,
      }),
    })
    const { error } = await res.json()
    if (error) { setError('Failed to send. Please try again.'); setLoading(false); return }
    setSent(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 relative z-10">

        {/* Header */}
        <div className="border-b border-white/10 pb-12 mb-16">
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-4">/ Contact</p>
          <h1 className="text-[12vw] md:text-[8vw] font-black uppercase tracking-tighter leading-none">
            GET IN<br /><span className="text-red-600">TOUCH</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* Left — info */}
          <div>
            <p className="font-mono text-white/40 text-sm leading-relaxed mb-16">
              Have a question, a bug report, or just want to say hello? We read every message.
            </p>

            <div className="space-y-px bg-white/5">
              {[
                { label: 'General', email: 'hello@beatpool.com' },
                { label: 'Support', email: 'support@beatpool.com' },
                { label: 'Legal', email: 'legal@beatpool.com' },
              ].map(c => (
                <div key={c.label} className="bg-black p-6 hover:bg-white/[0.02] transition">
                  <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-2">{c.label}</p>
                  <p className="font-black uppercase tracking-tight">{c.email}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div>
            {sent ? (
              <div className="border border-green-500/20 bg-green-500/5 p-16 h-full flex flex-col justify-center">
                <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-green-400 mb-4">/ Message sent</p>
                <h2 className="text-5xl font-black uppercase tracking-tighter text-green-400 mb-4">
                  GOT IT.
                </h2>
                <p className="font-mono text-white/40 text-sm">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 block mb-2">Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => update('name', e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-transparent border border-white/10 hover:border-white/20 focus:border-white/40 px-4 py-4 font-mono text-sm text-white placeholder-white/20 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 block mb-2">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => update('email', e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-transparent border border-white/10 hover:border-white/20 focus:border-white/40 px-4 py-4 font-mono text-sm text-white placeholder-white/20 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 block mb-2">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={e => update('subject', e.target.value)}
                    placeholder="What's this about?"
                    className="w-full bg-transparent border border-white/10 hover:border-white/20 focus:border-white/40 px-4 py-4 font-mono text-sm text-white placeholder-white/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 block mb-2">Message</label>
                  <textarea
                    value={form.message}
                    onChange={e => update('message', e.target.value)}
                    placeholder="Tell us everything..."
                    rows={8}
                    className="w-full bg-transparent border border-white/10 hover:border-white/20 focus:border-white/40 px-4 py-4 font-mono text-sm text-white placeholder-white/20 outline-none transition resize-none"
                  />
                </div>

                {error && <p className="text-[10px] font-mono uppercase tracking-widest text-red-400">{error}</p>}

                <button
                  onClick={handleSubmit}
                  disabled={loading || !form.name || !form.email || !form.message}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-black uppercase tracking-widest py-4 text-sm transition"
                >
                  {loading ? 'Sending...' : 'Send message →'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 md:px-12 py-10 border-t border-white/10 mt-24">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <span className="text-2xl font-black tracking-tighter uppercase">
            BEAT<span className="text-red-600">POOL</span>
          </span>
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">© 2026 BEATPOOL</p>
        </div>
      </footer>
    </main>
  )
}