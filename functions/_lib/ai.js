export async function callAI(env, prompt) {
  if (env.GEMINI_API_KEY) {
    const model = env.GEMINI_MODEL || 'gemini-3.1-flash-preview';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`, {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseMimeType:'application/json',temperature:0.25}})
    });
    if (!response.ok) throw new Error(`Gemini trả lỗi ${response.status}`);
    const json = await response.json();
    return json.candidates?.[0]?.content?.parts?.[0]?.text;
  }
  if (env.OPENAI_API_KEY) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method:'POST', headers:{'Content-Type':'application/json',Authorization:`Bearer ${env.OPENAI_API_KEY}`},
      body:JSON.stringify({model:env.OPENAI_MODEL||'gpt-4o',response_format:{type:'json_object'},messages:[{role:'user',content:prompt}]})
    });
    if (!response.ok) throw new Error(`OpenAI trả lỗi ${response.status}`);
    const json = await response.json(); return json.choices[0].message.content;
  }
  return null;
}
export function json(data, status=200) { return new Response(JSON.stringify(data), {status,headers:{'Content-Type':'application/json; charset=UTF-8','Cache-Control':'no-store'}}); }
export function parseJson(text) { return JSON.parse(text.replace(/```json|```/g,'')); }