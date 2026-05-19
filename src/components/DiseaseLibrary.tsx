import React, { useState, useEffect } from 'react';
import { Volume2, Search, Camera, UploadCloud, AlertTriangle, CheckCircle, ShieldAlert, Sparkles, Filter, Leaf, Trash2 } from 'lucide-react';

interface Disease {
  id: string;
  name: string;
  type: 'plants' | 'animals' | 'fish' | 'other';
  affected: string; // e.g. "Tomatoes", "Dairy Cows"
  symptoms: string[];
  organicPrevention: string;
  chemicalRemedy: string;
  imageUrl: string;
  audioGuide: string;
}

interface UserReportedDisease {
  id: string;
  date: string;
  affected: string;
  symptoms: string;
  suspected: string;
  photoUrl: string;
  aiDiagnosis?: string;
}

interface DiseaseLibraryProps {
  speakText: (text: string, force?: boolean) => void;
}

export default function DiseaseLibrary({ speakText }: DiseaseLibraryProps) {
  const [activeType, setActiveType] = useState<'all' | 'plants' | 'animals' | 'fish'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);

  // Upload fields
  const [affectedInput, setAffectedInput] = useState('');
  const [symptomsInput, setSymptomsInput] = useState('');
  const [suspectedInput, setSuspectedInput] = useState('');
  const [uploadedPhoto, setUploadedPhoto] = useState<string>('');
  const [reports, setReports] = useState<UserReportedDisease[]>([]);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState('');

  // Preset disease database
  const presetDiseases: Disease[] = [
    {
      id: "dis_1",
      name: "🍅 Tomato Late Blight (Fungal)",
      type: "plants",
      affected: "Tomato and Potato plants",
      symptoms: [
        "Dark water-soaked bruises on mature green leaves.",
        "White velvety fungal spores on leaf undersides in wet mornings.",
        "Stems turning blackish-brown and decaying rapidly.",
        "Large dark leathery spots on green or ripening tomatoes."
      ],
      organicPrevention: "Space tomato stalks at least 60cm wide for optimal airflow. Water ground roots directly using drip irrigation; never spray green leaves with water. Spray leaves with natural copper fungicide or a diluted baking-soda-soap water tonic weekly under heavy clouds.",
      chemicalRemedy: "Apply metalaxyl or mancozeb active ingredient sprays early when morning rains start.",
      imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=500&auto=format&fit=crop",
      audioGuide: "Tomato Late Blight. Affected: tomatoes and potatoes. Symptoms include dark water-soaked spots on leaves and velvety spores under wet leaves. Prevent by spacing plants wide, avoid overhead watering, and spray copper fungicide."
    },
    {
      id: "dis_2",
      name: "🌽 Maize Head Smut (Fungal)",
      type: "plants",
      affected: "Maize / Corn crops",
      symptoms: [
        "Infected tassels and ears of corn convert into black powdered spore balls.",
        "Deformed, swollen plant shoots with charcoal-like residue inside."
      ],
      organicPrevention: "Practice strict 3-year crop rotation (e.g., plants beans or sunflowers next season instead of corn). Deeply bury infected residues inside hot compost beds, or burn smut-clogged corn completely. Do not feed smutted corn stalks to milking dairy cows as it alters milk flavor.",
      chemicalRemedy: "Treat seeds with tebuconazole or carboxin fungicide powders before sowing into soils.",
      imageUrl: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=500&auto=format&fit=crop",
      audioGuide: "Maize Head Smut is a fungal infection where corn ears grow thick black powdered charcoal balls. Avoid by rotating crops with beans yearly, and burying spoiled plants deeply."
    },
    {
      id: "dis_3",
      name: "🥔 Potato Bacterial Wilt",
      type: "plants",
      affected: "Irish potatoes and eggplants",
      symptoms: [
        "Rapid wilting of leaves during hot afternoons, recovering temporarily at night.",
        "Stems showing dark brown internal veins when sliced open.",
        "White milky bacterial slime oozing out from potato eyes when squeezed."
      ],
      organicPrevention: "Buy certified pathogen-free clean seed potato tubers from official agricultural nurseries. Avoid growing potatoes or tomatoes in the same soil for at least 4 seasons. Dig ditches to stop water flowing from suspicious wilted potato fields into your healthy land.",
      chemicalRemedy: "No effective chemical sprays exist for bacterial wilt. Disinfect metal farming tools with sanitizer or bleach immediately.",
      imageUrl: "https://images.unsplash.com/photo-1518977676651-b53f82aba655?w=500&auto=format&fit=crop",
      audioGuide: "Potato Bacterial Wilt causes leaves to wilt during sunny hours and stems to secrete milky slime. There is no cure, so buy clean seed potatoes and isolate water flow ditches."
    },
    {
      id: "dis_4",
      name: "🐄 Mastitis (Bacterial Cow Disease)",
      type: "animals",
      affected: "Milking dairy cattle",
      symptoms: [
        "The cow's udder swells, feeling hot and painful to the touch.",
        "Milk becomes watery, containing thick white clots, blood, or thin yellow pus.",
        "Cow kicks her belly or refuses to let children milk her due to severe nipple pain."
      ],
      organicPrevention: "Wash udder nipples with warm botanical rosemary water before milking. Test milk drops daily using a black plastic strip cup to check for thick clots. Always dip each teat inside deep blue iodine antiseptic immediately after milking to shut the open milk ducts from soil bacilli.",
      chemicalRemedy: "Inject intramammary penicillin or cephalosporin antibiotic pastes into the infected nipple canal using sterile plastic tubes.",
      imageUrl: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=500&auto=format&fit=crop",
      audioGuide: "UD-D-ER Mastitis causes painful swelling of cow udders and lumpy clotted blood milk. Prevent by washing with rosemary water, using strip cups, and dipping teats in blue iodine after milking."
    },
    {
      id: "dis_5",
      name: "🐔 Gumboro / Infectious Bursal Disease (Viral)",
      type: "animals",
      affected: "Young chickens and layers",
      symptoms: [
        "Young chicks become sleepy, sit huddled together, and shiver with ruffled feathers.",
        "Chicks peck their own anus vents continuously.",
        "Watery, chalky white diarrhea coating the underfeathers."
      ],
      organicPrevention: "Feed chicks warm crushed garlic ginger honey syrup to boost early viral resistance. Maintain absolute dry sawdust litter bed depths of 10cm—damp manure speeds up Gumboro viral cells incubation. Restrict visiting farmers from entering your poultry houses without boot sanitizers.",
      chemicalRemedy: "No treatment for virus. Vaccinate all chicks on Day 14 and Day 21 of life using Gumboro vaccine drops added into clean non-chlorinated sweet water.",
      imageUrl: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500&auto=format&fit=crop",
      audioGuide: "Gumboro poultry virus makes chicks shiver, huddle, and suffer white watery droppings. There is no instant medicine, so vaccinate birds on day 14 and 21 using water drops."
    },
    {
      id: "dis_6",
      name: "🐟 Tilapia Saprolegniasis (Fungal Fish Growth)",
      type: "fish",
      affected: "Pond Tilapia and Catfish",
      symptoms: [
        "White or grey cotton-like turf clumps growing on fish skin, fins, or gills.",
        "Fish rubbing themselves violently against pond wooden posts or concrete stones.",
        "Sluggish swimming near the water surface, gasping for air."
      ],
      organicPrevention: "Clear floating pond algae residues. Avoid crowding too many fingerlings—maintain max 5 fish per square meter of water. Add water lilies to naturally filter sun rays. Harvest or transfer fish only using super soft, wet cotton hand nets to protect their delicate protective slime layer from scaling.",
      chemicalRemedy: "Bath affected breeding fish inside a separate container with clean water containing 3 grams of coarse agricultural iodized salt per Liter for 15 minutes.",
      imageUrl: "https://images.unsplash.com/photo-1522069213448-443a614da9b6?w=500&auto=format&fit=crop",
      audioGuide: "Fish Saprolegniasis is a fungal growth forming white cotton patches on tilapia. Prevent by keeping pond crowds under 5 fish per meter, and bathe sick fish in warm salt water."
    }
  ];

  // Load user reported outbreaks from local storage
  useEffect(() => {
    const saved = localStorage.getItem('farming_disease_reports');
    if (saved) {
      setReports(JSON.parse(saved));
    } else {
      const presets: UserReportedDisease[] = [
        {
          id: "rep_1",
          date: "2026-05-18",
          affected: "Maize Field C-2",
          symptoms: "Leaves turned dark yellow in a stripe layout, edges dried and broke with heavy wind.",
          suspected: "Maize Streak Virus",
          photoUrl: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=200&auto=format&fit=crop",
          aiDiagnosis: "Based on yellowish stripes and drying edges, this is likely Maize Streak Virus, spread by tiny leafhopper bugs. Solution: Weed borders to eliminate host wild grasses, and spray organic garlic soapy oil spray down the plant cones."
        }
      ];
      setReports(presets);
      localStorage.setItem('farming_disease_reports', JSON.stringify(presets));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPhoto(reader.result as string);
        speakText("Photo attached successfully. Click Diagnose Outbreak to proceed.", true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!affectedInput.trim() || !symptomsInput.trim()) return;

    setIsDiagnosing(true);
    setDiagnosisResult('');
    speakText("Starting plant disease scanning. Matching symptoms inside the farming dataset.", true);

    setTimeout(() => {
      // simulated clever diagnostic matching
      const input = (affectedInput + " " + symptomsInput + " " + suspectedInput).toLowerCase();
      let match = "Undetermined infection. We recommend deep isolation first. Standard advice: Remove infected leaves, wash your hands, and consult your closest district extension helper.";
      
      if (input.includes('tomato') || input.includes('blight') || input.includes('spot')) {
        match = "⚠️ HIGH MATCH: Tomato Late Blight (Fungal disease). Symptoms are black rot on leaf stalks. Action: Strip lower leaves, completely avoid splashing overhead water, and spray copper fungicide quickly.";
      } else if (input.includes('maize') || input.includes('corn') || input.includes('smut') || input.includes('black')) {
        match = "⚠️ HIGH MATCH: Maize Head Smut (Fungal spore balls). Action: Do NOT compost. Burn or bury infected tassels 1 meter underground. Rotate with sweet beans next rainy cycle.";
      } else if (input.includes('cow') || input.includes('milk') || input.includes('udder') || input.includes('clot')) {
        match = "⚠️ HIGH MATCH: Cow Mastitis (Bacterial infection of nipples). Action: Cease manual machine milking of this cow, wash teats in warm rosemary extract, and apply penicillin intramammary ointment.";
      } else if (input.includes('chicken') || input.includes('chick') || input.includes('shiver') || input.includes('diarrhea')) {
        match = "⚠️ HIGH MATCH: Gumboro / Infectious Bursal Chick Virus. Action: Add garlic-ginger syrup to water bowls immediately to trigger cellular energy. Vaccinate future birds on day 14.";
      } else if (input.includes('fish') || input.includes('tilapia') || input.includes('cotton') || input.includes('fungus')) {
        match = "⚠️ HIGH MATCH: Saprolegniasis Fish Fungus. Action: Reduce stock water numbers. Bathe infected fingerlings in standard salt water bath (3 grams/liter) for 15 minutes.";
      }

      setDiagnosisResult(match);
      setIsDiagnosing(false);
      speakText("Diagnosis matching complete: " + match.replace(/⚠️/g, 'Warning.'), true);

      // Save to report feed list
      const newReport: UserReportedDisease = {
        id: "rep_" + Date.now(),
        date: new Date().toISOString().split('T')[0],
        affected: affectedInput,
        symptoms: symptomsInput,
        suspected: suspectedInput || 'Suspected Disease',
        photoUrl: uploadedPhoto || "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=200&auto=format&fit=crop",
        aiDiagnosis: match
      };

      const next = [newReport, ...reports];
      setReports(next);
      localStorage.setItem('farming_disease_reports', JSON.stringify(next));

      // Reset fields
      setAffectedInput('');
      setSymptomsInput('');
      setSuspectedInput('');
      setUploadedPhoto('');
    }, 2800);
  };

  const deleteReport = (id: string) => {
    const next = reports.filter(r => r.id !== id);
    setReports(next);
    localStorage.setItem('farming_disease_reports', JSON.stringify(next));
    speakText("Reported case deleted.", true);
  };

  const filteredPreset = presetDiseases.filter(d => {
    const matchesFilter = activeType === 'all' || d.type === activeType;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.affected.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.organicPrevention.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8" id="disease-library-view">
      {/* Intro section */}
      <div className="bg-white border text-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center">
        <div className="p-4 bg-red-50 text-red-700 rounded-full animate-pulse">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="space-y-1 flex-1">
          <h3 className="text-xl font-bold font-sans">
            🏥 Crop, Animal & Fish Disease Diagnostics
          </h3>
          <p className="text-xs text-slate-500 font-sans leading-relaxed">
            Diagnose backyard farming infections using symptoms, images, and organic prevention protocols. 
            Upload a photo of your diseased leaf, udder, or fish fin below to get immediate organic 
            curation suggestions!
          </p>
        </div>
      </div>

      {/* Main Grid: Left Catalog, Right Analyzer upload */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Disease Lookup Catalog */}
        <div className="lg:col-span-7 bg-white border rounded-2xl p-5 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3.5">
            <h4 className="font-bold text-xs uppercase tracking-wide text-slate-700 flex items-center gap-1.5">
              📋 Diagnostic Catalog ({filteredPreset.length})
            </h4>
            
            {/* Type selector filters */}
            <div className="flex flex-wrap gap-1">
              {(['all', 'plants', 'animals', 'fish'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => {
                    setActiveType(t);
                    speakText(`Filtering catalog to ${t} diseases.`, true);
                  }}
                  className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-md transition ${
                    activeType === t 
                      ? 'bg-red-700 text-white' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-650'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search plant, livestock, fish disease symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-xs border pl-9 pr-4 py-1.5 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          {/* Disease List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPreset.map(dis => (
              <div 
                key={dis.id} 
                className="bg-slate-50/50 hover:bg-slate-50 border rounded-xl overflow-hidden shadow-2xs hover:shadow-xs flex flex-col justify-between transition"
              >
                <div>
                  <div className="relative h-32 w-full bg-slate-200">
                    <img 
                      src={dis.imageUrl} 
                      alt={dis.name} 
                      className="object-cover w-full h-full"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-slate-900/80 text-white font-extrabold text-[8px] uppercase tracking-wide rounded">
                      {dis.type} • {dis.affected}
                    </span>
                  </div>
                  
                  <div className="p-3.5 space-y-2">
                    <h5 className="font-extrabold text-xs text-slate-900">{dis.name}</h5>
                    <div className="space-y-1 text-[11px] text-slate-650">
                      <strong className="block text-red-950">🚨 Main Symptoms:</strong>
                      <ul className="list-disc pl-3.5 space-y-0.5">
                        {dis.symptoms.slice(0, 2).map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 pt-0 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedDisease(dis);
                      speakText(`Showing detailed prevention for ${dis.name}`, true);
                    }}
                    className="flex-1 py-1 px-2.5 bg-white border hover:bg-slate-100 text-slate-700 font-bold text-[10px] rounded-lg transition"
                  >
                    View Treatments
                  </button>
                  <button
                    onClick={() => speakText(dis.audioGuide, true)}
                    className="p-1 px-1.5 bg-red-50 border border-red-200 text-red-800 hover:bg-red-100 rounded-lg transition"
                    title="Read Aloud Symptoms and treatments"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Simulated Photo Analyzer & Report center */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Form */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wide text-slate-800 border-b pb-2 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-700 animate-pulse" /> Diagnostic Outbreak Upload Section
            </h4>

            <form onSubmit={handleDiagnose} className="space-y-3.5 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase">1. Affected Crop / Livestock</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tomato leaf, Eggplant, Holstein cow, tilapia..."
                  value={affectedInput}
                  onChange={(e) => setAffectedInput(e.target.value)}
                  className="w-full bg-slate-50 border px-3 py-1.5 rounded-xl focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase">2. Describe Symptoms Observed</label>
                <textarea
                  required
                  placeholder="Describe colors, holes, spots, swelling, shivering or clotted milk details..."
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  className="w-full bg-slate-50 border px-3 py-1.5 h-16 rounded-xl focus:ring-1 focus:ring-emerald-500 resize-none font-medium text-slate-850"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase">3. Suspected Disease Name (Optional)</label>
                <input
                  type="text"
                  placeholder="If you suspect an infection e.g. Late Blight, Mastitis..."
                  value={suspectedInput}
                  onChange={(e) => setSuspectedInput(e.target.value)}
                  className="w-full bg-slate-50 border px-3 py-1.5 rounded-xl font-medium"
                />
              </div>

              {/* Picture upload container */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase block">4. Attach Farm Disease Photo</label>
                
                <div className="flex items-center gap-3">
                  <label className="flex-1 border-2 border-dashed border-slate-200 hover:border-emerald-300 rounded-xl p-3 text-center cursor-pointer transition bg-slate-50">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center gap-1">
                      <UploadCloud className="w-5 h-5 text-slate-405" />
                      <span className="text-[9px] font-sans font-bold text-slate-500 uppercase tracking-wide">Attach Image</span>
                    </div>
                  </label>

                  {uploadedPhoto && (
                    <div className="relative h-12 w-16 bg-slate-100 rounded-lg border overflow-hidden shrink-0">
                      <img 
                        src={uploadedPhoto} 
                        alt="Pre-diagnose review" 
                        className="object-cover w-full h-full"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={() => setUploadedPhoto('')}
                        className="absolute top-0 right-0 p-0.5 bg-red-600 text-white rounded-bl font-bold text-[8px] cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isDiagnosing}
                className={`w-full py-2 rounded-xl text-xs font-bold font-sans uppercase flex items-center justify-center gap-1 shadow cursor-pointer transition ${
                  isDiagnosing 
                    ? 'bg-slate-300 text-slate-500' 
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                {isDiagnosing ? 'Analyzing Plant Structures...' : '🔬 Diagnose Farm Outbreak'}
              </button>
            </form>
          </div>

          {/* Diagnosis scan results */}
          {diagnosisResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2.5 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-emerald-900 border-b pb-1.5 border-emerald-150">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-700" />
                <strong className="text-xs font-bold uppercase tracking-wider font-sans">Diagnosis Scanning Finished</strong>
              </div>
              <p className="text-xs text-slate-700 font-sans leading-relaxed">
                {diagnosisResult}
              </p>
            </div>
          )}

        </div>

      </div>

      {/* Selected Disease Details Modal popup */}
      {selectedDisease && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border p-6 shadow-2xl space-y-5 animate-scaleIn max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b pb-4">
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-red-700 uppercase tracking-widest block font-mono">Detailed Healing Protocol</span>
                <h4 className="text-lg font-black text-slate-900 font-sans">{selectedDisease.name}</h4>
              </div>
              <button
                onClick={() => setSelectedDisease(null)}
                className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full font-black text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="relative h-44 w-full bg-slate-100 rounded-xl overflow-hidden border">
              <img 
                src={selectedDisease.imageUrl} 
                alt={selectedDisease.name} 
                className="object-cover w-full h-full"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-3 left-3 bg-red-800 text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase">
                {selectedDisease.affected}
              </span>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                <strong className="text-slate-800 font-extrabold uppercase text-[10px] tracking-wide block">⚠️ Bullet List of Symptoms</strong>
                <ul className="list-disc pl-4 space-y-1 text-slate-650">
                  {selectedDisease.symptoms.map((s, idx) => (
                    <li key={idx} className="leading-relaxed">{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl space-y-1 text-slate-800 leading-relaxed">
                <strong className="text-emerald-950 font-extrabold uppercase text-[10px] tracking-wide block">🌿 Organic Prevention & Bio-Control</strong>
                <p className="font-semibold text-slate-700 leading-relaxed text-[11px]">{selectedDisease.organicPrevention}</p>
              </div>

              {selectedDisease.chemicalRemedy && (
                <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl space-y-1 text-slate-700">
                  <strong className="text-red-950 font-extrabold uppercase text-[10px] tracking-wide block">🧪 Regulated Chemical Countermeasure</strong>
                  <p className="leading-relaxed text-[11px] font-semibold text-slate-700">{selectedDisease.chemicalRemedy}</p>
                </div>
              )}
            </div>

            <div className="border-t pt-3 flex justify-end gap-2">
              <button
                onClick={() => speakText(selectedDisease.audioGuide, true)}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold rounded-xl text-xs flex items-center gap-1 transition"
              >
                <Volume2 className="w-4 h-4" /> Listen Protocol
              </button>
              <button
                onClick={() => setSelectedDisease(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Dismiss Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reported Outbreaks Feed timeline */}
      {reports.length > 0 && (
        <div className="bg-white border rounded-2xl p-5 space-y-4 shadow-xs">
          <h4 className="font-black text-xs uppercase tracking-wide text-slate-700 border-b pb-2">
            📢 Community Disease Outbreak Reports & Symptoms Feed
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((r) => (
              <div key={r.id} className="p-4 bg-slate-50 border rounded-xl flex items-start gap-3 justify-between font-sans">
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between items-center bg-white/70 px-2 py-1 rounded border">
                    <strong className="text-slate-800 text-[11px] font-bold uppercase">{r.affected}</strong>
                    <span className="text-[9px] text-slate-400 font-mono">{r.date}</span>
                  </div>
                  
                  <p className="text-[11px] text-slate-650 leading-relaxed italic">
                    <strong>Reported Symptoms:</strong> &ldquo;{r.symptoms}&rdquo;
                  </p>

                  {r.aiDiagnosis && (
                    <div className="bg-emerald-50 p-2.5 rounded border border-emerald-150 text-[10px] text-slate-700 leading-relaxed font-semibold">
                      <strong>💡 AI Scored Remedy:</strong> {r.aiDiagnosis}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 shrink-0 items-end">
                  <img 
                    src={r.photoUrl} 
                    alt="Upload reference" 
                    className="h-14 w-14 object-cover rounded-lg border bg-white"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={() => deleteReport(r.id)}
                    className="p-1 px-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded transition cursor-pointer"
                    title="Delete case log"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
