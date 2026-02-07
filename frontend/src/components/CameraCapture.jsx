/**
 * Camera Capture Modal
 * Webcam interface for capturing banana images
 */

import { useState, useRef, useCallback, useEffect } from 'react'

const CameraCapture = ({ isOpen, onClose, onCapture }) => {
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const streamRef = useRef(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    // Start camera when modal opens
    useEffect(() => {
        if (isOpen) {
            startCamera()
        } else {
            stopCamera()
        }

        return () => stopCamera()
    }, [isOpen])

    const startCamera = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: 1280, height: 720 }
            })

            streamRef.current = stream
            if (videoRef.current) {
                videoRef.current.srcObject = stream
            }
            setIsLoading(false)
        } catch (err) {
            console.error('Camera error:', err)
            setError('Unable to access camera. Please check permissions.')
            setIsLoading(false)
        }
    }

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
            streamRef.current = null
        }
    }

    const handleCapture = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return

        const video = videoRef.current
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        // Set canvas size to video size
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0)

        // Convert to blob and create file
        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
                onCapture(file)
                onClose()
            }
        }, 'image/jpeg', 0.9)
    }, [onCapture, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm fade-in">
            <div className="relative w-full max-w-lg bg-dark-card rounded-2xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
                    <h3 className="text-lg font-semibold text-gray-100">Camera Capture</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
                        aria-label="Close Camera"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Camera preview */}
                <div className="relative aspect-[4/3] bg-black">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="spinner" />
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center p-6">
                            <p className="text-red-400 text-center">{error}</p>
                        </div>
                    )}

                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    />

                    {/* Hidden canvas for capture */}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Viewfinder overlay */}
                    {!isLoading && !error && (
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute inset-8 border-2 border-white/30 rounded-xl" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-2 border-emerald-400 rounded-full" />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 flex justify-center">
                    <button
                        onClick={handleCapture}
                        disabled={isLoading || error}
                        className="btn-primary flex items-center gap-2 disabled:opacity-50"
                        aria-label="Capture Photo"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Capture Photo
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CameraCapture
