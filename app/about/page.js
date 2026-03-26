export default function About() {
  const steps = [
    {
      num: '01',
      title: 'Post a request',
      desc: 'As an artist, describe your vision in detail. Set the genre, BPM range, mood, key, license type and budget. The more detail you give, the better the snippets you receive.',
      tag: 'Artist',
    },
    {
      num: '02',
      title: 'Producers respond with snippets',
      desc: 'Producers browse open requests and submit 10-second audio snippets made specifically for your request. They can also submit a counter offer if they feel their work is worth more.',
      tag: 'Producer',
    },
    {
      num: '03',
      title: 'Listen and pick a winner',
      desc: 'Review all submitted snippets directly on the platform with a waveform player. Pick the one that fits your vision. The request closes and a deal is created.',
      tag: 'Artist',
    },
    {
      num: '04',
      title: 'Pay securely via Stripe',
      desc: 'Complete payment through our secure Stripe checkout. Funds are held and automatically split — 80% to the producer, 20% platform fee.',
      tag: 'Both',
    },
    {
      num: '05',
      title: 'Download your beat and license',
      desc: 'The producer uploads the full beat file. You download it along with a legally binding license agreement — either a non-exclusive lease or full exclusive rights.',
      tag: 'Artist',
    },
  ]

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto w-full max-w-7xl px-6 py-16 md:px-12 md:py-24">
          <div className="mb-16 md:mb-24">
            <h1 className="max-w-5xl text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black uppercase tracking-tighter leading-[0.9]">
              HOW IT
              <br />
              <span className="text-red-600">WORKS</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20 mb-16 md:mb-24">
            <div className="max-w-2xl">
              <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.35em] text-red-500">
                / The problem
              </p>
              <p className="font-mono text-base leading-relaxed text-white/60 md:text-lg">
                Artists spend hours browsing through thousands of generic type beats hoping something
                fits their vision. Producers make beats blindly hoping someone buys. Both sides waste
                time.
              </p>
            </div>

            <div className="max-w-2xl">
              <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.35em] text-red-500">
                / The solution
              </p>
              <p className="font-mono text-base leading-relaxed text-white/60 md:text-lg">
                BeatPool flips the model. Artists post exactly what they need. Producers respond with
                custom 10-second snippets. Everyone wins.
              </p>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="grid grid-cols-[56px_1fr] gap-5 border border-white/10 bg-black p-6 md:grid-cols-[88px_1fr] md:gap-8 md:p-8"
              >
                <div className="text-4xl font-black leading-none tracking-tighter text-red-600/35 md:text-6xl">
                  {step.num}
                </div>

                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none">
                      {step.title}
                    </h3>

                    <span
                      className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest ${
                        step.tag === 'Artist'
                          ? 'bg-red-500/10 text-red-400'
                          : step.tag === 'Producer'
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-white/5 text-white/40'
                      }`}
                    >
                      {step.tag}
                    </span>
                  </div>

                  <p className="max-w-5xl font-mono text-base leading-relaxed text-white/45 md:text-lg">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto w-full max-w-7xl px-6 py-16 md:px-12 md:py-24">
          <h2 className="mb-12 text-4xl font-black uppercase tracking-tighter md:mb-16 md:text-5xl">
            LICENSE <span className="text-red-600">TYPES</span>
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            <div className="border border-white/10 bg-black p-8 md:p-10">
              <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.35em] text-blue-400">
                / Non-exclusive
              </p>
              <h3 className="mb-6 text-3xl font-black uppercase tracking-tighter">Lease</h3>

              <ul className="space-y-3 font-mono text-white/50">
                {[
                  'Up to 100,000 streams',
                  'Up to 10,000 downloads',
                  '1 music video',
                  'Unlimited live performances',
                  'Producer retains resale rights',
                  'Credit required: "Prod. by [name]"',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 text-blue-400">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-white/10 bg-black p-8 md:p-10">
              <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.35em] text-red-500">
                / Exclusive
              </p>
              <h3 className="mb-6 text-3xl font-black uppercase tracking-tighter">Full rights</h3>

              <ul className="space-y-3 font-mono text-white/50">
                {[
                  'Unlimited streams and downloads',
                  'Unlimited music videos',
                  'Sync licensing for TV and film',
                  'Full ownership of composition',
                  'Producer removes beat from market',
                  'No credit required',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 text-red-500">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center md:px-12">
          <span className="text-2xl font-black uppercase tracking-tighter">
            BEAT<span className="text-red-600">POOL</span>
          </span>
          <p className="text-xs uppercase tracking-widest text-white/20">© 2026 BeatPool</p>
        </div>
      </footer>
    </main>
  )
}