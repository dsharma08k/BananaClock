/**
 * FeedbackForm Component
 * Modal form for reporting incorrect predictions
 */

import { useState } from 'react'
import { submitFeedback } from '../services/api'

const RIPENESS_CLASSES = [
    { value: 'fresh', label: 'Fresh', description: 'Green banana, firm, not ripe yet' },
    { value: 'slightly_ripe', label: 'Slightly Ripe', description: 'Yellow with green tips, getting ripe' },
    { value: 'ripe', label: 'Ripe', description: 'Fully yellow, perfect for eating' },
    { value: 'overripe', label: 'Overripe', description: 'Yellow with brown spots, very soft' },
    { value: 'spoiled', label: 'Spoiled', description: 'Mostly brown/black, not edible' },
]

const FeedbackForm = ({ isOpen, onClose, imageFile, prediction }) => {
    const [selectedClass, setSelectedClass] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState(null)

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!selectedClass || !imageFile || !prediction) {
            setSubmitStatus({ type: 'error', message: 'Please select the correct condition' })
            return
        }

        setIsSubmitting(true)
        setSubmitStatus(null)

        try {
            await submitFeedback(
                imageFile,
                prediction.condition,
                selectedClass,
                prediction.confidence
            )

            setSubmitStatus({ type: 'success', message: 'Thank you for your feedback!' })

            // Close modal after 2 seconds
            setTimeout(() => {
                onClose()
                setSelectedClass('')
                setSubmitStatus(null)
            }, 2000)
        } catch (error) {
            setSubmitStatus({ type: 'error', message: error.message || 'Failed to submit feedback' })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div className="card w-full max-w-md p-6 fade-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Report Incorrect Prediction
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Current prediction info */}
                <div className="mb-6 p-3 bg-gray-100 dark:bg-dark-panel rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Model predicted: <span className="font-semibold text-gray-800 dark:text-gray-100">{prediction?.condition?.replace('_', ' ')}</span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Confidence: <span className="font-semibold text-gray-800 dark:text-gray-100">{Math.round((prediction?.confidence || 0) * 100)}%</span>
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        What is the correct condition?
                    </label>

                    {/* Radio options */}
                    <div className="space-y-2 mb-6">
                        {RIPENESS_CLASSES.map((cls) => (
                            <label
                                key={cls.value}
                                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${selectedClass === cls.value
                                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="correctClass"
                                    value={cls.value}
                                    checked={selectedClass === cls.value}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="mt-1 w-4 h-4 text-emerald-500 focus:ring-emerald-500"
                                />
                                <div>
                                    <span className="font-medium text-gray-800 dark:text-gray-100">
                                        {cls.label}
                                    </span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {cls.description}
                                    </p>
                                </div>
                            </label>
                        ))}
                    </div>

                    {/* Status message */}
                    {submitStatus && (
                        <div className={`mb-4 p-3 rounded-lg text-sm ${submitStatus.type === 'success'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            }`}>
                            {submitStatus.message}
                        </div>
                    )}

                    {/* Submit button */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!selectedClass || isSubmitting}
                            className="btn-primary flex-1 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Feedback'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FeedbackForm
