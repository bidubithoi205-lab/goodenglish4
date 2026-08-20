# GE (GoodEnglish) — AI Learning MVP

## Các tính năng đã tích hợp

| Kỹ năng | API / luồng | Endpoint |
|---|---|---|
| Writing | Gemini (ưu tiên) hoặc OpenAI chấm 4 tiêu chí IELTS Band | `POST /api/writing/assess` |
| Reading & Listening | Gemini hoặc OpenAI tạo bài theo trình độ, kèm đáp án và giải thích | `POST /api/practice/generate` |
| Speaking / Phát âm | Luồng thu âm browser + endpoint sẵn sàng cho Azure Pronunciation Assessment | `POST /api/speaking/assess` |

Khi chưa có key, web chạy ở **chế độ demo** để kiểm thử đầy đủ UX. Không có key nào được đặt trong mã nguồn.

## Chạy local

```bash
cd ielts-ai
cp .env.example .env
npm install
npm start
```

Mở `http://localhost:3000/ai-practice.html`.

## Cấu hình key

Điền key vào `.env` (file này không được đưa lên git):

- `GEMINI_API_KEY`: dùng cho Writing và tự tạo bài Reading/Listening.
- `GEMINI_MODEL`: model Gemini mà project của bạn được phép sử dụng. Giá trị mặc định được để riêng để bạn dễ đổi theo model đang có trên tài khoản.
- `OPENAI_API_KEY`: phương án dự phòng cho Writing/quiz nếu không dùng Gemini.
- `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION`: dùng cho chấm phát âm.

## Lưu ý Azure Speech

Azure Pronunciation Assessment nhận audio PCM/WAV 16 kHz mono ở luồng REST phổ biến. Trình duyệt hiện thu WebM, nên endpoint đã hiển thị demo khi chưa có key và trả chỉ dẫn khi key đã được thêm. Để production, thêm một bước chuyển WebM → WAV ở server (FFmpeg) hoặc dùng Azure Speech SDK trên client, rồi gọi Pronunciation Assessment với reference text.

## Bảo mật và production

- Tuyệt đối không đưa API key vào HTML hay JavaScript browser.
- Thêm xác thực người dùng, rate limit theo user/IP, kiểm tra kích thước file audio và lưu audit log trước khi public.
- Lưu bài viết, kết quả Band và lịch sử luyện nói trong database (PostgreSQL/Firebase) theo user id.
- Kết quả Band do AI là tham khảo; cần thông báo rõ cho học viên đây không phải điểm IELTS chính thức.
