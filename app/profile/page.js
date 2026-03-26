'use client'

import { Suspense, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ProfileContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const connectStatus = searchParams.get('connect')

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [requests, setRequests] = useState([])
  const [snippets, setSnippets] = useState([])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [switching, setSwitching] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    setUser(user)

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    setProfile(profileData)

    if (profileData?.role === 'artist') {
      const { data: requestsData } = await supabase
        .from('requests')
        .select('*')
        .eq('artist_id', user.id)
        .order('created_at', { ascending: false })

      setRequests(requestsData ?? [])

      const { data: dealsData } = await supabase
        .from('deals')
        .select('*, requests(title), profiles!deals_producer_id_fkey(username)')
        .eq('artist_id', user.id)
        .order('created_at', { ascending: false })

      setDeals(dealsData ?? [])
    }

    if (profileData?.role === 'producer') {
      const { data: snippetsData } = await supabase
        .from('snippets')
        .select('*, requests(title, budget, status)')
        .eq('producer_id', user.id)
        .order('created_at', { ascending: false })

      setSnippets(snippetsData ?? [])

      const { data: dealsData } = await supabase
        .from('deals')
        .select('*, requests(title), profiles!deals_artist_id_fkey(username)')
        .eq('producer_id', user.id)
        .order('created_at', { ascending: false })

      setDeals(dealsData ?? [])
    }

    setLoading(false)
  }

  async function handleConnectStripe() {
    setConnecting(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const res = await fetch('/api/connect-onboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ producerId: user.id, email: user.email }),
    })

    const { url, accountId, error } = await res.json()

    if (error) {
      alert(error)
      setConnecting(false)
      return
    }

    await supabase.from('profiles').update({ stripe_account_id: accountId }).eq('id', user.id)
    window.location.href = url
  }

  async function handleSwitchRole() {
    setSwitching(true)
    const newRole = profile.role === 'artist' ? 'producer' : 'artist'
    await supabase.from('profiles').update({ role: newRole }).eq('id', user.id)
    await fetchProfile()
    setSwitching(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function handleUploadFullBeat(dealId, e) {
    const file = e.target.files[0]
    if (!file) return

    const filename = `fullbeat-${dealId}-${Date.now()}.${file.name.split('.').pop()}`
    const { error: uploadError } = await supabase.storage.from('snippets').upload(filename, file)

    if (uploadError) {
      alert(uploadError.message)
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('snippets').getPublicUrl(filename)

    await supabase
      .from('deals')
      .update({ full_beat_url: publicUrl, status: 'completed' })
      .eq('id', dealId)

    fetchProfile()
  }

  function totalEarnings() {
    return deals
      .filter((d) => d.status === 'paid' || d.status === 'completed')
      .reduce((sum, d) => sum + Math.round(d.agreed_price * 0.8), 0)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 relative z-10">
        {connectStatus === 'success' && (
          <div className="border border-green-500/20 bg-green-500/5 px-6 py-4 mb-12">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-green-400">
              ✓ Stripe account connected — you can now receive payments
            </p>
          </div>
        )}

        <div className="border-b border-white/10 pb-12 mb-16 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-4">/ Profile</p>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-red-600/20 border border-red-500/20 flex items-center justify-center text-2xl font-black text-red-500">
                {profile?.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">{profile?.username}</h1>
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 mt-2 capitalize">
                  {profile?.role}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSwitchRole}
              disabled={switching}
              className="text-[10px] font-mono uppercase tracking-[0.3em] border border-white/10 hover:border-white/30 text-white/40 hover:text-white px-4 py-2 transition disabled:opacity-40"
            >
              {switching ? 'Switching...' : `Switch to ${profile?.role === 'artist' ? 'producer' : 'artist'}`}
            </button>
            <button
              onClick={handleSignOut}
              className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20 hover:text-white transition"
            >
              Sign out
            </button>
          </div>
        </div>

        {profile?.role === 'artist' && (
          <div className="space-y-16">
            <div className="grid grid-cols-3 border border-white/10">
              {[
                { num: requests.filter((r) => r.status === 'open').length, label: 'Open requests' },
                { num: requests.filter((r) => r.status !== 'open').length, label: 'Closed requests' },
                { num: deals.filter((d) => d.status === 'completed').length, label: 'Beats purchased' },
              ].map((s, i) => (
                <div key={s.label} className={`p-8 ${i !== 2 ? 'border-r border-white/10' : ''}`}>
                  <p className="text-5xl font-black text-red-500 font-mono tracking-tighter">{s.num}</p>
                  <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 mt-2">{s.label}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-8">/ Open requests</p>
              {requests.filter((r) => r.status === 'open').length === 0 ? (
                <div className="border border-white/5 p-12 text-center">
                  <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20 mb-4">No open requests</p>
                  <Link
                    href="/request/new"
                    className="inline-block bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-xs px-6 py-3 transition"
                  >
                    Post your first request →
                  </Link>
                </div>
              ) : (
                <div className="border border-white/10 divide-y divide-white/10">
                  {requests
                    .filter((r) => r.status === 'open')
                    .map((req) => (
                      <div key={req.id} className="flex items-center justify-between p-6 hover:bg-white/[0.02] transition">
                        <div>
                          <p className="font-black uppercase tracking-tight">{req.title}</p>
                          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mt-1">
                            {req.genre} · ${req.budget}
                            {req.license_type && ` · ${req.license_type}`}
                          </p>
                        </div>
                        <Link
                          href="/browse"
                          className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 hover:text-white transition"
                        >
                          View →
                        </Link>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-8">/ Past requests</p>
              {requests.filter((r) => r.status !== 'open').length === 0 ? (
                <div className="border border-white/5 p-12 text-center">
                  <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">No past requests yet</p>
                </div>
              ) : (
                <div className="border border-white/10 divide-y divide-white/10">
                  {requests
                    .filter((r) => r.status !== 'open')
                    .map((req) => {
                      const deal = deals.find((d) => d.request_id === req.id)

                      return (
                        <div key={req.id} className="p-6 hover:bg-white/[0.02] transition">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="font-black uppercase tracking-tight">{req.title}</p>
                              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mt-1">
                                {req.genre} · ${req.budget}
                              </p>
                            </div>
                            <span
                              className={`text-[10px] font-mono uppercase tracking-widest border px-3 py-1 ${
                                req.status === 'completed'
                                  ? 'border-white/10 text-white/30'
                                  : 'border-yellow-500/30 text-yellow-400'
                              }`}
                            >
                              {req.status}
                            </span>
                          </div>

                          {deal && (
                            <div className="flex items-center gap-3">
                              {deal.status === 'pending' && (
                                <Link
                                  href={`/deal?requestId=${req.id}`}
                                  className="text-[10px] font-black uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white px-4 py-2 transition"
                                >
                                  Complete payment →
                                </Link>
                              )}

                              {(deal.status === 'paid' || deal.status === 'completed') && deal.full_beat_url && (
                                <a
                                  href={deal.full_beat_url}
                                  download
                                  className="text-[10px] font-black uppercase tracking-widest bg-white text-black hover:bg-red-600 hover:text-white px-4 py-2 transition"
                                >
                                  Download beat
                                </a>
                              )}

                              {(deal.status === 'paid' || deal.status === 'completed') && deal.license_url && (
                                <a
                                  href={deal.license_url}
                                  download
                                  className="text-[10px] font-mono uppercase tracking-widest border border-white/20 hover:border-white/40 text-white/50 hover:text-white px-4 py-2 transition"
                                >
                                  Download license
                                </a>
                              )}

                              {deal.status === 'paid' && !deal.full_beat_url && (
                                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
                                  Waiting for producer to upload full beat
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          </div>
        )}

        {profile?.role === 'producer' && (
          <div className="space-y-16">
            <div className="grid grid-cols-3 border border-white/10">
              {[
                { num: snippets.length, label: 'Snippets submitted', color: 'text-white' },
                {
                  num: deals.filter((d) => d.status === 'paid' || d.status === 'completed').length,
                  label: 'Beats sold',
                  color: 'text-white',
                },
                { num: `$${totalEarnings()}`, label: 'Total earned', color: 'text-green-400' },
              ].map((s, i) => (
                <div key={s.label} className={`p-8 ${i !== 2 ? 'border-r border-white/10' : ''}`}>
                  <p className={`text-5xl font-black font-mono tracking-tighter ${s.color}`}>{s.num}</p>
                  <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 mt-2">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="border border-white/10 p-8 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-3">/ Payout account</p>
                {profile?.stripe_onboarded ? (
                  <p className="font-black uppercase tracking-tight text-green-400">
                    Connected — you receive 80% of each sale
                  </p>
                ) : (
                  <p className="font-black uppercase tracking-tight">Connect your bank account to receive payments</p>
                )}
              </div>

              {!profile?.stripe_onboarded ? (
                <button
                  onClick={handleConnectStripe}
                  disabled={connecting}
                  className="bg-white text-black hover:bg-red-600 hover:text-white font-black uppercase tracking-widest text-xs px-6 py-3 transition disabled:opacity-40"
                >
                  {connecting ? 'Loading...' : 'Connect Stripe →'}
                </button>
              ) : (
                <span className="text-[10px] font-mono uppercase tracking-widest border border-green-500/30 text-green-400 px-4 py-2">
                  ✓ Active
                </span>
              )}
            </div>

            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-8">/ Your submissions</p>
              {snippets.length === 0 ? (
                <div className="border border-white/5 p-12 text-center">
                  <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20 mb-4">No submissions yet</p>
                  <Link
                    href="/browse"
                    className="inline-block bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-xs px-6 py-3 transition"
                  >
                    Browse pool →
                  </Link>
                </div>
              ) : (
                <div className="border border-white/10 divide-y divide-white/10">
                  {snippets.map((snippet) => (
                    <div key={snippet.id} className="flex items-center justify-between p-6 hover:bg-white/[0.02] transition">
                      <div>
                        <p className="font-black uppercase tracking-tight">{snippet.requests?.title}</p>
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mt-1">
                          Budget: ${snippet.requests?.budget}
                          {snippet.counter_offer && ` · Your offer: $${snippet.counter_offer}`}
                          {snippet.is_selected && ' · ✓ Selected'}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-mono uppercase tracking-widest border px-3 py-1 ${
                          snippet.is_selected ? 'border-green-500/30 text-green-400' : 'border-white/10 text-white/30'
                        }`}
                      >
                        {snippet.is_selected ? 'Winner' : snippet.requests?.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-8">/ Deals</p>
              {deals.length === 0 ? (
                <div className="border border-white/5 p-12 text-center">
                  <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">No deals yet</p>
                </div>
              ) : (
                <div className="border border-white/10 divide-y divide-white/10">
                  {deals.map((deal) => (
                    <div key={deal.id} className="p-6 hover:bg-white/[0.02] transition">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-black uppercase tracking-tight">{deal.requests?.title}</p>
                          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mt-1">
                            Artist: {deal.profiles?.username} · You earn: ${Math.round(deal.agreed_price * 0.8)}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-mono uppercase tracking-widest border px-3 py-1 ${
                            deal.status === 'completed'
                              ? 'border-white/10 text-white/30'
                              : deal.status === 'paid'
                                ? 'border-green-500/30 text-green-400'
                                : 'border-yellow-500/30 text-yellow-400'
                          }`}
                        >
                          {deal.status}
                        </span>
                      </div>

                      {deal.status === 'paid' && !deal.full_beat_url && (
                        <div>
                          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40 mb-3">
                            Payment received — upload the full beat now
                          </p>
                          <label className="cursor-pointer inline-block bg-white text-black hover:bg-red-600 hover:text-white font-black uppercase tracking-widest text-xs px-6 py-3 transition">
                            Upload full beat
                            <input
                              type="file"
                              accept="audio/*"
                              className="hidden"
                              onChange={(e) => handleUploadFullBeat(deal.id, e)}
                            />
                          </label>
                        </div>
                      )}

                      {deal.full_beat_url && (
                        <p className="text-[10px] font-mono uppercase tracking-widest text-green-400">
                          ✓ Full beat uploaded
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black text-white flex items-center justify-center">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">Loading profile...</p>
        </main>
      }
    >
      <ProfileContent />
    </Suspense>
  )
}