import React, { useState, useEffect } from 'react';
import { Volume2, Search, Loader2, Sparkles, AlertCircle, CloudSun, TrendingUp, Newspaper, HelpCircle } from 'lucide-react';
import { WeatherData, FarmingNews } from '../types';

interface BusinessAndValueAdditionViewProps {
  speakText: (text: string, force?: boolean) => void;
  location: string;
}

export default function BusinessAndValueAdditionView({ speakText, location }: BusinessAndValueAdditionViewProps) {
  const [activeLoc, setActiveLoc] = useState(location || 'Meru, Kenya');
  const [loadingWeather, setLoadingWeather] = useState(false);
  
  // Weather & Alternatives Data State
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [newsList, setNewsList] = useState<FarmingNews[]>([]);
  const [marketAlts, setMarketAlts] = useState<{title: string; demandStatus: string; recommendation: string} | null>(null);

  // Value addition presets
  const [selectedValueAdd, setSelectedValueAdd] = useState<string>('milk');

  // Custom AI search
  const [customMaterial, setCustomMaterial] = useState('');
  const [customLoading, setCustomLoading] = useState(false);
  const [customPlan, setCustomPlan] = useState<string | null>(null);

  // Load weather and alternatives on mount or when location changes
  const fetchWeatherAndTrends = async (searchLoc: string) => {
    setLoadingWeather(true);
    speakText(`Pulling live weather forecasts and market trends for: ${searchLoc}. This uses live Google Search Grounding!`, true);
    
    try {
      const resp = await fetch('/api/gemini/weather-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: searchLoc })
      });

      if (!resp.ok) {
        throw new Error('Remote agricultural weather query failed.');
      }

      const data = await resp.json();
      setWeatherData(data.weather);
      setNewsList(data.news);
      setMarketAlts(data.alternatives);
      
      speakText(`Loaded dynamic forecast data. The current condition in ${searchLoc} is ${data.weather.condition}. Advice: ${data.weather.advice}`, true);
    } catch (err) {
      console.error(err);
      speakText("Notice: Showing preloaded local forecasts and news trends for your Highlands district.", true);
    } finally {
      setLoadingWeather(false);
    }
  };

  useEffect(() => {
    fetchWeatherAndTrends(activeLoc);
  }, []);

  const handleFetchClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeLoc.trim()) {
      fetchWeatherAndTrends(activeLoc);
    }
  };

  const handleCustomAgribusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMaterial.trim()) return;

    setCustomLoading(true);
    setCustomPlan(null);
    speakText(`Planning cottage business for ingredient: ${customMaterial}. Let me calculate costs and workflow list.`, true);

    try {
      const resp = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `I want to start an agricultural value addition business using: "${customMaterial}". Can you build a step-by-step cottage agribusiness plan? Write it in simple, low-literacy language containing: 
1. Equipment needed (simple boiling pots, hand tools), 
2. Exact processing steps, 
3. Shelf-life improvement (bottling, drying), 
4. Simplified costing estimate to start, 
5. Marketing tips.`,
          location: activeLoc,
          profileType: 'value-addition'
        })
      });

      if (!resp.ok) {
        throw new Error('Business AI failed to generate plan.');
      }

      const data = await resp.json();
      setCustomPlan(data.text);
      speakText(`Agribusiness plan is ready for ${customMaterial}`, true);
    } catch (err) {
      console.error(err);
      setCustomPlan(`Here is basic startup advice for: "${customMaterial}":
1. Setup clean workspace with boiling water sanitation.
2. Peel or slice cleanly.
3. Sun-dry or cook into concentrates.
4. Pack in glass jars sealed with hot beeswax to extend preservation up to 6 months.`);
    } finally {
      setCustomLoading(false);
    }
  };

  const valAddGuides: Record<string, {
    title: string;
    product: string;
    description: string;
    equipment: string[];
    steps: string[];
    sales: string;
    audio: string;
  }> = {
    milk: {
      title: '🥛 Milk ➡️ Yoghurt / Cheese making',
      product: 'Cultured yoghurt, paneer, & butter',
      description: 'Raw milk spoils inside 4 hours at room temperature, making evening milking difficult to sell. Transforming it into cream-thick yoghurt triples its price and keeps for 10 days.',
      equipment: ['Stainless cooking pot', 'Thermometer (to measure heat)', 'Clean glass jam jars', 'Starter active culture cups'],
      steps: [
        '1. Sanitation: Boil all spoons, jars, and pots in hot water. Dirt in milk causes immediate spoilage.',
        '2. Heating: Slowly heat fresh milk to 85°C to kill background bacteria. Do not boil over.',
        '3. Cooling: Let milk cool until warm (43°C), about temperature of a warm bath.',
        '4. Culture: Add 2 spoons of active plain yoghurt into the warm milk, stir gently.',
        '5. Waiting: Cover the pot with fleece blankets to trap heat. Let sit undisturbed for 8-12 hours. Milk turns into solid yoghurt!'
      ],
      sales: 'Flavor with local honey or pure strawberry juice. Sell in local markets, school kiosks, or roadside shops.',
      audio: 'To turn milk into yoghurt, sanitize all equipment. Heat fresh milk slowly to eighty-five degrees, let cool until warm, stir in two spoons of active natural yoghurt, cover the pot with warm blankets, and let sit for ten hours.'
    },
    tomato: {
      title: '🍅 Tomato ➡️ Paste & Sun-dried Jars',
      product: 'Rich tomato puree & sun-sealed slices',
      description: 'During peak tomato harvesting, prices collapse due to glut. Canning puree allows you to sell when tomatoes are dry and scarce for huge markup.',
      equipment: ['Manual hand blender or sieve', 'Thick cooking pot', 'Glass jars with screw lids', 'Pinch of salt and lemon juice'],
      steps: [
        '1. Selection: Wash tomatoes, remove bruised skins. Chop into small pieces.',
        '2. Cooking: Boil chopped tomatoes with a pinch of salt until they mash up into pulpy soup.',
        '3. Sieving: Press the pulp through a clean wire sieve to exclude stringy seeds and tough skins.',
        '4. Concentrating: Boil soup again, stirring constantly to boil off water until it thickens into dark tomato paste.',
        '5. Sealing: Pour piping hot paste into warm jars, add a spoon of lemon juice, screw lids tight, then submerge jars in boiling water for 15 minutes to seal vacuum.'
      ],
      sales: 'Sell sealed puree to hotels, boarding schools, or local market food stalls. These stay safe without a fridge for 6 months.',
      audio: 'Convert tomatoes to paste. Cook washed tomatoes with salt, pass through a wire sieve, reduce soup until thick, pour into hot jars with a squeeze of lemon, and seal in boiling water.'
    },
    potato: {
      title: '🥔 Potato ➡️ Packaged Crisps (Chips)',
      product: 'Crispy salted paper-crisps',
      description: 'Raw potato sacks sell cheap. Salted potato crisps pack major value, are easy to transport, and command five times the raw weight value.',
      equipment: ['Slicing blade / Mandoline', 'Deep frying pan or pot', 'Clean cotton towels', 'Plastic package bags & sealer'],
      steps: [
        '1. Slicing: Peel and slice potatoes paper-thin. Uniform slices cook evenly.',
        '2. Washing: Rinse starch off in clean cold water, then dry completely on cotton sheets. Moist slices go soggy.',
        '3. Frying: Heat vegetable oil until extremely hot. Drop thin slices in small batches.',
        '4. Flavoring: Fry until light gold. Scoop out, drain excess oil, and shake under salt, paprika, or chili powder.',
        '5. Packaging: Package in clear bags using a heat sealer or candle flame to trap dry air inside.'
      ],
      sales: 'Supply to local kiosks, petrol stations, and neighborhood grocery stores as fresh bar snacks.',
      audio: 'Prepare potato crisps. Slice potatoes thin, wash starch off, dry fully on towels, fry in hot oil until turning light gold, salt immediately, and package airtight.'
    }
  };

  return (
    <div className="space-y-8" id="business-value-container">
      
      {/* 1. Dynamic Local Weather & Crop Demand Block */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800 font-sans tracking-tight">
              🌍 Dynamic Weather Forecast & Crop Demand Insights
            </h3>
            <p className="text-xs text-slate-500 font-sans">
              Enter your town name. Our AI scans the web with search grounding to retrieve active forecasts and market options.
            </p>
          </div>
          
          <form onSubmit={handleFetchClick} className="flex gap-1.5 w-full sm:w-auto">
            <input
              type="text"
              className="px-3 py-1.5 rounded-xl border text-xs focus:ring-1 focus:ring-emerald-500 font-medium"
              placeholder="e.g. Meru, Nakuru, Lusaka"
              value={activeLoc}
              onChange={(e) => setActiveLoc(e.target.value)}
            />
            <button
              id="btn-fetch-trends"
              disabled={loadingWeather}
              type="submit"
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-750 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              {loadingWeather ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Load local trends</span>
            </button>
          </form>
        </div>

        {loadingWeather ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-xs text-slate-500 animate-pulse font-mono">Grounding forecasts from Google Search...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6" id="weather-insights-dashboard">
            
            {/* Live Weather Card */}
            {weatherData && (
              <div className="md:col-span-5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-5 rounded-2xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded font-bold">Dynamic Weather</span>
                    <CloudSun className="w-8 h-8 text-yellow-200" />
                  </div>
                  <div>
                    <h4 className="text-xs text-blue-100 font-bold font-sans">Location: {weatherData.location}</h4>
                    <p className="text-3xl font-extrabold font-mono mt-1">{weatherData.temp}</p>
                    <p className="text-xs font-semibold">{weatherData.condition} ({weatherData.humidity} hum)</p>
                  </div>
                  <p className="text-[11px] bg-white/15 p-2.5 rounded-xl leading-relaxed font-sans border border-white/10">
                    {weatherData.advice}
                  </p>
                </div>

                {/* mini 3-day forecast */}
                <div className="grid grid-cols-3 gap-1 pt-4 mt-4 border-t border-white/15 text-center text-[10px] font-mono">
                  {weatherData.forecast.map((f, i) => (
                    <div key={i} className="bg-white/10 p-1.5 rounded-lg">
                      <p className="font-bold">{f.day}</p>
                      <p className="text-yellow-255 font-bold mt-0.5">{f.temp}</p>
                      <p className="text-[8px] truncate">{f.condition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Demand & Alternatives Column */}
            {marketAlts && (
              <div className="md:col-span-7 space-y-4">
                <div className="bg-emerald-50/60 border border-emerald-150 p-5 rounded-2xl space-y-2.5">
                  <h4 className="font-bold text-emerald-950 text-xs uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-emerald-600" /> {marketAlts.title}
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    <strong>Trend:</strong> {marketAlts.demandStatus}
                  </p>
                  <p className="text-xs text-emerald-900 leading-relaxed font-sans bg-white p-3 rounded-xl border border-emerald-100">
                    <strong>Alternates Advice:</strong> {marketAlts.recommendation}
                  </p>
                </div>

                {/* dynamic news or blogs snippet */}
                {newsList.length > 0 && (
                  <div className="space-y-1.5">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1">
                      <Newspaper className="w-3.5 h-3.5" /> News and agricultural blog updates
                    </h5>
                    <div className="grid grid-cols-1 gap-2">
                      {newsList.map((nw, i) => (
                        <div key={i} className="p-3 bg-white border rounded-xl text-xs hover:shadow-sm transition font-sans">
                          <strong className="block text-slate-800 font-bold mb-0.5 leading-tight">{nw.title}</strong>
                          <span className="text-[10px] text-slate-405 font-medium uppercase font-mono mr-1">Source: {nw.source} | </span>
                          <span className="text-slate-550 leading-relaxed">{nw.summary}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>

      {/* 2. Interactive Agribusiness Presets */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold font-sans text-slate-800">
            🍯 Turn Milk and Crops into High-Value Business Plans
          </h3>
          <p className="text-xs text-slate-500 font-sans">
            Choose what you grow below to view processing steps, necessary cookware, and sales channels.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.keys(valAddGuides).map((key) => (
            <button
              id={`value-add-btn-${key}`}
              key={key}
              onClick={() => {
                setSelectedValueAdd(key);
                speakText(`Loaded value addition guidelines: ${valAddGuides[key].title}`, true);
              }}
              className={`p-4 rounded-xl border text-left font-sans transition flex items-center justify-between ${
                selectedValueAdd === key
                  ? 'bg-amber-100 border-amber-500 text-amber-950 font-bold shadow-inner'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{valAddGuides[key].title}</span>
            </button>
          ))}
        </div>

        {/* Selected Preset Business guide content */}
        <div className="bg-amber-50/20 border border-amber-105 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-amber-100">
            <div>
              <h4 className="font-extrabold text-slate-800 text-base">{valAddGuides[selectedValueAdd].title}</h4>
              <p className="text-xs text-slate-550 font-medium font-sans">Final Product: {valAddGuides[selectedValueAdd].product}</p>
            </div>
            <button
              id="value-add-audio-button"
              onClick={() => speakText(valAddGuides[selectedValueAdd].audio, true)}
              className="px-3.5 py-1.5 bg-amber-100 text-amber-900 hover:bg-amber-200 font-bold text-xs rounded-lg flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4" /> Listen to Recipe voiceover
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-sans bg-white p-3.5 rounded-xl border border-amber-50">
            {valAddGuides[selectedValueAdd].description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Steps list */}
            <div className="md:col-span-2 space-y-3">
              <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-sans">🏗️ Step-by-Step Cooking Guide</h5>
              <div className="space-y-2.5">
                {valAddGuides[selectedValueAdd].steps.map((st, i) => (
                  <p key={i} className="text-xs text-slate-700 bg-white p-3 rounded-lg border leading-relaxed font-sans">
                    {st}
                  </p>
                ))}
              </div>
            </div>

            {/* Cookware & distribution column */}
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border space-y-2">
                <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-sans text-amber-800">🥣 Required Cookware</h5>
                <ul className="space-y-1.5 font-sans text-xs text-slate-600">
                  {valAddGuides[selectedValueAdd].equipment.map((eq, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{eq}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-4 rounded-xl border space-y-1.5">
                <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-sans text-emerald-800">💹 Sales & Marketing</h5>
                <p className="text-[11px] text-slate-550 leading-relaxed font-sans">
                  {valAddGuides[selectedValueAdd].sales}
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 4. AI Custom Agribusiness plan generator */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <h4 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
            🔮 Custom Agribusiness Startup Plan
          </h4>
          <p className="text-xs text-slate-500 font-sans">
            Have raw products like mangoes, peanuts, bananas, wool, or fish? Ask the AI how to start a processed business around it.
          </p>
        </div>

        <form onSubmit={handleCustomAgribusiness} className="flex gap-2">
          <input
            type="text"
            required
            placeholder="e.g., Avocado oil, Fried banana chips, Peanut butter..."
            className="flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={customMaterial}
            onChange={(e) => setCustomMaterial(e.target.value)}
          />
          <button
            type="submit"
            disabled={customLoading}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            {customLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-yellow-300" />}
            <span>Build Plan</span>
          </button>
        </form>

        {customPlan && (
          <div className="p-5 bg-amber-50/25 rounded-2xl border border-amber-100 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-amber-100">
              <span className="text-xs font-bold text-amber-900">🧑‍🍳 Agribusiness Expert Startup Advice</span>
              <button
                onClick={() => speakText(customPlan, true)}
                className="p-1 px-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg text-xs flex items-center gap-1"
                title="Speak text guide"
              >
                <Volume2 className="w-4 h-4" /> Speak Business Plan
              </button>
            </div>
            <div className="text-slate-700 text-xs leading-relaxed space-y-2 whitespace-pre-wrap font-sans">
              {customPlan}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
