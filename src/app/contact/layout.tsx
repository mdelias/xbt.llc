import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Schedule a consultation with XBT Legal. Available for referral and direct inquiry.',
  openGraph: {
    title: 'Contact — XBT Legal',
    description:
      'Schedule a consultation with XBT Legal. Available for referral and direct inquiry.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact — XBT Legal',
    description:
      'Schedule a consultation with XBT Legal. Available for referral and direct inquiry.',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
