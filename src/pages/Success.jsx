import useExamStore from '../store/useExamStore';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { CheckCircle2, Home, BookOpen, Clock, Shield, Award, Printer, X } from 'lucide-react';

export default function Success() {
  const { studentInfo, submitted, resetExam } = useExamStore();
  const navigate = useNavigate();
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [showConfetti, setShowConfetti] = useState(true);
  const [visible, setVisible] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    if (!submitted) { navigate('/'); return; }
    setTimeout(() => setVisible(true), 100);
    const handleResize = () =>
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    const t = setTimeout(() => setShowConfetti(false), 6000);
    return () => { clearTimeout(t); window.removeEventListener('resize', handleResize); };
  }, [submitted, navigate]);

  const handleReturnHome = () => { resetExam(); navigate('/'); };

  const stats = [
    { icon: <BookOpen className="w-5 h-5" />, label: 'ប្រភេទការប្រឡង', value: 'ព័ត៌មានវិទ្យា' },
    { icon: <Shield className="w-5 h-5" />, label: 'ស្ថានភាព', value: 'បានផ្ញើ' },
    { icon: <Clock className="w-5 h-5" />, label: 'ពេលវេលា', value: new Date().toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' }) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-pink-200 to-rose-100 flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Aurora Background */}
      <div className="aurora-bg">
        <div className="aurora-glow" />
        <div className="aurora-glow" />
        <div className="aurora-glow" />
      </div>

      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={showConfetti}
          numberOfPieces={280}
          gravity={0.13}
          colors={['#0052D4', '#4364F7', '#6FB1FC', '#fbbf24', '#34d399', '#f472b6']}
        />
      </div>

      {/* ── Certificate Modal ── */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border-4 border-amber-400 relative text-center">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-amber-400 text-amber-600">
              <Award className="w-9 h-9" />
            </div>

            <h2 className="text-xl font-bold text-slate-800 tracking-tight">វិញ្ញាបនបត្របញ្ជាក់ការប្រឡង</h2>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mt-1">វិទ្យាល័យអង្គរកា · ២០២៥-២០២៦</p>

            <div className="my-6 py-5 px-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl">
              <p className="text-xs text-slate-500 mb-1">សូមបញ្ជាក់ថា សិស្សឈ្មោះ៖</p>
              <h3 className="text-2xl font-extrabold text-blue-700">{studentInfo?.name || 'សិស្សានុសិស្ស'}</h3>
              <div className="flex justify-center gap-4 mt-3 text-xs font-bold text-slate-600">
                <span className="bg-white px-3 py-1 rounded-full border border-slate-200">លេខរៀង៖ #{studentInfo?.studentCode || 'N/A'}</span>
                <span className="bg-white px-3 py-1 rounded-full border border-slate-200">ថ្នាក់៖ {studentInfo?.className || 'N/A'}</span>
              </div>
              <p className="text-xs text-emerald-600 font-bold mt-4">
                ✓ បានបញ្ចប់ការប្រឡងមុខវិជ្ជា ព័ត៌មានវិទ្យា ជាស្ថាពរ
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                បោះពុម្ព / រក្សាទុក PDF
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-6 py-3 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                បិទ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Card ── */}
      <div
        className="relative w-full max-w-xl z-10"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(32px)',
          transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* White Card Body */}
        <div className="bg-white/30 backdrop-blur-lg border border-pink-200/30 rounded-2xl shadow-xl p-6 max-w-lg w-full mx-auto animate-fadeInUp">

          {/* Hero Success Area */}
          <div className="relative flex flex-col items-center px-8 pt-10 pb-8 text-center overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-40 bg-gradient-to-b from-white/70 to-transparent rounded-full blur-2xl pointer-events-none" />

            {/* Animated badge */}
            <div className="relative mb-5 z-10">
              <span className="absolute inset-0 rounded-full bg-pink-200 animate-ping opacity-50" />
              <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-white border-4 border-pink-100 shadow-xl shadow-pink-100/60">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-600">
                  <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"
                      style={{ strokeDasharray: 30, strokeDashoffset: 30, animation: 'drawCheck 0.6s ease forwards 0.3s' }} />
                  </svg>
                </div>
              </div>
            </div>

            {/* Status pill */}
            <div className="inline-flex items-center gap-1.5 bg-white/70 border border-pink-200 text-rose-600 text-xs font-semibold px-3 py-1 rounded-full mb-4 z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block animate-pulse" />
              បានបញ្ជូនដោយជោគជ័យ
            </div>

            <h1 className="text-3xl md:text-3xl font-bold text-pink-800 mb-2 z-10">
              បញ្ជូនរួចរាល់!
            </h1>
            <p className="text-pink-900/70 text-sm leading-relaxed max-w-sm z-10 pt-3">
              ចម្លើយរបស់អ្នកត្រូវបានរក្សាទុកដោយជោគជ័យ
            </p>
          </div>

          {/* Stats */}
          <div className="mx-6 mb-5 grid grid-cols-3 gap-3">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2 bg-white/70 border border-pink-100 rounded-xl py-3.5 px-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-pink-100 text-rose-600">
                  {s.icon}
                </div>
                <p className="text-[10px] text-slate-400 font-medium text-center leading-tight">{s.label}</p>
                <p className="text-xs font-bold text-slate-700 text-center">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="px-6 pb-7 space-y-3">
            <button
              onClick={() => setShowCertificate(true)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-white font-bold py-3.5 rounded-xl text-sm shadow-md shadow-amber-500/20 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              មើល ឬបោះពុម្ពប័ណ្ណបញ្ជាក់ការប្រឡង
            </button>

            <button
              onClick={handleReturnHome}
              aria-label="Back to Home"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 hover:brightness-110 text-white font-semibold py-3.5 rounded-xl text-sm shadow-md shadow-pink-500/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:brightness-95 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              ត្រឡប់ទៅទំព័រដើម
            </button>
          </div>

          <style>{`
            @keyframes drawCheck {
              to { stroke-dashoffset: 0; }
            }
          `}</style>
        </div>

        {/* Footer note */}
        <p className="text-center text-slate-400 text-xs mt-5">
          © វិទ្យាល័យអង្គរកា · ២០២៣-២០២៤
        </p>
      </div>
    </div>
  );
}

