"use client";

import { useSyncExternalStore } from "react";

// BYOK：使用者自己的 OpenAI API key 只存在瀏覽器 localStorage，
// 每次呼叫我們的 API 時用這個 header 帶上來
export const API_KEY_HEADER = "x-openai-api-key";
const STORAGE_KEY = "mockly:openai-api-key";
const CHANGE_EVENT = "mockly:api-key-change";
export const OPEN_SETTINGS_EVENT = "mockly:open-api-key-settings";

export function getApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setApiKey(key: string) {
  try {
    if (key) localStorage.setItem(STORAGE_KEY, key);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {}
  // storage 事件只會在「其他分頁」觸發，同分頁要自己發通知
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function openApiKeySettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

// 伺服器端渲染時沒有 localStorage，回傳空字串
export function useApiKey(): string {
  return useSyncExternalStore(subscribe, getApiKey, () => "");
}
