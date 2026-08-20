import {callAI,json,parseJson} from '../../_lib/ai.js';
export async function onRequestPost({request,env}) {
 try { const {text,question='IELTS Writing Task 2'}=await request.json(); if(!text?.trim()) return json({error:'Vui lòng nhập bài viết.'},400);
 const prompt=`You are a strict but encouraging IELTS Writing examiner. Return ONLY valid JSON exactly as: {"overallBand":number,"criterion":{"taskResponse":number,"coherence":number,"lexical":number,"grammar":number},"summary":"string","corrections":[{"original":"string","improved":"string","reason":"string"}],"nextSteps":["string","string","string"]}. Assess this essay with IELTS Task 2 criteria. Question: ${question}. Essay: ${text}`;
 const output=await callAI(env,prompt);
 if(!output) return json({demo:true,overallBand:6,criterion:{taskResponse:6,coherence:6,lexical:6,grammar:5.5},summary:'Chế độ demo: hãy thêm Gemini hoặc OpenAI secret trên Cloudflare để chấm bài thật.',corrections:[{original:'people is',improved:'people are',reason:'People là danh từ số nhiều.'}],nextSteps:['Phát triển ý bằng ví dụ cụ thể.','Kiểm tra chia động từ.','Dùng collocation học thuật.']});
 return json(parseJson(output));
 } catch(e) { return json({error:'Không thể chấm bài AI.',detail:e.message},502); }
}