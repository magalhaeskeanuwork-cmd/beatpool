export default function Terms() {
  return (
    <main className="min-h-screen w-full overflow-x-clip bg-black text-white">
      <section className="mx-auto w-full max-w-3xl px-6 py-24 md:px-12">
        <h1 className="text-6xl font-black uppercase tracking-tighter mb-4">
          TERMS OF <span className="text-red-600">SERVICE</span>
        </h1>
        <p className="text-white/30 text-sm uppercase tracking-widest mb-16">Last updated: March 2026</p>

        <div className="space-y-12 text-white/60 text-sm leading-relaxed">
          {[
            { title: '1. Acceptance of terms', body: 'By accessing or using BeatPool, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform.' },
            { title: '2. Platform role', body: 'BeatPool is a marketplace that connects artists and producers. We facilitate transactions but are not a party to any agreement between artists and producers.' },
            { title: '3. Payments', body: 'All payments are processed securely through Stripe. BeatPool charges a 20% platform fee on all completed transactions. Producers receive 80% of the agreed price.' },
            { title: '4. Licenses', body: 'License agreements are generated automatically upon payment completion. BeatPool is not responsible for disputes arising from the use of licensed beats outside the terms of the agreement.' },
            { title: '5. Content', body: 'By uploading audio to BeatPool, you confirm you own the rights to that content and grant BeatPool a limited license to host and display it on the platform.' },
            { title: '6. Prohibited use', body: 'You may not use BeatPool to upload content you do not own, engage in fraud, harass other users, or attempt to circumvent our payment systems.' },
            { title: '7. Termination', body: 'We reserve the right to terminate any account that violates these terms at our discretion without notice.' },
            { title: '8. Limitation of liability', body: 'BeatPool is provided as-is. We are not liable for any damages arising from your use of the platform, including lost profits or data.' },
            { title: '9. Contact', body: 'For questions about these terms, contact us at legal@beatpool.com.' },
          ].map(section => (
            <div key={section.title}>
              <h2 className="text-white font-black uppercase tracking-tight text-lg mb-3">{section.title}</h2>
              <p>{section.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
