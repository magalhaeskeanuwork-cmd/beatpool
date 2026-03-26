import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

// ── helper ──────────────────────────────────────────────
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// ── fetch recent open requests (unchanged) ──────────────
async function getRecentRequests() {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('requests')
    .select('*, profiles(username)')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(5)
  return data ?? []
}

// ── fetch live stats for the hero counter bar ───────────
async function getStats() {
  const supabase = getSupabase()

  // 1. Count open requests
  const { count: openCount } = await supabase
    .from('requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'open')

  // 2. Sum budgets of closed/completed requests → "paid to producers"
  const { data: closedData } = await supabase
    .from('requests')
    .select('budget')
    .eq('status', 'closed')

  const totalPaid = (closedData ?? []).reduce(
    (sum, r) => sum + (r.budget ?? 0), 0
  )

  // 3. Placement rate = closed ÷ total
  const { count: totalCount } = await supabase
    .from('requests')
    .select('*', { count: 'exact', head: true })

  const placementRate =
    totalCount > 0
      ? Math.round(((totalCount - (openCount ?? 0)) / totalCount) * 100)
      : 0

  return {
    openRequests: openCount ?? 0,
    totalPaid,
    placementRate,
  }
}

export default async function Home() {
  const [recentRequests, stats] = await Promise.all([
    getRecentRequests(),
    getStats(),
  ])

  // Format the paid amount nicely: 18500 → "$18.5K"
  const formatPaid = (n) => {
    if (n >= 1000) return `$${(n / 1000).toFixed(1).replace('.0', '')}K+`
    return `$${n}`
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-between px-6 md:px-12 pt-12 pb-0 border-b border-white/10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.04] pointer-events-none" />

        {/* Corner labels */}
        <div className="relative z-10 flex items-center justify-between mb-8">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">/ EST. 2026</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">BEATPOOL_V1.0</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-red-500">● LIVE</span>
        </div>

        {/* Main headline */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="mb-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-red-500 border border-red-500/40 px-3 py-1.5">
              — The beat marketplace reimagined
            </span>
          </div>

          <h1 className="text-[18vw] md:text-[14vw] font-black uppercase leading-[0.85] tracking-tighter -mx-1">
            BEAT
          </h1>
          <div className="flex items-end justify-between">
            <h1 className="text-[18vw] md:text-[14vw] font-black uppercase leading-[0.85] tracking-tighter text-red-600 -mx-1">
              POOL
            </h1>
            <div className="hidden md:block mb-4 text-right">
              <p className="font-mono text-white/40 text-sm leading-relaxed max-w-xs mb-6">
                Post your request. Producers drop custom snippets. Pick the one that hits.
              </p>
              <div className="flex gap-3 justify-end">
                <Link href="/browse" className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest px-6 py-3 text-xs transition">
                  Enter pool →
                </Link>
                <Link href="/about" className="border border-white/20 hover:border-white/50 text-white font-black uppercase tracking-widest px-6 py-3 text-xs transition">
                  How it works
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="md:hidden relative z-10 mb-8 mt-6">
          <p className="font-mono text-white/40 text-sm leading-relaxed mb-6">
            Post your request. Producers drop custom snippets. Pick the one that hits.
          </p>
          <div className="flex gap-3">
            <Link href="/browse" className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest px-4 py-3 text-xs transition text-center">
              Enter pool →
            </Link>
            <Link href="/about" className="border border-white/20 text-white font-black uppercase tracking-widest px-4 py-3 text-xs transition">
              How it works
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 border-t border-white/10 grid grid-cols-3">
          {[
    { num: stats.openRequests.toString(),        label: 'Open requests' },
    { num: formatPaid(stats.totalPaid),          label: 'Paid to producers' },
    { num: `${stats.placementRate}%`,            label: 'Placement rate' },
  ].map((s, i) => (
            <div key={s.label} className={`py-6 px-4 ${i !== 2 ? 'border-r border-white/10' : ''}`}>
              <p className="text-3xl md:text-4xl font-black text-red-500 tracking-tighter font-mono">{s.num}</p>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ticker — animated */}
      <div className="border-b border-white/10 overflow-hidden py-3 bg-red-600">
        <style>{`
          @keyframes ticker {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .ticker-track {
            display: flex;
            width: max-content;
            animation: ticker 18s linear infinite;
          }
          .ticker-track:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="ticker-track">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/80 inline-flex gap-10 px-5 whitespace-nowrap">
              <span>CUSTOM BEATS</span>
              <span>■</span>
              <span>REAL ARTISTS</span>
              <span>■</span>
              <span>DIRECT SALES</span>
              <span>■</span>
              <span>SECURE PAYMENTS</span>
              <span>■</span>
              <span>LEASE &amp; EXCLUSIVE</span>
              <span>■</span>
              <span>PRODUCER TIERS</span>
              <span>■</span>
            </span>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 border-b border-white/10">
        <div className="flex items-start justify-between mb-16">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-4">/ 01 — Process</p>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
              HOW IT<br /><span className="text-red-600">WORKS</span>
            </h2>
          </div>
          <Link href="/about" className="hidden md:block text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 hover:text-white transition mt-4">
            View full process →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border border-white/10">
          {[
            { num: '01', title: 'Post a request', desc: 'Describe your vision. Set genre, BPM, mood, budget and license type. The more detail the better.' },
            { num: '02', title: 'Snippets drop', desc: 'Producers submit custom snippets made specifically for your request. No generic type beats.' },
            { num: '03', title: 'Pick and pay', desc: 'Choose your winner. Pay securely via Stripe. Download the full beat and your license agreement.' },
          ].map((step, i) => (
            <div key={step.num} className={`p-10 relative ${i !== 2 ? 'md:border-r border-white/10' : ''} ${i !== 0 ? 'border-t md:border-t-0 border-white/10' : ''} group hover:bg-white/[0.02] transition`}>
              <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/20 mb-6">— {step.num}</p>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 group-hover:text-red-500 transition">{step.title}</h3>
              <p className="font-mono text-white/40 text-sm leading-relaxed">{step.desc}</p>
              <div className="absolute bottom-6 right-6 text-white/5 text-8xl font-black tracking-tighter select-none">{step.num}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Live pool preview */}
      {recentRequests.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 border-b border-white/10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-4">/ 02 — Live</p>
              <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                RECENT<br /><span className="text-red-600">REQUESTS</span>
              </h2>
            </div>
            <Link href="/browse" className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 hover:text-white transition">
              View all →
            </Link>
          </div>

          <div className="border border-white/10 divide-y divide-white/10">
            {recentRequests.map((req, i) => (
              <Link
                key={req.id}
                href="/browse"
                className="flex items-center justify-between p-6 hover:bg-white/[0.02] transition group"
              >
                <div className="flex items-center gap-6">
                  <span className="text-[10px] font-mono text-white/20 w-6">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="font-black uppercase tracking-tight text-sm group-hover:text-red-500 transition">{req.title}</p>
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mt-1">
                      {req.profiles?.username} · {req.genre}
                      {req.bpm_min && req.bpm_max ? ` · ${req.bpm_min}–${req.bpm_max} BPM` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className={`text-[10px] font-mono uppercase tracking-widest border px-3 py-1 ${
                    req.license_type === 'exclusive'
                      ? 'border-red-500/30 text-red-400'
                      : 'border-blue-500/30 text-blue-400'
                  }`}>
                    {req.license_type ?? 'lease'}
                  </span>
                  <span className="font-black text-green-400">${req.budget}</span>
                  <span className="text-white/20 group-hover:text-white transition text-sm">→</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link href="/browse" className="inline-block border border-white/10 hover:border-white/30 text-white/40 hover:text-white font-black uppercase tracking-widest text-xs px-8 py-3 transition">
              See all open requests →
            </Link>
          </div>
        </section>
      )}

      {/* For artists / producers */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 border-b border-white/10">
        <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-16">/ 03 — Who it's for</p>
        <div className="grid grid-cols-1 md:grid-cols-2 border border-white/10">
          <div className="p-12 border-b md:border-b-0 md:border-r border-white/10 group hover:bg-red-600/5 transition">
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-red-500 mb-8">For artists</p>
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight mb-6">
              STOP<br />BROWSING.<br />START<br />CREATING.
            </h3>
            <p className="font-mono text-white/40 text-sm leading-relaxed mb-10 max-w-xs">
              Post exactly what you need and let producers come to you. No more sifting through thousands of type beats that don't fit your vision.
            </p>
            <Link href="/request/new" className="inline-flex items-center gap-3 bg-white text-black hover:bg-red-600 hover:text-white font-black uppercase tracking-widest text-xs px-6 py-3 transition">
              Post a request →
            </Link>
          </div>
          <div className="p-12 group hover:bg-blue-600/5 transition">
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-400 mb-8">For producers</p>
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight mb-6">
              REAL<br />OPPOR-<br />TUNITIES.<br />REAL PAY.
            </h3>
            <p className="font-mono text-white/40 text-sm leading-relaxed mb-10 max-w-xs">
              Browse open requests and submit snippets to artists actively looking. Get paid directly. Build your reputation through the tier system.
            </p>
            <Link href="/browse" className="inline-flex items-center gap-3 bg-white text-black hover:bg-blue-600 hover:text-white font-black uppercase tracking-widest text-xs px-6 py-3 transition">
              Browse pool →
            </Link>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 border-b border-white/10">
        <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-16">/ 04 — Producer tiers</p>
        <div className="grid grid-cols-2 md:grid-cols-5 border border-white/10">
          {[
            { tier: 'Newcomer', sales: '0 sales', color: 'text-white/40' },
            { tier: 'Rising', sales: '3+ sales', color: 'text-green-400', bg: 'bg-green-500/5' },
            { tier: 'Verified', sales: '10+ sales', color: 'text-blue-400', bg: 'bg-blue-500/5' },
            { tier: 'Elite', sales: '20+ sales', color: 'text-purple-400', bg: 'bg-purple-500/5' },
            { tier: 'Legend', sales: '50+ sales', color: 'text-yellow-400', bg: 'bg-yellow-500/5' },
          ].map((t, i) => (
            <div key={t.tier} className={`p-8 ${i !== 4 ? 'border-b md:border-b-0 md:border-r border-white/10' : ''} ${t.bg ?? ''}`}>
              <p className={`text-xl font-black uppercase tracking-tighter mb-2 ${t.color}`}>{t.tier}</p>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">{t.sales}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 border-b border-white/10">
        <div className="border border-white/10 p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-6 relative z-10">/ Ready?</p>
          <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none mb-8 relative z-10">
            JOIN THE<br /><span className="text-red-600">POOL</span>
          </h2>
          <p className="font-mono text-white/40 text-sm mb-10 relative z-10">Free to join. Pay only when you find your beat.</p>
          <div className="flex gap-4 justify-center relative z-10">
            <Link href="/login" className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest px-8 py-4 text-sm transition">
              Get started →
            </Link>
            <Link href="/browse" className="border border-white/20 hover:border-white/50 text-white font-black uppercase tracking-widest px-8 py-4 text-sm transition">
              Browse first
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <span className="text-2xl font-black tracking-tighter uppercase">
            BEAT<span className="text-red-600">POOL</span>
          </span>
          <div className="flex flex-wrap gap-6 text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">
            <Link href="/about" className="hover:text-white transition">How it works</Link>
            <Link href="/browse" className="hover:text-white transition">Pool</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          </div>
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">© 2026 BEATPOOL</p>
        </div>
      </footer>

    </main>
  )
}