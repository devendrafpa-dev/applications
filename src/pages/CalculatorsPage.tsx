import React, { useState } from 'react';
import { Calculator, TrendingUp, ArrowRight, ShieldCheck, PieChart, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EasyBackButton } from '../components/EasyBackButton';

export const CalculatorsPage: React.FC = () => {
  const { navigateTo } = useApp();

  const [calcType, setCalcType] = useState<'sip' | 'lumpsum' | 'swp' | 'stepup'>('sip');

  // SIP Calculator State
  const [monthlySip, setMonthlySip] = useState<number>(10000);
  const [sipRate, setSipRate] = useState<number>(14);
  const [sipYears, setSipYears] = useState<number>(15);

  // Lumpsum Calculator State
  const [lumpsumAmt, setLumpsumAmt] = useState<number>(100000);
  const [lumpsumRate, setLumpsumRate] = useState<number>(12);
  const [lumpsumYears, setLumpsumYears] = useState<number>(10);

  // SWP Calculator State
  const [swpInitial, setSwpInitial] = useState<number>(2500000);
  const [swpMonthly, setSwpMonthly] = useState<number>(20000);
  const [swpRate, setSwpRate] = useState<number>(9);
  const [swpYears, setSwpYears] = useState<number>(10);

  // Step-Up SIP Calculator State
  const [stepUpBase, setStepUpBase] = useState<number>(10000);
  const [stepUpPct, setStepUpPct] = useState<number>(10); // 10% annual increase
  const [stepUpRate, setStepUpRate] = useState<number>(14);
  const [stepUpYears, setStepUpYears] = useState<number>(15);

  // Computations
  // 1. Regular SIP
  const iSip = sipRate / 12 / 100;
  const nSip = sipYears * 12;
  const sipInvested = monthlySip * nSip;
  const sipTotal = monthlySip * ((Math.pow(1 + iSip, nSip) - 1) / iSip) * (1 + iSip);
  const sipGain = sipTotal - sipInvested;

  // 2. Lumpsum: A = P * (1 + r)^t
  const lumpsumInvested = lumpsumAmt;
  const lumpsumTotal = lumpsumAmt * Math.pow(1 + lumpsumRate / 100, lumpsumYears);
  const lumpsumGain = lumpsumTotal - lumpsumInvested;

  // 3. SWP: Total withdrawal = monthly * 12 * years
  const swpTotalWithdrawn = swpMonthly * 12 * swpYears;
  // Final value approximation
  let swpRemaining = swpInitial;
  for (let m = 0; m < swpYears * 12; m++) {
    swpRemaining = swpRemaining * (1 + swpRate / 12 / 100) - swpMonthly;
    if (swpRemaining < 0) {
      swpRemaining = 0;
      break;
    }
  }

  // 4. Step-Up SIP:
  let stepUpInvested = 0;
  let stepUpTotal = 0;
  let curMonthly = stepUpBase;
  const iStep = stepUpRate / 12 / 100;
  for (let y = 0; y < stepUpYears; y++) {
    for (let m = 0; m < 12; m++) {
      const remainingMonths = (stepUpYears - y) * 12 - m;
      stepUpInvested += curMonthly;
      stepUpTotal += curMonthly * Math.pow(1 + iStep, remainingMonths);
    }
    curMonthly = curMonthly * (1 + stepUpPct / 100);
  }
  const stepUpGain = stepUpTotal - stepUpInvested;

  return (
    <div className="space-y-6 pb-20">
      
      {/* Easy Back Navigation */}
      <EasyBackButton showBreadcrumb={true} currentPageName="Wealth Calculators" />

      {/* Header Banner */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-[#161b24] via-[#1a2333] to-[#121620] light:from-white light:to-slate-50 light:border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-bold text-white light:text-slate-900">
              Upstox Pro Wealth Calculators
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate future wealth, compound interest, and plan retirement with precision
          </p>
        </div>
      </div>

      {/* Calculator Type Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-800 light:border-slate-200 pb-2">
        {[
          { id: 'sip', label: 'SIP Calculator' },
          { id: 'lumpsum', label: 'Lumpsum Calculator' },
          { id: 'stepup', label: 'Step-Up SIP' },
          { id: 'swp', label: 'SWP (Monthly Income)' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setCalcType(item.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              calcType === item.id
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 light:bg-slate-100 light:text-slate-700 light:hover:bg-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Calculator Content */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {calcType === 'sip' && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Monthly Investment</span>
                  <span className="font-mono tabular-nums font-bold text-base text-emerald-400">
                    ₹{monthlySip.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={monthlySip}
                  onChange={e => setMonthlySip(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Expected Return Rate (p.a)</span>
                  <span className="font-mono tabular-nums font-bold text-base text-teal-400">
                    {sipRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="0.5"
                  value={sipRate}
                  onChange={e => setSipRate(Number(e.target.value))}
                  className="w-full accent-teal-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Time Period (Years)</span>
                  <span className="font-mono tabular-nums font-bold text-base text-cyan-400">
                    {sipYears} Years
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="35"
                  step="1"
                  value={sipYears}
                  onChange={e => setSipYears(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </>
          )}

          {calcType === 'lumpsum' && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Total One-Time Investment</span>
                  <span className="font-mono tabular-nums font-bold text-base text-emerald-400">
                    ₹{lumpsumAmt.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="2000000"
                  step="10000"
                  value={lumpsumAmt}
                  onChange={e => setLumpsumAmt(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Expected Return Rate (p.a)</span>
                  <span className="font-mono tabular-nums font-bold text-base text-teal-400">
                    {lumpsumRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="0.5"
                  value={lumpsumRate}
                  onChange={e => setLumpsumRate(Number(e.target.value))}
                  className="w-full accent-teal-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Time Period (Years)</span>
                  <span className="font-mono tabular-nums font-bold text-base text-cyan-400">
                    {lumpsumYears} Years
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={lumpsumYears}
                  onChange={e => setLumpsumYears(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </>
          )}

          {calcType === 'stepup' && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Initial Monthly SIP</span>
                  <span className="font-mono tabular-nums font-bold text-base text-emerald-400">
                    ₹{stepUpBase.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={stepUpBase}
                  onChange={e => setStepUpBase(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Annual Step-Up Increment</span>
                  <span className="font-mono tabular-nums font-bold text-base text-purple-400">
                    {stepUpPct}% per year
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="1"
                  value={stepUpPct}
                  onChange={e => setStepUpPct(Number(e.target.value))}
                  className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Expected Return Rate (p.a)</span>
                  <span className="font-mono tabular-nums font-bold text-base text-teal-400">
                    {stepUpRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="25"
                  step="0.5"
                  value={stepUpRate}
                  onChange={e => setStepUpRate(Number(e.target.value))}
                  className="w-full accent-teal-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Time Period</span>
                  <span className="font-mono tabular-nums font-bold text-base text-cyan-400">
                    {stepUpYears} Years
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={stepUpYears}
                  onChange={e => setStepUpYears(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </>
          )}

          {calcType === 'swp' && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Initial Corpus Deposited</span>
                  <span className="font-mono tabular-nums font-bold text-base text-emerald-400">
                    ₹{swpInitial.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="10000000"
                  step="100000"
                  value={swpInitial}
                  onChange={e => setSwpInitial(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Monthly Withdrawal</span>
                  <span className="font-mono tabular-nums font-bold text-base text-amber-400">
                    ₹{swpMonthly.toLocaleString('en-IN')}/month
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="1000"
                  value={swpMonthly}
                  onChange={e => setSwpMonthly(Number(e.target.value))}
                  className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Expected Fund Return Rate</span>
                  <span className="font-mono tabular-nums font-bold text-base text-teal-400">
                    {swpRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="15"
                  step="0.5"
                  value={swpRate}
                  onChange={e => setSwpRate(Number(e.target.value))}
                  className="w-full accent-teal-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Time Period</span>
                  <span className="font-mono tabular-nums font-bold text-base text-cyan-400">
                    {swpYears} Years
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="1"
                  value={swpYears}
                  onChange={e => setSwpYears(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </>
          )}
        </div>

        {/* Results Card (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/90 light:bg-slate-100 border border-slate-800 light:border-slate-200 space-y-5">
          <div>
            <span className="text-xs text-slate-400 font-medium block">
              {calcType === 'swp' ? 'Remaining Corpus After Withdrawals' : 'Expected Total Wealth'}
            </span>
            <span className="font-mono tabular-nums text-3xl font-black text-white light:text-slate-900 block mt-1">
              ₹{Math.round(
                calcType === 'sip' ? sipTotal :
                calcType === 'lumpsum' ? lumpsumTotal :
                calcType === 'stepup' ? stepUpTotal :
                swpRemaining
              ).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-800 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Total Invested Amount:</span>
              <span className="font-bold text-slate-200 light:text-slate-800">
                ₹{Math.round(
                  calcType === 'sip' ? sipInvested :
                  calcType === 'lumpsum' ? lumpsumInvested :
                  calcType === 'stepup' ? stepUpInvested :
                  swpInitial
                ).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">
                {calcType === 'swp' ? 'Total Withdrawn Income:' : 'Estimated Compound Wealth Gains:'}
              </span>
              <span className="font-bold text-emerald-400 text-sm">
                +₹{Math.round(
                  calcType === 'sip' ? sipGain :
                  calcType === 'lumpsum' ? lumpsumGain :
                  calcType === 'stepup' ? stepUpGain :
                  swpTotalWithdrawn
                ).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigateTo('mutual-funds')}
            className="w-full py-3 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-500 text-white transition-all flex items-center justify-center gap-2 shadow-sm shadow-purple-900/30"
          >
            <span>Start Direct SIP on Upstox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
