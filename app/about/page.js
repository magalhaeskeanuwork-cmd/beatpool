export default function AboutPage() {
  const steps = [
    {
      number: '01',
      title: 'Post your vision',
      role: 'Artist',
      description:
        'Describe the beat you actually want — genre, BPM, mood, key, references, budget, and license type. The clearer the brief, the better the responses.',
    },
    {
      number: '02',
      title: 'Producers submit snippets',
      role: 'Producer',
      description:
        'Instead of throwing full beats into the void, producers respond with short custom snippets built around your request. Fast, specific, and intentional.',
    },
    {
      number: '03',
      title: 'Pick what hits',
      role: 'Artist',
      description:
        'Listen to the submissions, compare ideas, and choose the one that feels right. Once selected, the request closes and a deal is created.',
    },
    {
      number: '04',
      title: 'Pay securely',
      role: 'Both',
      description:
        'Checkout runs through Stripe. Funds are handled securely and split automatically — 80% to the producer, 20% platform fee.',
    },
    {
      number: '05',
      title: 'Get the final beat + license',
      role: 'Artist',
      description:
        'The producer uploads the final beat, and the platform generates the license agreement. Clean handoff, clear rights, no chaos.',
    },
  ]

  const licenses = {
    lease: [
      'Up to 100,000 streams',
      'Up to 10,000 downloads',
      '1 music video',
      'Unlimited live performances',
      'Producer keeps resale rights',
      'Credit required',
    ],
    exclusive: [
      'Unlimited streams and downloads',
      'Unlimited music videos',
      'Sync use for TV and film',
      'Full ownership transfer',
      'Producer removes beat from market',
      'No credit required',
    ],
  }

  function roleStyle(role) {
    if (role === 'Artist') return 'text-red-400 border-red-500/20 bg-red-500/10'
    if (role === 'Producer') return 'text-blue-400 border-blue-500/20 bg-blue-500/10'
    return 'text-white/50 border-white/10 bg-white/5'
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28">
          <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
            <div>
              <p className="mb-6 text-[10px] font-mono uppercase tracking-[0.4em] text-red-500">
                / About BeatPool
              </p>

              <h1 className="max-w-5xl text-6xl font-black uppercase tracking-tighter leading-[0.88] sm:text-7xl md:text-8xl lg:text-[8.5rem]">
                CUSTOM
                <br />
                BEATS,
                <br />
                <span className="text-red-600">WITHOUT THE GUESSWORK</span>
              </h1>
            </div>

            <div className="flex flex-col justify-end gap-8">
              <div className="border border-white/10 p-6 md:p-8">
                <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.35em] text-white/30">
                  / The problem
                </p>
                <p className="font-mono text-sm leading-relaxed text-white/60 md:text-base">
                  Artists waste hours scrolling through generic type beats. Producers waste hours
                  making work with no clear buyer in mind.
                </p>
              </div>

              <div className="border border-white/10 p-6 md:p-8">
                <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.35em] text-white/30">
                  / The shift
                </p>
                <p className="font-mono text-sm leading-relaxed text-white/60 md:text-base">
                  BeatPool flips the workflow. Artists post the need first. Producers respond to a
                  real brief. The platform becomes a marketplace for fit, not noise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
          <div className="mb-10 md:mb-14">
            <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.4em] text-red-500">
              / How it works
            </p>
            <h2 className="text-4xl font-black uppercase tracking-tighter md:text-6xl">
              FIVE MOVES.
              <span className="text-red-600"> DONE.</span>
            </h2>
          </div>

          <div className="space-y-4 md:space-y-5">
            {steps.map((step) => (
              <article
                key={step.number}
                className="grid gap-6 border border-white/10 p-6 md:grid-cols-[84px_1fr] md:gap-8 md:p-8"
              >
                <div className="text-5xl font-black tracking-tighter leading-none text-red-600/30 md:text-6xl">
                  {step.number}
                </div>

                <div className="min-w-0">
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-black uppercase tracking-tighter leading-none md:text-4xl">
                      {step.title}
                    </h3>
                    <span
                      className={`border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${roleStyle(step.role)}`}
                    >
                      {step.role}
                    </span>
                  </div>

                  <p className="max-w-4xl font-mono text-sm leading-relaxed text-white/50 md:text-base">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
          <div className="mb-10 md:mb-14">
            <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.4em] text-red-500">
              / Licensing
            </p>
            <h2 className="text-4xl font-black uppercase tracking-tighter md:text-6xl">
              TWO CLEAR
              <span className="text-red-600"> OPTIONS</span>
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="border border-white/10 p-8 md:p-10">
              <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.35em] text-blue-400">
                / Non-exclusive
              </p>
              <h3 className="mb-8 text-3xl font-black uppercase tracking-tighter md:text-4xl">
                Lease
              </h3>

              <ul className="space-y-4">
                {licenses.lease.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-mono text-sm text-white/55 md:text-base">
                    <span className="mt-0.5 text-blue-400">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-white/10 p-8 md:p-10">
              <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.35em] text-red-500">
                / Exclusive
              </p>
              <h3 className="mb-8 text-3xl font-black uppercase tracking-tighter md:text-4xl">
                Full Rights
              </h3>

              <ul className="space-y-4">
                {licenses.exclusive.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-mono text-sm text-white/55 md:text-base">
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
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-12">
          <span className="text-2xl font-black uppercase tracking-tighter">
            BEAT<span className="text-red-600">POOL</span>
          </span>
          <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-white/20">
            © 2026 BeatPool
          </p>
        </div>
      </footer>
    </main>
  )
}