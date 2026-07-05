import { AsciiHero } from '@/components/ascii-hero';

export default function Home() {
  return (
    <>
      {/* hero */}
      <section className="relative flex flex-col items-center overflow-hidden px-4 py-20 text-center sm:py-28">
        <div className="absolute inset-0">
          <AsciiHero />
        </div>
        {/* backdrop that gives text a clean reading surface over the ASCII */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] mx-auto h-72 max-w-xl bg-gradient-to-b from-[var(--background)] via-[var(--background)]/60 to-transparent sm:h-80" />
        <div className="relative z-10">
          <h1 className="text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
            Law built for{' '}
            <span className="bg-gradient-to-r from-[var(--accent-light)] to-[var(--accent)] bg-clip-text font-bold text-transparent">
              digital assets
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            Regulatory strategy, corporate formation, securities compliance, and
            litigation defense at the intersection of law and blockchain
            technology.
          </p>
          <div className="mt-8 flex gap-3">
            <a
              href="/contact"
              className="rounded bg-[var(--accent)] px-5 py-2.5 text-xs font-semibold text-white shadow-sm shadow-[var(--accent)]/30 transition-all hover:brightness-110"
            >
              Schedule a consultation
            </a>
            <a
              href="/services"
              className="rounded border border-[var(--border)] px-5 py-2.5 text-xs font-medium text-[var(--muted)] transition-colors hover:border-[var(--subtle)] hover:text-[var(--foreground)]"
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