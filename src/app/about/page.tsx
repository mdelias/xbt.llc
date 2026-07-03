import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Wyoming-licensed attorney Matthew Elias — digital asset regulation, securities law, and corporate structuring.',
};

export default function AboutPage() {
  return (
    <section className="px-4 py-12 sm:py-20">
      <h1 className="text-3xl font-light sm:text-4xl">About</h1>
      <div className="mt-3 h-0.5 w-12 bg-[var(--accent)]" />

      <p className="mt-8 text-lg leading-relaxed text-[var(--foreground)] sm:text-xl">
        A Wyoming-licensed attorney specializing in the legal challenges of
        blockchain, digital assets, and decentralized technologies.
      </p>

      <div className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--muted)]">
        <p>
          Matthew Elias brings deep expertise at the intersection of law and
          emerging technology. As the first US attorney to register a digital
          asset with a state regulator, he has navigated the frontier of
          securities regulation, corporate structuring, and litigation for
          blockchain-native companies and funds since 2017.
        </p>
        <p>
          His practice spans corporate formation for token issuers and DAOs, SEC
          enforcement defense, digital asset trust structuring, and regulatory
          compliance for decentralized protocols. Clients range from early-stage
          protocols to institutional market participants.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
          <h3 className="text-sm font-medium text-[var(--foreground)]">
            Wyoming expertise
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
            Wyoming&apos;s DAO LLC, digital asset amendments, and special
            purpose depository framework — interpreted and applied for clients
            since inception.
          </p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
          <h3 className="text-sm font-medium text-[var(--foreground)]">
            National practice
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
            Federal securities litigation, SEC investigations, and multistate
            regulatory counseling from a Wyoming-licensed base.
          </p>
        </div>
      </div>
    </section>
  );
}