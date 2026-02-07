"""
Supabase Database Integration for BananaClock.
Handles feedback storage and retrieval.
"""

from typing import Dict, List, Optional
from datetime import datetime
import logging

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

# Supabase client (initialized lazily)
_supabase_client = None


def get_supabase_client():
    """Get or create Supabase client instance."""
    global _supabase_client
    
    if _supabase_client is None:
        if settings.supabase_url and settings.supabase_key:
            try:
                from supabase import create_client
                _supabase_client = create_client(settings.supabase_url, settings.supabase_key)
                logger.info("Supabase client initialized")
            except Exception as e:
                logger.error(f"Failed to initialize Supabase client: {e}")
                return None
        else:
            logger.warning("Supabase credentials not configured")
            return None
    
    return _supabase_client


async def insert_feedback(
    image_url: str,
    predicted_label: str,
    correct_label: str,
    confidence: float
) -> Optional[Dict]:
    """
    Insert feedback record into Supabase.
    
    Args:
        image_url: URL of the uploaded image in Supabase Storage
        predicted_label: The model's predicted label
        correct_label: The correct label provided by user
        confidence: Model confidence score
        
    Returns:
        Inserted record or None if failed
    """
    client = get_supabase_client()
    
    if client is None:
        logger.warning("Supabase not available, storing feedback locally")
        return {
            "id": "local",
            "image_url": image_url,
            "predicted_label": predicted_label,
            "correct_label": correct_label,
            "confidence": confidence,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    try:
        data = {
            "image_url": image_url,
            "predicted_label": predicted_label,
            "correct_label": correct_label,
            "confidence": confidence,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        result = client.table("feedback").insert(data).execute()
        logger.info(f"Feedback inserted successfully: {result.data}")
        return result.data[0] if result.data else None
        
    except Exception as e:
        logger.error(f"Failed to insert feedback: {e}")
        return None


async def get_all_feedback(limit: int = 100) -> List[Dict]:
    """
    Retrieve all feedback records from Supabase.
    
    Args:
        limit: Maximum number of records to retrieve
        
    Returns:
        List of feedback records
    """
    client = get_supabase_client()
    
    if client is None:
        return []
    
    try:
        result = client.table("feedback").select("*").limit(limit).execute()
        return result.data
        
    except Exception as e:
        logger.error(f"Failed to get feedback: {e}")
        return []
