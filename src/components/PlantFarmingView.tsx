import React, { useState } from 'react';
import { CROP_PRESETS, CropPreset } from '../data';
import { Volume2, Search, Loader2, Sparkles, BookOpen, UserCheck, ShieldAlert, Award } from 'lucide-react';

interface PlantFarmingViewProps {
  speakText: (text: string, force?: boolean) => void;
  location: string;
}

export default function PlantFarmingView({ speakText, location }: PlantFarmingViewProps) {
  const [selectedPreset, setSelectedPreset] = useState<CropPreset>(CROP_PRESETS[0]);
  const [customCrop, setCustomCrop] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  const handleCustomSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCrop.trim()) return;

    setSearchLoading(true);
    setAiAnswer(null);
    speakText(`Searching farming expert records for: ${customCrop}. Please hold!`, true);

    try {
      const resp = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Can you give me a clear, step-by-step planting guide for: ${customCrop}? Include the primary diseases, soil requirements, harvesting tips, do's & don'ts and value-addition ideas for beginners.`,
          location: location,
          profileType: 'plants'
        })
      });

      if (!resp.ok) {
        throw new Error('Expert is unavailable right now.');
      }

      const data = await resp.json();
      setAiAnswer(data.text);
      speakText(`Answer found! Here is the guide for ${customCrop}. Tap the loudspeaker icon to hear it.`, true);
    } catch (err) {
      console.error(err);
      setAiAnswer(`Could not contact the crop specialist. However, here is low-literacy advice regarding ${customCrop}: Ensure well-draining soil, add two cups of dark organic compost to every hole, water only early mornings, and space plants nicely to allow clean air to pass.`);
    } finally {
      setSearchLoading(false);
    }
  };

  const speakPresetSteps = () => {
    const list = selectedPreset.steps.map(s => `${s.title}: ${s.desc}`).join('. ');
    speakText(`Step guide for ${selectedPreset.name}: ${list}`, true);
  };

  const speakPresetDiseases = () => {
    const list = selectedPreset.diseases.map(d => `${d.name}. Visual signs are ${d.symptoms}. Prevent by ${d.prevention}`).join('. ');
    speakText(`Common diseases for ${selectedPreset.name}: ${list}`, true);
  };

  return (
    <div className="space-y-8" id="plant-farming-view">
      
      {/* Visual Crop Presets Selector */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold font-sans text-slate-800 tracking-tight flex items-center gap-2">
            🌱 Interactive Plant & Crop Manual
          </h3>
          <p className="text-xs text-slate-500 font-sans">
            Tap a vegetable crop below to load certified planting guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CROP_PRESETS.map((preset) => (
            <button
              id={`preset-crop-${preset.id}`}
              key={preset.id}
              onClick={() => {
                setSelectedPreset(preset);
                speakText(`Loaded manual for ${preset.name}. It takes ${preset.cycle} from planting.`, true);
              }}
              className={`p-4 rounded-2xl border text-left transition select-none flex flex-col justify-between h-28 ${
                selectedPreset.id === preset.id
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-500 ring-2 ring-emerald-50/20 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="font-bold text-sm block">{preset.name}</span>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                📅 cycle: {preset.cycle}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Guide Content */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Title and Voice controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
          <div>
            <h4 className="text-lg font-bold text-slate-800 font-sans">{selectedPreset.name} Guide</h4>
            <p className="text-xs text-slate-500 font-sans font-medium">Ideal soil: {selectedPreset.idealSoil}</p>
          </div>
          <button
            onClick={() => speakText(`Climate for ${selectedPreset.name} is: ${selectedPreset.bestClimate}. Crop cycle takes ${selectedPreset.cycle}.`, true)}
            className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-sans font-bold text-xs rounded-lg flex items-center gap-1.5"
          >
            <Volume2 className="w-4 h-4" /> Listen to Climate Specs
          </button>
        </div>

        {/* Climate Warning header */}
        <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 font-sans">
          <strong>🌡️ Certified Climate limits:</strong> {selectedPreset.bestClimate}
        </div>

        {/* Visual Steps Block */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h5 className="font-bold text-slate-800 text-sm">🌾 Soil Preparation & Plant Progression Tasks</h5>
            <button
              onClick={speakPresetSteps}
              className="text-[11px] font-bold text-emerald-800 hover:underline flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" /> Listen steps
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedPreset.steps.map((st, idx) => (
              <div key={idx} className="bg-slate-50 border p-4 rounded-xl space-y-1.5 hover:shadow-sm transition">
                <h6 className="font-bold text-slate-800 text-xs">{st.title}</h6>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Diseases and Prevention Block */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <h5 className="font-bold text-red-900 text-sm flex items-center gap-1">
              🍂 Critical Plant Pests & Natural Treatments
            </h5>
            <button
              onClick={speakPresetDiseases}
              className="text-[11px] font-bold text-red-800 hover:underline flex items-center gap-1 font-sans"
            >
              <Volume2 className="w-3.5 h-3.5 animate-bounce" /> Listen to Treatments
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedPreset.diseases.map((dis, idx) => (
              <div key={idx} className="bg-red-50/30 border border-red-50 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <h6 className="font-bold text-red-950 text-xs mb-1">{dis.name}</h6>
                  <p className="text-[11px] text-slate-500 font-sans mb-1.5"><strong>Visual signs:</strong> {dis.symptoms}</p>
                </div>
                <p className="text-[11px] text-slate-700 bg-white/80 p-2 rounded-lg border leading-relaxed font-sans">
                  <strong>💡 Action:</strong> {dis.prevention}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Harvesting and Value Add visual highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t font-sans">
          <div className="bg-slate-50 p-4 rounded-xl border">
            <h6 className="font-bold text-slate-800 text-xs mb-1.5 flex items-center gap-1">🧺 Gentler Harvesting</h6>
            <p className="text-[11px] text-slate-550 leading-relaxed font-sans">{selectedPreset.harvesting}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border">
            <h6 className="font-bold text-slate-800 text-xs mb-1.5 flex items-center gap-1">💰 Market Selling Channel</h6>
            <p className="text-[11px] text-slate-550 leading-relaxed font-sans">{selectedPreset.marketing}</p>
          </div>
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
            <h6 className="font-bold text-emerald-900 text-xs mb-1.5 flex items-center gap-1">🍯 Profit Cottage Addition</h6>
            <p className="text-[11px] text-emerald-950 leading-relaxed font-sans">{selectedPreset.valueAddition}</p>
          </div>
        </div>

      </div>

      {/* AI Custom Crop Search */}
      <div className="bg-white border md:border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-4">
        <div>
          <h4 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
            🔍 Ask AI About Any Other Plant
          </h4>
          <p className="text-xs text-slate-500 font-sans">
            Have onions, garlic, bananas, or tea? Specify the crop name below and get instant simplified guidance.
          </p>
        </div>

        <form onSubmit={handleCustomSearch} className="flex gap-2">
          <input
            type="text"
            required
            placeholder="e.g., Avocado trees, Garlic, Sweet potatoes..."
            value={customCrop}
            onChange={(e) => setCustomCrop(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={searchLoading}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-750 text-white font-semibold rounded-xl text-sm flex items-center gap-1.5 border-b shadow-sm cursor-pointer"
          >
            {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Consult AI</span>
          </button>
        </form>

        {aiAnswer && (
          <div className="p-5 bg-emerald-50/30 rounded-2xl border border-emerald-100 space-y-3 animate-fade-in relative">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-xs font-bold text-emerald-800">🧑‍🌾 AI Elder Farmer Guide</span>
              <button
                onClick={() => speakText(aiAnswer, true)}
                className="p-1 px-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-lg text-xs flex items-center gap-1"
                title="Listen to response text"
              >
                <Volume2 className="w-4 h-4" /> Play Audio Answer
              </button>
            </div>
            
            {/* Split formatting style */}
            <div className="text-slate-700 text-xs leading-relaxed space-y-2 whitespace-pre-wrap font-sans">
              {aiAnswer}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
