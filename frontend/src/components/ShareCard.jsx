/**
 * Share Card Component
 * Generates shareable result card with social media links
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import { toBlob } from 'html-to-image'
import { uploadShareImage } from '../services/api'
import { Loader2, RefreshCw, X } from 'lucide-react'

const ShareCard = ({ isOpen, onClose, result, activeCondition }) => {
    const cardRef = useRef(null)
    const [copied, setCopied] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [shareLink, setShareLink] = useState(null)
    const [bgGradient, setBgGradient] = useState('from-gray-800 to-gray-900')

    const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://bananaclock.vercel.app/'

    // Get prediction data based on active condition or fallback to first
    const prediction = (activeCondition && result?.predictions)
        ? result.predictions.find(p => p.condition === activeCondition) || result.predictions[0]
        : result?.predictions?.[0] || {}

    const condition = prediction.condition || 'unknown'
    const confidence = Math.round((prediction.confidence || 0) * 100)

    // Correct logic: Use specific banana's shelf life if available, otherwise global
    const daysUntilBad = prediction.days_until_bad ?? result?.earliest_spoilage ?? 0

    // Condition display
    const conditionLabels = {
        fresh: 'Fresh',
        slightly_ripe: 'Slightly Ripe',
        ripe: 'Perfectly Ripe',
        overripe: 'Overripe',
        spoiled: 'Spoiled',
    }

    // Curated vibrant gradients (ensure text contrast is good)
    const gradients = [
        'from-orange-500 to-red-600',       // Sunset
        'from-emerald-500 to-teal-700',     // Forest
        'from-blue-500 to-indigo-700',      // Ocean
        'from-violet-500 to-purple-700',    // Royal
        'from-pink-500 to-rose-700',        // Berry
        'from-amber-400 to-orange-600',     // Citrus
        'from-cyan-500 to-blue-600',        // Sky
        'from-fuchsia-500 to-pink-600',     // Candy
        'from-lime-500 to-green-700',       // Mojito
        'from-indigo-500 to-purple-900'     // Galaxy
    ]

    // Randomize gradient on open
    useEffect(() => {
        if (isOpen) {
            const randomGradient = gradients[Math.floor(Math.random() * gradients.length)]
            setBgGradient(randomGradient)
            setShareLink(null) // Reset link on new open to force regeneration if needed
        }
    }, [isOpen])

    const randomizeColor = () => {
        let newGradient = bgGradient
        while (newGradient === bgGradient) {
            newGradient = gradients[Math.floor(Math.random() * gradients.length)]
        }
        setBgGradient(newGradient)
        setShareLink(null) // Reset link if color changes
    }

    // Base text
    const shareText = `My banana is ${conditionLabels[condition]}! 🍌 Check yours:`

    // Generate link if not already generated
    const getShareLink = async () => {
        if (shareLink) return shareLink

        setIsGenerating(true)
        try {
            // 1. Generate image from DOM
            if (!cardRef.current) throw new Error("Card ref missing")

            // Wait a tick to ensure fonts
            await new Promise(r => setTimeout(r, 100))

            const blob = await toBlob(cardRef.current, {
                quality: 0.85,
                width: 600, // Optimize size
                height: 600,
                style: { transform: 'scale(1)' } // Prevent scaling issues
            })

            if (!blob) throw new Error("Failed to generate image")

            // 2. Upload to backend/supabase
            const data = await uploadShareImage(blob)

            // 3. Set link
            setShareLink(data.share_link)
            setIsGenerating(false)
            return data.share_link

        } catch (error) {
            console.error("Share generation failed:", error)
            setIsGenerating(false)
            // Fallback to site URL
            return SITE_URL
        }
    }

    const handleShare = async (platform) => {
        const link = await getShareLink()
        const text = encodeURIComponent(shareText)
        const url = encodeURIComponent(link)

        let target = ''
        switch (platform) {
            case 'whatsapp':
                target = `https://wa.me/?text=${text}%20${url}`
                break
            case 'telegram':
                target = `https://t.me/share/url?url=${url}&text=${text}`
                break
            case 'twitter':
                target = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
                break
            default:
                break
        }

        if (target) window.open(target, '_blank')
    }

    const copyToClipboard = useCallback(async () => {
        try {
            const link = await getShareLink()
            await navigator.clipboard.writeText(`${shareText} ${link}`)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Copy failed:', err)
        }
    }, [shareText, shareLink]) // eslint-disable-line

    if (!isOpen || !result) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm fade-in">
            <div className="w-full max-w-sm bg-dark-card rounded-2xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
                    <h3 className="text-lg font-semibold text-gray-100">Share Result</h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={randomizeColor}
                            className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-800"
                            title="Randomize Color"
                        >
                            <RefreshCw size={18} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Share card preview */}
                <div className="p-6">
                    <div
                        ref={cardRef}
                        className={`relative rounded-xl p-6 bg-gradient-to-br ${bgGradient} overflow-hidden aspect-square flex flex-col justify-center items-center shadow-lg transition-colors duration-500`}
                    >
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-20">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <pattern id="banana-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <text x="5" y="15" fontSize="14">🍌</text>
                                </pattern>
                                <rect fill="url(#banana-pattern)" width="100" height="100" />
                            </svg>
                        </div>

                        {/* Content */}
                        <div className="relative text-white text-center z-10 w-full">
                            <p className="text-sm font-bold opacity-100 mb-1 uppercase tracking-wider drop-shadow-sm">BananaClock</p>
                            <h4 className="text-4xl font-bold mb-6 drop-shadow-md">{conditionLabels[condition] || 'Unknown'}</h4>

                            <div className="grid grid-cols-2 gap-4 w-full px-2">
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/10 shadow-sm">
                                    <p className="text-3xl font-bold drop-shadow-sm">{confidence}%</p>
                                    <p className="text-xs uppercase tracking-wide font-medium opacity-90">Confidence</p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/10 shadow-sm">
                                    <p className="text-3xl font-bold drop-shadow-sm">{daysUntilBad}</p>
                                    <p className="text-xs uppercase tracking-wide font-medium opacity-90">Days Left</p>
                                </div>
                            </div>

                            <p className="mt-6 text-xs font-medium opacity-80 font-mono tracking-wide">banana-clock-seven.vercel.app</p>
                        </div>
                    </div>
                </div>

                {/* Share buttons */}
                <div className="px-6 pb-6">
                    {isGenerating && (
                        <div className="text-center text-sm text-gray-400 mb-3 flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin" size={16} /> Creating preview...
                        </div>
                    )}

                    <div className="grid grid-cols-4 gap-3 mb-4">
                        {/* WhatsApp */}
                        <button
                            onClick={() => handleShare('whatsapp')}
                            disabled={isGenerating}
                            className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 transition-colors disabled:opacity-50"
                            aria-label="Share on WhatsApp"
                        >
                            <svg className="w-6 h-6 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            <span className="text-xs text-gray-400">WhatsApp</span>
                        </button>

                        {/* Telegram */}
                        <button
                            onClick={() => handleShare('telegram')}
                            disabled={isGenerating}
                            className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[#0088cc]/20 hover:bg-[#0088cc]/30 transition-colors disabled:opacity-50"
                            aria-label="Share on Telegram"
                        >
                            <svg className="w-6 h-6 text-[#0088cc]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                            </svg>
                            <span className="text-xs text-gray-400">Telegram</span>
                        </button>

                        {/* Twitter */}
                        <button
                            onClick={() => handleShare('twitter')}
                            disabled={isGenerating}
                            className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 transition-colors disabled:opacity-50"
                            aria-label="Share on Twitter"
                        >
                            <svg className="w-6 h-6 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            <span className="text-xs text-gray-400">Twitter</span>
                        </button>

                        {/* Copy */}
                        <button
                            onClick={copyToClipboard}
                            disabled={isGenerating}
                            className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-700/50 hover:bg-gray-700 transition-colors disabled:opacity-50"
                            aria-label="Copy link to clipboard"
                        >
                            {copied ? (
                                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            )}
                            <span className="text-xs text-gray-400">{copied ? 'Copied!' : 'Copy'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShareCard
