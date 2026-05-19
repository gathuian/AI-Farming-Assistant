import React, { useState, useEffect } from 'react';
import { FinanceRecord, FarmActivityRecord } from '../types';
import { Volume2, Plus, Trash2, BookOpen, PenTool, CheckCircle, TrendingUp, TrendingDown, ClipboardList } from 'lucide-react';

interface FinanceAndRecordsProps {
  speakText: (text: string, force?: boolean) => void;
}

export default function FinanceAndRecords({ speakText }: FinanceAndRecordsProps) {
  // 1. Finances State
  const [finances, setFinances] = useState<FinanceRecord[]>([]);
  const [finType, setFinType] = useState<'income' | 'expense'>('expense');
  const [finCategory, setFinCategory] = useState('Chicken feed');
  const [finAmount, setFinAmount] = useState<string>('');
  const [finDesc, setFinDesc] = useState('');

  // 2. Activities & Yield State
  const [activities, setActivities] = useState<FarmActivityRecord[]>([]);
  const [actType, setActType] = useState<'crop' | 'livestock' | 'general'>('crop');
  const [actTitle, setActTitle] = useState('');
  const [actDetails, setActDetails] = useState('');
  const [actQty, setActQty] = useState('');

  // 3. Currency Selection States
  const [currencyCode, setCurrencyCode] = useState<string>('USD');
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');
  const [customCurrencySpec, setCustomCurrencySpec] = useState<string>('');

  const currenciesList = [
    { code: 'USD', symbol: '$', name: 'US Dollar ($)' },
    { code: 'EUR', symbol: '€', name: 'Euro (€)' },
    { code: 'GBP', symbol: '£', name: 'British Pound (£)' },
    // African Currencies
    { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling (KSh)' },
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira (₦)' },
    { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi (GH₵)' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand (R)' },
    { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling (USh)' },
    { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling (TSh)' },
    { code: 'RWF', symbol: 'RF', name: 'Rwandan Franc (RF)' },
    { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr (Br)' },
    { code: 'EGP', symbol: 'EGP', name: 'Egyptian Pound' },
    { code: 'MAD', symbol: 'DH', name: 'Moroccan Dirham' },
    { code: 'GMD', symbol: 'D', name: 'Gambian Dalasi' },
    { code: 'SLL', symbol: 'Le', name: 'Sierra Leonean Leone' },
    { code: 'MWK', symbol: 'MK', name: 'Malawian Kwacha' },
    { code: 'ZMW', symbol: 'ZK', name: 'Zambian Kwacha' },
    { code: 'BWP', symbol: 'P', name: 'Botswana Pula' },
    // Global Standard Others
    { code: 'INR', symbol: '₹', name: 'Indian Rupee (₹)' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'OTHER', symbol: 'Specify', name: 'Other / Specify custom' }
  ];

  const handleCurrencyChange = (code: string) => {
    setCurrencyCode(code);
    const found = currenciesList.find(c => c.code === code);
    if (found && code !== 'OTHER') {
      setCurrencySymbol(found.symbol);
      localStorage.setItem('farming_currency_choice', code);
      localStorage.setItem('farming_currency_symbol', found.symbol);
      speakText(`Currency toggled to ${found.name}`, true);
    } else if (code === 'OTHER') {
      setCurrencySymbol('Custom');
      speakText("Please specify your custom currency symbol in the text box below.");
    }
  };

  const handleApplyCustomCurrency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCurrencySpec.trim()) return;
    setCurrencySymbol(customCurrencySpec);
    localStorage.setItem('farming_currency_choice', 'OTHER');
    localStorage.setItem('farming_currency_symbol', customCurrencySpec);
    speakText(`Custom currency specified as: ${customCurrencySpec}`, true);
  };

  // Load from LocalStorage
  useEffect(() => {
    const savedFin = localStorage.getItem('farming_ledger');
    if (savedFin) setFinances(JSON.parse(savedFin));

    const savedAct = localStorage.getItem('farming_activities');
    if (savedAct) setActivities(JSON.parse(savedAct));

    const storedChoice = localStorage.getItem('farming_currency_choice');
    const storedSymbol = localStorage.getItem('farming_currency_symbol');
    if (storedChoice) setCurrencyCode(storedChoice);
    if (storedSymbol) setCurrencySymbol(storedSymbol);

    // Preset initial record guides if empty to make it illustrative
    if (!savedFin) {
      const presets: FinanceRecord[] = [
        { id: 'pres_1', type: 'expense', category: 'Seed purchase', amount: 80, date: '2026-05-15', description: 'Bought 2kg certified tomato seeds' },
        { id: 'pres_2', type: 'income', category: 'Egg sales', amount: 120, date: '2026-05-18', description: 'Sold 10 trays of quality layers eggs' },
        { id: 'pres_3', type: 'expense', category: 'Coop repairs', amount: 50, date: '2026-05-19', description: 'Bought support wood slats' }
      ];
      setFinances(presets);
      localStorage.setItem('farming_ledger', JSON.stringify(presets));
    }

    if (!savedAct) {
      const presets: FarmActivityRecord[] = [
        { id: 'act_1', date: '2026-05-15', type: 'crop', title: 'Nursery seedlings transfer', details: 'Transplanted tomato sprouts into Main Ridge beds.', quantity: '400 seedlings' },
        { id: 'act_2', date: '2026-05-17', type: 'livestock', title: 'Gumboro vaccine dose', details: 'Added vaccination powder to fresh chicken drinking bins.', quantity: '45 chickens' }
      ];
      setActivities(presets);
      localStorage.setItem('farming_activities', JSON.stringify(presets));
    }
  }, []);

  const saveFinances = (updated: FinanceRecord[]) => {
    setFinances(updated);
    localStorage.setItem('farming_ledger', JSON.stringify(updated));
  };

  const saveActivities = (updated: FarmActivityRecord[]) => {
    setActivities(updated);
    localStorage.setItem('farming_activities', JSON.stringify(updated));
  };

  // Finance addition
  const addFinanceRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmt = parseFloat(finAmount);
    if (isNaN(parsedAmt) || parsedAmt <= 0) return;

    const newRecord: FinanceRecord = {
      id: 'fin_' + Date.now(),
      type: finType,
      category: finCategory,
      amount: parsedAmt,
      date: new Date().toISOString().split('T')[0],
      description: finDesc || finCategory
    };

    const next = [newRecord, ...finances];
    saveFinances(next);
    setFinAmount('');
    setFinDesc('');
    
    speakText(`Recorded ${finType}: ${finCategory} worth ${parsedAmt} ${currencySymbol}.`, true);
  };

  const deleteFinance = (id: string, detail: string) => {
    const next = finances.filter(f => f.id !== id);
    saveFinances(next);
    speakText(`Deleted ledger entry: ${detail}`, true);
  };

  // Activity addition
  const addActivityRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTitle.trim()) return;

    const newAct: FarmActivityRecord = {
      id: 'act_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: actType,
      title: actTitle,
      details: actDetails,
      quantity: actQty
    };

    const next = [newAct, ...activities];
    saveActivities(next);
    setActTitle('');
    setActDetails('');
    setActQty('');

    speakText(`Logged activity: ${actTitle}`, true);
  };

  const deleteActivity = (id: string, title: string) => {
    const next = activities.filter(a => a.id !== id);
    saveActivities(next);
    speakText(`Deleted activity log: ${title}`, true);
  };

  // Accounting calculations
  const totalIncome = finances.filter(f => f.type === 'income').reduce((acc, f) => acc + f.amount, 0);
  const totalExpense = finances.filter(f => f.type === 'expense').reduce((acc, f) => acc + f.amount, 0);
  const netEarnings = totalIncome - totalExpense;

  const handleSpeakSummary = () => {
    speakText(
      `Financial Summary: You made ${totalIncome} ${currencySymbol} inside income. You spent ${totalExpense} ${currencySymbol} on expenses. Your net earnings amount to ${netEarnings} ${currencySymbol}.`,
      true
    );
  };

  return (
    <div className="space-y-8" id="finance-ledger-view">
      
      {/* 1. Explaining Bar */}
      <div className="bg-white border rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center shadow-sm">
        <div className="p-4 bg-indigo-50 rounded-full text-indigo-700">
          <ClipboardList className="w-10 h-10" />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-xl font-bold font-sans text-slate-805">
            📓 Smart Pocket Ledger & Activity Tracker
          </h3>
          <p className="text-xs text-slate-500 font-sans leading-relaxed">
            Record inputs (chicken feed, seeds, vaccination fees) under Expenses, and recorded outputs 
            (milk, eggs, crop kilograms) under Income. Log daily tasks or yields to maintain structured records.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
               onClick={() => speakText("This page helps you record money in and money out. Write down your spending under Expense. Write down your sales under Income. Your total net profit calculates automatically at the top!", true)}
               className="px-3.5 py-1 text-xs bg-indigo-50 hover:bg-indigo-100 font-bold rounded-lg text-indigo-900 flex items-center gap-1 transition"
            >
              <Volume2 className="w-3.5 h-3.5" /> Speak Ledger Guide
            </button>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs font-bold text-indigo-950 font-sans">Active Currency: {currencySymbol} ({currencyCode})</span>
          </div>
        </div>

        {/* Global Multi-Currency Dropdown Control */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 shrink-0 w-full md:w-64">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">🌍 Select Local Currency</label>
            <select
              value={currencyCode}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="w-full bg-white border border-slate-250 py-1.5 px-2.5 rounded-lg text-xs font-sans text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {currenciesList.map(item => (
                <option key={item.code} value={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {currencyCode === 'OTHER' && (
            <form onSubmit={handleApplyCustomCurrency} className="flex gap-2.5 items-end">
              <div className="space-y-0.5 flex-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Specify Symbol:</span>
                <input
                  type="text"
                  placeholder="e.g. CFA, DH, KSh..."
                  value={customCurrencySpec}
                  onChange={(e) => setCustomCurrencySpec(e.target.value)}
                  className="w-full bg-white border py-1 px-2 rounded-md text-[10px] uppercase font-bold text-slate-800 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-700 hover:bg-indigo-800 text-white rounded-md text-[10px] px-3.5 py-1.5 font-sans font-extrabold transition shrink-0 uppercase cursor-pointer"
              >
                Set Symbol
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Accounting Indicator Bento cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Income Card */}
        <div className="bg-white border p-5 rounded-2xl shadow-sm space-y-2 hover:shadow-md transition">
          <span className="text-[10px] uppercase font-bold text-slate-400 font-sans block">🌻 Total Income</span>
          <div className="flex items-center justify-between">
            <h4 id="tot-income-val" className="text-2xl font-black text-emerald-700 font-mono">{currencySymbol} {totalIncome}</h4>
            <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-sans">Money earned from selling yields</p>
        </div>

        {/* Expense Card */}
        <div className="bg-white border p-5 rounded-2xl shadow-sm space-y-2 hover:shadow-md transition">
          <span className="text-[10px] uppercase font-bold text-slate-400 font-sans block">💵 Total Expenses</span>
          <div className="flex items-center justify-between">
            <h4 id="tot-expense-val" className="text-2xl font-black text-red-700 font-mono">{currencySymbol} {totalExpense}</h4>
            <div className="bg-red-50 text-red-600 p-1.5 rounded-lg">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-sans">Money spent on feed, seed, tools</p>
        </div>

        {/* Net Profit Card */}
        <div className={`p-5 rounded-2xl border shadow-sm space-y-2 transition ${
          netEarnings >= 0 
            ? 'bg-emerald-50/60 border-emerald-100 text-emerald-950' 
            : 'bg-red-50/60 border-red-105 text-red-950'
        }`}>
          <div className="flex justify-between items-center text-[10px] uppercase font-bold font-sans">
            <span>📊 NET EARNINGS (PROFIT)</span>
            <button
              onClick={handleSpeakSummary}
              className="p-1 text-slate-650 hover:text-emerald-800 rounded bg-white"
            >
              <Volume2 className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <h4 id="net-profit-val" className="text-2xl font-black font-mono">{currencySymbol} {netEarnings}</h4>
            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border bg-white ${
              netEarnings >= 0 ? 'text-emerald-700 border-emerald-150' : 'text-red-700 border-red-150'
            }`}>
              {netEarnings >= 0 ? '✔️ MAKING PROFIT' : '⚠️ SPENDING TOO MUCH'}
            </span>
          </div>
          <p className="text-[10px] opacity-80 leading-relaxed font-sans">Ideal when income is bigger than spending.</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Ledger entry column */}
        <div className="lg:col-span-5 bg-white border rounded-2xl p-6 shadow-sm space-y-5">
          <h4 className="font-bold text-slate-805 text-sm border-b pb-2 flex items-center gap-1">
            💵 Log Money Record
          </h4>

          <form onSubmit={addFinanceRecord} className="space-y-4" id="add-ledger-form">
            
            {/* Type selection */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setFinType('income'); setFinCategory('Crop sales'); }}
                className={`py-2 text-xs font-bold rounded-xl border text-center transition ${
                  finType === 'income' 
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' 
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                📥 Income (Earnings)
              </button>
              <button
                type="button"
                onClick={() => { setFinType('expense'); setFinCategory('Chicken feed'); }}
                className={`py-2 text-xs font-bold rounded-xl border text-center transition ${
                  finType === 'expense' 
                    ? 'bg-red-650 border-red-600 text-white shadow-sm' 
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                📤 Expense (Spent)
              </button>
            </div>

            {/* Category selection */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Category Type</label>
              <select
                value={finCategory}
                onChange={(e) => setFinCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-50 font-sans focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {finType === 'expense' ? (
                  <>
                    <option value="Chicken feed">🐓 Chicken Feed & Pellets</option>
                    <option value="Cattle silage fodder">🐄 Cattle Silage / Fodder</option>
                    <option value="Certified Seeds">🌱 Certified Seed packets</option>
                    <option value="Worm feed / minerals">🐛 BSF Worm Feed or Salt Licks</option>
                    <option value="Vaccines & vet medicines">💉 Vaccines & Cow Medications</option>
                    <option value="Hired Farm help manual">🧑‍🌾 Manual Hired labor wages</option>
                    <option value="Wood and coop nails">🔨 Housing / Pen wood slats</option>
                    <option value="Water and fuel pumps">⛽ Water fuel pump / tools</option>
                  </>
                ) : (
                  <>
                    <option value="Crop sales">🥬 Vegetable & Grain Sales</option>
                    <option value="Milk collection gains">🥛 Raw Milk wholesale collection</option>
                    <option value="Yoghurt bottles profit">🍯 Made Yoghurt bottles direct sale</option>
                    <option value="Egg crates sales">🥚 Chicken Egg crates sold</option>
                    <option value="Compost manure sales">🪱 composted dark soil bags</option>
                    <option value="Seedling transplants sold">🌱 Nursery sprout tray sales</option>
                  </>
                )}
              </select>
            </div>

            {/* Amount */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-60s uppercase">Amount ({currencySymbol} / Local cash)</label>
              <input
                type="number"
                required
                min="0.5"
                step="0.5"
                placeholder="Total sum..."
                value={finAmount}
                onChange={(e) => setFinAmount(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 text-slate-800"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Optional Note</label>
              <input
                type="text"
                placeholder="e.g. bought 2 bags silage..."
                value={finDesc}
                onChange={(e) => setFinDesc(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              id="add-ledger-record-btn"
              type="submit"
              className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Record Book Entry
            </button>
          </form>
        </div>

        {/* Ledger display list column */}
        <div className="lg:col-span-12 xl:col-span-7 bg-white border rounded-2xl p-6 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center justify-between">
            <span>📋 Ledger Record Book Entries</span>
            <span className="text-[10px] text-slate-400 font-mono">Total {finances.length} records</span>
          </h4>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {finances.length > 0 ? (
              finances.map((rec) => (
                <div 
                  key={rec.id} 
                  className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl hover:shadow-xs border border-slate-200/50"
                >
                  <div className="flex items-center gap-3 font-sans">
                    <span className="text-sm">{rec.type === 'income' ? '📥' : '📤'}</span>
                    <div>
                      <strong className="block text-xs text-slate-805 font-bold leading-tight">{rec.category}</strong>
                      <span className="text-[10px] text-slate-405">{rec.date} | </span>
                      <span className="text-[10px] text-slate-500 italic font-medium">{rec.description}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold font-mono ${
                      rec.type === 'income' ? 'text-emerald-700' : 'text-red-700'
                    }`}>
                      {rec.type === 'income' ? '+' : '-'}{currencySymbol} {rec.amount}
                    </span>
                    <button
                      onClick={() => deleteFinance(rec.id, rec.category)}
                      className="text-slate-400 hover:text-red-600 transition p-1 rounded-lg hover:bg-red-50"
                      title="Remove record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 border-2 border-dashed rounded-xl text-center text-slate-400 font-sans text-xs">
                No ledger records found. Fill the form on the left!
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Activities & Yield log section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t pt-8">
        
        {/* Yield entry form */}
        <div className="lg:col-span-5 bg-white border rounded-2xl p-6 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center gap-1">
            🔏 Log Daily Yield / Activity
          </h4>

          <form onSubmit={addActivityRecord} className="space-y-4" id="add-activity-form">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Sector Group</label>
              <select
                value={actType}
                onChange={(e) => setActType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-50 font-sans focus:outline-none"
              >
                <option value="crop">🌱 Plant Crop Field Activity</option>
                <option value="livestock">🐄 Livestock Feeding/Vaccine</option>
                <option value="general">⚒️ General Pen Repairs/Sales</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Activity Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Milk extraction, Pruned tomatoes..."
                className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-emerald-500"
                value={actTitle}
                onChange={(e) => setActTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Yield Quantity (if any)</label>
              <input
                type="text"
                placeholder="e.g. 15 Liters, 4 crates, 2 bags..."
                className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-emerald-500"
                value={actQty}
                onChange={(e) => setActQty(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Details</label>
              <textarea
                placeholder="Details of what was done..."
                className="w-full px-3 py-2 border rounded-xl text-xs h-16 resize-none focus:ring-1 focus:ring-emerald-500"
                value={actDetails}
                onChange={(e) => setActDetails(e.target.value)}
              />
            </div>

            <button
              id="add-activity-record-btn"
              type="submit"
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shadow"
            >
              <Plus className="w-4 h-4" /> Save Activity Book Entry
            </button>
          </form>
        </div>

        {/* Yield list logs display */}
        <div className="lg:col-span-12 xl:col-span-7 bg-white border rounded-2xl p-6 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center justify-between">
            <span>📋 Farm Activity & Yield Log Notes</span>
            <span className="text-[10px] text-slate-400 font-mono">Total {activities.length} records</span>
          </h4>

          <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
            {activities.length > 0 ? (
              activities.map((act) => (
                <div key={act.id} className="p-4 bg-slate-50 rounded-xl hover:shadow-xs border font-sans space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-indigo-850 bg-indigo-50 px-2 py-0.5 rounded mr-1.5 border border-indigo-100/50">
                        {act.type}
                      </span>
                      <strong className="text-xs text-slate-805 font-bold">{act.title}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-mono">{act.date}</span>
                      <button
                        onClick={() => deleteActivity(act.id, act.title)}
                        className="text-slate-400 hover:text-red-650 transition p-1 rounded-lg"
                        title="Remove activity entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">{act.details}</p>
                  {act.quantity && (
                    <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-900 border border-emerald-110/60 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">
                      💡 Measured Yield: {act.quantity}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 border-2 border-dashed rounded-xl text-center text-slate-400 font-sans text-xs">
                No activity records logged. Use the form on the left!
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
