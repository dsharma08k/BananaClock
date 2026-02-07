/**
 * Loading Animation Component
 * Animated banana during analysis
 */

const LoadingAnimation = () => {
    return (
        <div className="flex flex-col items-center justify-center py-12 fade-in">
            {/* Animated banana */}
            <div className="relative w-24 h-24 mb-6">
                <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full animate-pulse"
                >
                    {/* Banana shape - centered */}
                    <g transform="translate(5, 30) rotate(-10 50 20)">
                        <path
                            d="M15 30 C10 28, 8 20, 15 12 C25 2, 50 0, 75 5 C85 8, 90 15, 85 22 C80 30, 60 35, 40 33 C25 31, 18 32, 15 30 Z"
                            fill="#FBBF24"
                            className="drop-shadow-lg"
                        />
                        {/* Stem detail */}
                        <path
                            d="M85 22 Q 92 25 95 20"
                            stroke="#A16207"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                        />
                        {/* Highlight */}
                        <path
                            d="M25 15 Q 50 8 70 12"
                            stroke="#FCD34D"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            opacity="0.8"
                        />
                    </g>
                </svg>

                {/* Rotating ring */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-28 h-28 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                </div>
            </div>

            {/* Loading text */}
            <p className="text-lg font-medium text-gray-300 mb-2">
                Analyzing banana...
            </p>
            <p className="text-sm text-gray-500">
                This may take a few seconds
            </p>

            {/* Progress dots */}
            <div className="flex gap-1 mt-4">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    )
}

export default LoadingAnimation
