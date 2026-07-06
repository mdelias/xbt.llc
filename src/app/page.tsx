import { AsciiHero } from '@/components/ascii-hero';

export default function Home() {
  return (
    <>
      {/* hero */}
      <section className="relative flex flex-col items-center overflow-hidden px-6 py-24 text-center sm:py-36">
        <div className="absolute inset-0">
          <AsciiHero />
        </div>
        {/* narrow backdrop behind the text only */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[5] h-72 w-[90vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-[#050508]/90 shadow-[0_0_100px_50px_#050508]" />
        <div className="relative z-10">
          <h1 className="text-5xl font-bold tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] sm:text-6xl">
            Law built for{' '}
            <span className="bg-gradient-to-br from-[#5af0ff] via-[#4a9eff] to-[#3a7acc] bg-clip-text font-extrabold text-transparent drop-shadow-[0_2px_8px_rgba(0,80,200,0.6)]">
              digital assets
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#ccc] drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] sm:text-lg">
            Regulatory strategy, corporate formation, securities compliance, and
            litigation defense at the intersection of law and blockchain
            technology.
          </p>
          <div className="mt-12 flex justify-center gap-6">
            <a
              href="/contact"
              className="rounded-lg bg-[#3a8acc] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#3a8acc]/30 transition-all hover:brightness-110 hover:shadow-xl hover:shadow-[#3a8acc]/40 active:scale-[0.97]"
            >
              Schedule a consultation
            </a>
            <a
              href="/services"
              className="rounded-lg border border-[#444] bg-[#111]/80 px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#aaa] shadow-lg backdrop-blur-sm transition-all hover:border-[#666] hover:text-white active:scale-[0.97]"
            >
              View services
            </a>
          </div>
        </div>
      </section>

      {/* stats */}
      <section className="flex justify-center gap-12 border-y border-[var(--border)] py-12 sm:gap-24">
        {[
          { num: '2017', label: 'Practicing since' },
          { num: 'First', label: 'Digital asset registration' },
          { num: '40+', label: 'Clients advised' },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-4xl font-light text-[var(--foreground)] sm:text-5xl">
              {s.num}
            </div>
            <div className="mt-2 text-sm text-[var(--subtle)]">{s.label}</div>
          </div>
        ))}
      </section>

      {/* disclosure */}
      <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-[var(--subtle)]">
        This website constitutes attorney advertising. Prior results do not
        guarantee a similar outcome. The information presented here is for
        informational purposes only and does not constitute legal advice.
      </p>
    </>
  );
}