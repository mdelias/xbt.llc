'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/team', label: 'Team' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-[var(--foreground)]"
        >
          XBT<span className="text-[var(--muted)]">Legal</span>
        </Link>
        <div className="hidden items-center gap-6 sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-xs transition-colors ${
                pathname === l.href || pathname.startsWith(l.href + '/')
                  ? 'text-[var(--accent-light)]'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="ml-2 rounded-md px-3 py-1.5 text-xs text-[var(--muted)] transition-colors hover:bg-[var(--surface)]"
            aria-label="Toggle theme"
          >
            {mounted ? (theme === 'dark' ? '☀️' : '🌙') : ''}
          </button>
        </div>
        {/* mobile toggle + theme */}
        <div className="flex items-center gap-3 sm:hidden">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-md px-2 py-1.5 text-xs text-[var(--muted)] hover:bg-[var(--surface)]"
            aria-label="Toggle theme"
          >
            {mounted ? (theme === 'dark' ? '☀️' : '🌙') : ''}
          </button>
        </div>
      </nav>
      {/* mobile nav bar */}
      <div className="flex justify-center gap-4 border-t border-[var(--border)] px-4 py-2 sm:hidden">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`text-xs transition-colors ${
              pathname === l.href
                ? 'text-[var(--accent-light)]'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </header>
  );
}