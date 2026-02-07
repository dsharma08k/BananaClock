"""
BananaClock API - Main FastAPI Application
Analyzes banana images to predict ripeness and days until spoilage.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.routes import predict, feedback, share
from app.config import get_settings

settings = get_settings()

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Initialize FastAPI app
app = FastAPI(
    title=settings.app_name,
    description="ML-powered banana ripeness detection API",
    version="1.0.0"
)

# Attach rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS for frontend
# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(predict.router, tags=["Prediction"])
app.include_router(feedback.router, tags=["Feedback"])
app.include_router(share.router, tags=["Share"])


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": "BananaClock API Running",
        "version": "1.0.0",
        "status": "healthy"
    }


@app.get("/health")
async def health_check():
    """Detailed health check endpoint."""
    return {
        "status": "healthy",
        "models_loaded": True,
        "ripeness_classes": settings.ripeness_classes
    }
