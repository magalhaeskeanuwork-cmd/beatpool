'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const GENRES = ['Trap', 'Drill', 'R&B', 'Afrobeats', 'Boom Bap', 'Pop', 'Lo-fi']
const MOODS = ['Dark', 'Melodic', 'Aggressive', 'Chill', 'Emotional', 'Hype']
const KEYS = ['C min', 'C maj', 'D min', 'D maj', 'E min', 'E maj', 'F min', 'F maj', 'G min', 'G maj', 'A min', 'A maj', 'B min', 'B maj']

export default function NewRequest() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    title: '', description: '', genre: '',
    bpm_min: '', bpm_max: '', mood: '',
    key: '', budget: '', license_type: 'lease',
  })

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('You must be logged in.'); setLoading(false); return }

    const { error } = await supabase.from('requests').insert({
      artist_id: user.id,
      title: form.title,
      description: form.description,
      genre: form.genre,
      bpm_min: parseInt(form.bpm_min) || null,
      bpm_max: parseInt(form.bpm_max) || null,
      mood: form.mood,
      key: form.key,
      budget: parseInt(form.budget),
      license_type: form.license_type,
    })

    if (error) { setError(error.message); setLoading(false); return }
    router.push('/browse')
  }

  const FilterBtn = ({ active, onClick, label }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition ${
        active
          ? 'bg-red-600 text-white border-red-600'
          : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'
      }`}
    >
      {label}
    </button>
  )

  return (
    <main className="relative min-h-screen w-full overflow-x-clip bg-black text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 py-16 md:px-12">

        {/* Header */}
        <div className="border-b border-white/10 pb-12 mb-16">
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-4">/ New request</p>
          <h1 className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none">
            POST A<br /><span className="text-red-600">REQUEST</span>
          </h1>
          <p className="font-mono text-white/40 text-sm mt-4">Describe your vision and producers will respond with custom snippets.</p>
        </div>

        <div className="space-y-10">

          {/* Title */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 block mb-3">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => update('title', e.target.value)}
              placeholder="e.g. Dark melodic trap for my EP intro"
              className="w-full bg-transparent border border-white/10 hover:border-white/20 focus:border-white/40 px-4 py-4 font-mono text-sm text-white placeholder-white/20 outline-none transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 block mb-3">Description</label>
            <textarea
              value={form.description}
              onChange={e => update('description', e.target.value)}
              placeholder="Describe the vibe, references, what you're going for..."
              rows={4}
              className="w-full bg-transparent border border-white/10 hover:border-white/20 focus:border-white/40 px-4 py-4 font-mono text-sm text-white placeholder-white/20 outline-none transition resize-none"
            />
          </div>

          {/* Genre */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 block mb-3">Genre</label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map(g => <FilterBtn key={g} active={form.genre === g} onClick={() => update('genre', g)} label={g} />)}
            </div>
          </div>

          {/* BPM */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 block mb-3">BPM Range</label>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                type="number"
                value={form.bpm_min}
                onChange={e => update('bpm_min', e.target.value)}
                placeholder="80"
                className="w-full bg-transparent border border-white/10 hover:border-white/20 focus:border-white/40 px-4 py-4 font-mono text-sm text-white placeholder-white/20 outline-none transition"
              />
              <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">to</span>
              <input
                type="number"
                value={form.bpm_max}
                onChange={e => update('bpm_max', e.target.value)}
                placeholder="140"
                className="w-full bg-transparent border border-white/10 hover:border-white/20 focus:border-white/40 px-4 py-4 font-mono text-sm text-white placeholder-white/20 outline-none transition"
              />
            </div>
          </div>

          {/* Mood */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 block mb-3">Mood</label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map(m => <FilterBtn key={m} active={form.mood === m} onClick={() => update('mood', m)} label={m} />)}
            </div>
          </div>

          {/* Key */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 block mb-3">Key</label>
            <div className="flex flex-wrap gap-2">
              {KEYS.map(k => <FilterBtn key={k} active={form.key === k} onClick={() => update('key', k)} label={k} />)}
            </div>
          </div>

          {/* License type */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 block mb-3">License type</label>
            <div className="grid grid-cols-2 gap-px bg-white/10">
              {[
                { value: 'lease', label: 'Lease', desc: 'Non-exclusive · producer can resell' },
                { value: 'exclusive', label: 'Exclusive', desc: 'Full ownership · producer cannot resell' },
              ].map(lt => (
                <button
                  key={lt.value}
                  onClick={() => update('license_type', lt.value)}
                  className={`p-6 text-left transition ${
                    form.license_type === lt.value
                      ? 'bg-white text-black'
                      : 'bg-black text-white hover:bg-white/5'
                  }`}
                >
                  <p className="font-black uppercase tracking-tight text-sm mb-1">{lt.label}</p>
                  <p className={`text-[10px] font-mono uppercase tracking-widest ${form.license_type === lt.value ? 'text-black/50' : 'text-white/30'}`}>{lt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 block mb-3">Budget (USD)</label>
            <div className="flex items-center border border-white/10 hover:border-white/20 focus-within:border-white/40 transition">
              <span className="text-white/30 font-mono px-4 border-r border-white/10">$</span>
              <input
                type="number"
                value={form.budget}
                onChange={e => update('budget', e.target.value)}
                placeholder="100"
                className="flex-1 bg-transparent px-4 py-4 font-mono text-sm text-white placeholder-white/20 outline-none"
              />
            </div>
          </div>

          {error && <p className="text-[10px] font-mono uppercase tracking-widest text-red-400">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading || !form.title || !form.genre || !form.budget}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-black uppercase tracking-widest py-4 text-sm transition"
          >
            {loading ? 'Posting...' : 'Post request →'}
          </button>
        </div>
      </div>
    </main>
  )
}
