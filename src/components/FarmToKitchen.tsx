import React, { useState } from 'react';
import { Volume2, ChefHat, Search, Heart, Utensils, Coffee, Leaf, Eye } from 'lucide-react';

interface Recipe {
  id: string;
  name: string;
  category: 'Food' | 'Drink' | 'Smoothies';
  gatherSource: string; // e.g. "Fish Pond", "Vegetable Garden", "Dairy Shed"
  gatherTips: string;   // How to harvest or gather nicely
  ingredients: string[];
  prepMinutes: number;
  cookMinutes: number;
  yieldInfo: string;
  steps: string[];
  nutritionBenefit: string;
}

interface FarmToKitchenProps {
  speakText: (text: string, force?: boolean) => void;
}

export default function FarmToKitchen({ speakText }: FarmToKitchenProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Food' | 'Drink' | 'Smoothies'>('All');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [search, setSearch] = useState('');

  const recipes: Recipe[] = [
    {
      id: "recipe_1",
      name: "🐟 Grilled Ginger & Herb Tilapia",
      category: "Food",
      gatherSource: "Tilapia Aquaculture Fish Pond",
      gatherTips: "Cast your hand net during early morning cooling, check that the fish measures at least 250g (width of a hand), scrub scales with clean salt water and slice three diagonal gashes across the gills.",
      ingredients: [
        "1 Freshly caught Tilapia fish (cleaned)",
        "2 tablespoons pure botanical sunflower oil",
        "1 tablespoon chopped garden rosemary and basil leaves",
        "1 thumb-size ginger knot (crushed)",
        "1 fresh garden lemon or lime juice",
        "A pinch of coarse salt and crushed black crop pepper"
      ],
      prepMinutes: 15,
      cookMinutes: 20,
      yieldInfo: "Feeds 2 people",
      steps: [
        "Wash the tilapia under clean run water. Tap dry with a clean cotton kitchen towel.",
        "Rub lemon juice and coarse salt inside the fish stomach cavity and inside the slash cuts.",
        "Mix sunflower oil, crushed ginger, chopped rosemary, and basil together in a small bowl.",
        "Spread this herb oil mix fully over both sides of the fish carcass.",
        "Light a wood-fire grill to moderate glow coals (or use a cast-iron frying pan).",
        "Grill the fish for 10 minutes on one side until skin turns crispy brown, then flip and grill for 10 more minutes until meat flakes fully with a wooden stick."
      ],
      nutritionBenefit: "Incredibly high in pure lean protein and heart-healthy Omega-3 fats to strengthen bones."
    },
    {
      id: "recipe_2",
      name: "🍅 Spiced Tomato-Basil Garden Stew",
      category: "Food",
      gatherSource: "Veggie Raised Beds / Tomato Rows",
      gatherTips: "Twist vine-ripened red plum tomatoes gently to pick. Avoid split skins or dark insect rot. Gather fresh bushy sweet basil sprigs.",
      ingredients: [
        "10 Big red ripe tomatoes (mashed or finely chopped)",
        "1 Large garden purple onion (chopped)",
        "3 Garlic cloves (mashed)",
        "A bunch of fresh basil leaves (torn)",
        "2 tablespoons cold compost-grown red chili powder",
        "1 tablespoon vegetable oil and a pinch of salt"
      ],
      prepMinutes: 10,
      cookMinutes: 15,
      yieldInfo: "Makes 4 servings of sauce",
      steps: [
        "Heat the vegetable oil in a traditional clay or metal stew pot over low heat.",
        "Add onion and garlic. Stir continuously for 3 minutes until smelling sweet.",
        "Pour in the chopped ripe tomatoes with their juices, adding chili powder and salt.",
        "Cover the pot and simmer for 15 minutes, stirring occasionally. The tomatoes will collapse into a thick red gravy.",
        "Remove the pot from the fire, toss in the torn basil leaves immediately so they release their rich oils.",
        "Serve hot alongside boiled maize mush (ugali), rice, or warm flatbreads."
      ],
      nutritionBenefit: "Lycopene inside cooked tomatoes cleans blood vessels and improves eye health."
    },
    {
      id: "recipe_3",
      name: "🍌 Probiotic Dairy Power Smoothie",
      category: "Smoothies",
      gatherSource: "Cow Barn & Fruit Trees",
      gatherTips: "Siphon raw milk into stainless steel buckets. Strain and pasteurize (boil to 85°C, cool, add yoghurt starter, ferment 12 hours). Harvest fully freckled yellow bananas.",
      ingredients: [
        "2 Cups of thick homemade probiotic yoghurt (plain or honey sweetened)",
        "2 Ripe sweet backyard bananas (peeled and sliced)",
        "1 Cup of ripe sweet mango chunks or berries",
        "1 tablespoon of raw comb forest honey"
      ],
      prepMinutes: 5,
      cookMinutes: 0,
      yieldInfo: "Yields 2 large tall cups",
      steps: [
        "Chop fresh mangoes and bananas with clean washed hands.",
        "Measure 2 cups of your cool fermented yoghurt into a kitchen bowl.",
        "Add fruits and honey. If you have a hand crank or electrical blender, blend for 60 seconds until perfectly creamy.",
        "Alternatively, mash the bananas and mango chunks into a ultra-smooth paste using a wooden fork first, then vigorously whip into the yoghurt using a wire whisk.",
        "Serve inside cool clay mugs to keep the active gut-health yeasts alive!"
      ],
      nutritionBenefit: "Active lactic cultures protect children from stomach bugs, providing instant potassium energy."
    },
    {
      id: "recipe_4",
      name: "☕ Lemongrass & Ginger Cold Remedy Tea",
      category: "Drink",
      gatherSource: "Herb Garden Borders",
      gatherTips: "Cut three green lemongrass stalks near the base. Dig up a small ginger root tuber. Wash thoroughly to remove mud particles.",
      ingredients: [
        "3 Lemongrass stalks (bruised and cut into finger segments)",
        "1 thumb-size Ginger root (sliced thin with skin on)",
        "4 Cups of fresh clear spring water",
        "2 tablespoons raw honey or brown molasses"
      ],
      prepMinutes: 5,
      cookMinutes: 10,
      yieldInfo: "Feeds 3-4 cups of hot booster",
      steps: [
        "In a boiling kettle or pot, add 4 cups of clear clean water.",
        "Bruise the lemongrass stems with the flat back of a knife to release the citrus-sweet oils.",
        "Toss lemongrass slices and ginger root segments directly into the boiling water.",
        "Bring to a rapid boil, then reduce heat to low and let it steep steam for 10 minutes.",
        "Pour into tea mugs using a fine wire tea mesh strainer.",
        "Stir in raw honey and drink hot to clear throat infections and cure coughs."
      ],
      nutritionBenefit: "Cures early morning throat chills, relieves stomach gas, and chokes cold virus multiplication."
    },
    {
      id: "recipe_5",
      name: "🌱 Spiced Mint & Basil Herbal Infusion",
      category: "Drink",
      gatherSource: "Herb Raised Beds",
      gatherTips: "Gently pluck green peppermint leaves and sweet basil leaves early in the morning, which has the highest oil concentration.",
      ingredients: [
        "10 Fresh mint leaves",
        "5 Fresh basil leaves",
        "3 Cups of pure water",
        "1 Slice of garden lemon"
      ],
      prepMinutes: 5,
      cookMinutes: 5,
      yieldInfo: "Serves 2 people",
      steps: [
        "Heat water in a small pot until bubbling hot.",
        "Place mint and basil inside two mugs.",
        "Pour the hot boiling water directly over the fresh green leaves in the mugs.",
        "Cover the top of the mugs with small plates to capture steam and let steep for 5 minutes.",
        "Add a thin slice of lemon and enjoy this soothing digestant after a heavy corn meal."
      ],
      nutritionBenefit: "Instantly relieves bloating, aids rapid stomach digestion, and freshens breath."
    }
  ];

  const filtered = recipes.filter(r => {
    const matchesCategory = activeCategory === 'All' || r.category === activeCategory;
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || 
                          r.gatherSource.toLowerCase().includes(search.toLowerCase()) ||
                          r.nutritionBenefit.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSpeakRecipe = (rec: Recipe) => {
    const txt = `Recipe: ${rec.name}. Source: Gather ingredients from ${rec.gatherSource}. Harvesting guidance: ${rec.gatherTips}. Instructions: Prepare in ${rec.prepMinutes} minutes and cook for ${rec.cookMinutes} minutes. Step by step process: ${rec.steps.join('. ')}. Health benefits: ${rec.nutritionBenefit}`;
    speakText(txt, true);
  };

  return (
    <div className="space-y-6" id="farm-to-kitchen-view">
      {/* Intro Bannner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-center gap-6">
        <div className="p-4 bg-emerald-50 rounded-full text-emerald-800">
          <ChefHat className="w-10 h-10" />
        </div>
        <div className="space-y-1 flex-1">
          <h3 className="text-xl font-bold text-slate-800 font-sans">
            🧑‍🍳 Interactive Farm-to-Kitchen & Cooking Companion
          </h3>
          <p className="text-xs text-slate-500 font-sans leading-relaxed">
            Sustainably harvest, catch, or gather raw ingredients straight from your homestead plots 
            and transform them into healthy nutritious family foods, healing natural drinks, and probiotic fruit smoothies. 
            Tap the speaker on any card to hear step-by-step cooking commands!
          </p>
        </div>
      </div>

      {/* Categories select and search bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border p-4 rounded-2xl shadow-xs">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search recipes e.g. Tilapia, Ginger, Tomato stew..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border bg-slate-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans text-slate-850"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center md:justify-end" id="kitchen-categories">
          {(['All', 'Food', 'Drink', 'Smoothies'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                speakText(`Showing ${cat} recipes.`, true);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                activeCategory === cat
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'All' && '⭐ All Dishes'}
              {cat === 'Food' && '🍲 Real Foods'}
              {cat === 'Drink' && '☕ Healing Teas'}
              {cat === 'Smoothies' && '🥤 Probiotic Smoothies'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left list panel */}
        <div className="lg:col-span-5 bg-white border rounded-2xl p-4 shadow-xs space-y-3">
          <h4 className="font-bold text-slate-700 text-xs border-b pb-2 uppercase tracking-wide">
            🌱 Harvested Recipe List ({filtered.length})
          </h4>

          <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedRecipe(item);
                    speakText(`Showing recipe for ${item.name}`, true);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border font-sans flex items-center justify-between transition ${
                    selectedRecipe?.id === item.id
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-2xs'
                      : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <strong className="text-xs block font-extrabold">{item.name}</strong>
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-medium">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase">{item.category}</span>
                      <span>📍 {item.gatherSource}</span>
                    </div>
                  </div>
                  <Utensils className="w-4 h-4 text-emerald-700 opacity-60" />
                </button>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs font-sans">
                No backyard recipes matched. Search for 'Tilapia' or 'Booster'!
              </div>
            )}
          </div>
        </div>

        {/* Right detail panel */}
        <div className="lg:col-span-7">
          {selectedRecipe ? (
            <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
              
              {/* Card Header */}
              <div className="flex flex-wrap justify-between items-center gap-4 border-b pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-750 font-bold uppercase tracking-wider font-mono">
                    Farm-To-Table Recipe Guide
                  </span>
                  <h4 className="text-xl font-extrabold text-slate-900 font-sans">
                    {selectedRecipe.name}
                  </h4>
                </div>
                <button
                  onClick={() => handleSpeakRecipe(selectedRecipe)}
                  className="px-3.5 py-2 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black text-xs rounded-xl flex items-center gap-1.5 transition shadow"
                >
                  <Volume2 className="w-4 h-4" /> Listen Cooking Instruction
                </button>
              </div>

              {/* Gather instructions */}
              <div className="bg-emerald-50/50 border border-emerald-100/80 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold font-sans text-emerald-900">📍 GATHER SOURCE: {selectedRecipe.gatherSource}</span>
                </div>
                <p className="text-[11px] text-slate-650 font-sans leading-relaxed">
                  <strong>How to Gather:</strong> {selectedRecipe.gatherTips}
                </p>
              </div>

              {/* Ingredients & Details Quick Specs */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Ingredients Left (7 cols) */}
                <div className="md:col-span-7 space-y-2">
                  <strong className="text-xs text-slate-700 font-bold block uppercase tracking-wider">🛒 Gathered Ingredients</strong>
                  <ul className="space-y-1">
                    {selectedRecipe.ingredients.map((ing, i) => (
                      <li key={i} className="text-xs text-slate-600 font-sans flex items-start gap-1.5">
                        <span className="text-emerald-700 text-xs">•</span>
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Details Right (5 cols) */}
                <div className="md:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2.5 flex flex-col justify-center">
                  <div className="text-[11px] text-slate-600 flex justify-between font-sans border-b pb-1">
                    <span>Prep Time:</span>
                    <strong>⏳ {selectedRecipe.prepMinutes} mins</strong>
                  </div>
                  <div className="text-[11px] text-slate-600 flex justify-between font-sans border-b pb-1">
                    <span>Cook Time:</span>
                    <strong>🔥 {selectedRecipe.cookMinutes} mins</strong>
                  </div>
                  <div className="text-[11px] text-slate-600 flex justify-between font-sans">
                    <span>Dishes:</span>
                    <strong>🥣 {selectedRecipe.yieldInfo}</strong>
                  </div>
                </div>

              </div>

              {/* Preparation Process */}
              <div className="space-y-2.5">
                <strong className="text-xs text-slate-800 font-bold block uppercase tracking-wider">🍲 Step-by-Step Directions</strong>
                <ol className="space-y-2">
                  {selectedRecipe.steps.map((st, sInd) => (
                    <li key={sInd} className="text-xs text-slate-650 font-sans leading-relaxed flex gap-2">
                      <strong className="text-emerald-800 text-xs font-mono">{sInd + 1}.</strong>
                      <span>{st}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Health and Nutrition */}
              <div className="bg-indigo-50/70 border border-indigo-150 p-4 rounded-xl flex gap-3.5 items-start">
                <div className="p-2 bg-indigo-100 text-indigo-800 rounded-lg">
                  <Heart className="w-5 h-5 text-indigo-700" />
                </div>
                <div className="space-y-0.5">
                  <strong className="text-xs text-indigo-950 font-bold block">💪 Vital Homestead Health Benefit</strong>
                  <p className="text-[11px] text-slate-700 font-sans leading-relaxed">
                    {selectedRecipe.nutritionBenefit}
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border rounded-2xl p-12 text-center text-slate-400 font-sans space-y-3 shadow-xs">
              <div className="w-16 h-16 bg-slate-50 border rounded-full flex items-center justify-center mx-auto text-xl">
                🍲
              </div>
              <h5 className="font-extrabold text-slate-700 text-sm">No Recipe Loaded</h5>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
                Explore local cooking techniques, prep guides, and ingredients by tapping any recipe name on the left!
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
