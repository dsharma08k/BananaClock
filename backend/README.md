---
title: BananaClock Backend
emoji: 🍌
colorFrom: yellow
colorTo: red
sdk: docker
pinned: false
---

# BananaClock Backend

The backend API for BananaClock, built with FastAPI. It handles image processing, ML inference (YOLOv8 + ResNet50), and user feedback storage via Supabase.

## Setup

### Prerequisites
- Python 3.10 or higher
- Docker (optional)
- Supabase Account
- Downloaded Models (see below)

### 1. Model Setup (Crucial!)
You must download the trained models and place them in the `trained_models/` directory (create it if it doesn't exist, at the same level as `app/`):
1. `banana_yolo.pt` (YOLOv8 Detector) -> `trained_models/banana_yolo.pt`
2. `banana_classifier.h5` (ResNet50) -> `trained_models/banana_classifier.h5`

*(If you don't have these, the app will try to run in mock mode or fail)*

### 2. Supabase Setup
1. Create a project at [Supabase](https://supabase.com).
2. Create a bucket named `share-images`.
3. Create a table `feedback` with columns: `id`, `image_url` (text), `prediction` (jsonb), `user_feedback` (text), `created_at` (timestamp).

### Installation

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Environment Variables

Create a `.env` file in this directory with the following variables:

```ini
# App
APP_NAME=BananaClock
DEBUG=False
VERSION=1.0.0

# CORS (Frontend URL)
ALLOWED_ORIGINS=http://localhost:5173

# Supabase (Storage & DB)
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# External Services (Optional)
IMGUR_CLIENT_ID=your_imgur_client_id
```

## Running the API

Start the development server:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Docker Deployment

To build and run the backend container:

```bash
docker build -t bananaclock-backend .
docker run -p 8000:8000 --env-file .env bananaclock-backend
```
