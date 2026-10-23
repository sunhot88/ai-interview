import Link from "next/link";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      {/* 小圓點 + 對話框造型的 logo mark */}
      <span className={`grid h-8 w-8 place-items-center rounded-full transition-transform ${inverted ? "bg-paper" : "bg-ink"} group-hover:-rotate-12`}>
        <span className="h-2.5 w-2.5 rounded-full bg-accent" />
      </span>
      <span className="font-serif text-xl font-black tracking-tight">Mockly</span>
    </Link>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm text-ink-soft md:flex">
          <Link href="/#features" className="hover:text-ink">特色</Link>
          <Link href="/#how" className="hover:text-ink">運作方式</Link>
          <Link href="/#faq" className="hover:text-ink">常見問題</Link>
        </nav>
        <Link
          href="/interview"
          className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition hover:bg-accent"
        >
          開始模擬面試
        </Link>
      </div>
    </header>
  );
}
