# 🚀 RAG PDF Chat System

An AI-powered Retrieval-Augmented Generation (RAG) system built using React, Laravel, HuggingFace Embeddings, Qdrant Vector Database, and OpenRouter LLMs.

---

# 🧠 System Architecture

The system workflow:

```text
PDF Upload → Text Extraction → Chunking → Embeddings → Qdrant Vector Store
                                                        ↓
User Question → Query Embedding → Vector Search → Context Retrieval → LLM Response
```

---

# ⚡ Tech Stack

## Frontend
- React
- Vite

## Backend
- Laravel

## AI / RAG Stack
- HuggingFace Embeddings API
- OpenRouter LLM API
- Qdrant Vector Database

## Database
- MySQL

---

# 📦 Project Setup

---

# 1️⃣ Clone Repository

```bash
git clone <your-repository-url>
cd <project-folder>
```

---

# 🔥 Backend Setup (Laravel)

## 2️⃣ Navigate to Backend

```bash
cd Backend
```

---

## 3️⃣ Install PHP Dependencies

```bash
composer install
```

---

## 4️⃣ Create Environment File

```bash
cp .env.example .env
```

---

## 5️⃣ Generate Laravel Application Key

```bash
php artisan key:generate
```

---

# ⚙️ Configure Environment Variables

Open `.env` file and configure:

```env
APP_NAME=RAG_SYSTEM
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=rag_system
DB_USERNAME=root
DB_PASSWORD=

HUGGINGFACE_API_KEY=your_huggingface_api_key

OPENROUTER_API_KEY=your_openrouter_api_key

QDRANT_HOST=http://localhost:6333
```

---

# 🔑 Required API Keys

---

## 🤗 HuggingFace API

Create API key from:

[Hugging Face](https://huggingface.co/settings/tokens?utm_source=chatgpt.com)

### Used For
- Generating embeddings
- Converting chunks and questions into vectors

### Embedding Model

```text
BAAI/bge-small-en-v1.5
```

### Vector Dimension

```text
384
```

---

## 🧠 OpenRouter API

Create API key from:

[OpenRouter](https://openrouter.ai/keys?utm_source=chatgpt.com)

### Used For
- LLM responses
- AI chat completion

---

# 🗄️ Database Setup

## 6️⃣ Create MySQL Database

```sql
CREATE DATABASE rag_system;
```

---

## 7️⃣ Run Database Migrations

```bash
php artisan migrate
```

---

# 📁 Storage Setup

## 8️⃣ Create Storage Link

```bash
php artisan storage:link
```

---

# 🚀 Run Laravel Backend

## 9️⃣ Start Laravel Server

```bash
php artisan serve
```

Backend URL:

```text
http://localhost:8000
```

---

# 🧩 Qdrant Vector Database Setup

---

## 🔟 Run Qdrant using Docker

Make sure Docker is installed.

Run:

```bash
docker run -p 6333:6333 qdrant/qdrant
```

---

## 1️⃣1️⃣ Create Qdrant Collection

```bash
curl -X PUT "http://localhost:6333/collections/chunks" ^
-H "Content-Type: application/json" ^
-d "{\"vectors\":{\"size\":384,\"distance\":\"Cosine\"}}"
```

---

# 💻 Frontend Setup (React + Vite)

---

## 1️⃣2️⃣ Navigate to Frontend

```bash
cd ../Frontend
```

---

## 1️⃣3️⃣ Install Dependencies

```bash
npm install
```

---

## 1️⃣4️⃣ Configure Frontend Environment

Create `.env` file:

```env
VITE_API_URL=http://localhost:8000/api
```

---

## 1️⃣5️⃣ Run Frontend

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# 🧠 How The RAG Pipeline Works

---

# 📄 PDF Processing Flow

### Step 1
User uploads PDF document

### Step 2
Laravel extracts text from PDF

### Step 3
Text is split into smaller chunks

### Step 4
Chunks are stored in MySQL database

### Step 5
HuggingFace generates embeddings for chunks

### Step 6
Embeddings are stored inside Qdrant vector database

---

# 💬 Question Answering Flow

### Step 1
User sends a question

### Step 2
Question is converted into embedding vector

### Step 3
Qdrant performs semantic similarity search

### Step 4
Most relevant chunks are retrieved

### Step 5
Laravel builds contextual prompt

### Step 6
Prompt is sent to OpenRouter LLM

### Step 7
AI-generated response is returned to the user

---

# 🛠️ Useful Commands

---

## Clear Laravel Cache

```bash
php artisan optimize:clear
```

---

## List Laravel Routes

```bash
php artisan route:list
```

---

## Re-index Chunks into Qdrant

Call API endpoint:

```http
POST /api/index-chunks
```

---

# ⚠️ Important Notes

- Make sure Qdrant is running before indexing documents.
- Embedding dimension must match Qdrant collection vector size.
- Current embedding dimension:

```text
384
```

- Recommended embedding model:

```text
BAAI/bge-small-en-v1.5
```

---

# 🌟 Features

✅ PDF Upload & Parsing  
✅ Semantic Search  
✅ AI-Powered Question Answering  
✅ Vector Similarity Search  
✅ Chunk-Based Retrieval  
✅ Context-Aware Responses  
✅ Full RAG Pipeline  
✅ React + Laravel Architecture  

---

# 📌 Future Improvements

- Streaming AI responses
- Multi-file support
- Conversation memory
- Hybrid search
- Metadata filtering
- Authentication system
- Dockerized deployment
- Production-ready queue system

---

# 👨‍💻 Author

Built with ❤️ using Laravel, React, Qdrant, and modern AI tooling.
