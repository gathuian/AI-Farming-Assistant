import React, { useState } from 'react';
import { Volume2, Leaf, Search, HelpCircle, ShieldCheck, ShowerHead, Heart, Soup, Eye } from 'lucide-react';

interface HerbData {
  id: string;
  name: string;
  scientificName: string;
  plantingGuide: string; // How to grow
  soilWater: string;     // Watering & soils
  uses: {
    naturalSoaps: string;
    coldRemedies: string;
    foodAdditions: string;
  };
  remedyStepByStep: string[]; // Step-by-step remedy prep
}

interface HerbsAndRemediesProps {
  speakText: (text: string, force?: boolean) => void;
}

export default function HerbsAndRemedies({ speakText }: HerbsAndRemediesProps) {
  const [search, setSearch] = useState('');
  const [selectedHerb, setSelectedHerb] = useState<HerbData | null>(null);

  const herbs: HerbData[] = [
    {
      id: "herb_1",
      name: "🌿 Aloe Vera (The Healing Succulent)",
      scientificName: "Aloe barbadensis miller",
      plantingGuide: "Plant sucker shoots (pups) in sandy, well-draining dry dirt beds. Allow ample morning sun. Do not let roots drown in heavy water puddles.",
      soilWater: "Water sparsely—only once every 10 days. Ensure sandy or volcanic rock is mixed into the potting structure.",
      uses: {
        naturalSoaps: "Aloe Soaps: Cut off a thick leaf, scoop out the clear slimy inner gel. Whip the clear gel into warm melted organic tallow or vegetable glycerin soap base. It cures skin dry scaling, rashes, and heals small field machete minor scratches.",
        coldRemedies: "Skin Burns & Sun Chills: Apply raw split-leaf cool gel directly onto burn wounds, insect hornet stings, or dry cracked homestead lips.",
        foodAdditions: "Aloe Tonic: Scoop a tiny teaspoon of washed aloe gel into fresh juice cups to settle stomach acid bloat and relieve digestion cramps."
      },
      remedyStepByStep: [
        "Cut a thick bottom mature Aloe leaf horizontally near the stem.",
        "Stand the cut leaf upright in a mug for 10 minutes to drain the yellow bitter sap (aloin), then toss the yellow sap away.",
        "Slice off the prickly green spines on the sides with a clean pocket knife.",
        "Split the leaf down the middle to expose the clean, clear, slimy jelly.",
        "With a spoon, scoop out the transparent gel and mash it thoroughly inside a clean bowl for use."
      ]
    },
    {
      id: "herb_2",
      name: "🌱 Peppermint (The Breathing Herb)",
      scientificName: "Mentha piperita",
      plantingGuide: "Grow cuttings or root divisions in rich, wet compost soils. Mint spreads aggressively, so plant inside closed wood planters or border containers to stop it from taking over other veggie zones.",
      soilWater: "Enjoys misty damp soil and cool light trees shading. Water daily during sunny afternoons.",
      uses: {
        naturalSoaps: "Mint Fresh Soaps: Mash fresh dry mint leaves into fine flakes and mix into soap bars. It yields a strong cooling aromatherapy effect that repels flies and cools tired farmer feet.",
        coldRemedies: "Chest Congestion Balm: Boil 20 mint leaves in a tea kettle, drape a thick towel over your head and breath the hot mint steam to instantly open congested noses and dry cold coughs.",
        foodAdditions: "Healthy Tea: Steep 5 torn green leaves in hot boiled tea water with honey for a refreshing digestion drink after high-fat meals."
      },
      remedyStepByStep: [
        "Pluck a handful of fresh clean peppermint leaves in the morning.",
        "Place them in a tea kettle or large ceramic mug.",
        "Pour boiling water over the leaves and let it bubble-steep for 8 minutes.",
        "Breathe in the rich menthol steam directly above the cup for 3 minutes.",
        "Strain, stir in a drop of eucalyptus honey, and sip slowly."
      ]
    },
    {
      id: "herb_3",
      name: "🍋 Lemongrass (The Fever Shield)",
      scientificName: "Cymbopogon citratus",
      plantingGuide: "Plant root bundles directly into fertile sunny borders. It forms big bushy grass mounds that act as a visual boundary and chokes aggressive grass weeds.",
      soilWater: "Grows in any soil. Water once a week during intense dry sunny seasons.",
      uses: {
        naturalSoaps: "Exfoliating Clean Scrub: Slice lemongrass roots into paper-thin disks and dry in the sun. Grind into sand powder and blend into glycerin soaps. Its lovely citrus smell and texture scrubs away grease grit from hard field labor.",
        coldRemedies: "Fever & Chills Tea: Brew cut grass stalks hot. It triggers healthy sweating, lowering malaria fever symptoms and breaking hot sweat flushes.",
        foodAdditions: "Cooking Herb: Crush the white bottom bulb with a wooden mallet and simmer inside fish soups or chicken stews to add authentic lemony wood flavoring."
      },
      remedyStepByStep: [
        "Uproot or cut 3 thick white lemongrass stems near soil level.",
        "Wash out all soil mud thoroughly. Beat the bulbs flat with a clean hammer.",
        "Slice the stalks into 5cm segments.",
        "Boil in 3 cups of water in a small pot for 12 minutes until water turns light golden yellow.",
        "Strain, add a half lemon slice, and drink hot to soothe flu symptoms."
      ]
    },
    {
      id: "herb_4",
      name: "🌻 Rosemary (The Mind and Hair Tonic)",
      scientificName: "Salvia rosmarinus",
      plantingGuide: "Plant green woody stem branches in dry sunny locations. It behaves like a small bush shrub and can survive severe heat without dying.",
      soilWater: "Prefers well-draining dry soils. Only water when the top 3cm of earth is dusty dry.",
      uses: {
        naturalSoaps: "Rosemary Antiseptic Soap: Boil rosemary sprigs in pure spring water to create a dark tea. Mix this strong antiseptic liquid into liquid soap bases. It destroys bacteria on dirty hands.",
        coldRemedies: "Homestead Cough Inhalation: Simmer rosemary needles in water. It contains pine-like camphor oils that open restricted lungs.",
        foodAdditions: "Roast Potato Spice: Mince rosemary needles fine and sprinkle over roasting potatoes, sheep meat, or pumpkin wedges to add incredible rich aroma."
      },
      remedyStepByStep: [
        "Harvest 2 fresh sprigs of dry-leaf rosemary.",
        "Boil 2 cups of clean water.",
        "Drop the rosemary sprigs directly into the hot kettle and cover with a wooden lid.",
        "Steep for 10 minutes on very low heat.",
        "Strain, mix with hot milk or lemon honey, and sip to relieve chest congestion."
      ]
    },
    {
      id: "herb_5",
      name: "🧄 Garlic Ginger Knots (Nature's Antibiotic)",
      scientificName: "Allium sativum / Zingiber",
      plantingGuide: "We plant individual garlic cloves root down, 5cm deep inside loose organic mulch beds. Dig up the mature root tubers in 5 months when leaves wither brown.",
      soilWater: "Requires loose rich soil with compost. Water moderately twice a week.",
      uses: {
        naturalSoaps: "Antibiotic Hand Wash: Ginger root extract mixed with liquid soaps kills fungal microbes on fingers after handling animal dung.",
        coldRemedies: "Master Chest Syrup: Mash 3 raw garlic cloves and 1 thumb ginger into paste. Blend with 4 tablespoons of wild pure forest honey inside an airtight jar. Take a spoon daily as a cold shield.",
        foodAdditions: "Daily Garlic Additives: Mash garlic cloves into stews to support heart blood vessels health."
      },
      remedyStepByStep: [
        "Peel 3 garlic cloves and slice 1 clean slice of ginger root.",
        "Mash them together into a smooth wet pulp using a flat stone or mortar.",
        "Put the pulp inside a small clean steel cup or jar.",
        "Drown the pulp in 3 tablespoons of pure natural honey.",
        "Leave it covered for 1 hour to release juices, then swallow 1 teaspoon of the syrup to clear chest viruses."
      ]
    }
  ];

  const filtered = herbs.filter(h => h.name.toLowerCase().includes(search.toLowerCase()) || 
                                     h.scientificName.toLowerCase().includes(search.toLowerCase()) || 
                                     h.uses.coldRemedies.toLowerCase().includes(search.toLowerCase()));

  const handleSpeakHerb = (hb: HerbData) => {
    const textStr = `Herb name: ${hb.name}. Grow instructions: ${hb.plantingGuide}. Soil water requirements: ${hb.soilWater}. How to make natural soaps: ${hb.uses.naturalSoaps}. Cold remedy recipe: ${hb.uses.coldRemedies}. Food additives: ${hb.uses.foodAdditions}. Preparing steps: ${hb.remedyStepByStep.join('. ')}`;
    speakText(textStr, true);
  };

  return (
    <div className="space-y-6" id="herbs-remedies-view">
      {/* Overview Banner */}
      <div className="bg-white border rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-center gap-6">
        <div className="p-4 bg-emerald-50 rounded-full text-emerald-850 animate-pulse">
          <Leaf className="w-10 h-10" />
        </div>
        <div className="space-y-1 flex-1">
          <h3 className="text-xl font-bold text-slate-800 font-sans">
            🌱 Backyard Herb Planting, Natural Soaps & Cold Remedies
          </h3>
          <p className="text-xs text-slate-500 font-sans leading-relaxed">
            Grow helpful backyard bushes, medicinal bulbs, and roots on small patches. Unpack easy rules of planting herbs 
            and how to brew home remedies for chest colds, throat coughs, and handmade herbal soaps for skin health. 
            Tap the speaker on any card to hear instructions!
          </p>
        </div>
      </div>

      {/* Search Input bar */}
      <div className="bg-white border p-4 rounded-2xl shadow-xs">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search healing herbs, e.g. Aloe Vera, Peppermint, Garlic syrup, Lemongrass..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border rounded-xl bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans text-slate-800"
          />
        </div>
      </div>

      {/* Main Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Herbs */}
        <div className="lg:col-span-5 bg-white border rounded-2xl p-4 shadow-xs space-y-3">
          <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider pb-2 border-b">
            📋 Backyard Healing Herbs ({filtered.length})
          </h4>

          <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
            {filtered.length > 0 ? (
              filtered.map((hb) => (
                <button
                  key={hb.id}
                  onClick={() => {
                    setSelectedHerb(hb);
                    speakText(`Loaded growing manual for ${hb.name}`, true);
                  }}
                  className={`w-full text-left p-3 rounded-xl border font-sans flex items-center justify-between transition ${
                    selectedHerb?.id === hb.id
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-2xs'
                      : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <strong className="text-xs block font-extrabold">{hb.name}</strong>
                    <span className="text-[10px] text-slate-400 font-serif italic">{hb.scientificName}</span>
                  </div>
                  <Leaf className="w-4 h-4 text-emerald-850 opacity-50" />
                </button>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                No matching healing herbs found. Search 'Aloe' or 'Peppermint'!
              </div>
            )}
          </div>
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-7">
          {selectedHerb ? (
            <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black text-emerald-650 tracking-wider font-mono">
                    Organic Apothecary Guide • {selectedHerb.scientificName}
                  </span>
                  <h4 className="text-xl font-black text-slate-900 font-sans">
                    {selectedHerb.name}
                  </h4>
                </div>
                <button
                  onClick={() => handleSpeakHerb(selectedHerb)}
                  className="px-3.5 py-2 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition shadow"
                >
                  <Volume2 className="w-4 h-4" /> Listen to Herb Lesson
                </button>
              </div>

              {/* Grow & Water instructions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-100 space-y-1.5">
                  <strong className="text-xs text-emerald-950 font-bold block">🌱 How to Plant & Grow</strong>
                  <p className="text-[11px] text-slate-650 font-sans leading-relaxed">
                    {selectedHerb.plantingGuide}
                  </p>
                </div>

                <div className="p-4 bg-sky-50/40 rounded-xl border border-sky-100 space-y-1.5">
                  <strong className="text-xs text-sky-950 font-bold block">💧 Soil & Water Routine</strong>
                  <p className="text-[11px] text-slate-650 font-sans leading-relaxed">
                    {selectedHerb.soilWater}
                  </p>
                </div>
              </div>

              {/* Healing uses */}
              <div className="space-y-3.5 border-t pt-4">
                <strong className="text-xs text-slate-850 font-extrabold block uppercase tracking-wider">🛠️ Homestead Practical Uses</strong>
                
                <div className="space-y-3">
                  {/* Soap making */}
                  <div className="flex gap-3 items-start p-3 bg-slate-50 border rounded-xl">
                    <div className="p-1.5 bg-sky-100 text-sky-900 rounded">
                      <ShowerHead className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <strong className="text-xs text-slate-800 font-bold block">Herbal Soap Formula</strong>
                      <p className="text-[11px] text-slate-600 font-sans leading-relaxed">{selectedHerb.uses.naturalSoaps}</p>
                    </div>
                  </div>

                  {/* Cold remedies */}
                  <div className="flex gap-3 items-start p-3 bg-slate-50 border rounded-xl">
                    <div className="p-1.5 bg-red-100 text-red-900 rounded">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <strong className="text-xs text-slate-800 font-bold block">Cold & Cough Remedy</strong>
                      <p className="text-[11px] text-slate-600 font-sans leading-relaxed">{selectedHerb.uses.coldRemedies}</p>
                    </div>
                  </div>

                  {/* Food additive */}
                  <div className="flex gap-3 items-start p-3 bg-slate-50 border rounded-xl">
                    <div className="p-1.5 bg-amber-100 text-amber-900 rounded">
                      <Soup className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <strong className="text-xs text-slate-800 font-bold block">Healthy Food Boost</strong>
                      <p className="text-[11px] text-slate-600 font-sans leading-relaxed">{selectedHerb.uses.foodAdditions}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remedy step tracker */}
              <div className="border-t pt-4 space-y-2">
                <strong className="text-xs text-slate-850 font-extrabold block uppercase tracking-wider">📋 Step-by-Step Preparation</strong>
                <ol className="space-y-1.5">
                  {selectedHerb.remedyStepByStep.map((s, idx) => (
                    <li key={idx} className="text-xs text-slate-650 font-sans leading-relaxed flex gap-2">
                      <strong className="text-emerald-800 font-mono text-xs">{idx + 1}.</strong>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Disclaimer */}
              <div className="bg-red-50/50 border border-red-150 p-4 rounded-xl flex gap-3 items-start">
                <ShieldCheck className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="text-xs text-red-950 font-bold block">⚠️ AI Safety Disclaimer Notice</strong>
                  <p className="text-[10px] text-red-900 leading-relaxed font-sans font-medium">
                    This is a homestead herbal suggestion and is entirely AI-generated. This info must NOT substitute professional medical advice. Please consult an organic agricultural extension officer or local apothecary specialist before consuming or trying unfamiliar skin gels.
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border rounded-2xl p-12 text-center text-slate-400 font-sans space-y-3 shadow-xs">
              <div className="w-16 h-16 bg-slate-50 border rounded-full flex items-center justify-center mx-auto text-xl">
                🌱
              </div>
              <h5 className="font-extrabold text-slate-700 text-sm">No Healing Herb Selected</h5>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
                Explore organic planting layouts, watering frequencies, healthy additives, and soaps by clicking any herb name on the left!
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
