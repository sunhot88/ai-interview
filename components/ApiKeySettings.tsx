"use client";

import { useEffect, useState } from "react";
import { OPEN_SETTINGS_EVENT, setApiKey, useApiKey } from "@/lib/apiKey";

export default function ApiKeySettings() {
  const saved = useApiKey();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  function show() {
    setValue(saved);
    setOpen(true);
  }

  // 讓其他頁面（例如面試頁）可以透過事件打開設定視窗
  useEffect(() => {
    const onOpen = () => show();
    window.addEventListener(OPEN_SETTINGS_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, onOpen);
  });

  function save() {
    setApiKey(value.trim());
    setOpen(false);
  }

  function clear() {
    setApiKey("");
    setValue("");
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={show}
        className="flex items-center gap-2 rounded-full border border-ink/80 px-4 py-2 text-sm font-medium transition hover:bg-paper-2"
      >
        <span className={`h-2 w-2 rounded-full ${saved ? "bg-moss" : "bg-accent"}`} />
        API Key
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-5"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="OpenAI API Key 設定"
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-md flex-col gap-4 rounded-3xl border border-ink bg-paper p-6 shadow-[8px_8px_0_0_var(--ink)]"
          >
            <h2 className="font-serif text-2xl font-black">OpenAI API Key</h2>
            <p className="text-sm leading-relaxed text-ink-soft">
              請輸入你自己的 OpenAI API key。它只會儲存在這個瀏覽器的 localStorage，
              每次面試時透過請求標頭送到我們的伺服器轉發給 OpenAI，伺服器不會儲存它。
            </p>
            <input
              type="password"
              autoComplete="off"
              spellCheck={false}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && value.trim()) save();
              }}
              placeholder="sk-..."
              className="rounded-2xl border border-ink/80 bg-paper p-3 font-mono text-sm outline-none transition focus:shadow-[4px_4px_0_0_var(--accent)]"
            />
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={clear}
                disabled={!saved}
                className="text-sm text-ink-soft underline disabled:opacity-30"
              >
                清除 Key
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-ink/80 px-5 py-2 text-sm hover:bg-paper-2"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={save}
                  disabled={!value.trim()}
                  className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition hover:bg-accent disabled:opacity-30"
                >
                  儲存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
