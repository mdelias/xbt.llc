import Script from 'next/script';

const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

// ponytail: Plausible-only, cookie-free. Swap provider by changing this one file.
export function Analytics() {
  if (!domain) return null;

  return (
    <Script
      src="https://plausible.io/js/script.js"
      data-domain={domain}
      strategy="lazyOnload"
    />
  );
}
