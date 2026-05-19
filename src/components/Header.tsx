import { Sprout, Volume2, VolumeX, BookOpen, AlertCircle } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  voiceHelp: boolean;
  setVoiceHelp: (on: boolean) => void;
  speakText: (text: string, force?: boolean) => void;
}

export default function Header({ currentTab, setCurrentTab, voiceHelp, setVoiceHelp, speakText }: HeaderProps) {
  const triggerVoiceTutorial = () => {
    speakText(
      "Welcome to the AI Farming Assistant, built to support homesteaders and local farmers. This application helps you design successful farming plans under our Smart Farm Planner. In the Crops and Livestock tabs, you will learn the exact guidelines for growing high-yield potatoes, corn, and tomatoes, including watering metrics, vaccine tables, and visual disease cards. Use our new Farm Calculator to estimate seed spacings and chicken feed costs. Visit our new Farm Diseases section to diagnose crop infection and check organic remedies. Record your daily income and spending on poultry feeds in our Money Ledger. Turn on the Voice ON button in the top right to hear details read out loud!",
      true
    );
  };

  return (
    <header className="bg-emerald-900 text-white shadow-md border-b border-emerald-800" id="app-header">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo and Tagline */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setCurrentTab('tutorial'); speakText("Going to Tutorial Page."); }}>
            <div className="p-2.5 bg-emerald-700 rounded-xl border border-emerald-500 shadow-inner">
              <Sprout className="w-8 h-8 text-emerald-200 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-sans font-bold tracking-tight flex items-center gap-2">
                AI Farming Assistant
              </h1>
              <p className="text-xs text-emerald-200/90 font-mono">
                🌾 Simple Soil, Healthy Livestock, Greater Profit
              </p>
            </div>
          </div>

          {/* Low Literacy Assist Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-emerald-950/80 px-4 py-2.5 rounded-xl border border-emerald-750 max-w-md">
            <div className="flex items-center gap-2 mr-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <p className="text-xs text-emerald-100 font-sans font-medium">
                Voice Assistant
              </p>
            </div>
            
            <button
              id="btn-toggle-voice"
              onClick={() => {
                const updated = !voiceHelp;
                setVoiceHelp(updated);
                if (updated) {
                  speakText("Voice guide is turned on. Tap any box to hear instructions!", true);
                } else {
                  if (window.speechSynthesis) window.speechSynthesis.cancel();
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                voiceHelp 
                  ? 'bg-emerald-500 text-white shadow'
                  : 'bg-emerald-800 text-emerald-200 hover:bg-emerald-750'
              }`}
              title="Click here to hear the app talk"
            >
              {voiceHelp ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-emerald-300" />}
              {voiceHelp ? 'Voice ON' : 'Turn Voice On'}
            </button>

            <button
              id="btn-voice-intro"
              onClick={triggerVoiceTutorial}
              className="px-2.5 py-1 text-xs font-semibold bg-emerald-800 text-emerald-100 rounded-lg hover:bg-emerald-750 flex items-center gap-1 border border-emerald-700"
            >
              <Volume2 className="w-3.5 h-3.5 text-yellow-300" />
              <span>Listen to Intro</span>
            </button>
          </div>

        </div>

        {/* Global Nav Bar */}
        <div className="flex flex-row overflow-x-auto whitespace-nowrap lg:flex-wrap gap-2 mt-4 pt-4 border-t border-emerald-800/60 text-sm font-medium scrollbar-none">
          <button
            id="nav-tutorial"
            onClick={() => { setCurrentTab('tutorial'); speakText("Opening Tutorial page"); }}
            className={`px-4 py-2 rounded-xl transition ${
              currentTab === 'tutorial' ? 'bg-emerald-700 text-white shadow-sm' : 'hover:bg-emerald-800/50 text-emerald-100'
            }`}
          >
            📋 App Tutorial First
          </button>
          <button
            id="nav-onboarding"
            onClick={() => { setCurrentTab('onboarding'); speakText("Opening AI Farm Planner page"); }}
            className={`px-4 py-2 rounded-xl transition ${
              currentTab === 'onboarding' ? 'bg-emerald-700 text-white shadow-sm' : 'hover:bg-emerald-800/50 text-emerald-100'
            }`}
          >
            ⭐ AI Smart Farm Planner
          </button>
          <button
            id="nav-plants"
            onClick={() => { setCurrentTab('plants'); speakText("Opening Crops and Plant Farming page"); }}
            className={`px-4 py-2 rounded-xl transition ${
              currentTab === 'plants' ? 'bg-emerald-700 text-white shadow-sm' : 'hover:bg-emerald-800/50 text-emerald-100'
            }`}
          >
            🌱 Plants & Crops
          </button>
          <button
            id="nav-animals"
            onClick={() => { setCurrentTab('animals'); speakText("Opening Livestock and Animals Farming page"); }}
            className={`px-4 py-2 rounded-xl transition ${
              currentTab === 'animals' ? 'bg-emerald-700 text-white shadow-sm' : 'hover:bg-emerald-800/50 text-emerald-100'
            }`}
          >
            🐄 Animals & Livestock
          </button>
          <button
            id="nav-diseases"
            onClick={() => { setCurrentTab('diseases'); speakText("Opening Farm Diseases and Diagnostic page"); }}
            className={`px-4 py-2 rounded-xl transition ${
              currentTab === 'diseases' ? 'bg-emerald-700 text-white shadow-sm' : 'hover:bg-emerald-800/50 text-emerald-100'
            }`}
          >
            🏥 Farm Diseases Page
          </button>
          <button
            id="nav-calculator"
            onClick={() => { setCurrentTab('calculator'); speakText("Opening Farm Calculators suite"); }}
            className={`px-4 py-2 rounded-xl transition ${
              currentTab === 'calculator' ? 'bg-emerald-700 text-white shadow-sm' : 'hover:bg-emerald-800/50 text-emerald-100'
            }`}
          >
            🧮 Farm Calculator Suite
          </button>
          <button
            id="nav-business"
            onClick={() => { setCurrentTab('business'); speakText("Opening Local Value Businesses page"); }}
            className={`px-4 py-2 rounded-xl transition ${
              currentTab === 'business' ? 'bg-emerald-700 text-white shadow-sm' : 'hover:bg-emerald-800/50 text-emerald-100'
            }`}
          >
            💡 Business & Value-Addition
          </button>
          <button
            id="nav-finances"
            onClick={() => { setCurrentTab('finances'); speakText("Opening Finances, Budgets, and Records page"); }}
            className={`px-4 py-2 rounded-xl transition ${
              currentTab === 'finances' ? 'bg-emerald-700 text-white shadow-sm' : 'hover:bg-emerald-800/50 text-emerald-100'
            }`}
          >
            💰 Money & Record Keeping
          </button>
          <button
            id="nav-blog"
            onClick={() => { setCurrentTab('blog'); speakText("Opening Farmers blog and discussion page"); }}
            className={`px-4 py-2 rounded-xl transition ${
              currentTab === 'blog' ? 'bg-emerald-700 text-white shadow-sm' : 'hover:bg-emerald-800/50 text-emerald-100'
            }`}
          >
            📝 Farmers Blog & Ask Qs
          </button>
          <button
            id="nav-contact"
            onClick={() => { setCurrentTab('contact'); speakText("Opening Contact and tool suggestion page"); }}
            className={`px-4 py-2 rounded-xl transition ${
              currentTab === 'contact' ? 'bg-emerald-700 text-white shadow-sm' : 'hover:bg-emerald-800/50 text-emerald-100'
            }`}
          >
            📞 Suggest Tools
          </button>
          <button
            id="nav-library"
            onClick={() => { setCurrentTab('library'); speakText("Opening Farming Dictionary and Keyword glossary."); }}
            className={`px-4 py-2 rounded-xl transition ${
              currentTab === 'library' ? 'bg-emerald-700 text-white shadow-sm' : 'hover:bg-emerald-800/50 text-emerald-100'
            }`}
          >
            📖 Farming Keyword Library
          </button>
          <button
            id="nav-kitchen"
            onClick={() => { setCurrentTab('kitchen'); speakText("Opening Farm to Kitchen gather and cook recipes."); }}
            className={`px-4 py-2 rounded-xl transition ${
              currentTab === 'kitchen' ? 'bg-emerald-700 text-white shadow-sm' : 'hover:bg-emerald-800/50 text-emerald-100'
            }`}
          >
            🍲 Farm-To-Kitchen Cook-Book
          </button>
          <button
            id="nav-remedies"
            onClick={() => { setCurrentTab('remedies'); speakText("Opening Herbs planting and home medicine options."); }}
            className={`px-4 py-2 rounded-xl transition ${
              currentTab === 'remedies' ? 'bg-emerald-700 text-white shadow-sm' : 'hover:bg-emerald-800/50 text-emerald-100'
            }`}
          >
            🌱 Herb Planting & Soap Remedies
          </button>
        </div>

      </div>
    </header>
  );
}
