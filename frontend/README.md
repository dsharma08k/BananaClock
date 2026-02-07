# BananaClock Frontend

React frontend for banana ripeness detection.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Environment Variables

Create `.env` file:
```
VITE_API_URL=http://localhost:8000
```

## Build

```bash
npm run build
```

Output in `dist/` folder.

## Components

| Component | Description |
|-----------|-------------|
| `BananaBackground` | Floating banana animation |
| `CameraCapture` | Webcam capture modal |
| `FeedbackForm` | Report incorrect prediction |
| `Header` | App header with logo |
| `ImageUpload` | Upload/camera buttons with progress |
| `LoadingAnimation` | Spinning banana loader |
| `ResultDisplay` | Results with timeline and counters |
| `RipenessTimeline` | Visual ripeness progression |
| `ShareCard` | Social media share modal |

## Hooks

| Hook | Description |
|------|-------------|
| `useAnimatedCounter` | Smooth number counting animation |
