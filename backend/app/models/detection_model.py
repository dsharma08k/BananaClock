"""
Banana Detection Model Wrapper using YOLOv8.
Handles detecting and cropping individual bananas from images.
"""

import numpy as np
from pathlib import Path
from typing import List, Tuple, Dict, Any
import logging

logger = logging.getLogger(__name__)


class BananaDetector:
    """Wrapper for the YOLOv8 banana detection model."""
    
    def __init__(self, model_path: Path, confidence_threshold: float = 0.5):
        """
        Initialize the detector.
        
        Args:
            model_path: Path to the trained .pt YOLO model file
            confidence_threshold: Minimum confidence for detections
        """
        self.model = None
        self.model_path = model_path
        self.confidence_threshold = confidence_threshold
        self._load_model()
    
    def _load_model(self):
        """Load the YOLO model."""
        try:
            from ultralytics import YOLO
            if self.model_path.exists():
                self.model = YOLO(str(self.model_path))
                logger.info(f"Loaded YOLO model from {self.model_path}")
            else:
                logger.warning(f"YOLO model not found at {self.model_path}. Using fallback detection.")
        except Exception as e:
            logger.error(f"Failed to load YOLO model: {e}")
            self.model = None
    
    def detect(self, image: np.ndarray) -> List[Dict[str, Any]]:
        """
        Detect bananas in the image.
        
        Args:
            image: RGB image as numpy array
            
        Returns:
            List of detection dictionaries with keys:
                - bbox: (x1, y1, x2, y2) bounding box
                - confidence: detection confidence
                - class_name: detected class name (if model provides)
        """
        if self.model is not None:
            results = self.model.predict(image, conf=self.confidence_threshold, verbose=False)
            
            detections = []
            for result in results:
                boxes = result.boxes
                for box in boxes:
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                    conf = float(box.conf[0].cpu().numpy())
                    cls_id = int(box.cls[0].cpu().numpy())
                    cls_name = result.names.get(cls_id, "banana")
                    
                    detections.append({
                        "bbox": (int(x1), int(y1), int(x2), int(y2)),
                        "confidence": conf,
                        "class_name": cls_name
                    })
            
            return detections
        else:
            # Fallback: treat entire image as single banana
            h, w = image.shape[:2]
            return [{
                "bbox": (0, 0, w, h),
                "confidence": 1.0,
                "class_name": "banana"
            }]
    
    def crop_detections(self, image: np.ndarray, detections: List[Dict[str, Any]]) -> List[np.ndarray]:
        """
        Crop detected banana regions from the image.
        
        Args:
            image: Original RGB image
            detections: List of detection dictionaries
            
        Returns:
            List of cropped image regions
        """
        crops = []
        for det in detections:
            x1, y1, x2, y2 = det["bbox"]
            crop = image[y1:y2, x1:x2]
            if crop.size > 0:
                crops.append(crop)
        return crops
    
    def detect_and_crop(self, image: np.ndarray) -> Tuple[List[Dict[str, Any]], List[np.ndarray]]:
        """
        Detect bananas and return both detections and cropped images.
        
        Args:
            image: RGB image as numpy array
            
        Returns:
            Tuple of (detections list, cropped images list)
        """
        detections = self.detect(image)
        crops = self.crop_detections(image, detections)
        return detections, crops
