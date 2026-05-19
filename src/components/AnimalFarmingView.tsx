import React, { useState } from 'react';
import { LIVESTOCK_PRESETS, LivestockPreset } from '../data';
import { Volume2, Search, Loader2, Sparkles, Award, ShieldAlert, BadgePlus, HelpCircle } from 'lucide-react';

interface AnimalFarmingViewProps {
  speakText: (text: string, force?: boolean) => void;
  location: string;
}

export default function AnimalFarmingView({ speakText, location }: AnimalFarmingViewProps) {
  const [selectedPreset, setSelectedPreset] = useState<LivestockPreset>(LIVESTOCK_PRESETS[0]);
  const [customAnimal, setCustomAnimal] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  const handleCustomSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAnimal.trim()) return;

    setSearchLoading(true);
    setAiAnswer(null);
    speakText(`Asking veterinary specialist advisor about: ${customAnimal}. Ready soon.`, true);

    try {
      const resp = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Can you create a thorough farming guide for raising ${customAnimal}? Outline: 1. Popular breeds, 2. Critical vaccination schedule, 3. Climate limitations, 4. Major disease vulnerabilities & visual symptoms, 5. Yield expectations, 6. do's & don'ts, and 7. housing infrastructure.`,
          location: location,
          profileType: 'animals'
        })
      });

      if (!resp.ok) {
        throw new Error('Veterinary AI is currently out on a farm visit.');
      }

      const data = await resp.json();
      setAiAnswer(data.text);
      speakText(`Animal guide returned for ${customAnimal}! Let's read through.`, true);
    } catch (err) {
      console.error(err);
      setAiAnswer(`Could not download animal plan. General advice for ${customAnimal}: Keep housing structures elevated and dry to preserve foot joints. Give clear drinking water mixed with organic salt licks for minerals. Keep animal feed in closed plastic bins away from rain-damp and mice.`);
    } finally {
      setSearchLoading(false);
    }
  };

  const speakVaccines = () => {
    const list = selectedPreset.vaccines.map(v => `${v.age}: ${v.treatment} (${v.details})`).join('. ');
    speakText(`Vaccination timeline: ${list}`, true);
  };

  const speakDiseases = () => {
    const list = selectedPreset.vulnerabilities.map(v => `${v.disease}. Signs are ${v.signs}. Action to take: ${v.actions}`).join('. ');
    speakText(`Disease warning checklist: ${list}`, true);
  };

  return (
    <div className="space-y-8" id="animal-farming-view">
      
      {/* Visual Animal Preset Buttons */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold font-sans text-slate-800 tracking-tight flex items-center gap-2">
            🐄 Interactive Livestock & Animal Manual
          </h3>
          <p className="text-xs text-slate-500 font-sans">
            Select an animal preset below to load vaccination charts, climate rules, and premium breeds list.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LIVESTOCK_PRESETS.map((preset) => (
            <button
              id={`preset-animal-${preset.id}`}
              key={preset.id}
              onClick={() => {
                setSelectedPreset(preset);
                speakText(`Loaded manual for ${preset.name}. This guide outlines vaccination schedules and structural setups.`, true);
              }}
              className={`p-5 rounded-2xl border text-left transition select-none flex flex-row items-center justify-between h-24 ${
                selectedPreset.id === preset.id
                  ? 'bg-amber-50 text-amber-950 border-amber-500 ring-2 ring-amber-50/20 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-750 hover:bg-slate-50'
              }`}
            >
              <div>
                <span className="font-extrabold text-sm block">{preset.name}</span>
                <span className="text-[10px] text-slate-400 block mt-1 font-mono">Breeds: {preset.breeds.length} listed</span>
              </div>
              <Award className="w-8 h-8 text-amber-600 opacity-80" />
            </button>
          ))}
        </div>
      </div>

      {/* Rearing Guidelines Content */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Title and Voice */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
          <div>
            <h4 className="text-lg font-bold text-slate-800 font-sans">{selectedPreset.name} Husbandry Guide</h4>
            <p className="text-xs text-slate-500 font-sans">Climate rule: {selectedPreset.climateLimit}</p>
          </div>
          <button
            onClick={() => speakText(`Climate restriction: ${selectedPreset.climateLimit}. Yield estimate: ${selectedPreset.yieldExpectations}`, true)}
            className="px-3.5 py-1.5 bg-amber-50 text-amber-900 hover:bg-amber-100 font-bold text-xs rounded-lg flex items-center gap-1.5 font-sans"
          >
            <Volume2 className="w-4 h-4" /> Listen to Climate Specs
          </button>
        </div>

        {/* Climate banner */}
        <div className="p-3 bg-amber-50/70 border border-amber-150 rounded-xl text-xs text-amber-950 font-sans">
          <strong>🌡️ Climate Limitations:</strong> {selectedPreset.climateLimit}
        </div>

        {/* Breeds & Yield block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
          
          <div className="bg-slate-50 p-5 rounded-xl border space-y-2">
            <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-sans text-emerald-800">🌟 Top Certified Breeds</h5>
            <div className="grid grid-cols-1 gap-1.5">
              {selectedPreset.breeds.map((breed, idx) => (
                <div key={idx} className="bg-white px-3 py-1.5 rounded-lg border text-xs text-slate-700 font-sans">
                  • {breed}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border flex flex-col justify-between">
            <div className="space-y-2">
              <h5 className="font-bold text-slate-850 text-xs uppercase tracking-wider font-sans text-indigo-800">🥛 Ideal Yield Expectations</h5>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">{selectedPreset.yieldExpectations}</p>
            </div>
            {selectedPreset.futureTrends && (
              <div className="mt-3 p-2.5 bg-indigo-50/50 rounded-lg text-[10px] text-indigo-900 border font-mono">
                <strong>Future Trend:</strong> {selectedPreset.futureTrends}
              </div>
            )}
          </div>

        </div>

        {/* Dynamic Vaccination Timeline */}
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-slate-100/60 p-3 rounded-xl border border-dashed border-slate-200">
            <span className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1">
              📅 Mandatory Vaccination Calendar Schedule
            </span>
            <button
              onClick={speakVaccines}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
            >
              <Volume2 className="w-4 h-4 text-emerald-600" /> Speak Timings
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-left text-xs text-slate-600 font-sans">
              <thead className="bg-slate-50 text-slate-705 border-b">
                <tr>
                  <th className="p-3 font-bold font-sans">Target Age</th>
                  <th className="p-3 font-bold font-sans">Vaccine/Treatment</th>
                  <th className="p-3 font-bold font-sans">How to Deliver</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {selectedPreset.vaccines.map((vax, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/30">
                    <td className="p-3 font-bold text-slate-700 whitespace-nowrap">{vax.age}</td>
                    <td className="p-3 font-bold text-emerald-800">{vax.treatment}</td>
                    <td className="p-3 text-slate-500">{vax.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vulnerabilities Block */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <h5 className="font-bold text-red-905 text-sm flex items-center gap-1.5">
              🛡️ Major Animal Vulnerabilities & Signs
            </h5>
            <button
              onClick={speakDiseases}
              className="text-xs font-bold text-red-800 hover:underline flex items-center gap-1"
            >
              <Volume2 className="w-4 h-4 text-red-600 animate-bounce" /> Speak Disease Warnings
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedPreset.vulnerabilities.map((vul, idx) => (
              <div key={idx} className="bg-red-50/40 border border-red-100 p-4 rounded-xl flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h6 className="font-bold text-red-950 text-xs flex items-center gap-1">⚠️ {vul.disease}</h6>
                  <p className="text-[11px] text-slate-550 leading-relaxed font-sans"><strong>Symptom Signs:</strong> {vul.signs}</p>
                </div>
                <div className="mt-3 p-2 bg-white rounded-lg border text-[11px] text-slate-700 leading-relaxed font-sans">
                  <strong>💡 Stop Measure:</strong> {vul.actions}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Housing Guidelines */}
        <div className="bg-emerald-50/30 p-5 rounded-xl border border-emerald-100/70 space-y-2">
          <h5 className="font-bold text-emerald-950 text-xs uppercase tracking-wider font-sans">🏗️ Animal Housing / Pen Infrastructure</h5>
          <p className="text-[11px] text-emerald-900 leading-relaxed font-sans">
            {selectedPreset.infrastructure}
          </p>
        </div>

      </div>

      {/* AI Custom Animal Search */}
      <div className="bg-white border md:border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-4">
        <div>
          <h4 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
            🔍 Consult Expert on Other Animals
          </h4>
          <p className="text-xs text-slate-500 font-sans">
            Want to learn how to raise pigs, goats, sheep, beehives or catfish? Type the animal name below.
          </p>
        </div>

        <form onSubmit={handleCustomSearch} className="flex gap-2">
          <input
            type="text"
            required
            placeholder="e.g. Goats, Pigs, Tilapia Fish pond..."
            value={customAnimal}
            onChange={(e) => setCustomAnimal(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={searchLoading}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-sm flex items-center gap-1.5 shadow-sm border-b cursor-pointer"
          >
            {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Consult Vet</span>
          </button>
        </form>

        {aiAnswer && (
          <div className="p-5 bg-amber-50/30 rounded-2xl border border-amber-100 space-y-3 animate-fade-in">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-xs font-bold text-amber-900">🩺 AI Veterinary Advisor Guidance</span>
              <button
                onClick={() => speakText(aiAnswer, true)}
                className="p-1 px-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg text-xs flex items-center gap-1"
                title="Listen to response text"
              >
                <Volume2 className="w-4 h-4" /> Speak Vet Guidance
              </button>
            </div>
            
            <div className="text-slate-700 text-xs leading-relaxed space-y-2 whitespace-pre-wrap font-sans">
              {aiAnswer}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
