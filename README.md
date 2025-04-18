# 🗂️ S3 Browser (Angular + Python Flask)

A web-based S3-compatible object storage browser built with:

- 🅰️ Angular (Frontend)
- 🐍 Flask + Boto3 (Backend)
- 🐳 Docker & Docker Compose (Deployment)
- 🎨 Bootstrap 5 UI

---

## 🚀 Features

- Connect to any S3-compatible endpoint (MinIO, AWS S3, etc.)
- Input credentials (access key, secret key, endpoint) dynamically
- List, create, and delete buckets
- Upload, download, and delete objects
- Generate presigned URLs for temporary object access
- Clean and responsive UI with Bootstrap

## RUN

```
wget -O - https://raw.githubusercontent.com/cloudbehl/s3-browser/refs/heads/main/run-s3-browser.sh | bash
```