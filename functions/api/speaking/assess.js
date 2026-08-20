import {json} from '../../_lib/ai.js';
export async function onRequestPost({request,env}) {
 const form=await request.formData(); const audio=form.get('audio');
 if(!audio || typeof audio === 'string') return json({error:'Vui lòng thu âm trước.'},400);
 if(!env.AZURE_SPEECH_KEY) return json({demo:true,transcript:'I believe technology makes education more accessible for students.',scores:{pronunciation:78,fluency:72,accuracy:75},feedback:['Phát âm rõ “technology” và “accessible”.','Nối âm giữa “makes education” tự nhiên hơn.','Giảm ngắt nghỉ trước “for students”.'],tip:'Nhấn trọng âm: ac-CES-si-ble.'});
 // Azure REST Pronunciation Assessment expects PCM/WAV audio (16 kHz mono), not WebM from MediaRecorder.
 // Convert WebM -> WAV in the browser, then enable the following request in production.
 return json({error:'Audio hiện là WebM. Hãy chuyển audio sang WAV 16 kHz mono trước khi gọi Azure Pronunciation Assessment.',hint:'Bản Cloudflare không cần Node; thực hiện chuyển đổi bằng Web Audio API ở trình duyệt hoặc Azure Speech SDK client-side.'},422);
}