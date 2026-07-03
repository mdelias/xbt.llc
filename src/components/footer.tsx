export function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-1 px-4 py-6 text-center">
        <p className="text-xs text-[var(--subtle)]">
          &copy; {new Date().getFullYear()} XBT Legal LLC. All rights reserved.
        </p>
        <p className="max-w-lg text-[10px] leading-relaxed text-[var(--subtle)]">
          This website constitutes attorney advertising. Prior results do not
          guarantee a similar outcome. The information presented here is for
          informational purposes only and does not constitute legal advice.
        </p>
      </div>
    </footer>
  );
}