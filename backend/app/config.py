"""
Configuration settings for BananaClock API.
Uses pydantic-settings for environment variable management.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Settings
    app_name: str = "BananaClock API"
    debug: bool = False
    
    # Model Paths
    model_dir: Path = Path(__file__).parent.parent / "trained_models"
    classifier_model_path: str = "banana_classifier.h5"
    yolo_model_path: str = "banana_yolo.pt"
    
    # Supabase Configuration
    supabase_url: str = ""
    supabase_key: str = ""
    
    # Deployment
    backend_url: str = "http://localhost:8000"
    allowed_origins: str = "http://localhost:5173"
    
    # Image Processing
    image_size: int = 416
    confidence_threshold: float = 0.5
    
    # Ripeness Classes
    ripeness_classes: list = ["fresh", "slightly_ripe", "ripe", "overripe", "spoiled"]
    
    # Days until bad mapping
    days_mapping: dict = {
        "fresh": {"min": 5, "max": 7},
        "slightly_ripe": {"min": 4, "max": 5},
        "ripe": {"min": 2, "max": 3},
        "overripe": {"min": 0, "max": 1},
        "spoiled": {"min": 0, "max": 0}
    }
    
    # Storage tips mapping
    storage_tips: dict = {
        "fresh": [
            "Keep at room temperature",
            "Avoid direct sunlight",
            "Separate from other fruits"
        ],
        "slightly_ripe": [
            "Store at room temperature",
            "Use within 4-5 days",
            "Great for eating soon"
        ],
        "ripe": [
            "Store in fridge to extend 2-3 days",
            "Perfect for eating now",
            "Great for smoothies"
        ],
        "overripe": [
            "Eat today or freeze for smoothies",
            "Perfect for banana bread",
            "Store in fridge to slow browning"
        ],
        "spoiled": [
            "Not recommended for consumption",
            "Can be composted",
            "Check for mold before any use"
        ]
    }
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
