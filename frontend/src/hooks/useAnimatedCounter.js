import { useState, useEffect, useRef } from 'react'

/**
 * Custom hook for animated number counting
 * @param {number} target - Target value to count to
 * @param {number} duration - Animation duration in ms (default: 1000)
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {number} - Current animated value
 */
export const useAnimatedCounter = (target, duration = 1000, decimals = 0) => {
    const [count, setCount] = useState(0)
    const startTime = useRef(null)
    const startValue = useRef(0)
    const animationFrame = useRef(null)

    useEffect(() => {
        startTime.current = Date.now()
        startValue.current = count

        const animate = () => {
            const now = Date.now()
            const elapsed = now - startTime.current
            const progress = Math.min(elapsed / duration, 1)

            // Easing function (ease-out cubic)
            const eased = 1 - Math.pow(1 - progress, 3)

            const current = startValue.current + (target - startValue.current) * eased
            setCount(Number(current.toFixed(decimals)))

            if (progress < 1) {
                animationFrame.current = requestAnimationFrame(animate)
            }
        }

        animationFrame.current = requestAnimationFrame(animate)

        return () => {
            if (animationFrame.current) {
                cancelAnimationFrame(animationFrame.current)
            }
        }
    }, [target, duration, decimals])

    return count
}

export default useAnimatedCounter
