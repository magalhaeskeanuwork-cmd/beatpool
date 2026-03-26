'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import WavePlayer from '@/components/WavePlayer'

const GENRES = ['All', 'Trap', 'Drill', 'R&B', 'Afrobeats', 'Boom Bap', 'Pop', 'Lo-fi']
const MOODS = ['Any', 'Dark', 'Melodic', 'Aggressive', 'Chill', 'Emotional', 'Hype']

export default function Browse() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [genre, setGenre] = useState('All')
  const [mood, setMood] = useState('Any')
  const [expanded, setExpanded] = useState({})
  const [snippets, setSnippets] = useState({})
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    getCurrentUser()
    fetchRequests()
  }, [genre, mood])

  async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)
  }

  async function fetchRequests() {
    setLoading(true)
    let query = supabase
      .from('requests')
      .select('*, profiles(username, avatar_url)')
      .order('created_at', { ascending: false })
    if (genre !== 'All') query = query.eq('genre', genre)
    if (mood !== 'Any') query = query.eq('mood', mood)
    const { data, error } = await query
    if (error) console.error(error)
    else setRequests(data)
    setLoading(false)
  }

  async function toggleSnippets(requestId) {
    const isOpen = expanded[requestId]
    setExpanded(prev => ({ ...prev, [requestId]: !isOpen }))
    if (!isOpen && !snippets[requestId]) {
      const { data, error } = await supabase
        .from('snippets')
        .select('*, profiles(username, rating_tier)')
        .eq('request_id', requestId)
        .order('created_at', { ascending: false })
      if (!error) setSnippets(prev => ({ ...prev, [requestId]: data }))
    }
  }

  async function refreshSnippets(requestId) {
    const { data, error } = await supabase
      .from('snippets')
      .select('*, profiles(username, rating_tier)')
      .eq('request_id', requestId)
      .order('created_at', { ascending: false })
    if (!error) setSnippets(prev => ({ ...prev, [requestId]: data }))
  }

  async function handlePickWinner(req, snippet) {
    const confirmed = confirm(`Pick ${snippet.profiles?.username} as the winner? This will close the request.`)
    if (!confirmed) return
    const agreedPrice = snippet.counter_offer ?? req.budget

    const { data, error: dealError } = await supabase.from('deals').insert({
      request_id: req.id,
      snippet_id: snippet.id,
      artist_id: currentUser.id,
      producer_id: snippet.producer_id,
      agreed_price: agreedPrice,
    }).select()

    if (dealError) { alert(dealError.message); return }

    await supabase.from('requests').update({ status: 'closed' }).eq('id', req.id)
    await supabase.from('snippets').update({ is_selected: true }).eq('id', snippet.id)

    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: snippet.producer_email ?? '',
        subject: `You were picked for "${req.title}"!`,
        html: `
          <h2>Congratulations! Your snippet was selected.</h2>
          <p>The artist has chosen your snippet for <strong>${req.title}</strong>.</p>
          <p>Agreed price: <strong>$${agreedPrice}</strong></p>
          <p>You will receive <strong>$${Math.round(agreedPrice * 0.80)}</strong> once the artist completes payment.</p>
          <p>Log in to BeatPool to check your deal status.</p>
          <br/>
          <p>— BeatPool</p>
        `,
      }),
    })

    fetchRequests()
    refreshSnippets(req.id)
  }

  async function handleDeleteSnippet(requestId, snippetId, audioUrl) {
    const confirmed = confirm('Delete your snippet?')
    if (!confirmed) return
    const filename = audioUrl.split('/').pop()
    await supabase.storage.from('snippets').remove([filename])
    await supabase.from('snippets').delete().eq('id', snippetId)
    refreshSnippets(requestId)
  }

  function tierBadge(tier) {
    const styles = {
      legend: 'text-yellow-400 bg-yellow-500/10',
      elite: 'text-purple-400 bg-purple-500/10',
      verified: 'text-blue-400 bg-blue-500/10',
      rising: 'text-green-400 bg-green-500/10',
      newcomer: 'text-white/30 bg-white/5',
    }
    const labels = {
      legend: '★ Legend',
      elite: '◆ Elite',
      verified: '✓ Verified',
      rising: '↑ Rising',
      newcomer: 'Newcomer',
    }
    return (
      <span className={`text-xs px-2 py-0.5 font-bold uppercase tracking-widest ${styles[tier] ?? styles.newcomer}`}>
        {labels[tier] ?? 'Newcomer'}
      </span>
    )
  }

  function statusBadge(status) {
    const styles = {
      open: 'text-green-400 border-green-500/30',
      closed: 'text-yellow-400 border-yellow-500/30',
      completed: 'text-white/30 border-white/10',
    }
    return (
      <span className={`text-xs font-bold uppercase tracking-widest border px-3 py-1 ${styles[status] ?? styles.open}`}>
        {status}
      </span>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-16">

        {/* Header */}
        <div className="flex items-end justify-between mb-16 border-b border-white/10 pb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-red-500 mb-3">Open requests</p>
            <h1 className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none">THE<br />POOL</h1>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black text-white/10">{requests.length}</p>
            <p className="text-xs uppercase tracking-widest text-white/30">requests</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-12 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/30 mb-4">Genre</p>
            <div className="flex flex-wrap gap-2">
              {GENRES.map(g => (
                <button
                  key={g}
                  onClick={() => setGenre(g)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition ${
                    genre === g
                      ? 'bg-red-600 text-white border-red-600'
                      : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/30 mb-4">Mood</p>
            <div className="flex flex-wrap gap-2">
              {MOODS.map(m => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition ${
                    mood === m
                      ? 'bg-red-600 text-white border-red-600'
                      : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Request cards */}
        {loading ? (
          <div className="py-32 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-white/20">Loading pool...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="py-32 text-center">
            <p className="text-4xl font-black uppercase tracking-tighter text-white/10 mb-4">Empty pool</p>
            <p className="text-white/30 text-sm uppercase tracking-widest mb-8">No requests match this filter</p>
            <Link href="/request/new" className="inline-block bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-sm px-6 py-3 transition">
              Be the first to post →
            </Link>
          </div>
        ) : (
          <div className="space-y-px bg-white/5">
            {requests.map(req => {
              const isOwner = currentUser?.id === req.artist_id
              const isClosed = req.status === 'closed' || req.status === 'completed'

              return (
                <div key={req.id} className={`bg-black p-8 transition ${isClosed ? 'opacity-50' : 'hover:bg-white/[0.02]'}`}>

                  {/* Card header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-600/20 flex items-center justify-center text-sm font-black text-red-500">
                        {req.profiles?.username?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <div>
                        <p className="text-sm font-bold uppercase tracking-wide">{req.profiles?.username ?? 'Unknown'}</p>
                        <p className="text-xs text-white/30 uppercase tracking-widest">{new Date(req.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {statusBadge(req.status)}
                      <span className="text-green-400 font-black text-xl">${req.budget}</span>
                    </div>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-3">{req.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-2xl">{req.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {req.genre && <span className="text-xs font-bold uppercase tracking-widest border border-white/10 text-white/40 px-3 py-1">{req.genre}</span>}
                    {req.bpm_min && req.bpm_max && <span className="text-xs font-bold uppercase tracking-widest border border-white/10 text-white/40 px-3 py-1">{req.bpm_min}–{req.bpm_max} BPM</span>}
                    {req.mood && <span className="text-xs font-bold uppercase tracking-widest border border-white/10 text-white/40 px-3 py-1">{req.mood}</span>}
                    {req.key && <span className="text-xs font-bold uppercase tracking-widest border border-white/10 text-white/40 px-3 py-1">{req.key}</span>}
                    {req.license_type && (
                      <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 border ${
                        req.license_type === 'exclusive'
                          ? 'border-red-500/30 text-red-400'
                          : 'border-blue-500/30 text-blue-400'
                      }`}>
                        {req.license_type}
                      </span>
                    )}
                  </div>

                  {/* Snippets */}
                  {expanded[req.id] && (
                    <div className="mb-6 space-y-3 border-t border-white/5 pt-6">
                      {!snippets[req.id] ? (
                        <p className="text-xs uppercase tracking-widest text-white/20">Loading snippets...</p>
                      ) : snippets[req.id].length === 0 ? (
                        <p className="text-xs uppercase tracking-widest text-white/20">No snippets yet — be the first.</p>
                      ) : (
                        snippets[req.id].map(snippet => {
                          const isMySnippet = currentUser?.id === snippet.producer_id
                          const isSelected = snippet.is_selected

                          return (
                            <div key={snippet.id} className={isSelected ? 'ring-1 ring-red-500/30' : ''}>
                              <WavePlayer
                                url={snippet.audio_url}
                                username={snippet.profiles?.username ?? 'Producer'}
                                date={new Date(snippet.created_at).toLocaleDateString()}
                                badge={
                                  <div className="flex gap-2">
                                    {snippet.profiles?.rating_tier && tierBadge(snippet.profiles.rating_tier)}
                                    {isSelected && <span className="text-xs font-bold uppercase tracking-widest text-red-400 bg-red-500/10 px-2 py-0.5">Selected</span>}
                                    {snippet.counter_offer && <span className="text-xs font-bold uppercase tracking-widest text-yellow-400 bg-yellow-500/10 px-2 py-0.5">Counter: ${snippet.counter_offer}</span>}
                                  </div>
                                }
                                actions={
                                  <>
                                    {isOwner && !isClosed && (
                                      <button
                                        onClick={() => handlePickWinner(req, snippet)}
                                        className="text-xs font-bold uppercase tracking-widest bg-green-500 hover:bg-green-600 text-white px-4 py-2 transition"
                                      >
                                        Pick winner
                                      </button>
                                    )}
                                    {isMySnippet && !isClosed && (
                                      <>
                                        <Link
                                          href={`/snippet/new?requestId=${req.id}&title=${encodeURIComponent(req.title)}&budget=${req.budget}`}
                                          className="text-xs font-bold uppercase tracking-widest border border-white/20 text-white/50 hover:text-white px-4 py-2 transition"
                                        >
                                          Edit
                                        </Link>
                                        <button
                                          onClick={() => handleDeleteSnippet(req.id, snippet.id, snippet.audio_url)}
                                          className="text-xs font-bold uppercase tracking-widest border border-red-500/30 text-red-400 hover:border-red-500 px-4 py-2 transition"
                                        >
                                          Delete
                                        </button>
                                      </>
                                    )}
                                    {isSelected && isOwner && (
                                      <Link
                                        href={`/deal?requestId=${req.id}`}
                                        className="text-xs font-bold uppercase tracking-widest bg-white text-black hover:bg-red-600 hover:text-white px-4 py-2 transition"
                                      >
                                        Go to deal →
                                      </Link>
                                    )}
                                  </>
                                }
                              />
                            </div>
                          )
                        })
                      )}
                    </div>
                  )}

                  {/* Card footer */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-6">
                    <button
                      onClick={() => toggleSnippets(req.id)}
                      className="text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white transition"
                    >
                      {expanded[req.id] ? '↑ Hide snippets' : '↓ Listen to snippets'}
                    </button>
                    {!isClosed && (
                      <Link
                        href={`/snippet/new?requestId=${req.id}&title=${encodeURIComponent(req.title)}&budget=${req.budget}`}
                        className="text-xs font-bold uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white px-5 py-2 transition"
                      >
                        Submit snippet →
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}