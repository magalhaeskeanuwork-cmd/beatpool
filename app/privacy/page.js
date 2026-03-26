export default function PrivacyPage() {
  return (
    <main className="min-h-screen w-full overflow-x-clip bg-black text-white">
      <div className="mx-auto w-full max-w-3xl px-6 py-16 md:px-12">
        <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-4">
          / Privacy Policy
        </p>

        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">
          Privacy Policy
        </h1>

        <div className="space-y-6 text-white/70 text-sm leading-relaxed">
          <p>
            This Privacy Policy explains how BeatPool collects, uses, and protects your information
            when you use the platform.
          </p>

          <div>
            <h2 className="text-white font-black uppercase tracking-wide mb-2">Information We Collect</h2>
            <p>
              We may collect account information, profile details, uploaded content, payment-related
              information, and usage data needed to operate the platform.
            </p>
          </div>

          <div>
            <h2 className="text-white font-black uppercase tracking-wide mb-2">How We Use Information</h2>
            <p>
              We use your information to provide the service, process transactions, communicate with
              you, improve the platform, and maintain security.
            </p>
          </div>

          <div>
            <h2 className="text-white font-black uppercase tracking-wide mb-2">Third-Party Services</h2>
            <p>
              We may use third-party services such as Supabase, Stripe, and email providers to help
              operate the platform.
            </p>
          </div>

          <div>
            <h2 className="text-white font-black uppercase tracking-wide mb-2">Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your data, subject to legal
              and operational requirements.
            </p>
          </div>

          <div>
            <h2 className="text-white font-black uppercase tracking-wide mb-2">Contact</h2>
            <p>
              If you have questions about this policy, contact BeatPool support.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
