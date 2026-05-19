import { useState, useEffect } from 'react';
import Header from './components/Header';
import TutorialView from './components/TutorialView';
import OnboardingQuiz from './components/OnboardingQuiz';
import PlantFarmingView from './components/PlantFarmingView';
import AnimalFarmingView from './components/AnimalFarmingView';
import DiseaseLibrary from './components/DiseaseLibrary';
import FarmCalculator from './components/FarmCalculator';
import BusinessAndValueAdditionView from './components/BusinessAndValueAdditionView';
import FinanceAndRecords from './components/FinanceAndRecords';
import BlogView from './components/BlogView';
import ContactUs from './components/ContactUs';
import FarmingLibrary from './components/FarmingLibrary';
import FarmToKitchen from './components/FarmToKitchen';
import HerbsAndRemedies from './components/HerbsAndRemedies';
import { FarmProfile, AIResponse } from './types';
import { Volume2, Sparkles, BookOpen, ShieldAlert, Scale, Check, LogIn } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'tutorial' | 'onboarding' | 'plants' | 'animals' | 'diseases' | 'calculator' | 'business' | 'finances' | 'blog' | 'contact' | 'library' | 'kitchen' | 'remedies'>('tutorial');
  const [voiceHelp, setVoiceHelp] = useState<boolean>(true); // on by default to aid illiterate users immediately
  const [disclaimerOpen, setDisclaimerOpen] = useState<boolean>(false);

  // Authenticated Google user simulation
  const [googleUser, setGoogleUser] = useState<{ name: string; email: string; photoUrl: string } | null>(() => {
    const saved = localStorage.getItem('farming_google_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showGoogleModal, setShowGoogleModal] = useState<boolean>(false);

  // Onboarding profile & custom generated plan state
  const [farmProfile, setFarmProfile] = useState<FarmProfile | null>(null);
  const [aiPlan, setAiPlan] = useState<AIResponse | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('onboarding_profile');
    const savedPlan = localStorage.getItem('onboarding_plan');
    if (savedProfile) setFarmProfile(JSON.parse(savedProfile));
    if (savedPlan) setAiPlan(JSON.parse(savedPlan));
  }, []);

  const handlePlanGenerated = (plan: AIResponse, profile: FarmProfile) => {
    setFarmProfile(profile);
    setAiPlan(plan);
    localStorage.setItem('onboarding_profile', JSON.stringify(profile));
    localStorage.setItem('onboarding_plan', JSON.stringify(plan));
  };

  // Speaks clean text on demand if voiceHelp is toggled active or if forced by explicit button click
  const speakText = (text: string, force: boolean = false) => {
    if (!voiceHelp && !force) return;
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        // clean markdown strings quickly and filter symbols to keep voice clean
        const clean = text
          .replace(/[*#_`\-[\]]/g, ' ')
          .replace(/\(\$[^)]+\)/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        
        if (!clean) return;
        
        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        utterance.onerror = (e) => {
          console.error('SpeechSynthesisUtterance error:', e);
        };

        window.speechSynthesis.speak(utterance);
        
        // Workaround for Chrome/webview speech issue: force resume if paused
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch (err) {
        console.error('Failed to perform Speech Synthesis:', err);
      }
    } else {
      console.warn('Speech synthesis not supported in this client configuration.');
    }
  };

  // Trigger once on loading App to greet
  useEffect(() => {
    setTimeout(() => {
      speakText("Welcome to AI Farming Assistant. Tap any tab, or turn on Voice helper to listen to steps.");
    }, 1500);
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [voiceHelp]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-emerald-100" id="app-root-container">
      
      {/* Visual Navigation Top header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab: any) => setCurrentTab(tab)}
        voiceHelp={voiceHelp}
        setVoiceHelp={setVoiceHelp}
        speakText={speakText}
      />

      {/* Main Adaptive Page Content container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* App Section Navigation Descriptions inside container boundary */}
        <div className="mb-6 p-4 bg-white border border-slate-200/60 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-emerald-50 rounded-xl text-emerald-850 text-lg">
              {currentTab === 'tutorial' && '📋'}
              {currentTab === 'onboarding' && '⭐'}
              {currentTab === 'plants' && '🌱'}
              {currentTab === 'animals' && '🐄'}
              {currentTab === 'diseases' && '🏥'}
              {currentTab === 'calculator' && '🧮'}
              {currentTab === 'business' && '💡'}
              {currentTab === 'finances' && '💰'}
              {currentTab === 'blog' && '📝'}
              {currentTab === 'contact' && '📞'}
              {currentTab === 'library' && '📚'}
              {currentTab === 'kitchen' && '🍲'}
              {currentTab === 'remedies' && '🌿'}
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide animate-fadeIn">
                Active Page: {currentTab === 'tutorial' && 'Visual App Tutorial Guide'}
                {currentTab === 'onboarding' && 'AI Smart Farm Planner'}
                {currentTab === 'plants' && 'Plants & Crops Interactive Manual'}
                {currentTab === 'animals' && 'Animals & Livestock Interactive Manual'}
                {currentTab === 'diseases' && 'Farm Diseases Diagnostics & Bio-Cure Protocols'}
                {currentTab === 'calculator' && 'Interactive Homestead Calculators & Budgets'}
                {currentTab === 'business' && 'Agribusiness Value-Addition Builder'}
                {currentTab === 'finances' && 'Ledger Accounting & Yield Logs'}
                {currentTab === 'blog' && 'P2P Farmers Discussion Forum & Blog'}
                {currentTab === 'contact' && 'Tools Request Box Section'}
                {currentTab === 'library' && 'Farming Keyword Library & Glossary'}
                {currentTab === 'kitchen' && 'Farm-To-Kitchen Cook-Book'}
                {currentTab === 'remedies' && 'Backyard Herbs & Remedy Manual'}
              </h2>
              <p className="text-xs text-slate-500 font-sans mt-0.5 animate-fadeIn">
                {currentTab === 'tutorial' && 'Start here. Perfect overview to read or hear about every single tool in this app.'}
                {currentTab === 'onboarding' && 'Answer 5 questions. The AI specialist will plan your space, seed costs, and crop timelines immediately.'}
                {currentTab === 'plants' && 'Learn how to plant, fertilize, protect, and harvest Premium tomatoes, maize, and potatoes.'}
                {currentTab === 'animals' && 'Details on cow and poultry breeds, vaccine dates, visual disease warnings, and future trends.'}
                {currentTab === 'diseases' && 'Diagnose crop blights, cattle parasites or fish saprolegnia with detailed organic bio-prevention cures.'}
                {currentTab === 'calculator' && 'Determine row seed spacing counts, required layer chicken feed rations or runoff rainfall harvesting weights.'}
                {currentTab === 'business' && 'Convert raw foods to yoghurt/cheese to double sales. Grounded forecasts tell you weather in your area.'}
                {currentTab === 'finances' && 'Record money spent on feeds/seeds and cash earned from sales. Write down daily milk/egg quantities.'}
                {currentTab === 'blog' && 'Write crop recipes directly in-app, upload screenshots, or ask peer farmers for solutions.'}
                {currentTab === 'contact' && 'Request specific water gravity tools, sun solar pump specifications, or graft manuals.'}
                {currentTab === 'library' && 'Search essential keywords and farming definitions for plants, cattle, aquaculture, and general setups.'}
                {currentTab === 'kitchen' && 'Discover simple farm-to-plate recipes for preparing, catching, gathering, and cooking healthy meals.'}
                {currentTab === 'remedies' && 'How to plant backyard healing leaves for cold symptoms, herbal soap formulas, and immunity boosters.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const summaries = {
                tutorial: 'App Tutorial page explains how to get seeds, vaccinate cows, and record money easily. Follow the steps.',
                onboarding: 'AI Farm Planner. Input your land size and budget, and get a tailored step-by-step master agricultural sheet.',
                plants: 'Plants page helps you grow big tomatoes, corn, or potatoes, detailing pest control and gentle harvesting.',
                animals: 'Animals manual. Lists vaccination dates, disease warning symptoms, dairy Friesian breeds, and zero-grazing housing.',
                diseases: 'Farm Diseases and organic prevention. Upload leaf photos and check plant bacterial wilt or chicken gumboro symptoms.',
                calculator: 'Farm spacing and feed calculator. Counts required seeds, chicken mash bags needed, and annual rooftop water harvest.',
                business: 'Value Business page explains how to cooker yoghurt, prepare crisps, and lists local supply and demand alternatives.',
                finances: 'Record book. Enter spendings and incomes daily to count exact net profits of your farm operations.',
                blog: 'Farmer Story corner. Share agricultural tips, ask solutions, and view comments from nearby farmers.',
                contact: 'Tools request box. Tell us which solar pump tools or support documents to load next.',
                library: 'Farming Keyword Library lists technical terms such as mulching, aquaponics, fingerlings, and zero-grazing steps.',
                kitchen: 'Kitchen page teaches you how to clean, catch, boil, and cook fresh stews, raw herbal booster teas, and dairy smoothies.',
                remedies: 'Herbs planting guide explains growing mint or aloe and using them for cold recovery tea or healthy soaps.'
              };
              speakText(summaries[currentTab]);
            }}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-sans font-bold text-xs rounded-xl flex items-center gap-1 shrink-0"
          >
            <Volume2 className="w-4 h-4 text-emerald-700" /> Hear Page Concept
          </button>
        </div>

        {/* Global AI Safety Disclaimer Banner inside container */}
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
            <p className="text-[11px] text-amber-950 font-sans leading-relaxed">
              <strong>⚠️ AI Disclaimer Warning Notice:</strong> All details, checklists, budgets, and veterinary routines on this app are AI-generated. Weather, animal immune limits, and soil qualities fluctuate. Please consult certified local experts or veterinary extension officers before proceeding!
            </p>
          </div>
          <button
            onClick={() => {
              setDisclaimerOpen(true);
              speakText("Loading app terms and protections.", true);
            }}
            className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg text-xs whitespace-nowrap transition cursor-pointer"
          >
            ⚖️ Read Protective Terms & Policies
          </button>
        </div>

        {/* Dynamic Route views */}
        <div className="py-4">
          {currentTab === 'tutorial' && (
            <TutorialView speakText={speakText} setCurrentTab={(t: any) => setCurrentTab(t)} />
          )}

          {currentTab === 'onboarding' && (
            <OnboardingQuiz
              onPlanGenerated={handlePlanGenerated}
              speakText={speakText}
              savedPlan={aiPlan}
              savedProfile={farmProfile}
            />
          )}

          {currentTab === 'plants' && (
            <PlantFarmingView speakText={speakText} location={farmProfile?.location || 'Highland Valleys'} />
          )}

          {currentTab === 'animals' && (
            <AnimalFarmingView speakText={speakText} location={farmProfile?.location || 'Highland Valleys'} />
          )}

          {currentTab === 'diseases' && (
            <DiseaseLibrary speakText={speakText} />
          )}

          {currentTab === 'calculator' && (
            <FarmCalculator speakText={speakText} />
          )}

          {currentTab === 'business' && (
            <BusinessAndValueAdditionView speakText={speakText} location={farmProfile?.location || 'Highland Valleys'} />
          )}

          {currentTab === 'finances' && (
            <FinanceAndRecords speakText={speakText} />
          )}

          {currentTab === 'blog' && (
            <BlogView speakText={speakText} />
          )}

          {currentTab === 'contact' && (
            <ContactUs 
              speakText={speakText} 
              signedInUser={googleUser}
              onSignInWithGoogle={() => setShowGoogleModal(true)}
              onSignOut={() => {
                setGoogleUser(null);
                localStorage.removeItem('farming_google_user');
              }}
            />
          )}

          {currentTab === 'library' && (
            <FarmingLibrary speakText={speakText} />
          )}

          {currentTab === 'kitchen' && (
            <FarmToKitchen speakText={speakText} />
          )}

          {currentTab === 'remedies' && (
            <HerbsAndRemedies speakText={speakText} />
          )}
        </div>

      </main>

      {/* Protective Terms and Conditions Modal */}
      {disclaimerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleIn max-h-[85vh] overflow-y-auto">
            <div className="flex items-center gap-2.5 border-b pb-3 text-amber-900">
              <Scale className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-black font-sans tracking-tight">
                ⚖️ Legal Liability Terms & Protection Policy
              </h3>
            </div>
            
            <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed font-sans">
              <p>
                Please read this safety warning carefully. By using the AI Farming Assistant application, you agree strictly to hold the application creators and developers harmless from all liabilities.
              </p>
              
              <div className="space-y-1 bg-slate-50 p-2.5 border rounded-lg">
                <strong className="text-[11px] text-slate-800 uppercase block font-bold">1. AI Generated Inaccuracy Warning</strong>
                <span>
                  The calculations, fertilizer steps, watering rates, vaccine tables, and crop guidelines are generated automatically by artificial intelligence models. AI may make compilation errors. Agricultural variables like rainfall, temperature, and viral mutations can cause sudden, absolute failures.
                </span>
              </div>

              <div className="space-y-1 bg-slate-50 p-2.5 border rounded-lg">
                <strong className="text-[11px] text-slate-800 uppercase block font-bold">2. Consult Local Extension Experts First</strong>
                <span>
                  Do not feed untested herbs, apply chemicals, make money expenditures, or inject veterinary medicine solely based on these screens. Always consult a government-approved agronomy extension officer, a registered veterinarian, or licensed soil expert beforehand.
                </span>
              </div>

              <div className="space-y-1 bg-slate-50 p-2.5 border rounded-lg">
                <strong className="text-[11px] text-slate-850 uppercase block font-bold">3. No Creator Liability Guarantee</strong>
                <span>
                  To the maximum extent permitted under law, the software creators, developers, designers, and platform hosts shall not be liable for any direct, indirect, incidental, or exemplary damages, including but not limited to crop blight, livestock deaths, financial losses, or soil contamination.
                </span>
              </div>

              <p className="text-[10px] text-slate-400 font-mono">
                Current local check stamp: {new Date().toISOString().split('T')[0]} • Standard Safeguard Model 0.0.0.0.
              </p>
            </div>

            <div className="border-t pt-3 flex justify-end">
              <button
                onClick={() => {
                  setDisclaimerOpen(false);
                  speakText("Terms accepted. Safe farming!", true);
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold font-sans flex items-center gap-1.5 cursor-pointer shadow-sm transition"
              >
                <Check className="w-4 h-4" /> I Accept & Understand these Terms
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Authentication Simulated Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border max-w-sm w-full p-6 shadow-2xl space-y-5 animate-scaleIn font-sans">
            <div className="flex flex-col items-center text-center space-y-2">
              <img 
                src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" 
                alt="Google Logo" 
                className="h-8 object-contain"
                referrerPolicy="no-referrer"
              />
              <h3 className="text-base font-bold text-slate-805">
                Sign in with Google
              </h3>
              <p className="text-xs text-slate-500">
                to continue to AI Farming Assistant
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Choose an account</span>
              
              {/* Account Selection Line - gathu */}
              <button
                type="button"
                onClick={() => {
                  const user = {
                    name: 'gathu',
                    email: 'gathuian077@gmail.com',
                    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop'
                  };
                  setGoogleUser(user);
                  localStorage.setItem('farming_google_user', JSON.stringify(user));
                  setShowGoogleModal(false);
                  speakText("Successfully signed in as gathu using Google account.", true);
                }}
                className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 text-left flex items-center justify-between transition cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 text-xs font-black">
                    G
                  </div>
                  <div>
                    <strong className="text-xs text-slate-850 block font-bold">gathu</strong>
                    <span className="text-[10px] text-slate-400 block font-mono">gathuian077@gmail.com</span>
                  </div>
                </div>
                <span className="text-[9px] text-emerald-700 font-bold">Recommended</span>
              </button>

              {/* Guest / Custom account sign in alternative */}
              <button
                type="button"
                onClick={() => {
                  const customName = prompt("Please enter your custom username for credentials:") || "Homestead Farmer";
                  const user = {
                    name: customName,
                    email: customName.toLowerCase().replace(/[^a-z0-9]/g, '') + "@gmail.com",
                    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop'
                  };
                  setGoogleUser(user);
                  localStorage.setItem('farming_google_user', JSON.stringify(user));
                  setShowGoogleModal(false);
                  speakText(`Successfully signed in as ${customName} using Google secure simulation.`, true);
                }}
                className="w-full p-2 py-1.5 rounded-xl text-center border text-[10px] text-slate-500 hover:bg-slate-50 transition uppercase block font-semibold cursor-pointer select-none"
              >
                Sign In with another Google account
              </button>

              <div className="text-center pt-2.5 border-t">
                <span className="text-[9px] text-slate-400">Representative Details • Credits to User Username only gathu</span>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Humble Footer with helpful low-literacy credentials */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 mt-12 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-sans">🌾 AI Farming Assistant — Created to support everyone, regardless of reading skill.</p>
          <div className="font-sans text-[10px] text-red-500 font-bold max-w-xl mx-auto leading-relaxed">
            ⚠️ DISCLAIMER WARNING NOTICE: All information, vaccine dates, pest warnings & crop calculations on this application are AI-generated. Consult an agronomy expert or registry veterinarian before proceeding with crop operations.
          </div>
          <p className="font-mono text-[10px] text-slate-500">
            Powered by Gemini with Google Search Grounding • Credits to gathu
          </p>
        </div>
      </footer>

    </div>
  );
}
