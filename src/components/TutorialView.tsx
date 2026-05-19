import { Volume2, BookOpen, PenTool, TrendingUp, Heart, CheckCircle, ShieldAlert, BadgeDollarSign } from 'lucide-react';

interface TutorialViewProps {
  speakText: (text: string, force?: boolean) => void;
  setCurrentTab: (tab: string) => void;
}

export default function TutorialView({ speakText, setCurrentTab }: TutorialViewProps) {
  const steps = [
    {
      id: 'step-1',
      title: '📋 1. Start with the AI Smart Farm Planner',
      icon: <BadgeDollarSign className="w-8 h-8 text-emerald-600" />,
      text: 'Tell the app how big your land is (e.g. 1 acre), how much money you can spend (budget), and if you have tools or farming knowledge. The AI plans the exact steps, seeds, housing, cost allocations, and disease protection strategies automatically.',
      audioText: 'Step 1. Go to the Smart Farm Planner. Fill out your capital budget, land size, and climate. The AI helper will split your budget and write a calendar on how to farm successfully.'
    },
    {
      id: 'step-2',
      title: '🐄 2. Learn Crop and livestock guides',
      icon: <CheckCircle className="w-8 h-8 text-blue-600" />,
      text: 'Browse local guidelines for growing Tomatoes, Maize, and Potatoes, or caring for Dairy Cattle and Poultry. It explains every core element from buying certified seeds to keeping housings clean, vaccination schedules, and the correct ways to harvest without tearing crops.',
      audioText: 'Step 2. Explore Plants and Crops, or Animals and Livestock tabs. You will find breeds, watering schedules, vaccine charts, and common diseases with visual signs!'
    },
    {
      id: 'step-3',
      title: '💡 3. Start Agribusiness with Value-Addition',
      icon: <TrendingUp className="w-8 h-8 text-amber-600" />,
      text: 'Raw crops rot inside days if unsold. Value-addition teaches you to boil milk to yoghurt, make cheese, dry tomatoes on wood screens, or slice potatoes to packaged crisps. The AI shows you how to establish small profitable cottage industries step-by-step.',
      audioText: 'Step 3. Check out Business and Value Addition. Do not sell dirty raw crops cheap. Learn how to cook milk into yoghurt or dry extra tomatoes to double your income.'
    },
    {
      id: 'step-4',
      title: '📓 4. Record Daily Money and Activities',
      icon: <PenTool className="w-8 h-8 text-indigo-600" />,
      text: 'Farming is a business. Use the ledger to record every bag of feed or packet of seed purchased (Expenses), and every tray of egg or liter of milk sold (Income). View clean indicators to see if your farm made a real profit this month.',
      audioText: 'Step 4. Record Daily Money. Write down feed spending and egg sales. This ensures you know if you are making real profit or wasting money.'
    },
    {
      id: 'step-5',
      title: '📝 5. Share with Other Farmers',
      icon: <Heart className="w-8 h-8 text-rose-600" />,
      text: 'Read real stories and tips from other farmers in the blog, and upload your own advice, complete with a title and photos. You can also ask questions or reply to neighboring queries on soil and parasites.',
      audioText: 'Step 5. Join the Farmers Blog. Write lists of what worked for you so other farmers can read and vote for your tips.'
    }
  ];

  return (
    <div className="space-y-8" id="tutorial-view-container">
      {/* Banner / Intro Card */}
      <div className="bg-gradient-to-br from-emerald-550 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-emerald-600">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BookOpen className="w-64 h-64" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-900/60 px-3.5 py-1.5 rounded-full border border-emerald-500/30 text-xs font-semibold tracking-wider uppercase">
            🆕 Easy Starter Tour
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight">
            How to Use This AI Farming Helper App
          </h2>
          <p className="text-emerald-100 text-base leading-relaxed">
            This application is designed specifically to help you grow more food and make more money. 
            If reading is difficult, tap any <strong className="text-yellow-300">🔊 Listen Button</strong> below, 
            and the app will read the text out loud in a clear, friendly voice!
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              id="tutorial-speak-banner"
              onClick={() => speakText("This app protects your plants from disease, keeps your dairy cows producing milk, and helps you budget your expenses. Tap any steps below to hear them!", true)}
              className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-900 rounded-xl font-bold flex items-center gap-2 transition hover:-translate-y-0.5 shadow-md text-sm"
            >
              <Volume2 className="w-5 h-5 text-slate-950 animate-bounce" />
              Listen to App Goal voiceover
            </button>
            <button
              id="tutorial-get-started"
              onClick={() => {
                setCurrentTab('onboarding');
                speakText("Let's go to the Smart Farm Planner and set up your goals!", true);
              }}
              className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-850/90 text-white rounded-xl font-bold flex items-center gap-2 transition hover:-translate-y-0.5 shadow border border-emerald-500/20 text-sm"
            >
              🚀 Go to AI Planner Now
            </button>
          </div>
        </div>
      </div>

      {/* Do's and Don'ts Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2 mb-3">
            💚 Farming GOLDEN RULES (Do's)
          </h3>
          <ul className="space-y-2.5 text-sm text-emerald-850 font-sans">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-semibold">✔️</span>
              <span>Water root soil directly, never spray water over leaves which triggers leaf mildew.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-semibold">✔️</span>
              <span>Keep chicken coop bedding clean and dry daily to stop deadly runny stomach blockages.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-semibold">✔️</span>
              <span>Add visitors foot-baths with simple disinfectant at the farm door to block germs.</span>
            </li>
          </ul>
          <button 
            onClick={() => speakText("Golden rules: Water root soil directly to avoid mildew. Keep chickens completely dry. Use foot-baths to exclude viral germs.", true)}
            className="mt-4 text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 bg-emerald-100 px-3 py-1.5 rounded-lg"
          >
            <Volume2 className="w-4 h-4" /> Listen to Golden Rules
          </button>
        </div>

        <div className="bg-red-50 border border-red-200/80 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-red-900 flex items-center gap-2 mb-3">
            ⚠️ What to Avoid at All Costs (Don'ts)
          </h3>
          <ul className="space-y-2.5 text-sm text-red-850 font-sans">
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-semibold">❌</span>
              <span>Do not buy unregistered cheap seeds—they carry viral rot and stunted harvests.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-semibold">❌</span>
              <span>Do not squeeze sick udders onto dry ground—it spreads infections to other cows.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-semibold">❌</span>
              <span>Do not store grains or feed directly on concrete floor, which gathers cold damp fungi.</span>
            </li>
          </ul>
          <button 
            onClick={() => speakText("Never buy cheap non-certified seeds. Never express infected milk onto healthy dirt beds. Never store animal feeds directly on damp concrete floors.", true)}
            className="mt-4 text-xs font-semibold text-red-800 hover:text-red-950 flex items-center gap-1.5 bg-red-100 px-3 py-1.5 rounded-lg"
          >
            <Volume2 className="w-4 h-4" /> Listen to What to Avoid
          </button>
        </div>
      </div>

      {/* Tutorial Steps */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold font-sans text-slate-800 tracking-tight">
          Visual Walkthrough of App Features
        </h3>
        <p className="text-slate-500 text-xs">
          Tap the loudspeaker icons to hear the voice coach guide you step-by-step.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((st) => (
            <div 
              key={st.id} 
              className="bg-white border md:border-slate-200/70 p-6 rounded-2xl hover:shadow-md transition group relative flex flex-col justify-between"
              id={st.id}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    {st.icon}
                  </div>
                  <button
                    onClick={() => speakText(st.audioText, true)}
                    className="p-2 text-slate-400 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-lg transition"
                    title="Click to hear voice description"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-2">{st.title}</h4>
                  <p className="text-xs text-slate-550 leading-relaxed font-sans">{st.text}</p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                  Accessible helper element
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
