"""
Feedback Endpoint for BananaClock API.
Handles user feedback when predictions are incorrect.
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Optional
import logging

from app.utils.storage import upload_image
from app.utils.database import insert_feedback
from app.config import get_settings

logger = logging.getLogger(__name__)
router = APIRouter()
settings = get_settings()


class FeedbackResponse(BaseModel):
    """Feedback submission response."""
    success: bool
    message: str
    feedback_id: Optional[str] = None


@router.post("/feedback", response_model=FeedbackResponse)
async def submit_feedback(
    file: UploadFile = File(...),
    predicted_label: str = Form(...),
    correct_label: str = Form(...),
    confidence: float = Form(...)
):
    """
    Submit feedback for incorrect predictions.
    
    Uploads the image to Supabase Storage and stores feedback data in Supabase
    for future model improvement.
    
    Args:
        file: The image file that was incorrectly predicted
        predicted_label: The label the model predicted
        correct_label: The label the user believes is correct
        confidence: The confidence score of the original prediction
    """
    # Validate correct_label is valid
    if correct_label not in settings.ripeness_classes:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid correct_label. Must be one of: {settings.ripeness_classes}"
        )
    
    # Validate predicted_label is valid
    if predicted_label not in settings.ripeness_classes:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid predicted_label. Must be one of: {settings.ripeness_classes}"
        )
    
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read file bytes
        file_bytes = await file.read()
        
        # Upload to Supabase Storage
        image_url = await upload_image(file_bytes)
        
        if image_url is None:
            # Fallback: store without image URL
            image_url = "upload_failed"
            logger.warning("Storage upload failed, storing feedback without image URL")
        
        # Store feedback in database
        result = await insert_feedback(
            image_url=image_url,
            predicted_label=predicted_label,
            correct_label=correct_label,
            confidence=confidence
        )
        
        if result:
            feedback_id = result.get("id", "unknown")
            logger.info(f"Feedback submitted successfully: {feedback_id}")
            return FeedbackResponse(
                success=True,
                message="Thank you for your feedback! This will help improve our model.",
                feedback_id=str(feedback_id)
            )
        else:
            return FeedbackResponse(
                success=True,
                message="Feedback received. Thank you for helping improve our model.",
                feedback_id=None
            )
            
    except Exception as e:
        logger.error(f"Feedback submission failed: {e}")
        raise HTTPException(status_code=500, detail=f"Feedback submission failed: {str(e)}")


@router.get("/feedback/classes")
async def get_ripeness_classes():
    """Get list of valid ripeness classes for feedback form."""
    return {
        "classes": settings.ripeness_classes,
        "descriptions": {
            "fresh": "Green banana, firm, not ripe yet",
            "slightly_ripe": "Yellow with green tips, getting ripe",
            "ripe": "Fully yellow, perfect for eating",
            "overripe": "Yellow with brown spots, very soft",
            "spoiled": "Mostly brown/black, not edible"
        }
    }
