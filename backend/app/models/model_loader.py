"""
Model Loader - Singleton pattern for loading and caching ML models.
"""

from pathlib import Path
from functools import lru_cache
import logging

from app.config import get_settings
from app.models.classification_model import BananaClassifier
from app.models.detection_model import BananaDetector

logger = logging.getLogger(__name__)
settings = get_settings()


@lru_cache()
def get_classifier() -> BananaClassifier:
    """
    Get the cached banana classifier instance.
    
    Returns:
        BananaClassifier instance
    """
    model_path = settings.model_dir / settings.classifier_model_path
    logger.info(f"Loading classifier from {model_path}")
    
    return BananaClassifier(
        model_path=model_path,
        classes=settings.ripeness_classes
    )


@lru_cache()
def get_detector() -> BananaDetector:
    """
    Get the cached banana detector instance.
    
    Returns:
        BananaDetector instance
    """
    model_path = settings.model_dir / settings.yolo_model_path
    logger.info(f"Loading detector from {model_path}")
    
    return BananaDetector(
        model_path=model_path,
        confidence_threshold=settings.confidence_threshold
    )


def preload_models():
    """Pre-load all models into memory at startup."""
    logger.info("Pre-loading models...")
    get_classifier()
    get_detector()
    logger.info("Models pre-loaded successfully")
