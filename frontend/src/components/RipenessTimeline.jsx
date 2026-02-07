/**
 * Ripeness Timeline Component
 * Visual progression from fresh to spoiled
 */

const RipenessTimeline = ({ currentCondition }) => {
    const stages = [
        { id: 'fresh', label: 'Fresh', color: 'bg-emerald-500', textColor: 'text-emerald-400' },
        { id: 'slightly_ripe', label: 'Slightly Ripe', color: 'bg-lime-500', textColor: 'text-lime-400' },
        { id: 'ripe', label: 'Ripe', color: 'bg-amber-500', textColor: 'text-amber-400' },
        { id: 'overripe', label: 'Overripe', color: 'bg-orange-500', textColor: 'text-orange-400' },
        { id: 'spoiled', label: 'Spoiled', color: 'bg-red-500', textColor: 'text-red-400' },
    ]

    const currentIndex = stages.findIndex(s => s.id === currentCondition)

    return (
        <div className="w-full py-4">
            {/* Timeline bar */}
            <div className="relative flex items-center justify-between mb-2">
                {/* Background line */}
                <div className="absolute left-0 right-0 h-1 bg-gray-700 rounded-full" />

                {/* Progress line */}
                <div
                    className="absolute left-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 rounded-full transition-all duration-700"
                    style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}
                />

                {/* Stage markers */}
                {stages.map((stage, index) => {
                    const isPast = index <= currentIndex
                    const isCurrent = index === currentIndex

                    return (
                        <div key={stage.id} className="relative z-10 flex flex-col items-center">
                            {/* Marker dot */}
                            <div
                                className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${isCurrent
                                        ? `${stage.color} border-white scale-125 shadow-lg`
                                        : isPast
                                            ? `${stage.color} border-gray-800`
                                            : 'bg-gray-700 border-gray-600'
                                    }`}
                            >
                                {isCurrent && (
                                    <div className="absolute inset-0 rounded-full animate-ping opacity-50"
                                        style={{ backgroundColor: 'currentColor' }} />
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Labels */}
            <div className="flex justify-between">
                {stages.map((stage, index) => {
                    const isCurrent = index === currentIndex

                    return (
                        <span
                            key={stage.id}
                            className={`text-xs transition-all duration-300 ${isCurrent ? `${stage.textColor} font-semibold` : 'text-gray-500'
                                }`}
                            style={{ width: '20%', textAlign: 'center' }}
                        >
                            {stage.label}
                        </span>
                    )
                })}
            </div>
        </div>
    )
}

export default RipenessTimeline
