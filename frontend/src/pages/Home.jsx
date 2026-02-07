/**
 * Home Page
 * Main page layout with all integrated features
 */

import { useState, useCallback, useEffect } from 'react'
import Header from '../components/Header'
import ImageUpload from '../components/ImageUpload'
import ResultDisplay from '../components/ResultDisplay'
import LoadingAnimation from '../components/LoadingAnimation'
import FeedbackForm from '../components/FeedbackForm'
import CameraCapture from '../components/CameraCapture'
import ShareCard from '../components/ShareCard'
import OnboardingGuide from '../components/OnboardingGuide'
import Footer from '../components/Footer'
import { predictBanana } from '../services/api'

const Home = () => {
    const [result, setResult] = useState(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [error, setError] = useState(null)
    const [showFeedback, setShowFeedback] = useState(false)
    const [showCamera, setShowCamera] = useState(false)
    const [showShare, setShowShare] = useState(false)
    const [showOnboarding, setShowOnboarding] = useState(false)
    const [currentImage, setCurrentImage] = useState(null)
    const [capturedImage, setCapturedImage] = useState(null)
    const [activeCondition, setActiveCondition] = useState(null)

    // Check for first-time visit
    useEffect(() => {
        const hasSeen = localStorage.getItem('hasSeenOnboarding')
        if (!hasSeen) {
            // Small delay to ensure smooth loading
            setTimeout(() => setShowOnboarding(true), 500)
        }
    }, [])

    const handleImageSelect = useCallback(async (imageFile) => {
        if (!imageFile) return

        setIsAnalyzing(true)
        setError(null)
        setResult(null)
        setCurrentImage(imageFile)
        setActiveCondition(null)

        try {
            const prediction = await predictBanana(imageFile)
            setResult(prediction)
        } catch (err) {
            console.error('Prediction error:', err)
            setError(err.message || 'Failed to analyze image. Please try again.')
        } finally {
            setIsAnalyzing(false)
        }
    }, [])

    const handleCameraCapture = useCallback((file) => {
        setCapturedImage(file)
        handleImageSelect(file)
    }, [handleImageSelect])

    const handleReportIncorrect = useCallback(() => {
        setShowFeedback(true)
    }, [])

    const handleCloseFeedback = useCallback(() => {
        setShowFeedback(false)
    }, [])

    const handleOpenCamera = useCallback(() => {
        setShowCamera(true)
    }, [])

    const handleCloseCamera = useCallback(() => {
        setShowCamera(false)
    }, [])

    const handleOpenShare = useCallback(() => {
        setShowShare(true)
    }, [])

    const handleCloseShare = useCallback(() => {
        setShowShare(false)
    }, [])

    const handleOpenOnboarding = useCallback(() => {
        setShowOnboarding(true)
    }, [])

    const handleCloseOnboarding = useCallback(() => {
        setShowOnboarding(false)
    }, [])

    // Get primary prediction for feedback
    const primaryPrediction = result?.predictions?.[0] || null

    return (
        <div className="h-[100dvh] lg:h-screen flex flex-col relative z-10 overflow-hidden">
            <Header onHelpClick={handleOpenOnboarding} />

            {/* Main content */}
            <main className="flex-1 overflow-y-auto lg:overflow-hidden pt-20 pb-10 lg:pt-16 lg:pb-0 flex items-start lg:items-center scrollbar-hide">
                <div className="w-full max-w-6xl mx-auto px-4 md:px-6">
                    {/* Split layout for desktop - centered vertically */}
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center justify-center">

                        {/* Left side - Upload */}
                        <div className="w-full lg:w-[45%] max-w-lg">
                            <ImageUpload
                                onImageSelect={handleImageSelect}
                                isAnalyzing={isAnalyzing}
                                onOpenCamera={handleOpenCamera}
                                capturedImage={capturedImage}
                                result={result}
                                activeCondition={activeCondition}
                                onError={setError}
                            />

                            {/* Error message */}
                            {error && (
                                <div className="mt-3 p-3 bg-red-900/20 border border-red-800 rounded-xl text-red-300 text-center text-sm fade-in">
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* Right side - Results */}
                        <div className="w-full lg:w-[55%] flex items-center justify-center">
                            {isAnalyzing ? (
                                <div className="flex flex-col items-center justify-center min-h-[300px]">
                                    <LoadingAnimation />
                                </div>
                            ) : result ? (
                                <ResultDisplay
                                    result={result}
                                    onReportIncorrect={handleReportIncorrect}
                                    onShare={handleOpenShare}
                                    activeCondition={activeCondition}
                                    onConditionChange={setActiveCondition}
                                />
                            ) : (
                                /* Empty state */
                                <div className="text-center py-6 fade-in flex flex-col items-center">
                                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-100 mb-2">
                                        Analyze Your Banana
                                    </h2>
                                    <p className="text-gray-500 text-sm max-w-sm mx-auto">
                                        Upload an image or use your camera to detect ripeness and get storage tips.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Camera capture modal */}
            <CameraCapture
                isOpen={showCamera}
                onClose={handleCloseCamera}
                onCapture={handleCameraCapture}
            />

            {/* Share card modal */}
            <ShareCard
                isOpen={showShare}
                onClose={handleCloseShare}
                result={result}
                activeCondition={activeCondition}
            />

            {/* Feedback modal */}
            <FeedbackForm
                isOpen={showFeedback}
                onClose={handleCloseFeedback}
                imageFile={currentImage}
                prediction={primaryPrediction}
            />

            {/* Onboarding Guide */}
            <OnboardingGuide
                isOpen={showOnboarding}
                onClose={handleCloseOnboarding}
            />
        </div>
    )
}

export default Home
