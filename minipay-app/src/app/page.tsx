import Link from "next/link";

const CURRENCIES = [
  { flag: "🇳🇬", code: "NGN" },
  { flag: "🇬🇭", code: "GHS" },
  { flag: "🇰🇪", code: "KES" },
  { flag: "🇺🇬", code: "UGX" },
  { flag: "🇹🇿", code: "TZS" },
  { flag: "🇲🇼", code: "MWK" },
];

const CHAINS = ["Optimism", "Arbitrum", "BNB Chain", "Scroll", "Linea", "Base", "Polygon", "Ethereum"];

const FEATURES = [
  {
    icon: "🌍",
    color: "bg-teal-500/15 text-teal-400",
    title: "Send Money Abroad",
    desc: "Send USDC or USDT straight to a bank account or mobile money wallet in Nigeria, Kenya, Ghana, and more.",
  },
  {
    icon: "💬",
    color: "bg-cowry-green/15 text-cowry-green",
    title: "Talk to Pay",
    desc: `Just type or make a voice record of what you want — "Send $50 to a bank account in Nigeria". No forms, no manual entry, no complexity.`,
  },
  {
    icon: "⛓️",
    color: "bg-indigo-500/15 text-indigo-400",
    title: "Cross-Chain Send",
    desc: "Send Celo USDC or USDm to anyone, they receive USDC on Ethereum, Base, Arbitrum, and 8 more chains.",
  },
  {
    icon: "🤖",
    color: "bg-cowry-green/15 text-cowry-green",
    title: "AI-Powered",
    desc: "An onchain AI agent, registered with Self Agent ID (ERC-8004), parses your intent and executes.",
  },
  {
    icon: "🛡️",
    color: "bg-blue-500/15 text-blue-400",
    title: "Always Confirm",
    desc: "No transaction ever executes without your explicit approval. You stay in control at every step.",
  },
  {
    icon: "⚡",
    color: "bg-yellow-500/15 text-yellow-400",
    title: "Built on Celo",
    desc: "Sub-cent fees, instant finality, and native MiniPay support, built for everyday payments and remittances.",
  },
];

const STEPS = [
  { n: 1, title: "Open Cowry", desc: "Works on MiniPay. Your wallet connects automatically, no sign-up needed." },
  { n: 2, title: "Grant Cowry AI access", desc: "One-time approval lets the AI agent execute payments on your behalf." },
  { n: 3, title: "Type what you want", desc: `Say "Send $50 to a bank account in Nigeria" or "Bridge 20 USDC to Base".` },
  { n: 4, title: "Tap Confirm", desc: "Review the preview and tap confirm. Cowry handles the rest." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cowry-dark text-white overflow-x-hidden">

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-cowry-dark/90 backdrop-blur-md border-b border-cowry-border">
        <span className="font-black text-xl tracking-tight text-white">
          CowryPay<span className="text-cowry-green">.</span>
        </span>
        <div className="flex items-center gap-3">
          <span className="text-cowry-muted text-lg cursor-pointer hover:text-white transition-colors">⚙</span>
          <Link
            href="/app"
            className="text-sm font-semibold bg-cowry-green text-black px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
          >
            Open App →
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-glow-green pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-cowry-card border border-cowry-border rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-cowry-green inline-block" />
          <span className="text-xs font-medium text-white tracking-wide">Talk. Send. Automate.</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black leading-tight mb-5 max-w-3xl mx-auto">
          Send money as easily as{" "}
          <span className="text-cowry-green">sending a message</span>
        </h1>

        <p className="max-w-md mx-auto text-cowry-muted text-sm sm:text-base leading-relaxed mb-10">
          CowryPay is an AI-powered crypto payment app built on Celo. Send
          money to a bank account abroad, Send Celo USDC to another chain, or
          check your balance, just type what you want.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <Link
            href="/app"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-cowry-green text-black font-bold px-8 py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
          >
            Launch App →
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-cowry-border text-white font-medium px-8 py-3 rounded-full text-sm hover:border-cowry-green/40 transition-colors"
          >
            See how it works
          </a>
        </div>

        {/* ── Supported Currencies ──────────────────────────────────────── */}
        <div className="mb-10">
          <p className="text-cowry-muted text-xs font-semibold tracking-widest uppercase mb-5">
            Supported Currencies
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {CURRENCIES.map((c) => (
              <div
                key={c.code}
                className="flex items-center gap-2 bg-cowry-card border border-cowry-border rounded-full px-4 py-2"
              >
                <span className="text-xl leading-none">{c.flag}</span>
                <span className="text-sm font-semibold text-white">{c.code}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Supported Chains ─────────────────────────────────────────── */}
        <div className="mb-16">
          <p className="text-cowry-muted text-xs font-semibold tracking-widest uppercase mb-5">
            Supported Chains for Cross-Chain Send
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {CHAINS.map((c) => (
              <div
                key={c}
                className="flex items-center gap-2 bg-cowry-card border border-cowry-border rounded-full px-4 py-2"
              >
                <span className="text-sm font-medium text-cowry-muted">{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Chat Demo ─────────────────────────────────────────────────── */}
        <div className="max-w-sm mx-auto">
          <div className="bg-cowry-card border border-cowry-border rounded-3xl overflow-hidden">
            {/* Chat messages */}
            <div className="p-5 space-y-3">
              {/* User message */}
              <div className="flex justify-end">
                <div className="bg-cowry-green text-black font-medium text-xs px-4 py-2.5 rounded-2xl rounded-br-sm max-w-[80%]">
                  Send $50 to a bank account in Nigeria
                </div>
              </div>
              <div className="text-right">
                <span className="text-cowry-muted text-[10px]">10:23am</span>
              </div>

              {/* Bot message */}
              <div className="flex justify-start">
                <div className="bg-cowry-darker border border-cowry-border text-cowry-muted text-xs px-4 py-2.5 rounded-2xl rounded-bl-sm max-w-[80%]">
                  Got it. Which bank and account number should I send to?
                </div>
              </div>
              <div className="text-left">
                <span className="text-cowry-muted text-[10px]">10:23am</span>
              </div>

              {/* User message */}
              <div className="flex justify-end">
                <div className="bg-cowry-green text-black font-medium text-xs px-4 py-2.5 rounded-2xl rounded-br-sm max-w-[80%]">
                  0706435785, Bank Opay
                </div>
              </div>
              <div className="text-right">
                <span className="text-cowry-muted text-[10px]">10:24am</span>
              </div>

              {/* Confirm card */}
              <div className="bg-cowry-darker border border-cowry-border rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-cowry-border">
                  <span className="text-white text-xs font-bold tracking-wide">CONFIRM TRANSFER</span>
                  <span className="bg-cowry-green text-black text-[10px] font-bold px-2 py-0.5 rounded-full">Quote locked</span>
                </div>
                <div className="px-4 py-3 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-cowry-muted">You pay</span>
                    <span className="text-white font-semibold">50.00 USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cowry-muted">Recipient gets</span>
                    <span className="text-white font-semibold">₦75,250.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cowry-muted">To</span>
                    <span className="text-white font-semibold">Godwin Obi Solomon · Opay</span>
                  </div>
                </div>
                <div className="flex gap-2 px-4 pb-4">
                  <button className="flex-1 bg-cowry-green text-black font-bold text-xs py-2 rounded-full">
                    Confirm
                  </button>
                  <button className="flex-1 bg-cowry-card border border-cowry-border text-cowry-muted font-medium text-xs py-2 rounded-full">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-cowry-muted text-xs mt-4">Live on Celo Mainnet</p>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section id="features" className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-cowry-green text-xs font-semibold tracking-widest uppercase mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-black">Everything you need to pay anyone, anywhere</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-cowry-card border border-cowry-border rounded-2xl p-6 hover:border-cowry-green/20 transition-colors"
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-lg mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-white mb-2 text-sm">{f.title}</h3>
                <p className="text-cowry-muted text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────── */}
      <section id="how-it-works" className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-cowry-green text-xs font-semibold tracking-widest uppercase mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-black">Four steps from zero to paid</h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Steps */}
            <div className="flex-1 space-y-6">
              {STEPS.map((s) => (
                <div key={s.n} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cowry-green flex items-center justify-center">
                    <span className="text-black font-black text-xs">{s.n}</span>
                  </div>
                  <div className="bg-cowry-card border border-cowry-border rounded-2xl px-5 py-4 flex-1">
                    <h3 className="font-bold text-white text-sm mb-1">{s.title}</h3>
                    <p className="text-cowry-muted text-xs leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Placeholder for the person image — swap with <Image> when you share it */}
            <div className="flex-1 flex justify-center">
              <div className="w-64 h-80 bg-cowry-card border border-cowry-border rounded-3xl flex items-center justify-center">
                <span className="text-cowry-muted text-sm text-center px-6 leading-relaxed">
                  📱 Person image goes here
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="max-w-2xl mx-auto bg-cowry-card border border-cowry-border rounded-3xl px-8 py-16 text-center">
          <h2 className="text-3xl sm:text-5xl font-black mb-4">
            Ready to try CowryPay?
          </h2>
          <p className="text-cowry-muted text-sm leading-relaxed mb-8 max-w-sm mx-auto">
            Open CowryPay in MiniPay, grant Cowry AI access, and send your
            first payment in under a minute.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 bg-cowry-green text-black font-bold px-8 py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
          >
            Get started, it&apos;s free →
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-cowry-border px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-sm text-white">
              CowryPay<span className="text-cowry-green">.</span>
            </span>
            <span className="text-cowry-muted text-xs">· Talk. Send. Automate.</span>
          </div>
          <p className="text-xs text-cowry-muted">© 2026 CowryPay</p>
        </div>
      </footer>

    </div>
  );
}
