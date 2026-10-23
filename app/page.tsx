import Link from "next/link";

const marqueeItems = [
  "前端工程師",
  "產品經理",
  "資料分析師",
  "UI/UX 設計師",
  "後端工程師",
  "行銷企劃",
  "業務代表",
  "專案經理",
];

const features = [
  {
    tag: "01",
    title: "為職缺量身出題",
    body: "貼上任何職缺描述，面試官會依據技能需求與職責，混合技術題與情境題。",
    span: "md:col-span-2",
    dark: true,
  },
  {
    tag: "02",
    title: "會追問的面試官",
    body: "回答太淺？它會順著你的答案繼續挖，就像真人面試。",
    span: "",
    dark: false,
  },
  {
    tag: "03",
    title: "題數自己決定",
    body: "時間有限就 1 題，想拼全真演練就 10 題。",
    span: "",
    dark: false,
  },
  {
    tag: "04",
    title: "逐題示範回答",
    body: "結束後不只給分數，更告訴你每一題「更好的回答」長什麼樣子，可以直接拿來改寫成自己的版本。",
    span: "md:col-span-2",
    dark: false,
    accent: true,
  },
];

const steps = [
  { n: "1", title: "貼上職缺描述", body: "把你想應徵的職缺文字貼進來，選擇想練習幾題。" },
  { n: "2", title: "與面試官對談", body: "一題一題回答，面試官會依你的答案追問或換主題。" },
  { n: "3", title: "取得評分與建議", body: "拿到總分、優缺點，以及每題的更佳回答方式。" },
];

const faqs = [
  {
    q: "需要註冊或付費嗎？",
    a: "不需要。直接進入面試模擬器，貼上職缺描述就能開始。",
  },
  {
    q: "我的職缺描述和回答會被保存嗎？",
    a: "對話只存在你的瀏覽器畫面中，伺服器不會保存紀錄；內容會送往 OpenAI 產生題目與評分。",
  },
  {
    q: "評分準確嗎？",
    a: "評分由 AI 根據職缺需求與你的回答產生，適合用來找出可改進之處，但不代表真實面試結果。",
  },
  {
    q: "可以練習哪些職缺？",
    a: "任何有文字描述的職缺都可以，不限產業與職級。",
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      {/* ───── Hero ───── */}
      <section className="relative overflow-hidden border-b border-line">
        {/* 背景裝飾：巨大的朱紅圓與細格線 */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-accent/90 blur-[2px]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 md:grid-cols-[1.15fr_1fr] md:py-28">
          <div className="rise">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink/20 bg-paper/70 px-3 py-1 font-mono text-xs uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              AI Interview Simulator
            </p>
            <h1 className="font-serif text-5xl font-black leading-[1.08] tracking-tight md:text-7xl">
              面試的答案，
              <br />
              先在這裡
              <span className="relative inline-block">
                <span className="relative z-10">演練</span>
                <span className="absolute inset-x-0 bottom-1 -z-0 h-4 -rotate-1 bg-accent/80 md:bottom-2 md:h-6" />
              </span>
              。
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-ink-soft">
              貼上職缺描述，AI 面試官針對該職缺出題、追問，最後給你評分，以及每一題更好的回答方式。
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/interview"
                className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-base font-medium text-paper transition hover:bg-accent"
              >
                立即開始模擬面試
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link href="/#how" className="text-sm underline underline-offset-4 hover:text-accent">
                看看如何運作
              </Link>
            </div>
          </div>

          {/* 產品預覽：一段擬真的對話卡片 */}
          <div className="rise relative [animation-delay:0.15s]">
            <div className="rotate-1 rounded-3xl border border-ink bg-paper p-5 shadow-[8px_8px_0_0_var(--ink)]">
              <div className="mb-4 flex items-center justify-between border-b border-line pb-3 font-mono text-xs text-ink-soft">
                <span>面試進行中</span>
                <span>Q2 / 3</span>
              </div>
              <div className="flex flex-col gap-3 text-sm">
                <div className="max-w-[88%] rounded-2xl rounded-bl-sm bg-paper-2 px-4 py-3">
                  你提到曾優化過頁面效能，能說說你是怎麼定位瓶頸的嗎？
                </div>
                <div className="max-w-[88%] self-end rounded-2xl rounded-br-sm bg-ink px-4 py-3 text-paper">
                  我先用 Lighthouse 和 Performance 面板找出最長的任務⋯
                </div>
                <div className="flex items-center gap-1.5 px-1 text-ink-soft">
                  <span className="dot h-1.5 w-1.5 rounded-full bg-ink" />
                  <span className="dot h-1.5 w-1.5 rounded-full bg-ink [animation-delay:0.2s]" />
                  <span className="dot h-1.5 w-1.5 rounded-full bg-ink [animation-delay:0.4s]" />
                  <span className="ml-1 text-xs">面試官正在思考追問</span>
                </div>
              </div>
            </div>
            {/* 浮動分數徽章 */}
            <div className="absolute -bottom-6 -left-4 -rotate-6 rounded-2xl bg-moss px-5 py-3 text-paper shadow-lg md:-left-8">
              <div className="font-mono text-[10px] uppercase tracking-widest text-paper/60">總分</div>
              <div className="font-serif text-3xl font-black leading-none">
                86<span className="text-base font-medium text-paper/60"> / 100</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── 跑馬燈 ───── */}
      <div className="overflow-hidden border-b border-line bg-ink py-4 text-paper">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap font-serif text-lg">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="flex items-center gap-10">
              {item}
              <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ───── 特色 ───── */}
      <section id="features" className="mx-auto max-w-6xl scroll-mt-16 px-5 py-24">
        <div className="mb-12 max-w-xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">Features</p>
          <h2 className="font-serif text-4xl font-black tracking-tight md:text-5xl">
            不是題庫，是一位
            <br />
            懂你職缺的面試官
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.tag}
              className={`${f.span} flex min-h-56 flex-col justify-between rounded-3xl border p-7 transition hover:-translate-y-1 ${
                f.dark
                  ? "border-ink bg-ink text-paper"
                  : f.accent
                    ? "border-ink bg-accent text-ink"
                    : "border-line bg-paper-2"
              }`}
            >
              <span className="font-mono text-xs opacity-60">{f.tag}</span>
              <div>
                <h3 className="font-serif text-2xl font-bold">{f.title}</h3>
                <p className={`mt-2 max-w-md text-sm leading-relaxed ${f.dark ? "text-paper/70" : "text-ink/70"}`}>
                  {f.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ───── 運作方式 ───── */}
      <section id="how" className="scroll-mt-16 border-y border-line bg-paper-2">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">How it works</p>
          <h2 className="mb-14 font-serif text-4xl font-black tracking-tight md:text-5xl">三步，完成一場面試</h2>
          <ol className="grid gap-10 md:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} className="relative border-t-2 border-ink pt-6">
                <span className="font-serif text-7xl font-black leading-none text-accent">{s.n}</span>
                <h3 className="mt-4 font-serif text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───── 報告預覽 ───── */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 md:grid-cols-2">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">The report</p>
          <h2 className="font-serif text-4xl font-black tracking-tight md:text-5xl">
            看見差距，
            <br />
            也看見答案
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-ink-soft">
            每一題都附上評語與示範回答。你可以對照自己的回答，學會怎麼把經驗講得更有結構、更有說服力。
          </p>
        </div>
        <div className="-rotate-1 rounded-3xl border border-ink bg-paper p-6 shadow-[8px_8px_0_0_var(--accent)]">
          <p className="font-medium">Q1. 請分享一次你處理跨部門衝突的經驗。</p>
          <p className="mt-3 text-sm text-ink-soft">
            <b className="text-ink">評語：</b>情境描述清楚，但缺少你個人具體的行動與成果數據。
          </p>
          <div className="mt-3 rounded-2xl bg-moss p-4 text-sm leading-relaxed text-paper">
            <b>建議回答：</b>
            當時設計與工程對時程有衝突，我先分別訪談雙方的限制，再提出分階段上線方案，最後讓交付時間縮短了兩週⋯
          </div>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-16 px-5 pb-24">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">FAQ</p>
        <h2 className="mb-8 font-serif text-4xl font-black tracking-tight">常見問題</h2>
        <div className="divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                {f.q}
                <span className="text-2xl transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ───── 結尾 CTA ───── */}
      <section className="px-5 pb-24">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-ink px-8 py-16 text-center text-paper md:py-24">
          <h2 className="mx-auto max-w-2xl font-serif text-4xl font-black leading-tight tracking-tight md:text-6xl">
            下一場面試，
            <br />
            <span className="text-accent">不會是第一次。</span>
          </h2>
          <Link
            href="/interview"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-accent px-8 py-4 font-medium text-ink transition hover:bg-paper"
          >
            免費開始練習 →
          </Link>
        </div>
      </section>
    </main>
  );
}
