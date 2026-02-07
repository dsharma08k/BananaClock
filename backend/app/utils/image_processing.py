"""
Image Processing Utilities for BananaClock API.
Handles image upload processing, normalization, and format conversion.
"""

import numpy as np
from PIL import Image
import cv2
from io import BytesIO
from typing import Tuple
import logging

logger = logging.getLogger(__name__)


def process_uploaded_image(file_bytes: bytes, target_size: Tuple[int, int] = (416, 416)) -> np.ndarray:
    """
    Process uploaded image bytes into a normalized numpy array.
    
    Args:
        file_bytes: Raw image bytes from file upload
        target_size: Target size for resizing (width, height)
        
    Returns:
        RGB image as numpy array
    """
    # Open image from bytes
    image = Image.open(BytesIO(file_bytes))
    
    # Convert to RGB if necessary
    if image.mode != "RGB":
        image = image.convert("RGB")
    
    # Convert to numpy array
    image_array = np.array(image)
    
    logger.info(f"Processed image with shape: {image_array.shape}")
    
    return image_array


def resize_image(image: np.ndarray, target_size: Tuple[int, int]) -> np.ndarray:
    """
    Resize image to target size.
    
    Args:
        image: Input image as numpy array
        target_size: Target size (width, height)
        
    Returns:
        Resized image
    """
    return cv2.resize(image, target_size)


def normalize_image(image: np.ndarray) -> np.ndarray:
    """
    Normalize image to [0, 1] range.
    
    Args:
        image: Input image as numpy array (0-255)
        
    Returns:
        Normalized image (0-1)
    """
    return image.astype(np.float32) / 255.0


def image_to_bytes(image: np.ndarray, format: str = "JPEG") -> bytes:
    """
    Convert numpy array image to bytes.
    
    Args:
        image: RGB image as numpy array
        format: Output format (JPEG, PNG)
        
    Returns:
        Image bytes
    """
    pil_image = Image.fromarray(image)
    buffer = BytesIO()
    pil_image.save(buffer, format=format)
    buffer.seek(0)
    return buffer.read()


def validate_image(file_bytes: bytes) -> bool:
    """
    Validate that the uploaded bytes represent a valid image.
    
    Args:
        file_bytes: Raw file bytes
        
    Returns:
        True if valid image, False otherwise
    """
    try:
        image = Image.open(BytesIO(file_bytes))
        image.verify()
        return True
    except Exception as e:
        logger.error(f"Image validation failed: {e}")
        return False
