import React, { useState, useEffect } from 'react';
import { Volume2, Plus, PenTool, CheckSquare, ShieldCheck, Mail, LogIn, Lock, Sparkles, AlertCircle } from 'lucide-react';

interface Recommendation {
  id: string;
  toolName: string;
  category: string;
  whyNeeded: string;
  date: string;
}

interface ContactUsProps {
  speakText: (text: string, force?: boolean) => void;
  signedInUser: { name: string; email: string; photoUrl: string } | null;
  onSignInWithGoogle: () => void;
  onSignOut: () => void;
}

export default function ContactUs({ speakText, signedInUser, onSignInWithGoogle, onSignOut }: ContactUsProps) {
  const [wishes, setWishes] = useState<Recommendation[]>([]);
  const [toolName, setToolName] = useState('');
  const [category, setCategory] = useState('Sensors & Water gravity');
  const [why, setWhy] = useState('');

  // Paypal widget html
  const paypalHtml = `
    <div>
      <style>.pp-8CG95D359RPZY{text-align:center;border:none;border-radius:0.25rem;min-width:11.625rem;padding:0 2rem;height:2.625rem;font-weight:bold;background-color:#FFD140;color:#000000;font-family:"Helvetica Neue",Arial,sans-serif;font-size:1rem;line-height:1.25rem;cursor:pointer;}</style>
      <form action="https://www.paypal.com/ncp/payment/8CG95D359RPZY" method="post" target="_blank" style="display:inline-grid;justify-items:center;align-content:start;gap:0.5rem;width:100%;">
        <input class="pp-8CG95D359RPZY" type="submit" value="Buy Now" />
        <img src="https://www.paypalobjects.com/images/Debit_Credit.svg" alt="cards" style="width:100%;max-width:240px;margin:0 auto;" />
        <section style="font-size: 0.75rem; text-align:center; color:#555;"> Powered by <img src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg" alt="paypal" style="height:0.875rem;vertical-align:middle;"/></section>
      </form>
    </div>
  `;

  useEffect(() => {
    const saved = localStorage.getItem('farming_wishes');
    if (saved) {
      setWishes(JSON.parse(saved));
    } else {
      const presets: Recommendation[] = [
        { id: 'w_1', toolName: 'Solar water pump kits under 100 dollars', category: 'Sensors & Water gravity', whyNeeded: 'To water tomatoes during the dry season without paying for expensive generator diesel.', date: '2026-05-18' },
        { id: 'w_2', toolName: 'Detailed guides for Avocado grafting', category: 'Guides & Manual articles', whyNeeded: 'Avocados are growing in value and grafting advice helps local farmers multiply nursery stocks.', date: '2026-05-19' }
      ];
      setWishes(presets);
      localStorage.setItem('farming_wishes', JSON.stringify(presets));
    }
  }, []);

  const saveWishes = (updated: Recommendation[]) => {
    setWishes(updated);
    localStorage.setItem('farming_wishes', JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName.trim()) return;

    const newWish: Recommendation = {
      id: 'wish_' + Date.now(),
      toolName,
      category,
      whyNeeded: why || 'Helpful for organic garden beds',
      date: new Date().toISOString().split('T')[0]
    };

    const next = [newWish, ...wishes];
    saveWishes(next);

    setToolName('');
    setWhy('');
    
    speakText(`Thank you! Recommended tool: ${toolName}. We will coordinate content production and tool sourcing.`, true);
  };

  return (
    <div className="space-y-8" id="contact-view">
      
      {/* Visual greeting card */}
      <div className="bg-white border text-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center shadow-sm">
        <div className="p-4 bg-emerald-100 rounded-full text-emerald-850 shrink-0">
          <PenTool className="w-10 h-10 animate-bounce" />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-xl font-bold font-sans">
            📞 Request Specialized Farm Equipment
          </h3>
          <p className="text-xs text-slate-500 font-sans leading-relaxed">
            What specialized farming tools (solar drip kits, sun egg incubators) or crop manuals would you like added? Suggest them publicly downstream.
          </p>
          <button
            onClick={() => speakText("Use this contact page to suggest new tools, water kits, or plant guides. Type what you want in the box and click submit. We will write articles about your ideas!", true)}
            className="px-3.5 py-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border rounded-lg flex items-center gap-1.5 transition select-none"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> Listen to Suggestion Guide
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Support Representative Credentials Section - SIGN IN PROTECTED */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-5">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 border-b pb-2 flex items-center gap-1">
              💼 Developer Support & Contact Details
            </h4>

            {signedInUser ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 space-y-3 font-sans">
                  <div className="flex items-center gap-3">
                    <img 
                      src={signedInUser.photoUrl} 
                      alt={signedInUser.name} 
                      className="w-10 h-10 rounded-full border bg-white"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-emerald-805 block">Signed-In Google Account</span>
                      <strong className="text-xs text-slate-800 font-bold block">{signedInUser.name} ({signedInUser.email})</strong>
                    </div>
                  </div>

                  <hr className="border-emerald-150" />

                  <div className="space-y-2.5 text-xs text-slate-750 font-sans">
                    <p className="leading-relaxed">
                      You are authenticated. You can contact our customer support representative directly at the address below:
                    </p>
                    <div className="p-2.5 bg-white border border-emerald-150 rounded-lg space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 block uppercase">Representative Name:</span>
                      <strong className="text-sm font-black text-slate-900 font-sans">gathu</strong>
                      
                      <span className="text-[10px] font-bold text-slate-505 block uppercase pt-1.5">Primary Contact Email Address:</span>
                      <a 
                        href="mailto:kathurimaian7@gmail.com" 
                        className="text-emerald-700 hover:underline font-bold text-xs flex items-center gap-1"
                      >
                        <Mail className="w-3.5 h-3.5" /> kathurimaian7@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Credits block */}
                  <div className="p-3 bg-indigo-50 border border-indigo-150 rounded-xl space-y-1 text-slate-800">
                    <div className="flex items-center gap-1 text-indigo-900">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                      <strong className="text-[10px] font-black uppercase tracking-wider">Application Credits</strong>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-700 leading-relaxed">
                      Credits to the user using username only <strong className="text-indigo-900 text-xs">gathu</strong> for initiating this digital farming ledger initiative.
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    onSignOut();
                    speakText("Signed out of Google account.", true);
                  }}
                  className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] uppercase rounded-lg transition"
                >
                  🚪 Sign Out of Google
                </button>
              </div>
            ) : (
              <div className="space-y-4 py-4 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-slate-50 border flex items-center justify-center text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                
                <div className="space-y-1 max-w-sm mx-auto">
                  <strong className="text-xs font-bold text-slate-800 block">Google Authentication Required</strong>
                  <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                    Personal emails and support representative connections are hidden. Please authenticate with your Google farming record account to bypass privacy screens.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSignInWithGoogle();
                  }}
                  className="mx-auto max-w-220 py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition hover:shadow-xs cursor-pointer select-none"
                >
                  <LogIn className="w-4 h-4 text-slate-500" />
                  <span>Sign In with Google</span>
                </button>

                {/* Visible Credits teaser */}
                <span className="text-[10px] text-slate-400 font-medium block">Credits: gathu</span>
              </div>
            )}
          </div>

          {/* Donations Section */}
          <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] text-amber-700 font-bold uppercase tracking-widest block font-mono">Support Continuation</span>
              <h4 className="text-sm font-black text-slate-900 font-sans flex items-center gap-1">
                💝 Sponsor this Homestead App
              </h4>
            </div>
            <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
              If this multi-currency ledger and disease catalog has saved your chickens or potato sprouts, consider sponsoring development costs for other remote communities:
            </p>

            {/* Paypal block */}
            <div 
              className="bg-white p-4 rounded-xl border border-amber-200/60 shadow-inner flex justify-center py-6"
              dangerouslySetInnerHTML={{ __html: paypalHtml }}
            />
          </div>

        </div>

        {/* Suggestion Form */}
        <div className="lg:col-span-12 xl:col-span-7 bg-white border rounded-2xl p-6 space-y-5 shadow-sm">
          <h4 className="font-bold text-slate-800 font-sans text-xs uppercase tracking-wider border-b pb-2 flex items-center gap-1">
            📦 Tool & Guide Request Box
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans" id="tool-request-form">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase">Product / Guide Name</label>
              <input
                type="text"
                required
                placeholder="e.g., Solar-drip timers, Grafting sheers..."
                className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 font-medium bg-slate-50 text-slate-800"
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
              />
            </div>

            <div className="space-y-1 font-sans">
              <label className="text-[10px] font-bold text-slate-600 uppercase">Farming Segment Core</label>
              <select
                className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:outline-none text-slate-800 cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Sensors & Water gravity">💧 Gravity Irrigation & Solar Pumps</option>
                <option value="Insect traps & biology">🐛 Safe Pest traps / Biological agents</option>
                <option value="Guides & Manual articles">📰 Plant husbandry grafting manuals</option>
                <option value="Value Add cookware">🍯 Cheese / jam cookers</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-60s uppercase">Why is this important for your community?</label>
              <textarea
                placeholder="Explain the farming benefit (e.g. saves water, doubles egg margins...)"
                className="w-full px-3 py-2 border rounded-xl text-xs h-20 resize-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 text-slate-800"
                value={why}
                onChange={(e) => setWhy(e.target.value)}
              />
            </div>

            <button
              id="submit-recommendation-btn"
              type="submit"
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow cursor-pointer select-none"
            >
              <Plus className="w-4 h-4" /> Submit Product Request To Board
            </button>
          </form>

          {/* Wishlist output board */}
          <div className="pt-4 border-t border-slate-100 space-y-3 font-sans">
            <div className="flex justify-between items-center text-xs">
              <strong className="font-bold text-slate-700 uppercase block">📋 Wishes Board</strong>
              <span className="text-[9px] text-slate-400 font-mono">Total {wishes.length} requests</span>
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {wishes.map((w) => (
                <div key={w.id} className="p-3 bg-slate-50 rounded-xl space-y-1.5 border text-xs leading-relaxed">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border mr-1.5">
                        {w.category}
                      </span>
                      <strong className="text-slate-850 font-bold text-[11px]">{w.toolName}</strong>
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono">{w.date}</span>
                  </div>
                  <p className="text-slate-650 text-[11px] leading-relaxed font-sans font-medium">{w.whyNeeded}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
