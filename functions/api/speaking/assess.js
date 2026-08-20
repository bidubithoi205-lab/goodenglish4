import { json } from "../../_lib/ai.js";

export async function onRequestPost({ request, env }) {
  try {
    const incoming = await request.formData();
    const audio = incoming.get("audio");

    if (!audio || typeof audio === "string") {
      return json(
        { error: "Vui lòng thu âm câu trả lời trước." },
        400
      );
    }

    if (!env.GROQ_API_KEY) {
      return json(
        {
          error:
            "Chưa cấu hình GROQ_API_KEY trong Cloudflare Environment Variables."
        },
        500
      );
    }

    const form = new FormData();

    form.append(
      "file",
      audio,
      audio.name || "speaking-answer.webm"
    );

    form.append(
      "model",
      env.GROQ_STT_MODEL || "whisper-large-v3-turbo"
    );

    form.append("language", "en");
    form.append("response_format", "json");

    const response = await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.GROQ_API_KEY}`
        },
        body: form
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return json(
        {
          error: "Groq không thể chuyển audio thành văn bản.",
          detail: data
        },
        response.status
      );
    }

    return json({
      transcript: data.text,
      message: "Đã nhận diện giọng nói thành công."
    });
  } catch (error) {
    return json(
      {
        error: "Không thể xử lý audio Speaking.",
        detail: error.message
      },
      500
    );
  }
}
