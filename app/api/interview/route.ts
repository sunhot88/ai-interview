import OpenAI from "openai";

// ───────────── 常數設定 ─────────────

// 前端沒傳題數（或傳了無效值）時的預設題數
const DEFAULT_TOTAL = 3;
// 題數上限，避免有人傳超大數字造成對話過長、費用暴增
const MAX_TOTAL = 10;
// 使用的模型；可在 .env.local 設定 OPENAI_MODEL 覆蓋，沒設就用 gpt-4o-mini
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

// ───────────── 型別定義 ─────────────

// 對話中的一則訊息：assistant = 面試官（AI），user = 求職者
type ChatMessage = { role: "assistant" | "user"; content: string };

// 面試結束後回傳給前端的評分報告結構
type Report = {
  score: number; // 總分 0–100
  summary: string; // 整體評語
  strengths: string[]; // 優點
  improvements: string[]; // 改進建議
  // 逐題回饋：題目、對該題回答的評語、較佳的示範回答
  perQuestion: { question: string; feedback: string; suggestedAnswer: string }[];
};

// 建立 OpenAI client。這個檔案只在伺服器端執行，所以 API key 不會洩漏到瀏覽器
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ───────────── 工具函式 ─────────────

// 產生「面試官人設」的 system prompt。
// 每次呼叫 OpenAI 都會帶上它，因為 API 本身沒有記憶，必須每次重新告訴模型它的角色與職缺
function systemPrompt(jobDescription: string, total: number) {
  return `你是一位專業、友善但嚴謹的面試官，正在面試應徵以下職缺的候選人。
請使用繁體中文，每次只問一個問題，不要回答自己的問題，也不要給評語。

【職缺描述】
${jobDescription}

面試規則：
- 整場面試共 ${total} 題。
- 根據職缺需求出題，可混合技術與情境/行為問題。
- 若候選人上一題回答不夠深入，可針對其回答追問；否則進入下一個主題。
- 只輸出問題本身。`;
}

// 驗證前端傳來的 messages 是否為合法的 ChatMessage[]（type guard）。
// 前端傳來的資料不可信，必須檢查：是陣列、每個元素都有合法的 role 和字串 content
function isValidMessages(value: unknown): value is ChatMessage[] {
  return (
    Array.isArray(value) &&
    value.every(
      (m) =>
        m &&
        (m.role === "assistant" || m.role === "user") &&
        typeof m.content === "string"
    )
  );
}

// ───────────── API 主體：POST /api/interview ─────────────
// 此 API 是「無狀態」的：伺服器不記任何東西，
// 整段對話紀錄由前端每次請求時完整帶上來。
export async function POST(request: Request) {
  // 沒設定 API key 就直接回 500，避免白白打 OpenAI 然後得到難懂的錯誤
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "缺少 OPENAI_API_KEY" }, { status: 500 });
  }

  // 解析 request body；若不是合法 JSON 則 catch 成 null，後面會被欄位檢查擋下
  const body = await request.json().catch(() => null);

  // 職缺描述：必須是字串，並去除前後空白
  const jobDescription =
    typeof body?.jobDescription === "string" ? body.jobDescription.trim() : "";

  // 對話紀錄：先標成 unknown，等通過 isValidMessages 驗證後才有正確型別。
  // 面試剛開始時前端會傳空陣列（或不傳）
  const messages: unknown = body?.messages ?? [];

  // 題數：轉成整數 → 無效值（NaN / 0）退回預設 3 → 再夾在 1～MAX_TOTAL 之間
  const total = Math.min(
    MAX_TOTAL,
    Math.max(1, Math.floor(Number(body?.totalQuestions)) || DEFAULT_TOTAL)
  );

  // 輸入驗證：不合法就回 400（客戶端錯誤）
  if (!jobDescription) {
    return Response.json({ error: "請提供職缺描述" }, { status: 400 });
  }
  if (!isValidMessages(messages)) {
    return Response.json({ error: "messages 格式錯誤" }, { status: 400 });
  }

  // 求職者已經回答了幾題 = role 為 user 的訊息數量。
  // 這是整個流程的「進度指標」，用它決定現在該出題還是該評分
  const answered = messages.filter((m) => m.role === "user").length;

  try {
    // ── 分支一：已回答滿 total 題 → 面試結束，產出評分報告 ──
    if (answered >= total) {
      const completion = await client.chat.completions.create({
        model: MODEL,
        // 強制模型輸出合法 JSON，方便後面直接 JSON.parse
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            // 在面試官人設後面追加「評分指令」與期望的 JSON 格式
            // （使用 json_object 模式時，prompt 中必須提到 JSON）
            content: `${systemPrompt(jobDescription, total)}

面試已結束，請根據整場對話評估候選人。只輸出 JSON，格式如下：
{"score": 0-100 的整數, "summary": "整體評語", "strengths": ["優點"], "improvements": ["具體改進建議"], "perQuestion": [{"question": "面試官問的題目", "feedback": "對候選人這題回答的簡短評語", "suggestedAnswer": "針對這題較佳的示範回答（第一人稱、可直接參考使用）"}]}
perQuestion 必須依序涵蓋面試中每一題（共 ${total} 題）。`,
          },
          // 附上完整對話，讓模型看到每一題與每個回答
          ...messages,
        ],
      });

      // 把模型回傳的 JSON 字串解析成物件（as Report 只是型別斷言，不會真的驗證內容）
      const report = JSON.parse(
        completion.choices[0].message.content ?? "{}"
      ) as Report;
      return Response.json({ type: "report", report });
    }

    // ── 分支二：還沒答完 → 出下一題 ──
    // answered 為 0 表示 messages 是空的，此時出的是第一題
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          // 告訴模型目前進度（第幾題 / 共幾題）；第一題時額外要求先打招呼
          content: `${systemPrompt(jobDescription, total)}\n\n現在是第 ${answered + 1} / ${total} 題。${
            answered === 0 ? "請先簡短打招呼，然後提出第一題。" : ""
          }`,
        },
        // 帶上目前為止的對話，模型才能根據上一題的回答決定要追問或換主題
        ...messages,
      ],
    });

    return Response.json({
      type: "question",
      content: completion.choices[0].message.content ?? "", // 面試官的題目文字
      index: answered + 1, // 目前是第幾題
      total, // 總題數
    });
  } catch (err) {
    // OpenAI 呼叫失敗或 JSON.parse 失敗：記錄在伺服器 log，回給前端通用錯誤（502）
    console.error(err);
    return Response.json({ error: "OpenAI 呼叫失敗" }, { status: 502 });
  }
}
