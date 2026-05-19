import React, { useState } from 'react';
import { BookOpen, Search, Volume2, Info, CheckCircle, ShieldAlert, Award } from 'lucide-react';

interface LibraryKeyword {
  keyword: string;
  category: 'Plants' | 'Animals' | 'Fish' | 'Other';
  definition: string;
  practice: string;
  tip: string;
  trick: string;
}

interface FarmingLibraryProps {
  speakText: (text: string, force?: boolean) => void;
}

export default function FarmingLibrary({ speakText }: FarmingLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Plants' | 'Animals' | 'Fish' | 'Other'>('All');
  const [selectedKeyword, setSelectedKeyword] = useState<LibraryKeyword | null>(null);

  const keywords: LibraryKeyword[] = [
    // --- PLANTS ---
    {
      keyword: "Mulching",
      category: "Plants",
      definition: "Covering the ground soil around plant roots with organic dry grass, maize stalks, or black polymer sheeting.",
      practice: "Spread a 5cm layer of straw or dry leaves around stems, keeping it 2cm clear of the actual green bark to prevent decay.",
      tip: "Keeps moisture inside the dirt during dry spells, cutting your watering labor in half.",
      trick: "Use wood shavings or pine needles for acid-loving berries, but stick to grass straw for cabbages, zucchini, and tomato lines."
    },
    {
      keyword: "Crop Rotation",
      category: "Plants",
      definition: "A systematic cycle of planting different families of crops in the same plot across sequential seasons.",
      practice: "Divide land into plots. Plant Maize or Wheat (family line 1) this season, then beans or soy plants (nitrogen fixers) next season, followed by kale or cabbages (leafy feeders).",
      tip: "Interrupts the lifespan of crop pests. Fungal spores of tomatoes die off when beans are grown.",
      trick: "Never plant potato species immediately after tomato or capsicum crops. They are cousins and attract the same soil rot!"
    },
    {
      keyword: "Grafting",
      category: "Plants",
      definition: "Joining the green twig of a high-yield crop (scion) onto the hardy rootstock of a disease-resistant cousin.",
      practice: "Cut matching diagonal slits on the root stem and scion twig. Fit them tight together and wrap with clean tape until they heal.",
      tip: "Allows growing sweet, premium avocados or citrus fruits on tough wild roots that survive clay and root rot.",
      trick: "Perform grafting on cool, fully shaded afternoons. Wrap with wet moss for the first 3 days to maintain moisture."
    },
    {
      keyword: "Cover Cropping",
      category: "Plants",
      definition: "Growing dense, sprawling crops like clover, sunflower, or alfalfa to cover bare ground soil during fallow times.",
      practice: "Broadcast dense bean or clover seeds right after primary harvest before heavy winds blow the topsoil away.",
      tip: "Prevents rainwater from splashing away fertile mud and naturally chokes out weeds.",
      trick: "Scythe down the cover crop right as it flowers and plow it into the earth. It decompose into pure green manure!"
    },
    {
      keyword: "Organic Composting",
      category: "Plants",
      definition: "Converting dry leaves, cow dung, eggshells, and wet farm refuse into nutrient-rich black plant humus.",
      practice: "Build a 1.5-meter pile alternating brown dry stuff (stalks, leaves) with green wet stuff (manure, kitchen vegetable peelings). Direct water to keep it damp.",
      tip: "Increases the organic sponge buffer of your fields so sandy soil holds water way longer.",
      trick: "Toss a shovel of existing dark forest dirt into the fresh compost stack. It supplies millions of decay bacteria to double the decomposition rate."
    },

    // --- ANIMALS ---
    {
      keyword: "Zero-Grazing",
      category: "Animals",
      definition: "A system of livestock keeping where animals (especially dairy cows) are kept in pens and feed is brought to them.",
      practice: "Build a raised timber housing with concrete floors sloping down to a manure drain. Cut and bring Napier grass or silage to feed troughs.",
      tip: "Prevents animals from catching tick-borne viral diseases in public pastures and saves energy for milk production.",
      trick: "Sprinkle dry sawdust or wood chips in rest beds daily. Keeps the udders clean and reduces mastitis tissue infections by 80%."
    },
    {
      keyword: "Silage Feed",
      category: "Animals",
      definition: "Green forage (typically maize stalks or Napier grass) chopped up, compacted damp, and fermented in airtight bags/pits.",
      practice: "Chop green maize when ears are milky. Pack it extremely tight into heavy plastic containers or pits to squeeze out all air, then seal completely for 30 days.",
      tip: "Preserves fresh nutritious fodder for up to 2 years, keeping cows yielding high milk even during heavy droughts.",
      trick: "Dilute a cup of sugarcane molasses in water and spray on feed sheets as you compact it. Increases energy yeast and aroma!"
    },
    {
      keyword: "Colostrum",
      category: "Animals",
      definition: "The thick, creamy yellow first-milk produced by a cow or goat immediately after giving birth.",
      practice: "Bottle feed the newborn animal inside the first 2 hours of life. Their stomach walls absorb these rich antibodies only on day one.",
      tip: "Provides life-saving natural vaccines directly from mother to child. Missing colostrum leads to weak calves that succumb to diarrhea.",
      trick: "Never boil colostrum. Extreme heat coagulates the vital immune proteins into useless rubber clumps."
    },
    {
      keyword: "Culling",
      category: "Animals",
      definition: "Identifying and removing non-productive, chronic sick, or highly aggressive animals from your breeding herd.",
      practice: "Keep animal record books. If a hen lays no eggs for 30 days, or a goat has chronic foot rot, sell or slaughter them.",
      tip: "Saves high feed money. Why feed a cow that returns only 2 liters of milk while others give 15?",
      trick: "Always cull bad temper animals. Aggressive cows or pigs pass genes down and injure younger stock, causing secret losses."
    },

    // --- FISH ---
    {
      keyword: "Fingerlings",
      category: "Fish",
      definition: "Baby fish that have grown to about the size of a human finger, ready to be stocked in grow-out ponds.",
      practice: "Transport fingerlings in cool early mornings inside oxygen-inflated plastic bags. Acclimate bag temperature in the pond for 20 minutes before gently releasing them.",
      tip: "Buying certified high-rate fingerlings avoids stunting. Cheap wild fingerlings may grow paper-thin.",
      trick: "Float a yellow solar bulb above the water at night. It attracts nocturnal lake flies which crash into the water, giving your fish free high-protein snacks!"
    },
    {
      keyword: "Aquaponics",
      category: "Fish",
      definition: "A combined circular system where dirty fish water is pumped onto root vegetables to act as natural organic fertilizer.",
      practice: "Create grow beds filled with volcanic pebbles. Pump nutrient-dense bottom sediment water from your fish tank onto the plants. Plant roots clean the water which drops back to fish.",
      tip: "No soil weed weeding. Plants grow 40% faster using natural fish poop fertilizer.",
      trick: "Keep a small colony of red wriggler earthworms inside the gravel grow beds. They eat solid fish waste chunks before they rot the roots."
    },
    {
      keyword: "Pond Fertilization",
      category: "Fish",
      definition: "Adding controlled amounts of organic dung or chicken manure to water to trigger green micro-algae growth.",
      practice: "Suspend a sack containing 10kg of dry chicken dung in the corner of a new earth pond. Wait 7 days until water turns a rich tea-green color.",
      tip: "Fills the water with millions of microscopic wild insects that tilapia eat, saving you up to 30% of commercial pellet costs.",
      trick: "Stand a 1-meter stick in the water. If your hand is still visible when your elbow is wet, the algae is too thin. Add a bit more dung!"
    },
    {
      keyword: "Dissolved Oxygen",
      category: "Fish",
      definition: "The invisible oxygen gas mixed into pond water that fish need to breathe through gills.",
      practice: "Use gravity bamboo pipelines to let incoming water splash down from a height of 50cm into the fish pond, generating white foam.",
      tip: "If fish gasp at the water surface during sunrise, oxygen is dangerously low. Halt feeding immediately and splash water.",
      trick: "Algae eats up oxygen on overcast, rainy, non-sunny days. Drain top warm water and splash in fresh cold rainwater."
    },

    // --- OTHER / AGRI-TECH / GENERAL ---
    {
      keyword: "Soil pH Level",
      category: "Other",
      definition: "A scale measure from 0 to 14 indicating how sour (acidic) or sweet (alkaline) your soil mud is.",
      practice: "Mix equal parts farm soil and distilled water in a cup. Dip a cheap litmus paper strip. A level of 6.0 to 6.8 is ideal for most vegetables.",
      tip: "If soil is too sour (acidic below 5.5), plants get locked and cannot absorb fertilizers. Mix dry lime stone powder to cure it.",
      trick: "Spread wood ash from wood stoves around acid beds. It acts as a free alkaline corrector and provides potash minerals."
    },
    {
      keyword: "Hardening Off",
      category: "Other",
      definition: "Gradually exposing delicate greenhouse or indoor nursery seedlings to raw outdoor wind and sun before transplanting.",
      practice: "Place your seedling trays outdoors in partial shade for 2 hours on day one, shifting to 4 hours on day three, and full day on week one.",
      tip: "Prevents transplant shock. Planting soft greenhouse sprouts directly into windy baking outdoor fields instantly shrivels leaves.",
      trick: "Reduce watering to once daily during the hardening week. It triggers the seedling to grow deeper, tougher taproots."
    },
    {
      keyword: "Biological Fencing",
      category: "Other",
      definition: "Planting dense hedges of thorny or bitter plants to form a living wall that excludes monkeys, goats, and thieves.",
      practice: "Plant Cactus lines, Euphorbia, or double-density Lantana hedges along boundaries. Interplant with spiny sisal crops.",
      tip: "Never ticks or breaks like wire fences. Provides natural shelter for helpful garden lizards and birds that eat caterpillar pests.",
      trick: "Plant Lemon Bee-balm or lemongrass in the gaps. The heavy citrus aroma acts as an biological shield that confuses migrating locusts."
    }
  ];

  const filteredKeywords = keywords.filter(k => {
    const matchesSearch = k.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          k.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          k.practice.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || k.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSpeakWord = (kw: LibraryKeyword) => {
    const speakTextString = `Keyword: ${kw.keyword}. Definition: ${kw.definition} Practice: ${kw.practice} Farmer Tip: ${kw.tip} Magic Trick: ${kw.trick}`;
    speakText(speakTextString, true);
  };

  return (
    <div className="space-y-6" id="farming-library-view">
      {/* Introduction banner */}
      <div className="bg-white border rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-center gap-6">
        <div className="p-4 bg-emerald-50 rounded-full text-emerald-800">
          <BookOpen className="w-10 h-10" />
        </div>
        <div className="space-y-1 flex-1">
          <h3 className="text-xl font-bold text-slate-800 font-sans">
            📖 Standard Farming Keyword Guide & Expert Glossary
          </h3>
          <p className="text-xs text-slate-500 font-sans leading-relaxed">
            Unpack agricultural words. Each keyword below includes practical preparation, easy tips, and secrets 
            to maximize yield for Plants, Animals, Fish, and other general smart practices. Tap the speaker on any item to read it.
          </p>
        </div>
      </div>

      {/* Control Panel: Search and Categories */}
      <div className="bg-white border rounded-2xl p-4 shadow-xs space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search keywords e.g. Mulching, Zero-Grazing, Fingerlings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border rounded-xl bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans text-slate-800"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5" id="library-filters">
          {(['All', 'Plants', 'Animals', 'Fish', 'Other'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                speakText(`Showing ${cat} vocabulary keywords.`, true);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'All' && '⭐ Show All'}
              {cat === 'Plants' && '🌱 Plants & Crops'}
              {cat === 'Animals' && '🐄 Animals & Livestock'}
              {cat === 'Fish' && '🐟 Fish Farming'}
              {cat === 'Other' && '⚒️ General Secrets'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Keywords List */}
        <div className="lg:col-span-5 bg-white border rounded-2xl p-4 shadow-xs space-y-3">
          <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider pb-2 border-b">
            📋 Dictionary Keywords ({filteredKeywords.length})
          </h4>

          <div className="space-y-1 max-h-[460px] overflow-y-auto pr-1">
            {filteredKeywords.length > 0 ? (
              filteredKeywords.map((k, ind) => (
                <button
                  key={ind}
                  onClick={() => {
                    setSelectedKeyword(k);
                    speakText(`Loaded definition for ${k.keyword}`, true);
                  }}
                  className={`w-full text-left p-3 rounded-xl border font-sans flex items-center justify-between transition ${
                    selectedKeyword?.keyword === k.keyword
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-2xs'
                      : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <strong className="text-xs block font-extrabold">{k.keyword}</strong>
                    <span className={`text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded ${
                      k.category === 'Plants' ? 'bg-emerald-100 text-emerald-800' :
                      k.category === 'Animals' ? 'bg-amber-100 text-amber-800' :
                      k.category === 'Fish' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {k.category}
                    </span>
                  </div>
                  <BookOpen className="w-4 h-4 opacity-50 text-emerald-800" />
                </button>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                No matching farming words found. Try searching for "Compost" or "Aqua"!
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Definition and Practical Guides */}
        <div className="lg:col-span-7 space-y-4">
          {selectedKeyword ? (
            <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6 animate-fadeIn">
              
              <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black text-emerald-700 tracking-wider font-mono">
                    Vocabulary Spotlight • Category: {selectedKeyword.category}
                  </span>
                  <h4 className="text-2xl font-black text-slate-900 font-sans tracking-tight">
                    {selectedKeyword.keyword}
                  </h4>
                </div>
                <button
                  onClick={() => handleSpeakWord(selectedKeyword)}
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold text-xs rounded-xl flex items-center gap-1.5 transition hover:-translate-y-0.5 shadow-sm"
                >
                  <Volume2 className="w-4 h-4" /> Listen to Keyword Lesson
                </button>
              </div>

              {/* Real Definition Box */}
              <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">📖 Simple Explanation</span>
                <p className="text-xs text-slate-700 font-sans leading-relaxed">
                  {selectedKeyword.definition}
                </p>
              </div>

              {/* Practical Guidelines */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* How to Practice */}
                <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-100 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🧑‍🌾</span>
                    <strong className="text-xs text-emerald-950 font-bold">How to Practice on Farm</strong>
                  </div>
                  <p className="text-[11px] text-slate-650 font-sans leading-relaxed">
                    {selectedKeyword.practice}
                  </p>
                </div>

                {/* Farmer Tip */}
                <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">💡</span>
                    <strong className="text-xs text-indigo-950 font-bold">Standard Farmer Tip</strong>
                  </div>
                  <p className="text-[11px] text-slate-650 font-sans leading-relaxed">
                    {selectedKeyword.tip}
                  </p>
                </div>

              </div>

              {/* Master Trick Indicator */}
              <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-4 flex gap-3.5 items-start">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-800">
                  <Award className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <strong className="text-xs text-amber-950 block font-bold">💡 Elder Farmer's Custom Trick</strong>
                  <p className="text-[11px] text-slate-750 font-sans leading-relaxed">
                    {selectedKeyword.trick}
                  </p>
                </div>
              </div>

              {/* Expert consult banner inside card */}
              <div className="bg-red-50/30 border border-red-100 rounded-xl p-4 flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-red-700 shrink-0" />
                <p className="text-[10px] text-red-900 leading-relaxed font-sans font-medium">
                  <strong>Advice Notice:</strong> Methods can vary with regional soils. Start this on a small trial patch before upgrading your entire farm!
                </p>
              </div>

            </div>
          ) : (
            <div className="bg-white border rounded-2xl p-12 text-center text-slate-400 font-sans space-y-3 shadow-xs">
              <div className="w-16 h-16 bg-slate-50 border rounded-full flex items-center justify-center mx-auto text-xl">
                🔎
              </div>
              <h5 className="font-extrabold text-slate-700 text-sm">No Keyword Spotlight Loaded</h5>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Read definitions, steps, and tips by tapping on any keyword in the list on the left side!
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
