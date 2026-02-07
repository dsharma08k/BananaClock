# BananaClock

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://banana-clock-frontend.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-blue?style=for-the-badge&logo=github)](https://github.com/dsharma08k/BananaClock)

BananaClock is an intelligent web application that uses computer vision (YOLOv8 + ResNet50) to detect bananas, classify their ripeness, and predict exactly how many days they have left before spoiling.

## Live Demo

**Frontend:** [https://banana-clock-frontend.vercel.app/](https://banana-clock-frontend.vercel.app/)

**Backend API:** [https://dsharma08k-bananaclockbackend.hf.space](https://dsharma08k-bananaclockbackend.hf.space)

## Features

- **AI Precision**: Instantly detects and classifies bananas into 5 ripeness stages (Fresh -> Spoiled).
- **Shelf Life Prediction**: Accurate countdowns for "Days Until Bad" based on current ripeness.
- **Smart Storage Tips**: Tailored advice on how to store your specific bunch to make it last.
- **Interactive Highlighting**: Click on ripeness stats to instantly spot which bananas are which in your photo.
- **Recipe Ideas**: Got overripe bananas? Get curated recipes like Banana Bread or Smoothies instantly.
- **PWA Ready**: Installable on mobile devices with a native app-like experience.
- **Social Sharing**: Generate beautiful, shareable cards of your banana stats for social media.

## Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS, PostCSS
- **State Management**: React Hooks (Context-free for simplicity)
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python)
- **ML Models**: 
  - **Detection**: YOLOv8 (Ultralytics)
  - **Classification**: ResNet50 (TensorFlow/Keras)
- **Storage**: Supabase (Images & feedback data)
- **Containerization**: Docker

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Docker (optional, for containerized deployment)

### 1. Clone the Repository
```bash
git clone https://github.com/dsharma08k/BananaClock.git
cd BananaClock
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload
```
The backend will start at `http://localhost:8000`.

### 3. Frontend Setup
```bash
cd frontend
npm install

# Run the development server
npm run dev
```
The frontend will start at `http://localhost:5173`.

## Deployment

### Backend (Hugging Face Spaces)
1. Ensure your `Dockerfile` is in the `backend` root.
2. Push to Hugging Face Spaces.
3. Set the required environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `ALLOWED_ORIGINS` (your frontend URL)

### Frontend (Vercel)
1. Connect your GitHub repo to Vercel.
2. Set the `Root Directory` to `frontend`.
3. Set the build command to `npm run build`.
4. Add environment variables:
   - `VITE_API_URL`: The URL of your deployed backend.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is open-source and available under the terms of the MIT License.
