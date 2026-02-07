/**
 * ResultDisplay Component
 * Shows prediction results with animated counters, timeline, and share button
 */

import { useState, useMemo, useEffect } from 'react'
import RipenessTimeline from './RipenessTimeline'
import { useAnimatedCounter } from '../hooks/useAnimatedCounter'
import RecipeModal from './RecipeModal'
import { ChefHat, Flag, Share2 } from 'lucide-react'

const ResultDisplay = ({ result, onReportIncorrect, onShare, activeCondition, onConditionChange }) => {
    const [showRecipes, setShowRecipes] = useState(false)

    // Calculate stats from predictions (Memoized)
    const stats = useMemo(() => {
        if (!result || !result.predictions.length) return null;

        const counts = {};
        let majorityCount = 0;
        let majorityCondition = result.predictions[0].condition;
        const conditionData = {}; // Map condition -> { days, confidence }

        result.predictions.forEach(p => {
            // Count conditions
            counts[p.condition] = (counts[p.condition] || 0) + 1;
            if (counts[p.condition] > majorityCount) {
                majorityCount = counts[p.condition];
                majorityCondition = p.condition;
            }
            // Store representative data (taking the min days for safety)
            if (!conditionData[p.condition] || p.days_until_bad < conditionData[p.condition].days) {
                conditionData[p.condition] = {
                    days: p.days_until_bad,
                    confidence: p.confidence,
                    tips: p.storage_tips
                };
            }
        });

        // Sort counts for display (highest first)
        const sortedCounts = Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .map(([cond, count]) => ({ condition: cond, count }));

        return {
            majorityCondition,
            sortedCounts,
            conditionData,
            isMixed: Object.keys(counts).length > 1
        };
    }, [result]);

    // Set initial active condition to majority (Effect)
    useEffect(() => {
        if (stats && !activeCondition) {
            onConditionChange(stats.majorityCondition);
        }
    }, [stats, activeCondition, onConditionChange]);

    // Prepare data safely for hooks
    const safeCondition = activeCondition || (stats ? stats.majorityCondition : 'ripe');
    const safeData = (stats && stats.conditionData[safeCondition]) || { days: 0, confidence: 0, tips: [] };

    // Hooks must be called unconditionally at top level
    const animatedConfidence = useAnimatedCounter(Math.round(safeData.confidence * 100), 1200, 0, safeCondition)
    const animatedDays = useAnimatedCounter(safeData.days, 800, 0, safeCondition)

    // Early return if data missing
    if (!result || !stats || !activeCondition) return null

    // Destructure real data
    const { sortedCounts, conditionData, isMixed, majorityCondition } = stats;
    const currentData = conditionData[activeCondition];

    const daysLeft = currentData.days;
    const confidence = currentData.confidence;
    const tips = currentData.tips || [];

    // Condition display mapping
    const conditionDisplay = {
        fresh: 'Fresh',
        slightly_ripe: 'Slightly Ripe',
        ripe: 'Perfectly Ripe',
        overripe: 'Overripe',
        spoiled: 'Spoiled',
    }

    // Get badge class
    const getBadgeClass = (condition) => {
        const classes = {
            fresh: 'badge-fresh',
            slightly_ripe: 'badge-slightly-ripe',
            ripe: 'badge-ripe',
            overripe: 'badge-overripe',
            spoiled: 'badge-spoiled',
        }
        return classes[condition] || 'badge-ripe'
    }

    // Dot colors
    const getDotColor = (condition) => {
        switch (condition) {
            case 'fresh': return 'bg-emerald-500';
            case 'slightly_ripe': return 'bg-lime-500';
            case 'ripe': return 'bg-amber-500';
            case 'overripe': return 'bg-orange-600';
            case 'spoiled': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    }

    const getRingColor = (condition) => {
        switch (condition) {
            case 'fresh': return 'ring-emerald-500';
            case 'slightly_ripe': return 'ring-lime-500';
            case 'ripe': return 'ring-amber-500';
            case 'overripe': return 'ring-orange-600';
            case 'spoiled': return 'ring-red-500';
            default: return 'ring-gray-500';
        }
    }

    // Confidence Circle Calc (Large Size)
    const { circumference, offset } = ((conf) => {
        const radius = 58
        const circumference = 2 * Math.PI * radius
        const offset = circumference - (conf * circumference)
        return { circumference, offset }
    })(confidence);

    const hasRecipes = ['ripe', 'overripe'].includes(activeCondition)

    return (
        <div className="w-full max-w-md mx-auto fade-in">
            <div className="card p-6 pb-2 relative">
                {/* Action Area (Top Right) */}
                <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                    <button
                        onClick={onShare}
                        className="p-2 transition-all duration-300 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20 group/share shadow-lg backdrop-blur-sm"
                        title="Share Result"
                    >
                        <Share2 size={16} />
                    </button>
                    <button
                        onClick={onReportIncorrect}
                        className="p-2 transition-all duration-300 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 shadow-lg backdrop-blur-sm"
                        title="Report Incorrect"
                    >
                        <Flag size={16} />
                    </button>
                </div>

                {/* Header Section */}
                <div className="flex flex-col items-center mb-4 transition-all duration-300">
                    <span className={`px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-2 transition-colors duration-300 ${getBadgeClass(activeCondition)}`}>
                        {isMixed && activeCondition === majorityCondition ? 'MOSTLY ' : ''}{activeCondition?.replace('_', ' ').toUpperCase()}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-100 mb-2">
                        {conditionDisplay[activeCondition]}
                    </h2>
                </div>

                <RipenessTimeline currentCondition={activeCondition} />

                {/* Stats - 2 columns */}
                <div className="grid grid-cols-2 gap-4 my-5 h-full">

                    {/* Confidence (Large) */}
                    <div className="stat-card flex flex-col items-center py-5 min-h-[160px]">
                        <p className="text-xs text-gray-400 font-medium tracking-wide mb-3">Confidence</p>
                        <div className="relative w-28 h-28 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 130 130">
                                <circle
                                    cx="65" cy="65" r="58"
                                    className="text-gray-700/30"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                    fill="transparent"
                                />
                                <circle
                                    cx="65" cy="65" r="58"
                                    className={`transition-all duration-1000 ease-out ${animatedConfidence < 70 ? 'text-red-500' :
                                        animatedConfidence < 85 ? 'text-amber-500' :
                                            'text-emerald-500'
                                        }`}
                                    stroke="currentColor"
                                    strokeWidth="10"
                                    fill="transparent"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={offset}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="absolute text-2xl font-bold text-gray-100">
                                {animatedConfidence}%
                            </span>
                        </div>
                    </div>

                    {/* Shelf Life with Dots */}
                    <div className="stat-card flex flex-col items-center justify-between py-5 relative transition-colors duration-300 min-h-[140px]">
                        <p className="text-xs text-gray-400 font-medium tracking-wide mb-1">Shelf Life</p>

                        <div className="text-center flex-1 flex flex-col justify-center mb-2">
                            <span className={`text-5xl font-bold transition-colors duration-300 drop-shadow-sm ${daysLeft <= 1 ? 'text-red-500' :
                                daysLeft <= 3 ? 'text-amber-500' :
                                    'text-emerald-500'
                                }`}>
                                {animatedDays}
                            </span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-semibold">days left</span>
                        </div>

                        {/* Interactive Dots */}
                        {isMixed && (
                            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 mt-auto">
                                {sortedCounts.map(({ condition, count }) => (
                                    <button
                                        key={condition}
                                        onClick={() => onConditionChange(condition)}
                                        className={`relative group flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 shadow-xl border-2 cursor-pointer active:scale-95 ${activeCondition === condition
                                            ? `border-transparent z-10 ring-2 ring-offset-2 ring-offset-[#1a1a1a] shadow-inner ${getRingColor(condition)}`
                                            : 'border-white/5 opacity-50 hover:opacity-100 hover:border-white/20 hover:-translate-y-0.5 grayscale hover:grayscale-0'
                                            } ${getDotColor(condition)}`}
                                    >
                                        <span className={`text-[10px] font-black leading-none ${['spoiled', 'overripe'].includes(condition) ? 'text-white' : 'text-black/80'}`}>
                                            {count}
                                        </span>
                                        <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-700 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20 transition-opacity duration-200 shadow-2xl">
                                            {condition.replace('_', ' ')}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Storage tips */}
                {tips.length > 0 && (
                    <div className="bg-dark-panel rounded-xl p-3 mb-2 relative group fade-in" key={activeCondition}>
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs font-medium text-gray-300">
                                    Tips for <span className="text-emerald-400 capitalize">{activeCondition?.replace('_', ' ')}</span>
                                </span>
                            </div>

                            {hasRecipes && (
                                <button
                                    onClick={() => setShowRecipes(true)}
                                    className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-[10px] font-semibold rounded-full transition-colors border border-amber-500/20 hover:border-amber-500/50"
                                >
                                    <ChefHat size={12} />
                                    <span>Ideas</span>
                                </button>
                            )}
                        </div>
                        <ul className="space-y-1 pr-1">
                            {tips.slice(0, 4).map((tip, index) => (
                                <li key={index} className="flex items-center gap-2 text-[13px] text-gray-400">
                                    <span className="text-emerald-500 flex-shrink-0 text-lg leading-none">•</span>
                                    <span className="flex-1">{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {isMixed && (
                    <p className="text-center text-[10px] text-gray-500 italic mt-2">
                        Tap the colored circles to view specific bananas.
                    </p>
                )}
            </div>

            <RecipeModal isOpen={showRecipes} onClose={() => setShowRecipes(false)} condition={activeCondition} />
        </div>
    )
}

export default ResultDisplay
