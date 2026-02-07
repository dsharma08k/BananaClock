/**
 * Recipe Modal Component
 * Displays curated recipes based on banana ripeness condition.
 */

import { useState } from 'react'
import { X, ChefHat, ChevronLeft, ChevronRight, Youtube } from 'lucide-react'

const RecipeModal = ({ isOpen, onClose, condition }) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    if (!isOpen) return null

    // Recipe Data
    const allRecipes = {
        ripe: [
            {
                title: "Banana Peanut Butter Toast",
                ingredients: ["2 slices bread", "1 ripe banana", "2 tbsp peanut butter", "Honey (optional)"],
                steps: ["Toast the bread.", "Spread peanut butter.", "Slice banana and place on top.", "Drizzle with honey."]
            },
            {
                title: "Frozen Banana Pops",
                ingredients: ["2 ripe bananas", "1/2 cup chocolate chips", "Crushed nuts or sprinkles"],
                steps: ["Cut bananas in half.", "Insert popsicle sticks.", "Freeze for 30 mins.", "Dip in melted chocolate and toppings."]
            },
            {
                title: "3-Ingredient Pancakes",
                ingredients: ["1 ripe banana", "2 eggs", "Cinnamon (pinch)"],
                steps: ["Mash banana in a bowl.", "Whisk in eggs and cinnamon.", "Cook small pancakes on a buttered pan.", "Serve with syrup."]
            },
            {
                title: "Banana Oatmeal Smoothie",
                ingredients: ["1 ripe banana", "1/2 cup rolled oats", "1 cup milk", "1 tbsp honey"],
                steps: ["Blend oats specifically first.", "Add banana, milk, and honey.", "Blend until smooth.", "Serve chilled."]
            },
            {
                title: "Peanut Butter Banana Bites",
                ingredients: ["2 ripe bananas", "Peanut butter", "Chocolate chips (optional)"],
                steps: ["Slice bananas into rounds.", "Sandwich peanut butter between two slices.", "Freeze for 1 hour.", "Enjoy as a cold treat."]
            }
        ],
        overripe: [
            {
                title: "Classic Banana Bread",
                ingredients: ["3 overripe bananas", "1/3 cup melted butter", "1 tsp baking soda", "1.5 cups flour", "3/4 cup sugar", "1 egg"],
                steps: ["Mash bananas.", "Mix butter and sugar.", "Beat in egg and bananas.", "Stir in flour/soda.", "Bake at 350°F (175°C) for 50-60 mins."]
            },
            {
                title: "Healthy Banana Smoothie",
                ingredients: ["1 overripe banana (frozen is best)", "1 cup milk/yogurt", "1 tbsp honey", "Ice cubes"],
                steps: ["Peel and slice banana.", "Blend all ingredients until smooth.", "Serve immediately."]
            },
            {
                title: "Banana Oatmeal Cookies",
                ingredients: ["2 overripe bananas", "1 cup rolled oats", "Chocolate chips (optional)"],
                steps: ["Mash bananas.", "Mix with oats and chips.", "Drop spoonfuls onto baking sheet.", "Bake at 350°F (175°C) for 15 mins."]
            },
            {
                title: "Microwave Banana Mug Cake",
                ingredients: ["1 overripe banana", "1 egg", "1 tbsp cocoa powder", "1 tbsp sugar (optional)"],
                steps: ["Mash banana in a mug.", "Mix in egg, cocoa, and sugar.", "Microwave on high for 90 seconds.", "Let cool slightly and eat."]
            },
            {
                title: "Simple Banana Fritters",
                ingredients: ["2 overripe bananas", "1/2 cup flour", "1 tbsp sugar", "Oil for frying"],
                steps: ["Mash bananas and mix with flour/sugar.", "Heat oil in a pan.", "Drop spoonfuls of batter.", "Fry until golden brown on both sides."]
            }
        ]
    }

    // Default to 'ripe' if condition not found, or combine
    const recipes = allRecipes[condition] || allRecipes['ripe']
    const recipe = recipes[currentIndex]

    const nextRecipe = () => {
        setCurrentIndex((prev) => (prev + 1) % recipes.length)
    }

    const prevRecipe = () => {
        setCurrentIndex((prev) => (prev - 1 + recipes.length) % recipes.length)
    }

    // Dynamic Video Link
    const videoUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(recipe.title + " recipe")}`

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm fade-in">
            {/* Main Modal Container - Compact Height */}
            <div className="w-full max-w-3xl bg-dark-card border border-dark-border rounded-2xl shadow-2xl flex flex-col h-[75vh] md:h-[500px] max-h-[90vh]">

                {/* Header - Compact */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-dark-border flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-amber-500/20 rounded-lg text-amber-500">
                            <ChefHat size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-100">
                            Recipe {currentIndex + 1} of {recipes.length}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-800"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content - Compact Padding */}
                <div className="p-4 overflow-y-auto md:overflow-hidden flex flex-col flex-1">
                    <div className="bg-dark-panel rounded-xl p-4 border border-dark-border hover:border-amber-500/50 transition-colors md:h-full flex flex-col">
                        <div className="mb-4 border-b border-gray-700/50 pb-3 flex-shrink-0 flex justify-between items-start">
                            <h4 className="text-xl font-bold text-amber-400 mb-0.5 leading-tight">{recipe.title}</h4>

                            <a
                                href={videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-500 text-xs font-semibold rounded-full transition-colors border border-red-600/20 hover:border-red-600/50 flex-shrink-0 ml-2"
                                title="Watch video tutorials on YouTube"
                            >
                                <Youtube size={16} />
                                <span className="hidden sm:inline">Watch Video</span>
                            </a>
                        </div>

                        {/* Grid layout - Compact Gap */}
                        <div className="grid md:grid-cols-2 gap-4 md:flex-1 md:min-h-0">
                            {/* Ingredients Column */}
                            <div className="bg-dark-bg/20 p-3 rounded-xl border border-gray-800/50 flex flex-col md:h-full">
                                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2 flex items-center gap-1.5 border-b border-gray-700 pb-1.5 flex-shrink-0">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                    Ingredients
                                </p>
                                <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside md:overflow-y-auto pr-1 custom-scrollbar flex-1">
                                    {recipe.ingredients.map((ing, i) => (
                                        <li key={i} className="pl-1 leading-snug">{ing}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Instructions Column */}
                            <div className="bg-dark-bg/20 p-3 rounded-xl border border-gray-800/50 flex flex-col md:h-full">
                                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2 flex items-center gap-1.5 border-b border-gray-700 pb-1.5 flex-shrink-0">
                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                    Instructions
                                </p>
                                <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside md:overflow-y-auto pr-1 custom-scrollbar flex-1">
                                    {recipe.steps.map((step, i) => (
                                        <li key={i} className="pl-1 marker:text-gray-500 leading-snug">{step}</li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Navigation - Compact */}
                <div className="p-3 border-t border-dark-border bg-dark-bg/50 rounded-b-2xl flex justify-between items-center px-4 md:px-6 flex-shrink-0">
                    <button
                        onClick={prevRecipe}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors text-xs md:text-sm font-medium"
                    >
                        <ChevronLeft size={16} />
                        <span className="hidden md:inline">Previous</span>
                        <span className="md:hidden">Prev</span>
                    </button>

                    <div className="flex gap-1">
                        {recipes.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-amber-500 w-3' : 'bg-gray-700'}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={nextRecipe}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium transition-colors shadow-lg shadow-amber-900/20 text-xs md:text-sm"
                    >
                        <span className="hidden md:inline">Next</span>
                        <span className="md:hidden">Next</span>
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RecipeModal
