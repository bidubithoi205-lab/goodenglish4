import { callAI, json, parseJson } from "../../_lib/ai.js";

// Evaluates the recognised transcript. It deliberately does not claim phoneme-level pronunciation scoring.
export async function onRequestPost({ request, env }) {
  try {
    const { transcript, question = "Do you think technology has improved education?" } = await request.json();
    if (!transcript?.trim()) return json({ error: "Chưa có transcript để đánh giá." }, 400);

    const prompt = `You are an encouraging IELTS Speaking examiner. Evaluate ONLY the transcript; do not claim to assess pronunciation, stress, or intonation. Return ONLY valid JSON:
{"scores":{"fluency":"Band x.x","grammar":"Band x.x","vocabulary":"Band x.x"},"feedback":"Vietnamese feedback, concise.","improvedAnswer":"A natural English answer at Band 6.5 level.","tip":"One concise Vietnamese improvement tip."}
Question: ${question}
Student transcript: ${transcript}`;

    const output = await callAI(env, prompt);
    if (!output) {
      return json({ demo: true, scores: { fluency: "Band 5.5", grammar: "Band 5.5", vocabulary: "Band 5.5" }, feedback: "Chế độ demo: câu trả lời có ý chính, nhưng nên thêm lý do và ví dụ cụ thể.", improvedAnswer: "I believe technology has improved education because students can access learning materials more easily and study at their own pace.", tip: "Dùng cấu trúc opinion → reason → example để phát triển câu trả lời." });
    }
    return json(parseJson(output));
  } catch (error) {
    return json({ error: "Không thể đánh giá Speaking.", detail: error.message }, 502);
  }
}
