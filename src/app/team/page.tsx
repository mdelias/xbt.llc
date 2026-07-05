import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team',
  description:
    'Direct, experienced counsel at XBT Legal. No layers of associates — every matter receives principal attention.',
  openGraph: {
    title: 'Team — XBT Legal',
    description:
      'Direct, experienced counsel at XBT Legal. No layers of associates — every matter receives principal attention.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Team — XBT Legal',
    description:
      'Direct, experienced counsel at XBT Legal. No layers of associates — every matter receives principal attention.',
  },
};

export default function TeamPage() {
  return (
    <section className="px-4 py-12 sm:py-20">
      <h1 className="text-3xl font-light sm:text-4xl">Team</h1>
      <div className="mt-3 h-0.5 w-12 bg-[var(--accent)]" />
      <p className="mt-6 max-w-lg text-sm leading-relaxed text-[var(--muted)]">
        Direct, experienced counsel. No layers of associates — every matter
        receives principal attention.
      </p>

      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        <div>
          <div aria-hidden="true" className="mb-3 aspect-square w-full rounded-lg bg-[var(--surface)] flex items-center justify-center text-[10px] text-[var(--subtle)]">
            photo
          </div>
          <h3 className="text-base font-medium text-[var(--foreground)]">
            Matthew Elias
          </h3>
          <p className="mt-0.5 text-xs text-[var(--subtle)]">
            Founder &amp; Attorney
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
            Wyoming-licensed. Practice focused on digital asset regulation,
            securities law, and complex corporate structuring. First US attorney
            to register a digital asset with a state regulator (2023).
          </p>
        </div>
        <div>
          <div aria-hidden="true" className="mb-3 aspect-square w-full rounded-lg bg-[var(--surface)] flex items-center justify-center text-[10px] text-[var(--subtle)]">
            photo
          </div>
          <h3 className="text-base font-medium text-[var(--foreground)]">
            XBT Legal LLC
          </h3>
          <p className="mt-0.5 text-xs text-[var(--subtle)]">
            Virtual practice
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
            A distributed legal practice serving clients nationwide from a
            Wyoming base. Supported by a network of co-counsel and subject
            matter experts across corporate, tax, and litigation disciplines.
          </p>
        </div>
      </div>
    </section>
  );
}