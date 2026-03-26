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
        <div className="mx-auto max-w-7xl px-8 py-24 md:px-14 md:py-28 xl:px-20">
          <div className="grid gap-14 xl:grid-cols-[minmax(0,1.1fr)_360px] xl:gap-20">
            <div className="min-w-0">
              <p className="mb-6 text-[10px] font-mono uppercase tracking-[0.35em] text-red-500">
                / About BeatPool
              </p>

              <h1 className="max-w-[10ch] text-4xl font-black uppercase tracking-tighter leading-[0.98] sm:text-5xl md:text-6xl lg:text-[4.75rem]">
                Custom beats,
                <br />
                <span className="text-red-600">without the guesswork</span>
              </h1>

              <p className="mt-8 max-w-2xl font-mono text-sm leading-relaxed text-white/50 md:text-[15px]">
                BeatPool is built around fit. Artists stop scrolling through endless generic beats.
                Producers stop creating in the dark. Requests come first. The right beat follows.
              </p>
            </div>

            <div className="grid gap-6 xl:pt-10">
              <div className="border border-white/10 p-6 md:p-7">
                <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">
                  / The problem
                </p>
                <p className="font-mono text-sm leading-relaxed text-white/60 md:text-[15px]">
                  Artists waste hours scrolling through generic type beats. Producers waste hours
                  making work with no clear buyer in mind.
                </p>
              </div>

              <div className="border border-white/10 p-6 md:p-7">
                <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">
                  / The shift
                </p>
                <p className="font-mono text-sm leading-relaxed text-white/60 md:text-[15px]">
                  Artists post the need first. Producers respond to a real brief. The platform
                  becomes a marketplace for fit, not noise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-8 py-20 md:px-14 md:py-24 xl:px-20">
          <div className="mb-12 md:mb-16">
            <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.35em] text-red-500">
              / How it works
            </p>
            <h2 className="text-2xl font-black uppercase tracking-tighter sm:text-3xl md:text-4xl">
              Five moves.
              <span className="text-red-600"> Done.</span>
            </h2>
          </div>

          <div className="grid gap-6 md:gap-8">
            {steps.map((step) => (
              <article
                key={step.number}
                className="border border-white/10 p-6 md:p-8"
              >
                <div className="grid gap-5 md:grid-cols-[72px_minmax(0,1fr)] md:gap-7">
                  <div className="text-3xl font-black tracking-tighter leading-none text-red-600/35 md:text-4xl">
                    {step.number}
                  </div>

                  <div className="min-w-0">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-black uppercase tracking-tighter leading-none md:text-2xl">
                        {step.title}
                      </h3>
                      <span
                        className={`border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${roleStyle(step.role)}`}
                      >
                        {step.role}
                      </span>
                    </div>

                    <p className="max-w-3xl font-mono text-sm leading-relaxed text-white/50 md:text-[15px]">
                      {step.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-8 py-20 md:px-14 md:py-24 xl:px-20">
          <div className="mb-12 md:mb-16">
            <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.35em] text-red-500">
              / Licensing
            </p>
            <h2 className="text-2xl font-black uppercase tracking-tighter sm:text-3xl md:text-4xl">
              Two clear
              <span className="text-red-600"> options</span>
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="border border-white/10 p-6 md:p-8">
              <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.3em] text-blue-400">
                / Non-exclusive
              </p>
              <h3 className="mb-6 text-2xl font-black uppercase tracking-tighter md:text-3xl">
                Lease
              </h3>

              <ul className="space-y-4">
                {licenses.lease.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 font-mono text-sm text-white/55 md:text-[15px]"
                  >
                    <span className="mt-0.5 text-blue-400">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-white/10 p-6 md:p-8">
              <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.3em] text-red-500">
                / Exclusive
              </p>
              <h3 className="mb-6 text-2xl font-black uppercase tracking-tighter md:text-3xl">
                Full Rights
              </h3>

              <ul className="space-y-4">
                {licenses.exclusive.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 font-mono text-sm text-white/55 md:text-[15px]"
                  >
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
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-8 py-10 md:flex-row md:items-center md:justify-between md:px-14 xl:px-20">
          <span className="text-xl font-black uppercase tracking-tighter">
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