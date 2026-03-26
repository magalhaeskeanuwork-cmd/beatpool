'use client'

import { Suspense, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import WavePlayer from '@/components/WavePlayer'

function DealContent() {
  const searchParams = useSearchParams()
  const requestId = searchParams.get('requestId')

  const [deal, setDeal] = useState(null)
  const [request, setRequest] = useState(null)
  const [snippet, setSnippet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!requestId) {
      setLoading(false)
      return
    }

    fetchDeal()
  }, [requestId])

  async function fetchDeal() {
    setLoading(true)
    setError(null)

    const { data: dealData, error: dealError } = await supabase
      .from('deals')
      .select('*, profiles!deals_producer_id_fkey(username, stripe_account_id, stripe_onboarded)')
      .eq('request_id', requestId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (dealError) {
      setError(dealError.message)
      setLoading(false)
      return
    }

    const { data: requestData, error: requestError } = await supabase
      .from('requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (requestError) {
      setError(requestError.message)
      setLoading(false)
      return
    }

    let snippetData = null

    if (dealData?.snippet_id) {
      const { data, error: snippetError } = await supabase
        .from('snippets')
        .select('*')
        .eq('id', dealData.snippet_id)
        .single()

      if (snippetError) {
        setError(snippetError.message)
        setLoading(false)
        return
      }

      snippetData = data
    }

    setDeal(dealData)
    setRequest(requestData)
    setSnippet(snippetData)
    setLoading(false)
  }

  async function handlePay() {
    if (!deal || !request) return

    setPaying(true)
    setError(null)

    const res = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dealId: deal.id,
        amount: deal.agreed_price,
        requestTitle: request.title,
        producerUsername: deal.profiles?.username ?? 'Producer',
        stripeAccountId: deal.profiles?.stripe_account_id ?? null,
      }),
    })

    const { url, error } = await res.json()

    if (error) {
      setError(error)
      setPaying(false)
      return
    }

    window.location.href = url
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">
          Loading deal...
        </p>
      </main>
    )
  }

  if (!requestId) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">
          Missing requestId.
        </p>
      </main>
    )
  }

  if (!deal) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">
          Deal not found.
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />

      <div className="max-w-2xl mx-auto px-6 md:px-12 py-16 relative z-10">
        <div className="border-b border-white/10 pb-12 mb-16">
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-4">
            / Deal summary
          </p>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            {request?.title}
          </h1>
        </div>

        <div className="border border-white/10 mb-8">
          {[
            { label: 'Producer', value: deal.profiles?.username, color: '' },
            { label: 'Agreed price', value: `$${deal.agreed_price}`, color: 'text-green-400' },
            { label: 'Platform fee (20%)', value: `-$${Math.round(deal.agreed_price * 0.2)}`, color: 'text-white/40' },
            { label: 'Producer receives', value: `$${Math.round(deal.agreed_price * 0.8)}`, color: '' },
          ].map((row, i) => (
            <div
              key={row.label}
              className={`flex items-center justify-between px-8 py-5 ${i !== 3 ? 'border-b border-white/10' : ''}`}
            >
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">
                {row.label}
              </span>
              <span className={`font-black uppercase tracking-tight ${row.color}`}>
                {row.value}
              </span>
            </div>
          ))}

          <div className="flex items-center justify-between px-8 py-5 border-t border-white/10 bg-white/[0.02]">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">
              Status
            </span>
            <span
              className={`text-[10px] font-mono uppercase tracking-widest border px-3 py-1 ${
                deal.status === 'paid'
                  ? 'border-green-500/30 text-green-400'
                  : deal.status === 'completed'
                    ? 'border-white/10 text-white/30'
                    : 'border-yellow-500/30 text-yellow-400'
              }`}
            >
              {deal.status}
            </span>
          </div>

          {request?.license_type && (
            <div className="flex items-center justify-between px-8 py-5 border-t border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">
                License type
              </span>
              <span
                className={`text-[10px] font-mono uppercase tracking-widest border px-3 py-1 ${
                  request.license_type === 'exclusive'
                    ? 'border-red-500/30 text-red-400'
                    : 'border-blue-500/30 text-blue-400'
                }`}
              >
                {request.license_type}
              </span>
            </div>
          )}
        </div>

        {snippet?.audio_url && (
          <div className="mb-8">
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-4">
              / Winning snippet
            </p>
            <WavePlayer
              url={snippet.audio_url}
              username={deal.profiles?.username ?? 'Producer'}
              date={new Date(snippet.created_at).toLocaleDateString()}
            />
          </div>
        )}

        {deal.status === 'paid' && deal.full_beat_url && (
          <div className="border border-green-500/20 bg-green-500/5 p-8 mb-8">
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-green-400 mb-4">
              / Full beat ready
            </p>
            <a
              href={deal.full_beat_url}
              download
              className="inline-block bg-white text-black hover:bg-red-600 hover:text-white font-black uppercase tracking-widest text-xs px-6 py-3 transition"
            >
              Download beat →
            </a>
          </div>
        )}

        {deal.status === 'paid' && !deal.full_beat_url && (
          <div className="border border-white/10 p-8 mb-8">
            <p className="font-black uppercase tracking-tight mb-1">Payment confirmed</p>
            <p className="font-mono text-white/30 text-xs">
              Waiting for the producer to upload the full beat.
            </p>
          </div>
        )}

        {!deal.profiles?.stripe_onboarded && deal.status === 'pending' && (
          <div className="border border-yellow-500/20 bg-yellow-500/5 p-6 mb-8">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-yellow-400">
              The producer has not connected a payout account yet. Payment will still work but they
              won&apos;t receive funds until they connect.
            </p>
          </div>
        )}

        {error && (
          <p className="text-[10px] font-mono uppercase tracking-widest text-red-400 mb-6">
            {error}
          </p>
        )}

        {deal.status === 'pending' && (
          <button
            onClick={handlePay}
            disabled={paying}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-black uppercase tracking-widest py-4 text-sm transition mb-6"
          >
            {paying ? 'Redirecting to Stripe...' : `Pay $${deal.agreed_price} →`}
          </button>
        )}

        <Link
          href="/browse"
          className="block text-center text-[10px] font-mono uppercase tracking-[0.3em] text-white/20 hover:text-white transition"
        >
          ← Back to pool
        </Link>
      </div>
    </main>
  )
}

export default function DealPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black text-white flex items-center justify-center">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">
            Loading deal...
          </p>
        </main>
      }
    >
      <DealContent />
    </Suspense>
  )
}