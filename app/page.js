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
    <main className="min-h-screen w-full overflow-x-clip bg-black text-white">

      {/* Hero */}
      <section className="relative min-h-screen border-b border-white/10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.04] pointer-events-none" />
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-between px-6 pb-0 pt-12 md:px-12">

          {/* Corner labels */}
          <div className="mb-8 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">/ EST. 2026</span>
            <span className="hidden text-[10px] font-mono uppercase tracking-[0.3em] text-white/20 sm:block">BEATPOOL_V1.0</span>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-red-500">● LIVE</span>
          </div>

          {/* Main headline */}
          <div className="flex flex-1 flex-col justify-center py-12 md:py-16">
            <div className="mb-4">
              <span className="inline-flex border border-red-500/40 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.4em] text-red-500">
                - The beat marketplace reimagined
              </span>
            </div>

            <h1 className="text-[clamp(5.25rem,18vw,13rem)] font-black uppercase leading-[0.85] tracking-tighter -mx-1">
              BEAT
            </h1>
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <h1 className="text-[clamp(5.25rem,18vw,13rem)] font-black uppercase leading-[0.85] tracking-tighter text-red-600 -mx-1">
                POOL
              </h1>
              <div className="hidden md:block mb-4 text-right">
                <p className="mb-6 max-w-xs font-mono text-sm leading-relaxed text-white/40">
                  Post your request. Producers drop custom snippets. Pick the one that hits.
                </p>
                <div className="flex justify-end gap-3">
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
          <div className="md:hidden mb-8 mt-6">
            <p className="mb-6 font-mono text-sm leading-relaxed text-white/40">
              Post your request. Producers drop custom snippets. Pick the one that hits.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/browse" className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest px-4 py-3 text-xs transition text-center">
                Enter pool →
              </Link>
              <Link href="/about" className="flex-1 border border-white/20 text-white font-black uppercase tracking-widest px-4 py-3 text-xs transition text-center">
                How it works
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-1 border-t border-white/10 sm:grid-cols-3">
            {[
              { num: stats.openRequests.toString(), label: 'Open requests' },
              { num: formatPaid(stats.totalPaid), label: 'Paid to producers' },
              { num: `${stats.placementRate}%`, label: 'Placement rate' },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`px-4 py-6 ${i !== 2 ? 'border-b border-white/10 sm:border-b-0 sm:border-r' : ''}`}
              >
                <p className="font-mono text-3xl font-black tracking-tighter text-red-500 md:text-4xl">{s.num}</p>
                <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">{s.label}</p>
              </div>
            ))}
          </div>
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
      <section className="w-full border-b border-white/10">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 md:px-12 md:py-24">
          <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.4em] text-white/30">/ 01 - Process</p>
              <h2 className="text-5xl font-black uppercase tracking-tighter leading-none md:text-7xl">
                HOW IT<br /><span className="text-red-600">WORKS</span>
              </h2>
            </div>
            <Link href="/about" className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 hover:text-white transition md:mt-4">
              View full process →
            </Link>
          </div>

          <div className="grid grid-cols-1 border border-white/10 md:grid-cols-3">
            {[
              { num: '01', title: 'Post a request', desc: 'Describe your vision. Set genre, BPM, mood, budget and license type. The more detail the better.' },
              { num: '02', title: 'Snippets drop', desc: 'Producers submit custom snippets made specifically for your request. No generic type beats.' },
              { num: '03', title: 'Pick and pay', desc: 'Choose your winner. Pay securely via Stripe. Download the full beat and your license agreement.' },
            ].map((step, i) => (
              <div key={step.num} className={`group relative p-8 transition hover:bg-white/[0.02] md:p-10 ${i !== 2 ? 'md:border-r border-white/10' : ''} ${i !== 0 ? 'border-t md:border-t-0 border-white/10' : ''}`}>
                <p className="mb-6 text-[10px] font-mono uppercase tracking-[0.4em] text-white/20">- {step.num}</p>
                <h3 className="mb-4 text-2xl font-black uppercase tracking-tighter transition group-hover:text-red-500">{step.title}</h3>
                <p className="max-w-sm font-mono text-sm leading-relaxed text-white/40">{step.desc}</p>
                <div className="absolute bottom-6 right-6 text-7xl font-black tracking-tighter text-white/5 select-none md:text-8xl">{step.num}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live pool preview */}
      {recentRequests.length > 0 && (
        <section className="w-full border-b border-white/10">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 md:px-12 md:py-24">
            <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.4em] text-white/30">/ 02 - Live</p>
                <h2 className="text-5xl font-black uppercase tracking-tighter leading-none md:text-6xl">
                  RECENT<br /><span className="text-red-600">REQUESTS</span>
                </h2>
              </div>
              <Link href="/browse" className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 hover:text-white transition">
                View all →
              </Link>
            </div>

            <div className="divide-y divide-white/10 border border-white/10">
              {recentRequests.map((req, i) => (
                <Link
                  key={req.id}
                  href="/browse"
                  className="group flex flex-col gap-4 p-6 transition hover:bg-white/[0.02] md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-start gap-4 md:items-center md:gap-6">
                    <span className="w-6 pt-1 text-[10px] font-mono text-white/20 md:pt-0">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight transition group-hover:text-red-500">{req.title}</p>
                      <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
                        {req.profiles?.username} · {req.genre}
                        {req.bpm_min && req.bpm_max ? ` · ${req.bpm_min}–${req.bpm_max} BPM` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 md:gap-6">
                    <span className={`text-[10px] font-mono uppercase tracking-widest border px-3 py-1 ${
                      req.license_type === 'exclusive'
                        ? 'border-red-500/30 text-red-400'
                        : 'border-blue-500/30 text-blue-400'
                    }`}>
                      {req.license_type ?? 'lease'}
                    </span>
                    <span className="font-black text-green-400">${req.budget}</span>
                    <span className="text-sm text-white/20 transition group-hover:text-white">→</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link href="/browse" className="inline-block border border-white/10 hover:border-white/30 text-white/40 hover:text-white font-black uppercase tracking-widest text-xs px-8 py-3 transition">
                See all open requests →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* For artists / producers */}
      <section className="w-full border-b border-white/10">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 md:px-12 md:py-24">
          <p className="mb-16 text-[10px] font-mono uppercase tracking-[0.4em] text-white/30">/ 03 - Who it&apos;s for</p>
          <div className="grid grid-cols-1 border border-white/10 md:grid-cols-2">
            <div className="group border-b border-white/10 p-10 transition hover:bg-red-600/5 md:border-b-0 md:border-r md:p-12">
              <p className="mb-8 text-[10px] font-mono uppercase tracking-[0.4em] text-red-500">For artists</p>
              <h3 className="mb-6 text-4xl font-black uppercase tracking-tighter leading-tight md:text-5xl">
                STOP<br />BROWSING.<br />START<br />CREATING.
              </h3>
              <p className="mb-10 max-w-xs font-mono text-sm leading-relaxed text-white/40">
                Post exactly what you need and let producers come to you. No more sifting through thousands of type beats that don&apos;t fit your vision.
              </p>
              <Link href="/request/new" className="inline-flex items-center gap-3 bg-white text-black hover:bg-red-600 hover:text-white font-black uppercase tracking-widest text-xs px-6 py-3 transition">
                Post a request →
              </Link>
            </div>
            <div className="group p-10 transition hover:bg-blue-600/5 md:p-12">
              <p className="mb-8 text-[10px] font-mono uppercase tracking-[0.4em] text-blue-400">For producers</p>
              <h3 className="mb-6 text-4xl font-black uppercase tracking-tighter leading-tight md:text-5xl">
                REAL<br />OPPOR-<br />TUNITIES.<br />REAL PAY.
              </h3>
              <p className="mb-10 max-w-xs font-mono text-sm leading-relaxed text-white/40">
                Browse open requests and submit snippets to artists actively looking. Get paid directly. Build your reputation through the tier system.
              </p>
              <Link href="/browse" className="inline-flex items-center gap-3 bg-white text-black hover:bg-blue-600 hover:text-white font-black uppercase tracking-widest text-xs px-6 py-3 transition">
                Browse pool →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="w-full border-b border-white/10">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 md:px-12 md:py-24">
          <p className="mb-16 text-[10px] font-mono uppercase tracking-[0.4em] text-white/30">/ 04 - Producer tiers</p>
          <div className="grid grid-cols-1 border border-white/10 sm:grid-cols-2 md:grid-cols-5">
            {[
              { tier: 'Newcomer', sales: '0 sales', color: 'text-white/40' },
              { tier: 'Rising', sales: '3+ sales', color: 'text-green-400', bg: 'bg-green-500/5' },
              { tier: 'Verified', sales: '10+ sales', color: 'text-blue-400', bg: 'bg-blue-500/5' },
              { tier: 'Elite', sales: '20+ sales', color: 'text-purple-400', bg: 'bg-purple-500/5' },
              { tier: 'Legend', sales: '50+ sales', color: 'text-yellow-400', bg: 'bg-yellow-500/5' },
            ].map((t, i) => (
              <div key={t.tier} className={`p-8 ${i !== 4 ? 'border-b border-white/10 sm:last:border-b-0 md:border-b-0 md:border-r' : ''} ${t.bg ?? ''}`}>
                <p className={`mb-2 text-xl font-black uppercase tracking-tighter ${t.color}`}>{t.tier}</p>
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">{t.sales}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full border-b border-white/10">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 md:px-12 md:py-24">
          <div className="relative overflow-hidden border border-white/10 p-10 text-center md:p-20">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
            <p className="relative z-10 mb-6 text-[10px] font-mono uppercase tracking-[0.4em] text-white/30">/ Ready?</p>
            <h2 className="relative z-10 mb-8 text-6xl font-black uppercase tracking-tighter leading-none md:text-9xl">
              JOIN THE<br /><span className="text-red-600">POOL</span>
            </h2>
            <p className="relative z-10 mb-10 font-mono text-sm text-white/40">Free to join. Pay only when you find your beat.</p>
            <div className="relative z-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/login" className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest px-8 py-4 text-sm transition">
                Get started →
              </Link>
              <Link href="/browse" className="border border-white/20 hover:border-white/50 text-white font-black uppercase tracking-widest px-8 py-4 text-sm transition">
                Browse first
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center md:px-12">
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
