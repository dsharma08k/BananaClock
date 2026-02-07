/**
 * BananaBackground Component
 * Subtle animated floating banana illustrations in the background
 */

const BananaBackground = () => {
    // Banana SVG path - simplified outline style
    const BananaSVG = ({ className }) => (
        <svg
            className={className}
            viewBox="0 0 100 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
        >
            <path d="M15 30 C10 28, 8 20, 15 12 C25 2, 50 0, 75 5 C85 8, 90 15, 85 22 C80 30, 60 35, 40 33 C25 31, 18 32, 15 30 Z" />
            <path d="M20 25 C18 23, 18 18, 22 14 C30 6, 50 5, 70 8 C78 10, 82 15, 80 20" opacity="0.5" />
        </svg>
    )

    const bananas = [
        { id: 1, top: '5%', left: '10%', size: 'w-24', rotation: 'rotate-12' },
        { id: 2, top: '15%', right: '8%', size: 'w-20', rotation: '-rotate-6' },
        { id: 3, top: '40%', left: '5%', size: 'w-16', rotation: 'rotate-45' },
        { id: 4, top: '60%', right: '12%', size: 'w-28', rotation: '-rotate-12' },
        { id: 5, top: '75%', left: '15%', size: 'w-18', rotation: 'rotate-30' },
        { id: 6, top: '25%', left: '80%', size: 'w-14', rotation: '-rotate-45' },
        { id: 7, top: '85%', right: '25%', size: 'w-22', rotation: 'rotate-6' },
        { id: 8, top: '50%', left: '45%', size: 'w-12', rotation: '-rotate-30' },
    ]

    return (
        <div className="banana-bg">
            {bananas.map((banana) => (
                <div
                    key={banana.id}
                    className={`banana-float ${banana.size} ${banana.rotation} text-gray-500 dark:text-gray-600`}
                    style={{
                        top: banana.top,
                        left: banana.left,
                        right: banana.right,
                    }}
                >
                    <BananaSVG className="w-full h-auto" />
                </div>
            ))}
        </div>
    )
}

export default BananaBackground
