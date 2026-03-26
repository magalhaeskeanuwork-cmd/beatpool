'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function DealSuccess() {
  const searchParams = useSearchParams()
  const dealId = searchParams.get('dealId')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (dealId) handleSuccess()
  }, [dealId])

  async function handleSuccess() {
    const { data: deal } = await supabase
      .from('deals')
      .select('*, artist:profiles!deals_artist_id_fkey(username, legal_name), producer:profiles!deals_producer_id_fkey(username, legal_name), requests(title, license_type)')
      .eq('id', dealId)
      .single()

    if (!deal) return

    await supabase.from('deals').update({ status: 'paid', license_type: deal.requests?.license_type ?? 'lease' }).eq('id', dealId)

    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

    const licenseRes = await fetch('/api/generate-license', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dealId,
        artistUsername: deal.artist?.username ?? 'Artist',
        artistLegalName: deal.artist?.legal_name ?? deal.artist?.username ?? 'Artist',
        producerUsername: deal.producer?.username ?? 'Producer',
        producerLegalName: deal.producer?.legal_name ?? deal.producer?.username ?? 'Producer',
        trackTitle: deal.requests?.title ?? 'Untitled',
        agreedPrice: deal.agreed_price,
        date,
        licenseType: deal.requests?.license_type ?? 'lease',
      }),
    })

    const { licenseText } = await licenseRes.json()
    const blob = new Blob([licenseText], { type: 'text/plain' })
    const licenseFilename = `license-${dealId}.txt`
    await supabase.storage.from('snippets').upload(licenseFilename, blob, { upsert: true })
    const { data: { publicUrl } } = supabase.storage.from('snippets').getPublicUrl(licenseFilename)
    await supabase.from('deals').update({ license_url: publicUrl }).eq('id', dealId)

    const { data: authData } = await supabase.auth.getUser()
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: authData.user.email,
        subject: `Payment confirmed — ${deal.requests?.title}`,
        html: `
          <h2>Your payment was confirmed!</h2>
          <p>Producer: <strong>${deal.producer?.username}</strong></p>
          <p>Track: <strong>${deal.requests?.title}</strong></p>
          <p>License: <strong>${deal.requests?.license_type === 'exclusive' ? 'Exclusive Rights' : 'Non-Exclusive Lease'}</strong></p>
          <p>Amount: <strong>$${deal.agreed_price}</strong></p>
          <p><a href="${publicUrl}">Download your license agreement</a></p>
          <br/><p>— BeatPool</p>
        `,
      }),
    })

    setDone(true)
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full border border-white/10 p-12 text-center">
        <div className="w-12 h-12 border border-green-500/30 bg-green-500/10 flex items-center justify-center mx-auto mb-8">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10L8 14L16 6" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-4">/ Payment confirmed</p>
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-6">
          DEAL<br /><span className="text-green-400">LOCKED IN</span>
        </h1>
        <p className="font-mono text-white/40 text-sm mb-12 leading-relaxed">
          The producer has been notified and will upload the full beat shortly. Check your email for your license agreement.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/profile" className="block w-full bg-white text-black hover:bg-red-600 hover:text-white font-black uppercase tracking-widest text-xs py-4 transition">
            Go to profile →
          </Link>
          <Link href="/browse" className="block text-[10px] font-mono uppercase tracking-[0.3em] text-white/20 hover:text-white transition">
            Back to pool
          </Link>
        </div>
      </div>
    </main>
  )
}