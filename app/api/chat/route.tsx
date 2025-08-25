// import { streamText } from "ai";
// import { createOllama } from "ollama-ai-provider";


// const aiChat = async (req: Request): Promise<Response | undefined> => {
//   const { messages } = await req.json();

//   const ollama = createOllama({});
//   const result = streamText({
//     model: ollama("llama3.2:3b"),
//     messages,
//   });

//   return result.toDataStreamResponse();
// };

// export const POST = aiChat;

export const runtime = "nodejs";    // สำคัญ: ใช้ Node runtime (ไม่ใช่ Edge)

import { streamText } from "ai";
import { createOllama } from "ollama-ai-provider";
import dataset from "@/data/DatasetAll.json";

// ---------- Config ----------
const OLLAMA_BASE_URL =
  process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
const EMBED_MODEL =
  process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text";
const TOP_K = 3;                 // ดึงเอกสารใกล้สุดกี่ชิ้น
const SIM_THRESHOLD = 0.72;      // เกณฑ์ความคล้ายขั้นต่ำ (0-1)

// ---------- Types ----------
type Item = {
  instruction: string;
  input?: string;
  output: string;
};

type Doc = {
  id: number;
  text: string;
  vec: number[];
};

// ---------- Simple in-memory index ----------
let INDEX: Doc[] | null = null;

// สร้างข้อความสำหรับฝังลง index (Q/A style)
function toDocText(d: Item) {
  const inp = (d.input ?? "").trim();
  return [
    `Q: ${d.instruction.trim()}`,
    inp ? `Input: ${inp}` : "",
    `A: ${d.output.trim()}`,
  ]
    .filter(Boolean)
    .join("\n");
}

// เรียก embeddings จาก Ollama
async function getEmbedding(text: string): Promise<number[]> {
  const res = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: EMBED_MODEL, input: text }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Embedding error: ${res.status} ${msg}`);
  }
  const json = (await res.json()) as { embedding: number[] };
  return json.embedding;
}

// cosine similarity
function cosine(a: number[], b: number[]) {
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb) || 1;
  return dot / denom;
}

async function ensureIndex() {
  if (INDEX) return;

  const items = dataset as Item[];
  // สร้าง embeddings สำหรับทุกเรคคอร์ด
  const docs: Doc[] = [];
  for (let i = 0; i < items.length; i++) {
    const text = toDocText(items[i]);
    const vec = await getEmbedding(text);
    docs.push({ id: i, text, vec });
  }
  INDEX = docs;
}

async function retrieveContext(query: string) {
  await ensureIndex();
  if (!INDEX || INDEX.length === 0) return [];

  const qvec = await getEmbedding(query);

  // จัดอันดับตาม cosine sim
  const scored = INDEX.map((d) => ({
    ...d,
    score: cosine(qvec, d.vec),
  }))
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_K)
    .filter((d) => d.score >= SIM_THRESHOLD);

  return scored;
}

// ---------- Handler ----------
const aiChat = async (req: Request): Promise<Response | undefined> => {
  const { messages } = (await req.json()) as {
    messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  };

  const userQuestion = messages[messages.length - 1]?.content ?? "";

  // หา context จาก dataset (semantic)
  const hits = await retrieveContext(userQuestion);
  const context =
    hits.length > 0
      ? hits.map((h, i) => `[#${i + 1}] ${h.text}`).join("\n\n")
      : "";

  const ollama = createOllama({}); // ใช้ llama3.2:3b ตามเดิม

  // Prompt strategy:
  // - ถ้ามี context: แจ้งว่า "ให้ใช้ข้อมูลต่อไปนี้เป็นแหล่งอ้างอิงหลัก"
  // - ถ้าไม่มี context: ให้ตอบด้วยความรู้ทั่วไปได้ตามปกติ
  const promptPreamble = hits.length
    ? `คุณคือ EVana ผู้ช่วยท่องเที่ยวสำหรับรถยนต์ไฟฟ้าในภาคเหนือตอนบนของไทย
ต่อไปนี้คือฐานความรู้อ้างอิง (ให้ยึดเป็นหลักเมื่อเกี่ยวข้อง):
${context}

ห้ามบิดเบือนหรือแต่งข้อมูลนอกเหนือจาก context ถ้าเกี่ยวข้องโดยตรงกับคำถาม
ถ้าคำถามไม่เกี่ยวกับข้อมูลใน context ให้ใช้ความรู้ทั่วไปตอบตามปกติ
ตอบให้กระชับและถูกต้อง`
    : `คุณคือ EVana ผู้ช่วยท่องเที่ยวสำหรับรถยนต์ไฟฟ้าในภาคเหนือตอนบนของไทย
หากไม่มีข้อมูลอ้างอิงจากฐานความรู้ ให้ตอบด้วยความรู้ทั่วไปตามปกติ
ตอบให้กระชับและถูกต้อง`;

  const result = streamText({
    model: ollama("llama3.2:3b"),
    messages: [
      { role: "system", content: promptPreamble },
      // (อาจเพิ่มบรรทัดนี้ถ้าอยากให้โมเดล “เห็น” context ชัดขึ้น)
      // hits.length ? { role: "assistant", content: `Context:\n${context}` } : undefined,
      ...messages,
    ].filter(Boolean) as any,
    // คุณสามารถกำหนด maxTokens/temperature ได้ตามต้องการ
  });

  return result.toDataStreamResponse();
};

export const POST = aiChat;
