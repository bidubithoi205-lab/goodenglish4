# Đưa GE lên Cloudflare Pages (không cần server Node)

Dự án đã có **Cloudflare Pages Functions** trong thư mục `functions/`. Chúng chạy ở Cloudflare Workers runtime, vì vậy không cần chạy `server.js`, không cần VPS và không cần Node server sau khi deploy.

## 1. Đưa mã nguồn lên GitHub

Tạo repository GitHub mới, sau đó upload toàn bộ nội dung thư mục `ielts-ai`, gồm cả thư mục `functions`.

> Không upload `.env` hoặc API key. File `.env.example` chỉ là mẫu an toàn.

## 2. Tạo Cloudflare Pages project

1. Vào Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Chọn repository vừa tạo.
3. Thiết lập build:
   - **Framework preset:** `None`
   - **Build command:** để trống
   - **Build output directory:** `/` (root)
   - **Root directory:** để trống nếu repository chỉ chứa thư mục `ielts-ai`; nếu repo có thư mục đó, đặt là `ielts-ai`.
4. Nhấn **Save and Deploy**.

Cloudflare tự publish giao diện. Mở `/ai-practice.html` để xem AI Learning Lab. Các URL `/api/writing/assess`, `/api/practice/generate`, `/api/speaking/assess` tự động được map tới các file trong `functions/api/`.

## 3. Thêm API key an toàn

Vào project Pages → **Settings** → **Environment variables** → chọn cả **Production** và **Preview**, thêm các secret sau:

| Tên biến | Dùng cho | Giá trị |
|---|---|---|
| `GEMINI_API_KEY` | Writing / Reading / Listening | API key Gemini của bạn |
| `GEMINI_MODEL` | Chọn model | Model Gemini được tài khoản của bạn hỗ trợ |
| `OPENAI_API_KEY` | Phương án thay Gemini | OpenAI API key |
| `OPENAI_MODEL` | Chọn model OpenAI | ví dụ `gpt-4o` |
| `AZURE_SPEECH_KEY` | Phát âm | Azure Speech resource key |
| `AZURE_SPEECH_REGION` | Phát âm | ví dụ `southeastasia` |

Chỉ cần một trong hai `GEMINI_API_KEY` hoặc `OPENAI_API_KEY`. Sau khi thêm biến, chọn **Deployments → Retry deployment** để cập nhật.

## 4. Azure Speech cho phát âm

Cloudflare Function không cần Node, nhưng Azure Pronunciation Assessment cần audio WAV/PCM 16 kHz mono. Trình duyệt hiện thu `webm`. Có hai cách production:

1. Chuyển WebM → WAV bằng **Web Audio API trong trình duyệt**, sau đó gửi WAV lên `/api/speaking/assess`.
2. Dùng **Azure Speech SDK trực tiếp ở client** với token ngắn hạn do Cloudflare Function cấp. Không bao giờ đặt Azure subscription key trong trình duyệt.

Bản hiện tại xử lý UI/thu âm và demo feedback khi chưa có Azure key; endpoint trả chỉ dẫn rõ ràng nếu audio chưa được chuyển đổi.

## 5. Kiểm tra sau khi deploy

- Mở `https://ten-project.pages.dev/ai-practice.html`.
- Dán một bài Writing và nhấn **Chấm bài với AI**.
- Tạo một bài Reading/Listening.
- Nếu kết quả hiển thị `bản minh hoạ`, kiểm tra lại Environment variables và redeploy.

## Lưu ý bảo mật / chi phí

- API key chỉ lưu ở **Environment variables**, tuyệt đối không đưa vào HTML hay GitHub.
- Trước khi public, thêm Cloudflare Turnstile, xác thực user và rate limit để tránh bị lạm dụng API/chi phí AI.
- Xem kết quả IELTS do AI là phản hồi học tập, không phải điểm thi chính thức.
