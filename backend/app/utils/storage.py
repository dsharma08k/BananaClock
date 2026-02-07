"""
Supabase Storage Integration for BananaClock.
Handles image uploads for feedback storage.
"""

import uuid
from typing import Optional
import logging

from app.config import get_settings
from app.utils.database import get_supabase_client

logger = logging.getLogger(__name__)
settings = get_settings()

BUCKET_NAME = "feedback-images"


async def upload_image(image_bytes: bytes, filename: str = None, bucket_name: str = BUCKET_NAME) -> Optional[str]:
    """
    Upload image to Supabase Storage and return the public URL.
    
    Args:
        image_bytes: Raw image bytes
        filename: Optional filename, will generate UUID if not provided
        bucket_name: Target bucket name (default: feedback-images)
        
    Returns:
        Public URL of the uploaded image or None if failed
    """
    try:
        supabase = get_supabase_client()
        if not supabase:
            logger.warning("Supabase client not available")
            return None
        
        # Generate unique filename if not provided
        if not filename:
            filename = f"{uuid.uuid4()}.jpg"
        
        # Upload to Supabase Storage
        result = supabase.storage.from_(bucket_name).upload(
            path=filename,
            file=image_bytes,
            file_options={"content-type": "image/jpeg"}
        )
        
        # Get public URL
        public_url = supabase.storage.from_(bucket_name).get_public_url(filename)
        
        logger.info(f"Image uploaded to Supabase Storage: {public_url}")
        return public_url
            
    except Exception as e:
        logger.error(f"Supabase Storage upload error: {e}")
        return None


async def delete_image(filename: str) -> bool:
    """
    Delete an image from Supabase Storage.
    
    Args:
        filename: The filename/path of the image to delete
        
    Returns:
        True if deleted successfully, False otherwise
    """
    try:
        supabase = get_supabase_client()
        if not supabase:
            return False
        
        supabase.storage.from_(BUCKET_NAME).remove([filename])
        return True
        
    except Exception as e:
        logger.error(f"Supabase Storage delete error: {e}")
        return False



