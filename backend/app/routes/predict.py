"""
Prediction Endpoint for BananaClock API.
Handles banana image analysis and ripeness prediction.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from pydantic import BaseModel
from typing import List
import logging

from slowapi import Limiter
from slowapi.util import get_remote_address

from app.models.model_loader import get_classifier, get_detector
from app.utils.image_processing import process_uploaded_image, validate_image
from app.config import get_settings

logger = logging.getLogger(__name__)
router = APIRouter()
settings = get_settings()

# Rate limiter instance (shared with main.py)
limiter = Limiter(key_func=get_remote_address)

# File size limit: 10MB
MAX_FILE_SIZE = 10 * 1024 * 1024


class BananaPrediction(BaseModel):
    """Single banana prediction result."""
    banana_id: int
    condition: str
    confidence: float
    days_until_bad: int
    days_range: str
    storage_tips: List[str]
    bbox: List[int]


class PredictionResponse(BaseModel):
    """Full prediction response."""
    bananas_detected: int
    predictions: List[BananaPrediction]
    worst_condition: str
    earliest_spoilage: int
    overall_tips: List[str]


def get_days_until_bad(condition: str) -> tuple:
    """
    Get days until bad based on condition.
    
    Returns:
        Tuple of (min_days, max_days, display_string)
    """
    days_info = settings.days_mapping.get(condition, {"min": 0, "max": 0})
    min_days = days_info["min"]
    max_days = days_info["max"]
    
    if min_days == max_days:
        display = f"{min_days}"
    else:
        display = f"{min_days}-{max_days}"
    
    return min_days, max_days, display


def get_condition_rank(condition: str) -> int:
    """Get numerical rank for condition (higher = worse)."""
    ranks = {
        "fresh": 1,
        "slightly_ripe": 2,
        "ripe": 3,
        "overripe": 4,
        "spoiled": 5
    }
    return ranks.get(condition, 3)


@router.post("/predict", response_model=PredictionResponse)
@limiter.limit("30/minute")
async def predict_banana_ripeness(request: Request, file: UploadFile = File(...)):
    """
    Analyze banana image and predict ripeness.
    
    Accepts an image file and returns:
    - Number of bananas detected
    - Per-banana predictions with condition, confidence, and days until bad
    - Overall worst condition and earliest spoilage date
    - Storage tips based on conditions
    """
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Read file bytes
    file_bytes = await file.read()
    
    # Validate file size
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 10MB.")
    
    # Validate image
    if not validate_image(file_bytes):
        raise HTTPException(status_code=400, detail="Invalid image file")
    
    try:
        # Process image
        image = process_uploaded_image(file_bytes)
        
        # Get models
        detector = get_detector()
        classifier = get_classifier()
        
        # Detect bananas
        detections, crops = detector.detect_and_crop(image)
        
        if len(crops) == 0:
            # No bananas detected, analyze whole image
            crops = [image]
            detections = [{"bbox": (0, 0, image.shape[1], image.shape[0]), "confidence": 1.0}]
        
        # Classify each detected banana
        predictions = []
        worst_condition = "fresh"
        worst_rank = 0
        earliest_spoilage = 999
        
        for idx, crop in enumerate(crops):
            condition, confidence = classifier.predict(crop)
            min_days, max_days, days_display = get_days_until_bad(condition)
            
            # Get bbox for this banana
            bbox = list(detections[idx]["bbox"])
            
            # Track worst condition
            rank = get_condition_rank(condition)
            if rank > worst_rank:
                worst_rank = rank
                worst_condition = condition
            
            # Track earliest spoilage
            if min_days < earliest_spoilage:
                earliest_spoilage = min_days
            
            # Get storage tips for this condition
            tips = settings.storage_tips.get(condition, [])
            
            predictions.append(BananaPrediction(
                banana_id=idx + 1,
                condition=condition,
                confidence=round(confidence, 2),
                days_until_bad=min_days,
                days_range=days_display,
                storage_tips=tips,
                bbox=bbox
            ))
        
        # Get overall tips based on worst condition
        overall_tips = settings.storage_tips.get(worst_condition, [])
        
        # Clean up - image is processed, no need to store
        del image
        del crops
        
        logger.info(f"Prediction complete: {len(predictions)} bananas detected")
        
        return PredictionResponse(
            bananas_detected=len(predictions),
            predictions=predictions,
            worst_condition=worst_condition,
            earliest_spoilage=earliest_spoilage if earliest_spoilage < 999 else 0,
            overall_tips=overall_tips
        )
        
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        # Return generic error message to client for security
        raise HTTPException(status_code=500, detail="An error occurred while processing the image.")
