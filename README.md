# 🗂️ S3 Browser

A modern, lightweight S3 Browser with Angular frontend and Python (Flask + Boto3) backend to manage your S3-compatible storage (MinIO, Ceph, AWS S3, etc.).

## 🚀 Features

- ✅ List/create/delete buckets
- 📁 Upload, download, delete, view metadata for objects
- 🔗 Generate presigned URLs
- 🔒 Auth via user-provided access/secret keys and endpoint
- 🧩 Compatible with AWS S3, Ceph RGW, etc.

---

## 🐳 Run with Docker (No Clone Needed)

You can start the app with **just one command**:

```
wget -O - https://raw.githubusercontent.com/cloudbehl/s3-browser/refs/heads/main/run-s3-browser.sh | bash
```

This pulls the prebuilt frontend/backend Docker images and runs them locally via Docker Compose.

---

## 🧱 Project Structure

```text
s3-browser/
├── frontend/         # Angular App (IBM Carbon / Bootstrap UI)
├── backend/          # Flask API (Boto3 for S3 interaction)
├── docker-compose.yml
└── Dockerfiles       # Separate Dockerfiles for frontend/backend
```

---

## 🛠️ Manual Setup (Dev Mode)

### 📦 Backend (Python + Flask)

```bash
cd backend
pip install -r requirements.txt
python server.py
```

### 🌐 Frontend (Angular)

```bash
cd frontend
npm install
ng serve
```

---

## 🌍 Access the App

| Component | URL                    |
|----------|------------------------|
| Frontend | http://localhost:8080       |
| Backend  | http://localhost:5000  |

You will need to provide:
- `AWS Access Key`
- `AWS Secret Key`
- `S3-compatible endpoint` (e.g., http://localhost:9000 )

These can be added via UI input.

---

## 🧪 Example Usage

- Create a bucket
- Upload files
- View object metadata
- Download or delete
- Share via presigned URL

---

## 🧰 Build Docker Images (Optional)

```bash
# Frontend
docker build -t s3-browser-frontend ./frontend

# Backend
docker build -t s3-browser-backend ./backend
```

Run with Docker Compose:

```bash
docker-compose up -d
```


## Demo
https://github.com/user-attachments/assets/99e780a0-6c92-496a-aa33-7cae918c5e6f


