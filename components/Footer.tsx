import Link from "next/link";
import { Logo } from "./Header";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Logo inverted />
          <p className="max-w-xs text-sm leading-relaxed text-paper/60">
            把面試前的緊張，換成一次又一次的練習。
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <h3 className="font-mono text-xs uppercase tracking-widest text-paper/40">產品</h3>
          <Link href="/#features" className="text-paper/80 hover:text-accent">特色</Link>
          <Link href="/#how" className="text-paper/80 hover:text-accent">運作方式</Link>
          <Link href="/#faq" className="text-paper/80 hover:text-accent">常見問題</Link>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <h3 className="font-mono text-xs uppercase tracking-widest text-paper/40">開始</h3>
          <Link href="/interview" className="text-paper/80 hover:text-accent">進入面試模擬器 →</Link>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 font-mono text-xs text-paper/40 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Mockly. All rights reserved.</span>
          <span>AI 提供的評分與建議僅供練習參考。</span>
        </div>
      </div>
    </footer>
  );
}
