# BananaClock Architecture

## System Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │────▶│    Backend      │────▶│   ML Models     │
│  React + Vite   │     │    FastAPI      │     │ YOLO + ResNet50 │
│    (Vercel)     │     │ (HuggingFace)   │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                │
                                ▼
                        ┌─────────────────┐
                        │    Supabase     │
                        │   (Database)    │
                        └─────────────────┘
```

## Frontend Architecture

**Tech Stack**: React 18 + Vite + TailwindCSS

### Key Components
| Component | Purpose |
|-----------|---------|
| `Home.jsx` | Main page, state management |
| `ImageUpload.jsx` | Dropzone + camera capture |
| `ResultDisplay.jsx` | Shows predictions with bounding boxes |
| `ShareCard.jsx` | Generates shareable cards |
| `RecipeModal.jsx` | Banana recipe suggestions |

### State Flow
```
User uploads image
    ↓
ImageUpload → onImageSelect(file)
    ↓
Home.jsx → analyzeImage() → API call
    ↓
ResultDisplay ← receives predictions
```

## Backend Architecture

**Tech Stack**: FastAPI + Python 3.10+

### API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/predict` | POST | Analyze banana image |
| `/feedback` | POST | Submit correction feedback |
| `/share` | GET | Generate OG meta tags |
| `/health` | GET | Health check |

### ML Pipeline
1. **Detection (YOLOv8)**: Locates bananas in image
2. **Classification (ResNet50)**: Predicts ripeness per banana
3. **Post-processing**: Aggregates results, calculates shelf life

## Database Schema (Supabase)

### `feedback` Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| prediction_id | TEXT | Original prediction reference |
| original_condition | TEXT | What model predicted |
| correct_condition | TEXT | User correction |
| created_at | TIMESTAMP | Submission time |

## Deployment

| Service | Platform | Purpose |
|---------|----------|---------|
| Frontend | Vercel | Static hosting + CDN |
| Backend | HuggingFace Spaces | API + ML inference |
| Database | Supabase | PostgreSQL + Storage |

## Security Considerations

- Image validation before processing
- File size limits (10MB max)
- Rate limiting on prediction endpoint
- CORS configured for production origins
