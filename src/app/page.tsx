import { AsciiHero } from '@/components/ascii-hero';

export default function Home() {
  return (
    <>
      {/* hero */}
      <section className="relative flex flex-col items-center overflow-hidden px-4 py-20 text-center sm:py-28">
        <div className="absolute inset-0">
          <AsciiHero />
        </div>
        {/* solid backdrop behind text for readability over ASCII */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] mx-auto h-80 w-full max-w-2xl rounded-b-3xl bg-gradient-to-b from-[#050508] via-[#050508]/95 to-[#050508]/0" />
        <div className="relative z-10">
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] sm:text-5xl">
            Law built for{' '}
            <span className="bg-gradient-to-br from-[#5af0ff] via-[#4a9eff] to-[#3a7acc] bg-clip-text font-extrabold text-transparent drop-shadow-[0_2px_8px_rgba(0,80,200,0.6)]">
              digital assets
            </span>
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-[#ccc] drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] sm:text-base">
            Regulatory strategy, corporate formation, securities compliance, and
            litigation defense at the intersection of law and blockchain
            technology.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <a
              href="/contact"
              className="rounded-lg bg-[#3a8acc] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#3a8acc]/30 transition-all hover:brightness-110 hover:shadow-xl hover:shadow-[#3a8acc]/40 active:scale-[0.97]"
            >
              Schedule a consultation
            </a>
            <a
              href="/services"
              className="rounded-lg border border-[#333] bg-[#111]/80 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#999] shadow-lg backdrop-blur-sm transition-all hover:border-[#555] hover:text-white active:scale-[0.97]"
            >
              View services
            </a>
          </div>
        </div>
      </section>

      {/* stats */}
      <section className="flex justify-center gap-8 border-y border-[var(--border)] py-8 sm:gap-16">
        {[
          { num: '2017', label: 'Practicing since' },
          { num: 'First', label: 'Digital asset registration' },
          { num: '40+', label: 'Clients advised' },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl font-light text-[var(--foreground)] sm:text-4xl">
              {s.num}
            </div>
            <div className="mt-1 text-xs text-[var(--subtle)]">{s.label}</div>
          </div>
        ))}
      </section>

      {/* disclosure */}
      <p className="mx-auto mt-8 max-w-lg text-center text-[10px] leading-relaxed text-[var(--subtle)]">
        This website constitutes attorney advertising. Prior results do not
        guarantee a similar outcome. The information presented here is for
        informational purposes only and does not constitute legal advice.
      </p>
    </>
  );
}