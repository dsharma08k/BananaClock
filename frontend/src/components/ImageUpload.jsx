import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Camera, ImageIcon, X, Zap } from 'lucide-react'
import CameraCapture from './CameraCapture'

// Helper for condition colors
const getConditionColor = (condition) => {
    switch (condition) {
        case 'fresh': return '#10b981'; // emerald-500
        case 'slightly_ripe': return '#84cc16'; // lime-500
        case 'ripe': return '#f59e0b'; // amber-500
        case 'overripe': return '#ea580c'; // orange-600
        case 'spoiled': return '#ef4444'; // red-500
        default: return '#6b7280'; // gray-500
    }
}

const ImageUpload = ({ onImageSelect, result, activeCondition, onError }) => {
    const [preview, setPreview] = useState(null)
    const [showCamera, setShowCamera] = useState(false)
    const [naturalSize, setNaturalSize] = useState(null)
    const [hoveredIndex, setHoveredIndex] = useState(null)

    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

    const onDrop = useCallback((acceptedFiles, fileRejections) => {
        // Handle Rejected Files (Size limit)
        if (fileRejections?.length > 0) {
            const rejection = fileRejections[0]
            if (rejection.errors[0]?.code === 'file-too-large') {
                onError?.("File is too large. Maximum size is 10MB.")
            } else {
                onError?.("Invalid file. Please upload an image.")
            }
            return
        }

        const file = acceptedFiles[0]
        if (file) {
            // Manual size check redundancy
            if (file.size > MAX_FILE_SIZE) {
                onError?.("File is too large. Maximum size is 10MB.")
                return
            }

            // Use FileReader for reliable mobile preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result)
            }
            reader.readAsDataURL(file)
            setNaturalSize(null)
            onImageSelect(file)
        }
    }, [onImageSelect, onError])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1,
        maxSize: MAX_FILE_SIZE
    })

    const handleCameraCapture = (file) => {
        if (file.size > MAX_FILE_SIZE) {
            onError?.("Captured image is too large. Please try again.")
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result)
        }
        reader.readAsDataURL(file)
        setNaturalSize(null)
        onImageSelect(file)
        setShowCamera(false)
    }

    const clearImage = (e) => {
        e.stopPropagation()
        setPreview(null)
        setNaturalSize(null)
        onImageSelect(null)
        onError?.(null) // Clear error on reset
    }

    return (
        <div className="w-full max-w-lg mx-auto">
            {/* Camera Overlay Modal */}
            <CameraCapture
                isOpen={showCamera}
                onClose={() => setShowCamera(false)}
                onCapture={handleCameraCapture}
            />

            {!preview ? (
                // Dropzone State
                // Dropzone State (Card Style)
                <div className="bg-[#18181B] p-4 rounded-xl shadow-2xl border border-white/5 relative group fade-in">
                    <div
                        {...getRootProps()}
                        className={`
                            relative border-2 border-dashed rounded-2xl p-6
                            flex flex-col items-center justify-center text-center cursor-pointer
                            min-h-[300px] transition-all duration-300 group
                            ${isDragActive
                                ? 'border-brand-primary bg-brand-primary/5 shadow-[0_0_20px_rgba(255,215,0,0.1)]'
                                : 'border-white/10 hover:border-brand-primary/50 hover:bg-white/5'
                            }
                        `}
                        role="button"
                        aria-label="Upload image dropzone. Click to browse or drag and drop an image here."
                        tabIndex={0}
                    >
                        <input {...getInputProps()} aria-label="File upload input" />
                        <div className="p-3 bg-white/5 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                            <ImageIcon className={`w-6 h-6 ${isDragActive ? 'text-brand-primary' : 'text-gray-400'}`} />
                        </div>
                        <p className="text-gray-300 font-medium text-sm mb-0.5">
                            Drop image here
                        </p>
                        <p className="text-gray-500 text-xs">
                            or click to browse
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <button
                            onClick={() => setShowCamera(true)}
                            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#27272A] hover:bg-[#3F3F46] text-gray-200 text-sm font-medium rounded-full transition-colors border border-white/5"
                        >
                            <Camera size={16} />
                            <span>Camera</span>
                        </button>
                        <button
                            onClick={() => document.querySelector('input[type="file"]')?.click()}
                            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#27272A] hover:bg-[#3F3F46] text-gray-200 text-sm font-medium rounded-full transition-colors border border-white/5"
                        >
                            <Upload size={16} />
                            <span>Browse</span>
                        </button>
                    </div>
                </div>
            ) : (
                // Preview State (Matching Reference)
                <div className="bg-[#18181B] p-3 rounded-xl shadow-2xl border border-white/5 relative group fade-in">

                    {/* Dashed Border Container */}
                    <div className="relative border-2 border-dashed border-emerald-500/30 rounded-2xl p-2 flex items-center justify-center bg-black/20 min-h-[300px] transition-colors duration-300 hover:border-emerald-500/50">

                        {/* Inner Image Wrapper */}
                        <div className="relative inline-block rounded-lg shadow-2xl">
                            <img
                                src={preview}
                                alt="Preview of uploaded banana"
                                className="block max-w-full max-h-[280px] w-auto h-auto rounded-lg object-contain"
                                onLoad={(e) => {
                                    setNaturalSize({ w: e.target.naturalWidth, h: e.target.naturalHeight })
                                }}
                            />

                            {/* Bounding Boxes and Labels */}
                            {result && naturalSize && result.predictions && result.predictions.map((pred, idx) => {
                                if (!pred.bbox) return null;
                                const [x1, y1, x2, y2] = pred.bbox;
                                const color = getConditionColor(pred.condition);

                                // Highlighting logic
                                const isActive = !activeCondition || activeCondition === pred.condition;
                                const isHovered = hoveredIndex === idx;
                                const opacity = isActive ? 1 : 0.5;

                                // Tag is at the center of the box
                                const centerX = (x1 + x2) / 2;
                                const centerY = (y1 + y2) / 2;

                                return (
                                    <div key={`pred-${pred.banana_id || idx}`}>
                                        {/* Layer 1: Bounding Box Border */}
                                        <div
                                            className="absolute rounded transition-all duration-300"
                                            onMouseEnter={() => setHoveredIndex(idx)}
                                            onMouseLeave={() => setHoveredIndex(null)}
                                            style={{
                                                left: `${(x1 / naturalSize.w) * 100}%`,
                                                top: `${(y1 / naturalSize.h) * 100}%`,
                                                width: `${((x2 - x1) / naturalSize.w) * 100}%`,
                                                height: `${((y2 - y1) / naturalSize.h) * 100}%`,
                                                borderColor: color,
                                                borderWidth: isActive || isHovered ? '2px' : '1px',
                                                boxShadow: isActive || isHovered
                                                    ? `0 0 0 1px ${color}, 0 0 12px ${color}66`
                                                    : 'none',
                                                opacity: opacity,
                                                zIndex: isHovered ? 50 : 20,
                                                transform: isActive || isHovered ? 'scale(1.02)' : 'scale(1)',
                                                cursor: 'pointer'
                                            }}
                                        />

                                        {/* Layer 2: Ripeness Label (Tag) */}
                                        <div
                                            className="absolute transition-all duration-300 group/box"
                                            onMouseEnter={() => setHoveredIndex(idx)}
                                            onMouseLeave={() => setHoveredIndex(null)}
                                            style={{
                                                left: `${(centerX / naturalSize.w) * 100}%`,
                                                top: `${(centerY / naturalSize.h) * 100}%`,
                                                transform: `translate(-50%, -50%) ${isActive || isHovered ? 'scale(1.1)' : 'scale(0.8)'}`,
                                                opacity: opacity,
                                                zIndex: isHovered ? 60 : (isActive ? 40 : 15)
                                            }}
                                        >
                                            <div
                                                className="relative px-2 py-0.5 rounded-full text-[9px] font-bold text-white transition-all duration-300 cursor-default flex items-center gap-1 overflow-hidden group-hover/box:gap-2 shadow-[0_0_10px_rgba(0,0,0,0.3)] border border-white/30"
                                                style={{
                                                    backgroundColor: color,
                                                    boxShadow: isActive || isHovered ? `0 0 15px ${color}88` : 'none'
                                                }}
                                            >
                                                <span className="whitespace-nowrap z-10 uppercase tracking-wider">
                                                    {pred.condition.replace('_', ' ')}
                                                </span>

                                                {/* Confidence revealed on hover */}
                                                <span className={`transition-all duration-300 whitespace-nowrap text-[8px] border-l border-white/20 pl-1 ${isHovered ? 'max-w-[40px] opacity-100' : 'max-w-0 opacity-0'
                                                    }`}>
                                                    {Math.round(pred.confidence * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Red Close Button (Floating on Image Corner) */}
                            <button
                                onClick={clearImage}
                                className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-30"
                            >
                                <X size={14} strokeWidth={3} />
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons (Capsule Style) */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <button
                            onClick={() => setShowCamera(true)}
                            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#27272A] hover:bg-[#3F3F46] text-gray-200 text-sm font-medium rounded-full transition-colors border border-white/5"
                        >
                            <Camera size={16} />
                            <span>Camera</span>
                        </button>
                        <button
                            onClick={() => document.querySelector('input[type="file"]')?.click()}
                            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#27272A] hover:bg-[#3F3F46] text-gray-200 text-sm font-medium rounded-full transition-colors border border-white/5"
                        >
                            <Upload size={16} />
                            <span>Browse</span>
                        </button>
                        <input {...getInputProps()} className="hidden" />
                    </div>
                </div>
            )
            }
        </div >
    )
}

export default ImageUpload
