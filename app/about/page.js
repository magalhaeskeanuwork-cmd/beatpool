export default function About() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-24 border-b border-white/10">
        <h1 className="text-[10vw] font-black uppercase tracking-tighter leading-none mb-16">
          HOW IT<br /><span className="text-red-600">WORKS</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          <div>
            <p className="font-mono uppercase tracking-[0.3em] text-red-500 mb-4">The problem</p>
            <p className="text-white/60 font-mono">
              Artists spend hours browsing through thousands of generic type beats hoping something fits their vision. Producers make beats blindly hoping someone buys. Both sides waste time.
            </p>
          </div>
          <div>
            <p className="font-mono uppercase tracking-[0.3em] text-red-500 mb-4">The solution</p>
            <p className="text-white/60 font-mono">
              BeatPool flips the model. Artists post exactly what they need. Producers respond with custom 10-second snippets. Everyone wins.
            </p>
          </div>
        </div>

        <div className="space-y-px bg-white/10">
          {[
            { num: '01', title: 'Post a request', desc: 'As an artist, describe your vision in detail. Set the genre, BPM range, mood, key, license type and budget. The more detail you give, the better the snippets you receive.', tag: 'Artist' },
            { num: '02', title: 'Producers respond with snippets', desc: 'Producers browse open requests and submit 10-second audio snippets made specifically for your request. They can also submit a counter offer if they feel their work is worth more.', tag: 'Producer' },
            { num: '03', title: 'Listen and pick a winner', desc: 'Review all submitted snippets directly on the platform with a waveform player. Pick the one that fits your vision. The request closes and a deal is created.', tag: 'Artist' },
            { num: '04', title: 'Pay securely via Stripe', desc: 'Complete payment through our secure Stripe checkout. Funds are held and automatically split — 80% to the producer, 20% platform fee.', tag: 'Both' },
            { num: '05', title: 'Download your beat and license', desc: 'The producer uploads the full beat file. You download it along with a legally binding license agreement — either a non-exclusive lease or full exclusive rights.', tag: 'Artist' },
          ].map(step => (
            <div key={step.num} className="bg-black p-10 flex gap-10 hover:bg-white/5 transition">
              <p className="text-red-600 font-black text-5xl tracking-tighter opacity-20 flex-shrink-0 w-16">{step.num}</p>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-black uppercase tracking-tight">{step.title}</h3>
                  <span className={`text-xs px-2 py-0.5 uppercase tracking-widest font-bold ${
                    step.tag === 'Artist' ? 'text-red-400 bg-red-500/10' :
                    step.tag === 'Producer' ? 'text-blue-400 bg-blue-500/10' :
                    'text-white/40 bg-white/5'
                  }`}>{step.tag}</span>
                </div>
                <p className="text-white/40 font-mono">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* License types */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-24 border-b border-white/10">
        <h2 className="text-5xl font-black uppercase tracking-tighter mb-16">
          LICENSE <span className="text-red-600">TYPES</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
          <div className="bg-black p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-blue-400 mb-4">Non-exclusive</p>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-6">Lease</h3>
            <ul className="space-y-3 font-mono text-white/50">
              {['Up to 100,000 streams', 'Up to 10,000 downloads', '1 music video', 'Unlimited live performances', 'Producer retains resale rights', 'Credit required: "Prod. by [name]"'].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-blue-400 mt-0.5">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-black p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-red-500 mb-4">Exclusive</p>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-6">Full rights</h3>
            <ul className="space-y-3 font-mono text-white/50">
              {['Unlimited streams and downloads', 'Unlimited music videos', 'Sync licensing for TV and film', 'Full ownership of composition', 'Producer removes beat from market', 'No credit required'].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-red-500 mt-0.5">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 md:px-16 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <span className="text-2xl font-black tracking-tighter uppercase">
            BEAT<span className="text-red-600">POOL</span>
          </span>
          <p className="text-white/20 text-xs uppercase tracking-widest">© 2026 BeatPool</p>
        </div>
      </footer>
    </main>
  )
}