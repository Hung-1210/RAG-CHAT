# 🤖 RAG Chatbot — Retrieval-Augmented Generation

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
![License](https://img.shields.io/badge/license-ISC-green?style=for-the-badge)

**Ứng dụng chatbot thông minh tích hợp RAG (Retrieval-Augmented Generation),  
cho phép upload tài liệu và trò chuyện với nội dung tài liệu bằng Google Gemini AI.**

</div>

---

## 📋 Mục lục

- [✨ Tính năng](#-tính-năng)
- [🏗️ Kiến trúc hệ thống](#️-kiến-trúc-hệ-thống)
- [🛠️ Công nghệ sử dụng](#️-công-nghệ-sử-dụng)
- [📁 Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [⚙️ Yêu cầu hệ thống](#️-yêu-cầu-hệ-thống)
- [🚀 Hướng dẫn cài đặt](#-hướng-dẫn-cài-đặt)
- [🗃️ Cấu hình Database](#️-cấu-hình-database)
- [🔐 Cấu hình biến môi trường](#-cấu-hình-biến-môi-trường)
- [▶️ Chạy ứng dụng](#️-chạy-ứng-dụng)
- [📡 API Reference](#-api-reference)
- [🌐 Giao diện người dùng](#-giao-diện-người-dùng)
- [🔒 Phân quyền hệ thống](#-phân-quyền-hệ-thống)
- [🐛 Xử lý sự cố](#-xử-lý-sự-cố)

---

## ✨ Tính năng

### 🗂️ Quản lý tài liệu
- **Upload đa định dạng**: Hỗ trợ PDF, DOCX, DOC, XLSX, XLS, CSV, TXT
- **Giới hạn file**: Tối đa 10MB mỗi file
- **Xem & xóa tài liệu**: Quản lý toàn bộ tài liệu đã upload
- **Vector Embedding**: Tự động tạo embedding bằng Google Gemini khi upload

### 💬 RAG Chat
- **Chat với tài liệu**: Đặt câu hỏi về nội dung tài liệu bất kỳ
- **Tìm kiếm ngữ nghĩa**: Dùng cosine similarity trên vector embedding (pgvector)
- **Lịch sử trò chuyện**: Lưu trữ toàn bộ lịch sử chat theo từng tài liệu
- **Trả lời chính xác**: Gemini AI trả lời dựa trên ngữ cảnh tài liệu thực tế

### 🔐 Xác thực & Phân quyền
- **Đăng ký / Đăng nhập**: JWT Authentication với access token & refresh token
- **Phân quyền 2 cấp**: `user` (người dùng) và `admin` (quản trị viên)
- **Bảo vệ route**: Tất cả API đều yêu cầu xác thực
- **Mã hóa mật khẩu**: bcrypt hashing

### 🛡️ Admin Dashboard
- **Xem thống kê người dùng**: Tổng số tài liệu, lịch sử chat của từng user
- **Quản lý tài liệu toàn hệ thống**: Admin có thể xem/xóa tài liệu của bất kỳ user nào
- **Giám sát rủi ro**: Module quản trị dành riêng cho Admin

---

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (React + Vite)                │
│   Login / Register / Dashboard / RAG Chat / Admin        │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP REST API
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (Express.js)                    │
│  ┌──────────┐  ┌────────────┐  ┌─────────────────────┐  │
│  │ Auth     │  │ Documents  │  │      Chat           │  │
│  │ Routes   │  │ Routes     │  │      Routes         │  │
│  └────┬─────┘  └─────┬──────┘  └──────────┬──────────┘  │
│       │              │                    │              │
│       ▼              ▼                    ▼              │
│  ┌──────────────────────────────────────────────────┐    │
│  │        Controllers / Services / Middleware        │    │
│  └──────────────────┬───────────────────────────────┘    │
└─────────────────────┼───────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
┌─────────────────┐     ┌─────────────────────┐
│   PostgreSQL    │     │   Google Gemini AI   │
│  + pgvector     │     │  - Embedding (768d)  │
│  - documents    │     │  - Chat Generation   │
│  - chat_history │     └─────────────────────┘
│  - users        │
└─────────────────┘
```

---

## 🛠️ Công nghệ sử dụng

| Thành phần  | Công nghệ                        | Phiên bản |
|-------------|----------------------------------|-----------|
| **Frontend** | React + Vite                    | 19 / 7    |
| **Styling**  | TailwindCSS                     | 4         |
| **Routing**  | React Router DOM                | 7         |
| **Icons**    | Lucide React                    | 0.545     |
| **Backend**  | Node.js + Express.js            | 18+ / 4   |
| **Database** | PostgreSQL + pgvector           | 15+       |
| **AI**       | Google Generative AI (Gemini)   | 0.24+     |
| **Auth**     | JWT (jsonwebtoken) + bcrypt     | 9 / 6     |
| **Upload**   | Multer                          | 2         |
| **Security** | Helmet + CORS                   | 7 / 2     |

---

## 📁 Cấu trúc thư mục

```
RAG/
├── 📄 README.md
├── 🔧 Backend/
│   ├── server.js               # Entry point
│   ├── database.sql            # Schema SQL
│   ├── .env                    # Biến môi trường
│   ├── package.json
│   ├── config/
│   │   └── database.js         # Kết nối PostgreSQL (pg Pool)
│   ├── controllers/
│   │   ├── authController.js   # Xử lý đăng ký / đăng nhập
│   │   ├── documentController.js # Upload / xóa / lấy tài liệu
│   │   └── chatController.js   # RAG chat & lịch sử
│   ├── middleware/
│   │   └── authMiddleware.js   # Xác thực JWT & kiểm tra role
│   ├── routes/
│   │   ├── index.js            # Document & Chat routes
│   │   └── authRoutes.js       # Auth routes
│   ├── services/               # Business logic, embedding, etc.
│   ├── scripts/
│   │   └── initDatabase.js     # Script khởi tạo DB
│   └── uploads/                # Thư mục lưu file upload
│
└── 🌐 Front-end/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── App.jsx             # Router chính
        ├── main.jsx
        ├── components/
        │   ├── RAGInterface.jsx    # Giao diện chat RAG
        │   ├── DashboardLayout.jsx # Layout chính
        │   └── ProtectedRoute.jsx  # Bảo vệ route
        ├── pages/
        │   ├── Login.jsx           # Trang đăng nhập
        │   ├── Register.jsx        # Trang đăng ký
        │   ├── Dashboard.jsx       # Dashboard người dùng
        │   └── AdminRAGDashboard.jsx # Dashboard admin
        └── services/
            └── authService.js      # Gọi API auth
```

---

## ⚙️ Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt:

| Công cụ | Phiên bản tối thiểu | Tải về |
|---------|---------------------|--------|
| **Node.js** | 18.0+ | [nodejs.org](https://nodejs.org) |
| **npm** | 9.0+ | Đi kèm Node.js |
| **PostgreSQL** | 15.0+ | [postgresql.org](https://www.postgresql.org/download/) |
| **Git** | Bất kỳ | [git-scm.com](https://git-scm.com) |

---

## 🚀 Hướng dẫn cài đặt

### Bước 1 — Clone repository

```bash
git clone https://github.com/Hung-1210/RAG-CHAT.git
cd RAG-CHAT
```

---

### Bước 2 — Cài đặt PostgreSQL & pgvector

#### 🪟 Windows

1. Tải và cài đặt PostgreSQL từ [postgresql.org](https://www.postgresql.org/download/windows/)
2. Trong quá trình cài đặt, nhớ ghi lại **password** của user `postgres`
3. Cài đặt extension **pgvector**:

```bash
# Cài pgvector qua Stack Builder (đi kèm PostgreSQL installer)
# Hoặc tải từ: https://github.com/pgvector/pgvector/releases
```

4. Kết nối vào PostgreSQL và bật extension:

```sql
-- Mở psql hoặc pgAdmin, chạy lệnh:
CREATE EXTENSION IF NOT EXISTS vector;
```

#### 🐧 Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo apt install postgresql-15-pgvector
```

#### 🍎 macOS

```bash
brew install postgresql@15
brew install pgvector
```

---

### Bước 3 — Tạo Database

Mở **psql** hoặc **pgAdmin** và chạy:

```sql
-- Tạo database
CREATE DATABASE "RAG";

-- Kết nối vào database
\c RAG

-- Bật pgvector
CREATE EXTENSION IF NOT EXISTS vector;
```

Sau đó chạy toàn bộ file `database.sql` để tạo bảng:

```bash
# Chạy từ terminal (thay your_password và your_username nếu cần)
psql -U postgres -d RAG -f Backend/database.sql
```

Hoặc copy nội dung file `Backend/database.sql` và paste vào pgAdmin để chạy.

---

### Bước 4 — Lấy Google Gemini API Key

1. Truy cập [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Đăng nhập bằng tài khoản Google
3. Nhấn **"Create API Key"**
4. Sao chép API Key để dùng ở bước tiếp theo

---

### Bước 5 — Cài đặt Backend

```bash
# Di chuyển vào thư mục Backend
cd Backend

# Cài đặt dependencies
npm install
```

Tạo file `.env` trong thư mục `Backend/` với nội dung sau:

```env
# ===== Server Configuration =====
PORT=5000
NODE_ENV=development

# ===== Database Configuration =====
DB_HOST=localhost
DB_PORT=5432
DB_NAME=RAG
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here

# ===== JWT Configuration =====
JWT_SECRET=your_jwt_secret_here_at_least_32_characters
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here_at_least_32_characters
JWT_REFRESH_EXPIRES_IN=30d

# ===== Google Gemini API =====
GEMINI_API_KEY=your_gemini_api_key_here

# ===== File Upload Configuration =====
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# ===== CORS Configuration =====
CORS_ORIGIN=http://localhost:5173
```

> **⚠️ Lưu ý bảo mật:** Không commit file `.env` lên Git. File này đã được thêm vào `.gitignore`.

---

### Bước 6 — Cài đặt Frontend

```bash
# Mở terminal mới, di chuyển vào thư mục Front-end
cd Front-end

# Cài đặt dependencies
npm install
```

Kiểm tra file `.env` trong `Front-end/`:

```env
VITE_API_URL=http://localhost:5000
```

---

## ▶️ Chạy ứng dụng

### Chạy Backend

```bash
cd Backend

# Development mode (tự động reload khi thay đổi code)
npm run dev

# Production mode
npm start

# Khởi tạo database (nếu dùng script tự động)
npm run init-db
```

Khi khởi động thành công, bạn sẽ thấy:

```
🔑 Gemini API Key: Loaded ✅
✅ Database connection successful
🚀 Server started successfully!
📡 API running on http://localhost:5000
🌍 Environment: development
📚 API Documentation: http://localhost:5000/api/health
```

---

### Chạy Frontend

```bash
cd Front-end

# Development mode
npm run dev
```

Mở trình duyệt và truy cập: **http://localhost:5173**

---

### Chạy cả hai cùng lúc (Windows)

Mở **2 cửa sổ terminal riêng biệt**:

```bash
# Terminal 1 — Backend
cd Backend && npm run dev

# Terminal 2 — Frontend
cd Front-end && npm run dev
```

---

## 🗃️ Cấu hình Database

### Sơ đồ bảng

```sql
-- Lưu nội dung + vector embedding của tài liệu
documents (id, content, metadata, embedding VECTOR(768), created_at)

-- Metadata của file đã upload
document_metadata (id, title, url, file_type, file_size, created_at, schema)

-- Các dòng dữ liệu cho file Excel/CSV
document_rows (id, dataset_id, row_data JSONB, created_at)

-- Lịch sử trò chuyện
chat_history (id, document_id, user_message, bot_response, created_at)
```

### Function tìm kiếm vector

```sql
-- Tìm các đoạn văn bản tương tự câu hỏi dựa trên cosine similarity
SELECT * FROM match_documents(
  query_embedding := '[0.1, 0.2, ...]'::vector,
  match_count := 5
);
```

---

## 🔐 Cấu hình biến môi trường

### Backend (`Backend/.env`)

| Biến | Mô tả | Ví dụ |
|------|-------|-------|
| `PORT` | Cổng chạy server | `5000` |
| `NODE_ENV` | Môi trường | `development` |
| `DB_HOST` | Host database | `localhost` |
| `DB_PORT` | Cổng PostgreSQL | `5432` |
| `DB_NAME` | Tên database | `RAG` |
| `DB_USER` | User PostgreSQL | `postgres` |
| `DB_PASSWORD` | Mật khẩu PostgreSQL | `your_password` |
| `JWT_SECRET` | Khóa bí mật JWT (≥32 ký tự) | `abc123...` |
| `JWT_EXPIRES_IN` | Thời hạn access token | `7d` |
| `JWT_REFRESH_SECRET` | Khóa refresh token | `xyz789...` |
| `JWT_REFRESH_EXPIRES_IN` | Thời hạn refresh token | `30d` |
| `GEMINI_API_KEY` | API Key từ Google AI Studio | `AIza...` |
| `MAX_FILE_SIZE` | Giới hạn dung lượng file (bytes) | `10485760` (10MB) |
| `UPLOAD_DIR` | Thư mục lưu file | `./uploads` |
| `CORS_ORIGIN` | URL frontend được phép | `http://localhost:5173` |

### Frontend (`Front-end/.env`)

| Biến | Mô tả | Ví dụ |
|------|-------|-------|
| `VITE_API_URL` | URL backend API | `http://localhost:5000` |

---

## 📡 API Reference

### 🔑 Authentication

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `POST` | `/api/auth/register` | Đăng ký tài khoản mới | ❌ |
| `POST` | `/api/auth/login` | Đăng nhập | ❌ |
| `POST` | `/api/auth/refresh` | Làm mới access token | ❌ |
| `POST` | `/api/auth/logout` | Đăng xuất | ✅ |

### 📄 Documents

| Method | Endpoint | Mô tả | Auth | Role |
|--------|----------|-------|------|------|
| `POST` | `/api/documents/upload` | Upload tài liệu | ✅ | user |
| `GET` | `/api/documents` | Lấy danh sách tài liệu | ✅ | user |
| `GET` | `/api/documents/:id` | Lấy chi tiết tài liệu | ✅ | user |
| `DELETE` | `/api/documents/:id` | Xóa tài liệu | ✅ | owner/admin |
| `GET` | `/api/admin/users-stats` | Thống kê user | ✅ | admin |
| `GET` | `/api/admin/users/:userId/documents` | Tài liệu của user | ✅ | admin |

### 💬 Chat

| Method | Endpoint | Mô tả | Auth | Role |
|--------|----------|-------|------|------|
| `POST` | `/api/chat/message` | Gửi câu hỏi | ✅ | user |
| `GET` | `/api/chat/history/:documentId` | Lịch sử chat | ✅ | user |
| `DELETE` | `/api/chat/history/:documentId` | Xóa lịch sử | ✅ | user |
| `GET` | `/api/admin/users/:userId/chats` | Chat của user | ✅ | admin |

### ❤️ Health Check

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/health` | Kiểm tra trạng thái server |
| `GET` | `/` | Thông tin API |

---

## 🌐 Giao diện người dùng

| Route | Trang | Mô tả | Quyền |
|-------|-------|-------|-------|
| `/login` | Đăng nhập | Form đăng nhập | Public |
| `/register` | Đăng ký | Form đăng ký tài khoản | Public |
| `/dashboard` | Dashboard | Tổng quan tài khoản | User |
| `/dashboard/rag-chat` | RAG Chat | Chat với tài liệu | User |
| `/dashboard/files` | Files | Quản lý file & folder | User |
| `/dashboard/digital-signature` | Ký số | Module ký số | User |
| `/dashboard/risk-monitoring` | Giám sát rủi ro | Dashboard rủi ro | **Admin** |

---

## 🔒 Phân quyền hệ thống

```
┌─────────────────────────────────────────────┐
│                   ADMIN                      │
│  ✅ Xem tài liệu của tất cả users           │
│  ✅ Xóa tài liệu của bất kỳ user nào       │
│  ✅ Xem lịch sử chat của tất cả users       │
│  ✅ Truy cập Admin Dashboard                │
│  ✅ Xem thống kê người dùng                 │
└─────────────────────┬───────────────────────┘
                      │ kế thừa
┌─────────────────────▼───────────────────────┐
│                   USER                       │
│  ✅ Upload tài liệu của mình                │
│  ✅ Xem tài liệu của mình                   │
│  ✅ Xóa tài liệu của mình                   │
│  ✅ Chat với tài liệu                        │
│  ✅ Xem & xóa lịch sử chat của mình         │
│  ❌ Không thể truy cập dữ liệu user khác    │
└─────────────────────────────────────────────┘
```

---

## 🐛 Xử lý sự cố

### ❌ Lỗi kết nối database

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Giải pháp:**
- Kiểm tra PostgreSQL đang chạy: `pg_ctl status` hoặc mở Services trên Windows
- Kiểm tra lại `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` trong `.env`
- Đảm bảo database `RAG` đã được tạo

---

### ❌ Lỗi pgvector chưa được cài

```
Error: type "vector" does not exist
```

**Giải pháp:**
```sql
-- Chạy trong PostgreSQL
CREATE EXTENSION IF NOT EXISTS vector;
```

---

### ❌ Gemini API Key không hợp lệ

```
🔑 Gemini API Key: Missing ❌
```

**Giải pháp:**
- Kiểm tra `GEMINI_API_KEY` trong file `Backend/.env`
- Đảm bảo không có dấu cách hoặc ký tự thừa xung quanh giá trị

---

### ❌ Lỗi CORS khi frontend gọi API

```
Access to fetch blocked by CORS policy
```

**Giải pháp:**
- Kiểm tra `CORS_ORIGIN` trong `Backend/.env` phải khớp với URL frontend (mặc định `http://localhost:5173`)
- Đảm bảo backend đang chạy trên đúng port

---

### ❌ Lỗi upload file

```
Error: File is too large. Maximum size is 10MB
```

**Giải pháp:**
- Giảm dung lượng file hoặc tăng `MAX_FILE_SIZE` trong `.env`
- Giá trị tính bằng bytes: `10485760` = 10MB

---

## 📝 Ghi chú phát triển

- **Embedding dimension**: Hệ thống sử dụng vector 768 chiều (Google Gemini `text-embedding-004`)
- **Similarity search**: Cosine similarity qua pgvector operator `<=>`
- **Chunking**: Tài liệu được chia nhỏ thành các đoạn trước khi embedding
- **JWT Flow**: Access token (7 ngày) + Refresh token (30 ngày)

---

<div align="center">

**Made with ❤️ by Hung-1210**

</div>