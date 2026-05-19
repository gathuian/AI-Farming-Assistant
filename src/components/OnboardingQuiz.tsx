import React, { useState } from 'react';
import { FarmProfile, AIResponse } from '../types';
import { Volume2, Loader2, Sparkles, Sprout, Tractor, Compass, Globe, CircleDollarSign, CloudSun } from 'lucide-react';

interface OnboardingQuizProps {
  onPlanGenerated: (plan: AIResponse, profile: FarmProfile) => void;
  speakText: (text: string, force?: boolean) => void;
  savedPlan: AIResponse | null;
  savedProfile: FarmProfile | null;
}

export default function OnboardingQuiz({ onPlanGenerated, speakText, savedPlan, savedProfile }: OnboardingQuizProps) {
  const [profile, setProfile] = useState<FarmProfile>(savedProfile || {
    ventureType: 'plants',
    landSize: '1 Acre',
    goals: 'Tomatoes & Cabbage',
    budget: 500,
    hasEquipment: false,
    knowledgeLevel: 'none',
    location: 'Highland Valleys',
    climate: 'Warm and Sunny'
  });

  const [loading, setLoading] = useState(false);
  const [errorStr, setErrorStr] = useState<string | null>(null);
  const [activePlan, setActivePlan] = useState<AIResponse | null>(savedPlan);

  // Tools specific search and specify states
  const [toolText, setToolText] = useState<string>('');
  const [specifiedTools, setSpecifiedTools] = useState<string[]>(['Shovel', 'Watering Can']);

  const ALL_TOOL_SUGGESTIONS = [
    "Shovel (Hand Digger)",
    "Spade (Flat Edge Shovel)",
    "Wheelbarrow (Hauler)",
    "Watering Can (Sprinkler)",
    "Knapsack Sprayer (Pest Pump)",
    "Solar Garden Water Pump",
    "Hand Weed Hoe",
    "Drip Irrigation Pipe Roll",
    "Pruning Scissors / Shears",
    "Compost Bin & Aerator",
    "Incubator (Egg Warm Hatchery)",
    "Milking Container (Stainless steel)",
    "Litmus pH Earth Tester",
    "Fencing Chainlink Rolls",
    "Seedling Sprout Trays",
    "Cow Feeding Troughs",
    "Chicken Brooding Hot Bulbs"
  ];

  const handleAddTool = (tool: string) => {
    if (!tool.trim()) return;
    if (!specifiedTools.includes(tool.trim())) {
      const updated = [...specifiedTools, tool.trim()];
      setSpecifiedTools(updated);
      speakText(`Added tool: ${tool}`, true);
    }
    setToolText('');
  };

  const handleRemoveTool = (tool: string) => {
    const updated = specifiedTools.filter(t => t !== tool);
    setSpecifiedTools(updated);
    speakText(`Removed tool: ${tool}`, true);
  };


  const startVoiceFormGuide = () => {
    speakText(
      "Let's prepare your farming plan. Answer five simple questions: Select Crops or Livestock, type your goals, choose your land size from the list, type your total wallet budget, tick if you have tools, and write your city or climate.",
      true
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorStr(null);
    speakText("Submitting your profile to the AI farm consultant. Please wait while I analyze your soil and capital!");

    try {
      const resp = await fetch('/api/gemini/farming-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile })
      });

      if (!resp.ok) {
        throw new Error('Could not contact the farming AI. Please check your network connection.');
      }

      const data: AIResponse = await resp.json();
      setActivePlan(data);
      onPlanGenerated(data, profile);
      speakText(`Plan created successfully! It is called: ${data.guide.title}. Tap any section's speaker icon to hear the step-by-step instructions.`);
    } catch (e: any) {
      console.error(e);
      setErrorStr(e.message || 'Farming AI is busy. Please try again in 1 minute.');
      speakText("Error generating farming plan. Please check your values and retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8" id="onboarding-quiz-container">
      {/* Introduction Card */}
      <div className="bg-white border md:border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row gap-6 items-center">
        <div className="p-4 bg-emerald-100 rounded-full text-emerald-800">
          <Sparkles className="w-12 h-12" />
        </div>
        <div className="space-y-3 flex-1">
          <h3 className="text-xl sm:text-2xl font-bold font-sans text-slate-800">
            📊 Interactive Farm Plan Generator
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Fill in your farm's metrics to receive a fully customized planting schedule, financial division guide, 
            local animal vaccine timelines, and cottage industry ideas.
          </p>
          <div className="flex gap-2">
            <button
              id="btn-voice-quiz"
              onClick={startVoiceFormGuide}
              className="px-3.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-lg text-xs flex items-center gap-1.5 transition"
            >
              <Volume2 className="w-4 h-4" /> Listen to Fields Guide
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white border border-slate-200/70 p-6 rounded-2xl shadow-sm space-y-6">
          <h4 className="font-bold text-slate-800 text-lg border-b pb-3 flex items-center gap-2">
            📝 Farm Questionnaire
          </h4>

          <form onSubmit={handleSubmit} className="space-y-5" id="farm-setup-form">
            
            {/* 1. Venture Type */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. What do you want to farm?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['plants', 'animals', 'both'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setProfile({ ...profile, ventureType: type })}
                    className={`py-3 px-2 rounded-xl text-center text-xs font-bold border transition flex flex-col items-center gap-1.5 ${
                      profile.ventureType === type
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {type === 'plants' && <Sprout className="w-5 h-5" />}
                    {type === 'animals' && <Tractor className="w-5 h-5 text-amber-600 group-hover:text-white" />}
                    {type === 'both' && <Compass className="w-5 h-5 text-indigo-600" />}
                    <span className="capitalize">{type === 'both' ? 'Both' : type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Specific goals */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. What target crops or animals (be specific)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tomatoes and Dairy Cows"
                value={profile.goals}
                onChange={(e) => setProfile({ ...profile, goals: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[10px] text-slate-400">Specify exactly which breeds, veggies or fruits you want.</p>
            </div>

            {/* 3. Land Size */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-705 uppercase tracking-wider">
                3. Total Land Area
              </label>
              <select
                value={profile.landSize}
                onChange={(e) => setProfile({ ...profile, landSize: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Mini yard - small patch">Backyard patch / Raised seedbeds</option>
                <option value="0.5 Acres">Half (0.5) acre chunk</option>
                <option value="1 Acre">1 Full Acre</option>
                <option value="2 to 5 Acres">2 to 5 Acres (Medium Farm)</option>
                <option value="More than 5 Acres">Large scale (Above 5 Acres)</option>
              </select>
            </div>

            {/* 4. Capital Budget */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  4. Capital Budget ($ / Shillings)
                </label>
                <span className="text-sm font-extrabold text-emerald-700 font-mono">${profile.budget}</span>
              </div>
              <input
                type="range"
                min="50"
                max="10000"
                step="50"
                value={profile.budget}
                onChange={(e) => setProfile({ ...profile, budget: Number(e.target.value) })}
                className="w-full accent-emerald-600 cursor-ew-resize"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>$50 (Small seed capital)</span>
                <span>$10,000 (Commercial starter)</span>
              </div>
            </div>

            {/* 5. Tool Checkbox & Specify */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="has-equipment"
                  checked={profile.hasEquipment}
                  onChange={(e) => setProfile({ ...profile, hasEquipment: e.target.checked })}
                  className="w-4.5 h-4.5 accent-emerald-600 rounded cursor-pointer"
                />
                <label htmlFor="has-equipment" className="text-xs font-semibold text-slate-705 cursor-pointer select-none">
                  ⚙️ I already have tools or equipment
                </label>
              </div>

              {profile.hasEquipment && (
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Specify tools you possess:</span>
                  
                  {/* Specified tags display */}
                  {specifiedTools.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {specifiedTools.map(tl => (
                        <span key={tl} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[9px] font-extrabold uppercase tracking-wide">
                          {tl}
                          <button
                            type="button"
                            onClick={() => handleRemoveTool(tl)}
                            className="hover:text-red-650 cursor-pointer font-black text-[10px] ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Input and specify button */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type tool name (e.g. Solar pump)..."
                      value={toolText}
                      onChange={(e) => setToolText(e.target.value)}
                      className="flex-1 bg-white border px-2.5 py-1.5 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTool(toolText)}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg uppercase cursor-pointer transition shadow-2xs"
                    >
                      ➕ Specify Tool
                    </button>
                  </div>

                  {/* Typing suggestions container */}
                  {toolText.trim().length > 0 && (
                    <div className="bg-white border rounded-lg p-2 max-h-28 overflow-y-auto space-y-1 shadow-xs">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block pb-1 border-b">Did you mean:</span>
                      {ALL_TOOL_SUGGESTIONS.filter(ts => ts.toLowerCase().includes(toolText.toLowerCase())).map(ts => (
                        <button
                          key={ts}
                          type="button"
                          onClick={() => handleAddTool(ts.split(' (')[0])}
                          className="w-full text-left py-1 px-1.5 hover:bg-slate-50 text-[10px] rounded text-slate-650 flex justify-between items-center transition"
                        >
                          <span>💡 {ts}</span>
                          <span className="text-[8px] bg-slate-100 px-1 py-0.2 rounded text-slate-400">add</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 6. Knowledge level */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                5. Your Farming Experience
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['none', 'beginner', 'expert'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setProfile({ ...profile, knowledgeLevel: lvl })}
                    className={`py-2 px-1 text-[11px] font-bold rounded-lg border text-center whitespace-nowrap ${
                      profile.knowledgeLevel === lvl
                        ? 'bg-emerald-150 text-emerald-800 border-emerald-400'
                        : 'bg-white border-slate-200 text-slate-650'
                    }`}
                  >
                    {lvl === 'none' ? 'Absolute Novice' : lvl === 'beginner' ? 'Basic Knowledge' : 'Experienced'}
                  </button>
                ))}
              </div>
            </div>

            {/* 7. Location and Climate */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-650 uppercase">Town/Region</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meru, Kenya"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-650 uppercase">Local Climate</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cool Highland Wet"
                  value={profile.climate}
                  onChange={(e) => setProfile({ ...profile, climate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs focus:outline-none"
                />
              </div>
            </div>

            <button
              id="submit-quiz-button"
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-750 text-white font-bold rounded-xl shadow-md transition hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>AI is Preparing Seeds Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                  <span>Generate AI Farming Plan</span>
                </>
              )}
            </button>
          </form>

          {errorStr && (
            <div className="bg-red-50 text-red-800 border border-red-200 p-3 rounded-xl text-xs font-sans">
              ⚠️ {errorStr}
            </div>
          )}
        </div>

        {/* Plan Output Bento Column */}
        <div className="lg:col-span-7 space-y-6">
          {activePlan ? (
            <div className="space-y-6" id="plan-bento-grid">
              
              {/* Header Title Bento element */}
              <div className="bg-emerald-900 text-white p-6 sm:p-8 rounded-2xl shadow-sm space-y-3 relative overflow-hidden border border-emerald-800">
                <div className="relative z-10 space-y-2">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-700/60 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    🏆 Your Custom AI Blueprint
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-sans tracking-tight flex items-center gap-2">
                    {activePlan.guide.title}
                  </h3>
                  <p className="text-emerald-100 text-xs leading-relaxed">
                    {activePlan.guide.introduction}
                  </p>
                  <button
                    onClick={() => speakText(`${activePlan.guide.introduction}`, true)}
                    className="inline-flex items-center gap-1 bg-yellow-400 hover:bg-yellow-300 text-slate-900 px-3 py-1 rounded-lg text-xs font-extrabold shadow"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Listen Introduction
                  </button>
                </div>
              </div>

              {/* Bento Grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Steps Item */}
                <div className="bg-white border p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div className="space-y-3">
                    <h5 className="font-bold text-slate-800 text-sm flex items-center gap-1">
                      📅 Step-by-Step Planting Calendar
                    </h5>
                    <ul className="space-y-2 text-xs text-slate-600 font-sans">
                      {activePlan.guide.stepByStepProcess.map((st, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => speakText(`Your schedule steps: ${activePlan.guide.stepByStepProcess.join('. ')}`, true)}
                    className="mt-4 text-[10px] font-bold text-slate-500 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Speak Calendar Steps
                  </button>
                </div>

                {/* Disease Shield Item */}
                <div className="bg-red-50/40 border border-red-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div className="space-y-3">
                    <h5 className="font-bold text-red-900 text-sm flex items-center gap-1">
                      🛡️ Diseases & Protection Measures
                    </h5>
                    <div className="space-y-3">
                      {activePlan.guide.diseasesAndPrevention.map((dis, idx) => (
                        <div key={idx} className="bg-white/80 p-2.5 rounded-xl border border-red-50 text-[11px] font-sans">
                          <strong className="block text-red-900 font-bold mb-0.5">{dis.name}</strong>
                          <p className="text-slate-500"><strong className="text-slate-700 font-medium">Signs:</strong> {dis.symptoms}</p>
                          <p className="text-slate-600 mt-1"><strong className="text-emerald-800 font-semibold">Treat/Prevent:</strong> {dis.prevention}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => speakText(`Learn to protect your farm from: ${activePlan.guide.diseasesAndPrevention.map(d => `${d.name}. Symptoms are ${d.symptoms}. Prevent by ${d.prevention}`).join('. ')}`, true)}
                    className="mt-4 text-[10px] font-bold text-red-800 hover:text-red-950 flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Read Disease Shield
                  </button>
                </div>

                {/* Harvesting/Storing and Marketing Item */}
                <div className="bg-slate-50 border p-5 rounded-2xl shadow-sm flex flex-col justify-between md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">🌾 Harvesting & Dry Storing</h5>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans">{activePlan.guide.harvestingAndStoring}</p>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-sans">📈 Intelligent Marketing</h5>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans">{activePlan.guide.marketingAdvice}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => speakText(`Harvesting advice: ${activePlan.guide.harvestingAndStoring}. Market advice: ${activePlan.guide.marketingAdvice}`, true)}
                    className="mt-4 self-start text-[10px] font-bold text-slate-500 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Speak Harvest & Sales
                  </button>
                </div>

                {/* Value-Addition Business Plan bento item */}
                <div className="bg-amber-50/40 border border-amber-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between md:col-span-2">
                  <div className="space-y-3">
                    <h5 className="font-bold text-amber-900 text-sm flex items-center gap-1">
                      🍯 Agribusiness Cottage Value-Addition Planner
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {activePlan.guide.valueAdditionAgribusiness}
                    </p>
                    {activePlan.guide.vulnerabilitiesAndTrends && (
                      <p className="text-[11px] text-slate-500 font-mono bg-white p-2.5 rounded-xl border">
                        <strong>Trends & Risks:</strong> {activePlan.guide.vulnerabilitiesAndTrends}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => speakText(`Smart business value addition instructions: ${activePlan.guide.valueAdditionAgribusiness}`, true)}
                    className="mt-4 self-start text-[10px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Speak Value-Addition Tips
                  </button>
                </div>

                {/* Quick Budget Cost Breakdown table */}
                {activePlan.businessPlan && (
                  <div className="bg-white border p-5 rounded-2xl shadow-sm md:col-span-2 space-y-3">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 border-b pb-2">
                      💰 Capital Division Blueprint (${profile.budget} Total)
                    </h4>
                    <p className="text-xs text-slate-500 font-sans">
                      {activePlan.businessPlan.overview}
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-550">
                        <thead className="bg-slate-50 text-slate-700">
                          <tr>
                            <th className="p-2 font-bold font-sans">Infrastructure Section</th>
                            <th className="p-2 font-bold font-sans text-right">Cost Estimate</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {activePlan.businessPlan.costEstimates.map((cost, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/40">
                              <td className="p-2 font-medium">{cost.item}</td>
                              <td className="p-2 text-right font-mono font-bold text-emerald-800">${cost.cost}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-2.5 bg-indigo-50/55 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 font-sans">
                      <strong>Sales Pitch:</strong> {activePlan.businessPlan.marketingStrategy}
                    </div>
                  </div>
                )}

              </div>

            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 p-12 rounded-2xl text-center space-y-4 flex flex-col items-center justify-center h-full min-h-[350px]">
              <Tractor className="w-16 h-16 text-slate-350 stroke-1 stroke-slate-300" />
              <div>
                <h5 className="font-bold text-slate-700 font-sans">No Farm Plan Generated Yet</h5>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 font-sans">
                  Complete the questionnaire on the left. The AI Farming Specialist will split your budget and plan your crops immediately!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
