import { HelpCircle } from 'lucide-react'

const Header = ({ onHelpClick }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border">
            <div className="max-w-7xl mx-auto px-6 py-1.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src="/logo.png"
                        alt="BananaClock"
                        className="w-10 h-10 md:w-12 md:h-12 object-contain hover:scale-110 transition-transform duration-300 drop-shadow-sm"
                    />
                    <div
                        className="flex items-center text-2xl md:text-3xl font-normal text-yellow-400 brand-creative"
                        style={{ fontFamily: "'Grand Hotel', cursive" }}
                    >
                        {"BananaClock".split("").map((char, i) => (
                            <span
                                key={i}
                                className="inline-block brand-letter"
                                style={{ animationDelay: `${i * 0.08}s` }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </span>
                        ))}
                    </div>
                </div>
                <button
                    onClick={onHelpClick}
                    className="p-2 text-gray-400 hover:text-emerald-400 transition-colors"
                    aria-label="Help"
                >
                    <HelpCircle size={24} />
                </button>
            </div>
            {/* Brand Animation Styles */}
            <style>
                {`
                    .brand-letter {
                        opacity: 0;
                        transform: translateY(20px) scale(0);
                        animation: letter-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                    }

                    @keyframes letter-pop {
                        0% {
                            opacity: 0;
                            transform: translateY(20px) scale(0) rotate(-20deg);
                        }
                        100% {
                            opacity: 1;
                            transform: translateY(0) scale(1) rotate(0deg);
                        }
                    }

                    /* Subtle floating wave for the whole brand */
                    .brand-creative {
                        animation: brand-float 4s ease-in-out infinite;
                        animation-delay: 1.5s;
                    }

                    @keyframes brand-float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-4px); }
                    }
                `}
            </style>
        </header>
    )
}

export default Header
