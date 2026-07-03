import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Legal counsel across the full lifecycle of digital asset ventures — from formation through enforcement defense.',
};

const services = [
  {
    title: 'Corporate & Securities',
    desc: 'Wyoming LLCs, DAO LLCs, Series LLCs, fund formation, 506(b)/506(c) offerings, Reg A+, and S-1 registration.',
  },
  {
    title: 'Digital Asset Registration',
    desc: 'State-level digital asset classification, registration strategy, and the only on-chain asset registration precedent in the United States.',
  },
  {
    title: 'SEC Enforcement Defense',
    desc: 'Representation in SEC investigations and enforcement actions, Wells submissions, and federal securities litigation for digital asset issuers and exchanges.',
  },
  {
    title: 'Trust & Estate',
    desc: 'Digital asset trust formation, qualified custodian structuring, special purpose depository charter navigation, and succession planning for crypto estates.',
  },
  {
    title: 'Regulatory Compliance',
    desc: 'BSA/AML program design, state money transmitter licensing, OFAC sanctions review, and ongoing compliance monitoring for digital asset businesses.',
  },
  {
    title: 'Litigation',
    desc: 'Federal and state court litigation involving digital assets, smart contract disputes, bankruptcy adversary proceedings, and class action defense.',
  },
];

export default function ServicesPage() {
  return (
    <section className="px-4 py-12 sm:py-20">
      <h1 className="text-3xl font-light sm:text-4xl">Services</h1>
      <div className="mt-3 h-0.5 w-12 bg-[var(--accent)]" />
      <p className="mt-6 max-w-lg text-sm leading-relaxed text-[var(--muted)]">
        Legal counsel across the full lifecycle of digital asset ventures — from
        formation through enforcement defense.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div
            key={s.title}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6"
          >
            <div className="mb-4 h-8 w-8 rounded bg-[var(--accent-bg)]" />
            <h3 className="text-sm font-medium text-[var(--foreground)]">
              {s.title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}