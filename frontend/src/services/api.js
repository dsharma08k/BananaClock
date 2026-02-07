/**
 * API Service for BananaClock
 * Handles all communication with the backend API
 */

import axios from 'axios'

// API base URL - update for production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 300000, // 5 minute timeout for ML predictions (Cold Start)
})

/**
 * Predict banana ripeness from an image
 * @param {File} imageFile - The image file to analyze
 * @returns {Promise<Object>} Prediction results
 */
export const predictBanana = async (imageFile) => {
    const formData = new FormData()
    formData.append('file', imageFile)

    try {
        const response = await api.post('/predict', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    } catch (error) {
        console.error('Prediction error:', error)
        throw new Error(error.response?.data?.detail || 'Failed to analyze image')
    }
}

/**
 * Submit feedback for incorrect predictions
 * @param {File} imageFile - The image file
 * @param {string} predictedLabel - What the model predicted
 * @param {string} correctLabel - What the correct label should be
 * @param {number} confidence - Original confidence score
 * @returns {Promise<Object>} Feedback submission result
 */
export const submitFeedback = async (imageFile, predictedLabel, correctLabel, confidence) => {
    const formData = new FormData()
    formData.append('file', imageFile)
    formData.append('predicted_label', predictedLabel)
    formData.append('correct_label', correctLabel)
    formData.append('confidence', confidence.toString())

    try {
        const response = await api.post('/feedback', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    } catch (error) {
        console.error('Feedback submission error:', error)
        throw new Error(error.response?.data?.detail || 'Failed to submit feedback')
    }
}

/**
 * Upload share card image for social sharing
 * @param {Blob} imageBlob - The image blob to upload
 * @returns {Promise<Object>} Upload result with public_url
 */
export const uploadShareImage = async (imageBlob) => {
    const formData = new FormData()
    // Append blob as 'file' with a filename
    formData.append('file', imageBlob, 'share_card.jpg')
    // We reuse the feedback endpoint logic or create a new one?
    // Wait, I didn't create a backend route for UPLOADING share images.
    // I only created GET /share for metadata.
    // I need a way to upload.
    // I can reuse POST /feedback but that inserts into DB.
    // I should create a generic upload endpoint or use Supabase client directly from frontend.
    // Using backend proxy is cleaner to keep keys hidden (though we expose anon key in frontend anyway).
    // Let's create POST /share/upload in backend to handle this cleanly.

    // For now, I will assume I will create POST /share/upload in share.py
    try {
        const response = await api.post('/share/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    } catch (error) {
        console.error('Share upload error:', error)
        throw new Error(error.response?.data?.detail || 'Failed to generate share link')
    }
}

/**
 * Get list of valid ripeness classes
 * @returns {Promise<Object>} Classes and descriptions
 */
export const getRipenessClasses = async () => {
    try {
        const response = await api.get('/feedback/classes')
        return response.data
    } catch (error) {
        console.error('Failed to get ripeness classes:', error)
        // Return default classes as fallback
        return {
            classes: ['fresh', 'slightly_ripe', 'ripe', 'overripe', 'spoiled'],
            descriptions: {
                fresh: 'Green banana, firm, not ripe yet',
                slightly_ripe: 'Yellow with green tips, getting ripe',
                ripe: 'Fully yellow, perfect for eating',
                overripe: 'Yellow with brown spots, very soft',
                spoiled: 'Mostly brown/black, not edible',
            },
        }
    }
}

/**
 * Health check endpoint
 * @returns {Promise<Object>} Health status
 */
export const healthCheck = async () => {
    try {
        const response = await api.get('/health')
        return response.data
    } catch (error) {
        console.error('Health check failed:', error)
        return { status: 'unhealthy' }
    }
}

export default api
