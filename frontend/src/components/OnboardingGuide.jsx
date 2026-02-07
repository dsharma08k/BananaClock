/**
 * Onboarding Guide Component
 * Shows a "First-Time User Experience" guide.
 * Automtically appears on first visit, or when triggered manually.
 */

import { useState, useEffect } from 'react'
import { X, ChevronRight, Camera, Upload, Clock } from 'lucide-react'

const OnboardingGuide = ({ isOpen, onClose }) => {
    const [currentSlide, setCurrentSlide] = useState(0)

    const slides = [
        {
            title: "Welcome to BananaClock 🍌",
            description: "The AI-powered assistant that tracks your banana's life cycle. Stop guessing and start knowing exactly when to eat.",
            icon: <div className="text-6xl mb-4">🍌</div>
        },
        {
            title: "Snap or Upload",
            description: "Take a photo directly or upload one from your gallery. Our AI analyzes the peel color and texture instantly.",
            icon: (
                <div className="flex gap-4 mb-4">
                    <div className="p-4 bg-emerald-500/20 rounded-full text-emerald-400">
                        <Camera size={32} />
                    </div>
                    <div className="p-4 bg-emerald-500/20 rounded-full text-emerald-400">
                        <Upload size={32} />
                    </div>
                </div>
            )
        },
        {
            title: "Get Predictions",
            description: "See exactly how many days are left until spoilage, get storage tips, and track ripeness stages.",
            icon: (
                <div className="p-4 bg-amber-500/20 rounded-full text-amber-400 mb-4">
                    <Clock size={40} />
                </div>
            )
        }
    ]

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(curr => curr + 1)
        } else {
            handleClose()
        }
    }

    const handleClose = () => {
        // Mark as seen permanently
        localStorage.setItem('hasSeenOnboarding', 'true')
        onClose()
        // Reset slide after animation
        setTimeout(() => setCurrentSlide(0), 500)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm fade-in">
            <div className="w-full max-w-md bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-2xl">
                {/* Close button */}
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col items-center text-center min-h-[400px]">

                    {/* Slide Content */}
                    <div className="flex-1 flex flex-col items-center justify-center fade-in" key={currentSlide}>
                        {slides[currentSlide].icon}
                        <h3 className="text-2xl font-bold text-white mb-3">
                            {slides[currentSlide].title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                            {slides[currentSlide].description}
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="w-full mt-8">
                        {/* Dots */}
                        <div className="flex justify-center gap-2 mb-6">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-6 bg-emerald-500' : 'bg-gray-700'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Button */}
                        <button
                            onClick={nextSlide}
                            className="w-full btn-primary flex items-center justify-center gap-2 group"
                        >
                            {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
                            {currentSlide < slides.length - 1 && (
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OnboardingGuide
