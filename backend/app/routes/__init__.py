# API Routes
from app.routes.predict import router as predict_router
from app.routes.feedback import router as feedback_router

__all__ = ["predict_router", "feedback_router"]
