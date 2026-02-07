"""
Banana Ripeness Classification Model Wrapper.
Handles prediction using the trained TensorFlow/Keras model.
"""

import numpy as np
from pathlib import Path
from typing import Tuple, List
import logging

logger = logging.getLogger(__name__)


class BananaClassifier:
    """Wrapper for the banana ripeness classification model."""
    
    def __init__(self, model_path: Path, classes: List[str]):
        """
        Initialize the classifier.
        
        Args:
            model_path: Path to the trained .h5 model file
            classes: List of class names in order
        """
        self.model = None
        self.model_path = model_path
        self.classes = classes
        self.input_size = (224, 224)
        self._load_model()
    
    def _load_model(self):
        """Load the TensorFlow model."""
        try:
            import tensorflow as tf
            if self.model_path.exists():
                self.model = tf.keras.models.load_model(str(self.model_path))
                logger.info(f"Loaded classification model from {self.model_path}")
            else:
                logger.warning(f"Model not found at {self.model_path}. Using mock predictions.")
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            self.model = None
    
    def preprocess(self, image: np.ndarray) -> np.ndarray:
        """
        Preprocess image for model input.
        
        Args:
            image: RGB image as numpy array
            
        Returns:
            Preprocessed image ready for prediction
        """
        import cv2
        
        # Resize to model input size
        resized = cv2.resize(image, self.input_size)
        
        # Normalize to [0, 1]
        normalized = resized.astype(np.float32) / 255.0
        
        # Add batch dimension
        batched = np.expand_dims(normalized, axis=0)
        
        return batched
    
    def predict(self, image: np.ndarray) -> Tuple[str, float]:
        """
        Predict ripeness class for a banana image.
        
        Args:
            image: RGB image as numpy array
            
        Returns:
            Tuple of (predicted class name, confidence score)
        """
        preprocessed = self.preprocess(image)
        
        if self.model is not None:
            predictions = self.model.predict(preprocessed, verbose=0)
            class_idx = np.argmax(predictions[0])
            confidence = float(predictions[0][class_idx])
        else:
            # Mock prediction for development without trained model
            class_idx = np.random.randint(0, len(self.classes))
            confidence = np.random.uniform(0.7, 0.98)
            logger.info("Using mock prediction (model not loaded)")
        
        predicted_class = self.classes[class_idx]
        return predicted_class, confidence
    
    def predict_batch(self, images: List[np.ndarray]) -> List[Tuple[str, float]]:
        """
        Predict ripeness for multiple images.
        
        Args:
            images: List of RGB images as numpy arrays
            
        Returns:
            List of (class name, confidence) tuples
        """
        results = []
        for image in images:
            result = self.predict(image)
            results.append(result)
        return results
