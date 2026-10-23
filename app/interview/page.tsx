"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = { role: "assistant" | "user"; content: string };

type Report = {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  perQuestion: { question: string; feedback: string; suggestedAnswer: string }[];
};

export default function InterviewPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(3);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const answered = messages.filter((m) => m.role === "user").length;

  // 有新訊息、載入狀態或報告時，自動捲到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, report]);

  async function callApi(next: ChatMessage[]) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, messages: next, totalQuestions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "發生錯誤");

      if (data.type === "report") {
        setReport(data.report);
      } else {
        setMessages([...next, { role: "assistant", content: data.content }]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "發生錯誤");
    } finally {
      setLoading(false);
    }
  }

  function start() {
    if (!jobDescription.trim()) return;
    setStarted(true);
    setMessages([]);
    setReport(null);
    callApi([]);
  }

  function send() {
    if (!input.trim() || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: input.trim() }];
    setMessages(next);
    setInput("");
    callApi(next);
  }

  function reset() {
    setStarted(false);
    setMessages([]);
    setReport(null);
    setInput("");
    setError("");
  }

  const fieldClass =
    "rounded-2xl border border-ink/80 bg-paper p-4 outline-none transition focus:shadow-[4px_4px_0_0_var(--accent)]";

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-5 py-12">
      {!started ? (
        /* ───── 設定畫面 ───── */
        <section className="rise flex flex-col gap-6">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">Step 1 / Setup</p>
            <h1 className="font-serif text-4xl font-black tracking-tight md:text-5xl">今天想面哪個職缺？</h1>
            <p className="mt-3 text-ink-soft">貼上職缺描述，面試官會針對它出題。</p>
          </div>

          <textarea
            id="jd"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={10}
            placeholder="例如：資深前端工程師，需熟悉 React、TypeScript、效能優化…"
            className={fieldClass}
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">題數</span>
              {/* 步進器：− 數字 + */}
              <div className="flex items-center rounded-full border border-ink/80">
                <button
                  type="button"
                  aria-label="減少題數"
                  onClick={() => setTotalQuestions((n) => Math.max(1, n - 1))}
                  className="h-10 w-10 rounded-l-full text-lg hover:bg-paper-2"
                >
                  −
                </button>
                <span className="w-10 text-center font-mono">{totalQuestions}</span>
                <button
                  type="button"
                  aria-label="增加題數"
                  onClick={() => setTotalQuestions((n) => Math.min(10, n + 1))}
                  className="h-10 w-10 rounded-r-full text-lg hover:bg-paper-2"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-ink-soft">1–10 題</span>
            </div>

            <button
              onClick={start}
              disabled={!jobDescription.trim()}
              className="rounded-full bg-ink px-7 py-3 font-medium text-paper transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-ink"
            >
              開始面試 →
            </button>
          </div>
        </section>
      ) : (
        /* ───── 面試畫面 ───── */
        <section className="flex flex-1 flex-col gap-6">
          {/* 進度條 */}
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs uppercase tracking-widest text-ink-soft">
              {report ? "完成" : `Q${Math.min(answered + 1, totalQuestions)} / ${totalQuestions}`}
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-2">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${(report ? 1 : answered / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`rise max-w-[85%] whitespace-pre-wrap rounded-3xl px-5 py-3.5 leading-relaxed ${
                  m.role === "user"
                    ? "self-end rounded-br-md bg-ink text-paper"
                    : "self-start rounded-bl-md border border-line bg-paper-2"
                }`}
              >
                {m.content}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-1.5 self-start px-1 text-sm text-ink-soft">
                <span className="dot h-1.5 w-1.5 rounded-full bg-ink" />
                <span className="dot h-1.5 w-1.5 rounded-full bg-ink [animation-delay:0.2s]" />
                <span className="dot h-1.5 w-1.5 rounded-full bg-ink [animation-delay:0.4s]" />
                <span className="ml-1">{answered >= totalQuestions ? "面試官正在評分…" : "面試官思考中…"}</span>
              </div>
            )}
          </div>

          {error && (
            <p className="rounded-2xl border border-accent bg-accent/10 px-4 py-3 text-sm text-accent">
              {error}
            </p>
          )}

          {report ? (
            /* ───── 評分報告 ───── */
            <div className="rise flex flex-col gap-8 rounded-[2rem] border border-ink bg-paper p-7 shadow-[8px_8px_0_0_var(--ink)] md:p-9">
              <div className="flex items-end gap-3">
                <span className="font-serif text-7xl font-black leading-none text-accent">{report.score}</span>
                <span className="pb-2 font-mono text-ink-soft">/ 100</span>
              </div>
              <p className="leading-relaxed">{report.summary}</p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl bg-moss p-5 text-paper">
                  <h2 className="mb-2 font-serif text-lg font-bold">優點</h2>
                  <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
                    {report.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div className="rounded-2xl bg-paper-2 p-5">
                  <h2 className="mb-2 font-serif text-lg font-bold">改進建議</h2>
                  <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
                    {report.improvements?.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              </div>

              {report.perQuestion?.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h2 className="font-serif text-2xl font-black">逐題回饋與建議回答</h2>
                  {report.perQuestion.map((q, i) => (
                    <div key={i} className="flex flex-col gap-3 rounded-2xl border border-line p-5">
                      <p className="font-medium">
                        <span className="mr-2 font-mono text-accent">Q{i + 1}</span>
                        {q.question}
                      </p>
                      <p className="text-sm leading-relaxed text-ink-soft">
                        <b className="text-ink">評語　</b>
                        {q.feedback}
                      </p>
                      <p className="whitespace-pre-wrap rounded-xl bg-paper-2 p-4 text-sm leading-relaxed">
                        <b>建議回答　</b>
                        {q.suggestedAnswer}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={reset}
                className="self-end rounded-full bg-ink px-7 py-3 font-medium text-paper transition hover:bg-accent"
              >
                再練習一次
              </button>
            </div>
          ) : (
            /* ───── 輸入區 ───── */
            <div className="sticky bottom-4 flex items-end gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send();
                }}
                rows={3}
                disabled={loading}
                placeholder="輸入你的回答（Ctrl/⌘ + Enter 送出）"
                className={`${fieldClass} flex-1 disabled:opacity-50`}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="rounded-full bg-accent px-6 py-3 font-medium text-ink transition hover:bg-ink hover:text-paper disabled:opacity-30"
              >
                送出
              </button>
            </div>
          )}
          <div ref={bottomRef} />
        </section>
      )}
    </main>
  );
}
