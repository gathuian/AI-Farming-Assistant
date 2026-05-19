import React, { useState } from 'react';
import { Volume2, Calculator, Sprout, Footprints, Droplets, Percent, DollarSign, Sparkles } from 'lucide-react';

interface FarmCalculatorProps {
  speakText: (text: string, force?: boolean) => void;
}

export default function FarmCalculator({ speakText }: FarmCalculatorProps) {
  const [activeSubTab, setActiveSubTab] = useState<'seed' | 'feed' | 'fertilizer' | 'water'>('seed');

  // Load active currency symbol from localStorage if updated in ledger view
  const currencySymbol = localStorage.getItem('farming_currency_symbol') || '$';

  // State 1: Seed spacing inputs
  const [landArea, setLandArea] = useState<number>(1); // e.g., acres
  const [areaUnit, setAreaUnit] = useState<'acres' | 'hectares' | 'sq_meters'>('acres');
  const [selectedCrop, setSelectedCrop] = useState<'Maize' | 'Tomato' | 'Potato'>('Maize');
  const [rowSpacingCm, setRowSpacingCm] = useState<number>(75);
  const [plantSpacingCm, setPlantSpacingCm] = useState<number>(25);
  const [seedCostPerPkt, setSeedCostPerPkt] = useState<number>(12);

  // State 2: Livestock feeds inputs
  const [animalCount, setAnimalCount] = useState<number>(100);
  const [animalType, setAnimalType] = useState<'Layers' | 'Broilers' | 'DairyCows' | 'Pigs'>('Layers');
  const [feedDays, setFeedDays] = useState<number>(30);
  const [pricePerKgFeed, setPricePerKgFeed] = useState<number>(0.8);

  // State 3: Fertilizer inputs
  const [fertilizerBagsPerAcre, setFertilizerBagsPerAcre] = useState<number>(1); // DAP typical
  const [costPerFertilizerBag, setCostPerFertilizerBag] = useState<number>(45);

  // State 4: Water harvest inputs
  const [roofSqMeters, setRoofSqMeters] = useState<number>(80);
  const [annualRainfallMm, setAnnualRainfallMm] = useState<number>(900);
  const [harvestEfficiency, setHarvestEfficiency] = useState<number>(85); // 85% runoff coefficent

  // Pre-set standard crop recommendations
  const handleCropSelectChange = (crop: 'Maize' | 'Tomato' | 'Potato') => {
    setSelectedCrop(crop);
    if (crop === 'Maize') {
      setRowSpacingCm(75);
      setPlantSpacingCm(25);
      speakText("Preset row spacing to 75 centimeters and plant spacing to 25 centimeters for optimal maize yields.", true);
    } else if (crop === 'Tomato') {
      setRowSpacingCm(60);
      setPlantSpacingCm(45);
      speakText("Preset spacing to 60 by 45 centimeters for staked garden tomatoes.", true);
    } else if (crop === 'Potato') {
      setRowSpacingCm(75);
      setPlantSpacingCm(30);
      speakText("Preset spacing to 75 by 30 centimeters for potato mounding heaps.", true);
    }
  };

  // Calculations for Crop Seed Spacing
  const getAreaInSqMeters = () => {
    if (areaUnit === 'acres') return landArea * 4046.85;
    if (areaUnit === 'hectares') return landArea * 10000;
    return landArea; // sq meters
  };

  const calculateSeeds = () => {
    const areaSqM = getAreaInSqMeters();
    const rowSpacingM = rowSpacingCm / 100;
    const plantSpacingM = plantSpacingCm / 100;
    const areaPerSeedSqM = rowSpacingM * plantSpacingM;
    
    if (areaPerSeedSqM <= 0) return { totalSeeds: 0, pkts: 0, totalCost: 0 };
    
    const totalSeeds = Math.floor(areaSqM / areaPerSeedSqM);
    // Standard maize seed packet: approx 2,500 seeds. Tomato seed packet: 1,000 plants.
    const seedsPerPkt = selectedCrop === 'Maize' ? 2500 : selectedCrop === 'Tomato' ? 1000 : 800;
    const pkts = Math.ceil(totalSeeds / seedsPerPkt);
    const totalCost = pkts * seedCostPerPkt;

    return { totalSeeds, pkts, totalCost };
  };

  // Calculations for Animal Feed Budgeter
  const calculateFeed = () => {
    // Feed per animal per day in grams:
    // Layers: 120g, Broilers: 150g average, DairyCow: 15,000g, Pigs: 3000g
    let gPerDay = 120;
    if (animalType === 'Broilers') gPerDay = 150;
    else if (animalType === 'DairyCows') gPerDay = 15000;
    else if (animalType === 'Pigs') gPerDay = 3000;

    const totalGramsDaily = animalCount * gPerDay;
    const totalKgDaily = totalGramsDaily / 1000;
    const totalKgPeriod = totalKgDaily * feedDays;
    
    // Standard 50 kilogram bagcount
    const bags = Math.ceil(totalKgPeriod / 50);
    const cost = totalKgPeriod * pricePerKgFeed;

    return { totalKgPeriod, bags, cost };
  };

  // Calculations for Fertilizers
  const calculateFertilizers = () => {
    const acres = areaUnit === 'acres' ? landArea : areaUnit === 'hectares' ? landArea * 2.471 : landArea / 4046.85;
    const bagsRequired = Math.ceil(acres * fertilizerBagsPerAcre);
    const totalCost = bagsRequired * costPerFertilizerBag;

    return { acres, bagsRequired, totalCost };
  };

  // Calculations for Water Harvesting
  const calculateWaterHarvest = () => {
    // Water harvested (Liters) = Roof Area (sq.m) * Rainfall (mm) * Runoff Coefficient (0.85)
    const runoffCoef = harvestEfficiency / 100;
    const totalLiters = Math.floor(roofSqMeters * annualRainfallMm * runoffCoef);
    // Standard household water tank holds 10,000 liters
    const standardTanks = (totalLiters / 10000).toFixed(1);

    return { totalLiters, standardTanks };
  };

  const handleSpeakFeedBudget = () => {
    const fRes = calculateFeed();
    speakText(
      `Feed Budget. For ${animalCount} ${animalType} over ${feedDays} days, you will require a total of ${Math.round(fRes.totalKgPeriod)} kilograms of feed. This equals about ${fRes.bags} fifty-kilogram bags, costed at approximately ${Math.round(fRes.cost)} ${currencySymbol}.`,
      true
    );
  };

  return (
    <div className="space-y-8" id="farming-calculators-view">
      
      {/* Overview Card banner */}
      <div className="bg-white border text-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row gap-6 items-center">
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-full">
          <Calculator className="w-10 h-10" />
        </div>
        <div className="space-y-1 flex-1">
          <h3 className="text-xl font-bold font-sans">
            🧮 Interactive Homestead Farm Calculators & Budgets
          </h3>
          <p className="text-xs text-slate-500 font-sans leading-relaxed">
            Eliminate operational guesswork by counting seed density, pricing livestock rations, 
            and estimating rainfall water harvesting potential. Standardized 50-kilogram feed bags 
            and raw crop density benchmarks are preconfigured inside!
          </p>
        </div>
      </div>

      {/* Selector tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-2" id="calculator-tabs">
        <button
          onClick={() => {
            setActiveSubTab('seed');
            speakText("Loading Crop Seeding Spacing Calculator", true);
          }}
          className={`flex items-center gap-1.5 px-4 py-2 font-bold text-xs rounded-xl border transition ${
            activeSubTab === 'seed'
              ? 'bg-emerald-700 text-white border-emerald-700'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Sprout className="w-4 h-4" /> 🌽 Crop Seeding & Spacing
        </button>
        <button
          onClick={() => {
            setActiveSubTab('feed');
            speakText("Loading Livestock Feed Cost Budgeter", true);
          }}
          className={`flex items-center gap-1.5 px-4 py-2 font-bold text-xs rounded-xl border transition ${
            activeSubTab === 'feed'
              ? 'bg-emerald-700 text-white border-emerald-700'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Footprints className="w-4 h-4" /> 🐓 Livestock Feed Cost Budgeter
        </button>
        <button
          onClick={() => {
            setActiveSubTab('fertilizer');
            speakText("Loading Fertilizer Dose Guide", true);
          }}
          className={`flex items-center gap-1.5 px-4 py-2 font-bold text-xs rounded-xl border transition ${
            activeSubTab === 'fertilizer'
              ? 'bg-emerald-700 text-white border-emerald-700'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Percent className="w-4 h-4" /> 🧪 Fertilizer Bag Estimator
        </button>
        <button
          onClick={() => {
            setActiveSubTab('water');
            speakText("Loading Rainfall Water Harvesting Calculator", true);
          }}
          className={`flex items-center gap-1.5 px-4 py-2 font-bold text-xs rounded-xl border transition ${
            activeSubTab === 'water'
              ? 'bg-emerald-700 text-white border-emerald-700'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Droplets className="w-4 h-4" /> 💧 Rainfall Water Collector
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Parameter input Box */}
        <div className="lg:col-span-5 bg-white border rounded-2xl p-6 space-y-5 shadow-sm">
          <h4 className="font-extrabold text-slate-700 text-xs border-b pb-2 uppercase tracking-wider">
            🛠️ Adjustable Inputs
          </h4>

          {/* Seeding Inputs */}
          {activeSubTab === 'seed' && (
            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Land Size</span>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={landArea}
                    onChange={(e) => setLandArea(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border p-2 rounded-xl focus:ring-1 focus:ring-emerald-500 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Area Unit</span>
                  <select
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value as any)}
                    className="w-full bg-slate-50 border p-2 rounded-xl focus:outline-none"
                  >
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                    <option value="sq_meters">Square Meters</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Target Crop Type</span>
                <select
                  value={selectedCrop}
                  onChange={(e) => handleCropSelectChange(e.target.value as any)}
                  className="w-full bg-slate-50 border p-2 rounded-xl font-medium cursor-pointer"
                >
                  <option value="Maize">🌽 Highland Maize (Rotative)</option>
                  <option value="Tomato">🍅 Garden Tomato (Staked row)</option>
                  <option value="Potato">🥔 Irish Potato (Mounded rows)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Row Spacing (cm)</span>
                  <input
                    type="number"
                    value={rowSpacingCm}
                    onChange={(e) => setRowSpacingCm(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border p-2 rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Plant Spacing (cm)</span>
                  <input
                    type="number"
                    value={plantSpacingCm}
                    onChange={(e) => setPlantSpacingCm(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border p-2 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Packet Price ({currencySymbol})</span>
                <input
                  type="number"
                  value={seedCostPerPkt}
                  onChange={(e) => setSeedCostPerPkt(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border p-2 rounded-xl font-bold"
                />
              </div>
            </div>
          )}

          {/* Feed Inputs */}
          {activeSubTab === 'feed' && (
            <div className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Target Livestock</span>
                <select
                  value={animalType}
                  onChange={(e) => {
                    setAnimalType(e.target.value as any);
                    if (e.target.value === 'DairyCows') {
                      setPricePerKgFeed(0.5);
                    } else {
                      setPricePerKgFeed(0.8);
                    }
                    speakText(`Toggled feed budget target to ${e.target.value}`, true);
                  }}
                  className="w-full bg-slate-50 border p-2 rounded-xl cursor-pointer"
                >
                  <option value="Layers">🐓 Layer Chickens (Egg mash)</option>
                  <option value="Broilers">🍗 Broiler Chickens (High protein crumble)</option>
                  <option value="DairyCows">🐄 Dairy Holstein Cattle (Silage & Concentrates)</option>
                  <option value="Pigs">🐖 Pigs / Swine breeds (Sow finisher meal)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Animals Headcount</span>
                  <input
                    type="number"
                    value={animalCount}
                    onChange={(e) => setAnimalCount(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border p-2 rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Days to feed</span>
                  <input
                    type="number"
                    value={feedDays}
                    onChange={(e) => setFeedDays(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border p-2 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Feed cost per kg ({currencySymbol})</span>
                <input
                  type="number"
                  step="0.1"
                  value={pricePerKgFeed}
                  onChange={(e) => setPricePerKgFeed(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border p-2 rounded-xl font-bold"
                />
              </div>
            </div>
          )}

          {/* Fertilizers Inputs */}
          {activeSubTab === 'fertilizer' && (
            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Land Size</span>
                  <input
                    type="number"
                    value={landArea}
                    onChange={(e) => setLandArea(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border p-2 rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Area unit</span>
                  <select
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value as any)}
                    className="w-full bg-slate-50 border p-2 rounded-xl focus:outline-none"
                  >
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                    <option value="sq_meters">Square Meters</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Dose Target (Bags/Acre)</span>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={fertilizerBagsPerAcre}
                  onChange={(e) => setFertilizerBagsPerAcre(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border p-2 rounded-xl font-bold"
                />
                <span className="text-[9px] text-slate-400 block pt-0.5">Note: DAP is usually 1 bag/acre; CAN is 1 bag/acre.</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Fertilizer price per 50kg bag ({currencySymbol})</span>
                <input
                  type="number"
                  value={costPerFertilizerBag}
                  onChange={(e) => setCostPerFertilizerBag(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border p-2 rounded-xl font-bold"
                />
              </div>
            </div>
          )}

          {/* Water harvesting inputs */}
          {activeSubTab === 'water' && (
            <div className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Roof Area (Square Meters)</span>
                <input
                  type="number"
                  value={roofSqMeters}
                  onChange={(e) => setRoofSqMeters(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border p-2 rounded-xl font-bold"
                />
                <span className="text-[9px] text-slate-400 block">Total iron sheet surface drainage width.</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Expected Annual Rain (mm)</span>
                <input
                  type="number"
                  value={annualRainfallMm}
                  onChange={(e) => setAnnualRainfallMm(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border p-2 rounded-xl font-bold"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Catchment runoff efficiency (%)</span>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={harvestEfficiency}
                  onChange={(e) => setHarvestEfficiency(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border p-2 rounded-xl font-bold"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Render calculations results panel */}
        <div className="lg:col-span-12 xl:col-span-7">
          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
            
            <div className="flex justify-between items-center border-b pb-4">
              <div className="space-y-1">
                <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider font-mono">
                  Calculations Benchmark Result
                </span>
                <h4 className="text-lg font-black text-slate-900 font-sans">
                  {activeSubTab === 'seed' && '🌾 Yield & Plant Spacing Matrix'}
                  {activeSubTab === 'feed' && '🐓 Poultry & Dairy feed budgeting'}
                  {activeSubTab === 'fertilizer' && '🧪 Soil fertilizer volume results'}
                  {activeSubTab === 'water' && '💧 Water Harvest potential metrics'}
                </h4>
              </div>
              
              <button
                onClick={() => {
                  if (activeSubTab === 'seed') {
                    const c = calculateSeeds();
                    speakText(`Seeding Plan. Total Seedlings required for your ${landArea} ${areaUnit} of ${selectedCrop} is ${c.totalSeeds}. This translates to ${c.pkts} standardized packages, costing total ${c.totalCost} ${currencySymbol}.`, true);
                  } else if (activeSubTab === 'feed') {
                    handleSpeakFeedBudget();
                  } else if (activeSubTab === 'fertilizer') {
                    const fert = calculateFertilizers();
                    speakText(`Fertilizer output. Total bags needed is ${fert.bagsRequired}. Cost is ${fert.totalCost} ${currencySymbol}.`, true);
                  } else if (activeSubTab === 'water') {
                    const w = calculateWaterHarvest();
                    speakText(`Water collection projection: You can naturally store ${w.totalLiters} liters of pristine clean rainfall annually from your roof structure.`, true);
                  }
                }}
                className="px-3.5 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold text-xs rounded-xl flex items-center gap-1 shadow-2xs transition"
              >
                <Volume2 className="w-4 h-4" /> Listen Result
              </button>
            </div>

            {/* Calculations outputs layout */}

            {activeSubTab === 'seed' && (
              <div className="space-y-6">
                
                {/* Visual grid layout results */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex flex-col justify-center">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Total Seedlings Required</span>
                    <strong className="text-2xl font-black text-emerald-950 font-mono">
                      {calculateSeeds().totalSeeds.toLocaleString()}
                    </strong>
                    <span className="text-[9px] text-slate-500 pt-0.5">Sowing density</span>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex flex-col justify-center">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Suggested Packets (Standard)</span>
                    <strong className="text-2xl font-black text-emerald-950 font-mono">
                      {calculateSeeds().pkts}
                    </strong>
                    <span className="text-[9px] text-slate-500 pt-0.5">Approx bags or packets</span>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex flex-col justify-center">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Estimated Seed Cost</span>
                    <strong className="text-2xl font-black text-slate-900 font-mono">
                      {currencySymbol} {calculateSeeds().totalCost.toLocaleString()}
                    </strong>
                    <span className="text-[9px] text-slate-500 pt-0.5">Excludes transport</span>
                  </div>
                </div>

                {/* Advice block */}
                <div className="p-4.5 bg-slate-50 border rounded-xl space-y-2">
                  <span className="text-xs font-black text-slate-800 uppercase block tracking-wide">💡 Agronomist Spacing Advice note</span>
                  <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                    By spacing {selectedCrop} sprouts at target row intervals of <strong>{rowSpacingCm}cm</strong> and plant frequencies of <strong>{plantSpacingCm}cm</strong>, you avoid branch tangling, maximize sunlight access to leaves, and retain rich damp compost mulch soil longer. Always sow 2 seeds per hole as safety backup, then thin out the weaker weed shoot 2 weeks after sprouting.
                  </p>
                </div>

              </div>
            )}


            {activeSubTab === 'feed' && (
              <div className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex flex-col justify-center">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Total Feed Weight Daily</span>
                    <strong className="text-2xl font-black text-indigo-950 font-mono">
                      {Math.round((calculateFeed().totalKgPeriod / feedDays) * 10) / 10} kg
                    </strong>
                    <span className="text-[9px] text-slate-500 pt-0.5">To distribute daily</span>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex flex-col justify-center">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Standard 50kg bags needed</span>
                    <strong className="text-2xl font-black text-indigo-950 font-mono">
                      {calculateFeed().bags} bags
                    </strong>
                    <span className="text-[9px] text-slate-500 pt-0.5">Over {feedDays} days</span>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex flex-col justify-center">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Estimated cost budget</span>
                    <strong className="text-2xl font-black text-slate-900 font-mono">
                      {currencySymbol} {Math.round(calculateFeed().cost).toLocaleString()}
                    </strong>
                    <span className="text-[9px] text-slate-500 pt-0.5">At prevailing markets</span>
                  </div>
                </div>

                <div className="p-4.5 bg-slate-50 border rounded-xl space-y-2">
                  <span className="text-xs font-black text-slate-800 uppercase block">💡 Poultry & Pigs Feed Guard rules</span>
                  <p className="text-[11px] text-slate-650 font-sans leading-relaxed">
                    For <strong>{animalType}</strong>, poultry diets require strict protein metrics to sustain daily egg lays or weight scales. Clean your feeders every evening; damp feeds left overnight foster poisonous black mold that causes sudden chicken respiratory drops.
                  </p>
                </div>

              </div>
            )}


            {activeSubTab === 'fertilizer' && (
              <div className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex flex-col justify-center animate-fadeIn">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Aggregated land width</span>
                    <strong className="text-2xl font-black text-red-950 font-mono">
                      {Math.round(calculateFertilizers().acres * 100) / 100} Acres
                    </strong>
                    <span className="text-[9px] text-slate-500 pt-0.5">Standard reference unit</span>
                  </div>

                  <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex flex-col justify-center animate-fadeIn">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Bags required (50kg standard)</span>
                    <strong className="text-2xl font-black text-red-950 font-mono">
                      {calculateFertilizers().bagsRequired} Bags
                    </strong>
                    <span className="text-[9px] text-slate-500 pt-0.5">At {fertilizerBagsPerAcre} bag/acre rate</span>
                  </div>

                  <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex flex-col justify-center animate-fadeIn">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Total Soil Food Investment</span>
                    <strong className="text-2xl font-black text-slate-900 font-mono">
                      {currencySymbol} {calculateFertilizers().totalCost.toLocaleString()}
                    </strong>
                    <span className="text-[9px] text-slate-500 pt-0.5">Chemical/Compost Cost</span>
                  </div>
                </div>

                <div className="p-4.5 bg-slate-50 border rounded-xl space-y-2">
                  <span className="text-xs font-black text-slate-800 uppercase block">💡 Organic Fertilizer Enrichment Strategy</span>
                  <p className="text-[11px] text-slate-650 font-sans leading-relaxed">
                    Apply planting phosphorus chemical DAP inside individual root holes instead of broadcast surface tossing, which invites greedy wild weeds. Mix with two large handfuls of dry rotted chicken manure compost to inject active probiotic soil bacteria.
                  </p>
                </div>

              </div>
            )}


            {activeSubTab === 'water' && (
              <div className="space-y-6 animate-fadeIn">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 flex flex-col justify-center">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Estimate Rain Harvest Capacity</span>
                    <strong className="text-2xl font-black text-sky-950 font-mono">
                      {calculateWaterHarvest().totalLiters.toLocaleString()} Liters
                    </strong>
                    <span className="text-[9px] text-slate-500 pt-0.5">Total natural rainwater volume annually</span>
                  </div>

                  <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 flex flex-col justify-center">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Typical 10,000L Storage Tanks Filled</span>
                    <strong className="text-2xl font-black text-sky-950 font-mono">
                      {calculateWaterHarvest().standardTanks} Tanks
                    </strong>
                    <span className="text-[9px] text-slate-500 pt-0.5">Required capacity potential</span>
                  </div>
                </div>

                <div className="p-4.5 bg-slate-50 border rounded-xl space-y-2">
                  <span className="text-xs font-black text-slate-850 uppercase block">💡 homestead Rain Water Preservation tips</span>
                  <p className="text-[11px] text-slate-650 font-sans leading-relaxed">
                    Rain runoff from iron sheet structures is highly sterile but gathers bird stool, leaf dust and roof lichen during early rain minutes. Implement a simple <strong>First Flush Diverter</strong> (a small pipe that dumps the absolute first 15 Liters) to direct only perfectly clear, non-infectious water into your main fish ponds and vegetable beds.
                  </p>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
