'use client';

import { useState } from 'react';

const fields = [
  { name: 'name', type: 'text', label: 'Name' },
  { name: 'email', type: 'email', label: 'Email' },
  { name: 'subject', type: 'text', label: 'Subject' },
] as const;

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const body = Object.fromEntries(data.entries());

    // ponytail: Formspree-style POST, swap endpoint when real backend exists
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setSent(true);
      form.reset();
    }
  }

  return (
    <section className="px-4 py-12 sm:py-20">
      <h1 className="text-3xl font-light sm:text-4xl">Contact</h1>
      <div className="mt-3 h-0.5 w-12 bg-[var(--accent)]" />
      <p className="mt-6 max-w-lg text-sm leading-relaxed text-[var(--muted)]">
        Available for consultation by referral or direct inquiry. Initial
        consultations are treated as confidential and privileged from first
        contact.
      </p>

      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fields.map((f) => (
            <input
              key={f.name}
              type={f.type}
              name={f.name}
              placeholder={f.label}
              required
              minLength={2}
              className="rounded border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--subtle)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          ))}
          <textarea
            name="message"
            placeholder="How can we help?"
            required
            minLength={10}
            rows={5}
            className="resize-y rounded border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--subtle)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
          <button
            type="submit"
            disabled={sent}
            className="self-start rounded bg-[var(--accent-bg)] px-5 py-2.5 text-xs font-medium text-[var(--accent-light)] transition-colors hover:bg-[var(--accent)] hover:text-white disabled:opacity-50"
          >
            {sent ? 'Sent ✓' : 'Send inquiry'}
          </button>
        </form>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="text-sm font-medium text-[var(--foreground)]">
              Email
            </h3>
            <p className="mt-1 text-xs text-[var(--muted)]">mde@xbt.llc</p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="text-sm font-medium text-[var(--foreground)]">
              Location
            </h3>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Cheyenne, Wyoming
            </p>
            <p className="mt-2 text-[10px] text-[var(--subtle)]">
              By appointment only. Virtual consultations available.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-10 max-w-lg text-[10px] leading-relaxed text-[var(--subtle)]">
        Contacting us does not create an attorney-client relationship. Please do
        not send confidential information through this form. Attorney-client
        relationship is established only by written engagement agreement.
      </p>
    </section>
  );
}