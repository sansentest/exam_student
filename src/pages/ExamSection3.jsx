import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions3 } from '../data/questions3';
import useExamStore from '../store/useExamStore';
import { useAntiCheat } from '../hooks/useAntiCheat';
import { submitToGoogleSheets } from '../services/api';
import Timer from '../components/Timer';
import ProgressBar from '../components/ProgressBar';
import AntiCheatOverlay from '../components/AntiCheatOverlay';
import {
  ChevronLeft, ChevronRight, Send, User,
  AlertTriangle, X, FileText, CheckCircle2, AlertCircle
} from 'lucide-react';

/* ── Final Submit Confirm Modal ── */
function SubmitModal({ onConfirm, onCancel, answeredCount, totalCount }) {
  const allDone = answeredCount >= totalCount;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-[2rem] shadow-2xl shadow-black/25 max-w-sm w-full p-8 border border-white/60">
        <button onClick={onCancel} className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
          <X size={18} />
        </button>

        <div className="flex justify-center mb-5">
          <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center shadow-lg ${
            allDone ? 'bg-emerald-50 border-emerald-200 shadow-emerald-500/20' : 'bg-amber-50 border-amber-200 shadow-amber-500/20'
          }`}>
            {allDone
              ? <CheckCircle2 className="w-8 h-8 text-emerald-500" strokeWidth={2.5} />
              : <AlertTriangle className="w-8 h-8 text-amber-500" strokeWidth={2.5} />
            }
          </div>
        </div>

        <h2 className="text-xl font-extrabold text-slate-800 text-center mb-2 tracking-tight">
          {allDone ? 'ត្រៀមបញ្ជូន!' : 'មានសំណួរមិនទាន់ឆ្លើយ!'}
        </h2>
        <p className="text-slate-500 text-center text-sm leading-relaxed mb-3">
          Section ៣ ៖ <span className="font-bold text-slate-800">{answeredCount}</span> / <span className="font-bold text-slate-800">{totalCount}</span> សំណួរ
        </p>
        {!allDone && (
          <p className="text-slate-500 text-center text-sm mb-4">
            ចម្លើយ Section ១ ២ ៣ <span className="font-semibold text-green-600">ទាំងអស់</span> នឹងបញ្ជូន​ទៅ​ម្ដង
          </p>
        )}
        {allDone && (
          <p className="text-slate-500 text-center text-sm mb-4">
            ចម្លើយ Section <span className="font-bold text-indigo-600">ទី ២ + ទី ៣</span> ទាំងអស់នឹងបញ្ជូន​ ១ ដង
          </p>
        )}

        <div className="w-full bg-slate-100 rounded-full h-1.5 mb-7 overflow-hidden">
          <div className={`h-1.5 rounded-full transition-all duration-500 ${allDone ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}
            style={{ width: `${(answeredCount / totalCount) * 100}%` }} />
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all">
            ត្រឡប់ក្រោយ
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-sm transition-all shadow-lg shadow-green-500/30">
            បញ្ជូនចម្លើយ
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Submitting Full Screen ── */
function SubmittingOverlay() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-blue-900/50 to-indigo-900/60 backdrop-blur-xl" />
      <div className="relative flex flex-col items-center gap-5 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] px-14 py-12 shadow-2xl text-center">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-20 animate-pulse" />
          <div className="w-14 h-14 rounded-full border-4 border-white/20 border-t-white animate-spin" />
          <Send className="absolute w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white text-2xl font-extrabold tracking-tight">កំពុងបញ្ជូន...</p>
          <p className="text-white/60 text-sm mt-1.5">ចំលើយ Section ២ + ៣ ទាំងអស់</p>
        </div>
        <div className="flex gap-2">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-white/50 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ExamSection3() {
  const navigate = useNavigate();
  const { studentInfo, examStarted, answers, tabSwitches, submitExam } = useExamStore();
  const { isPenalized } = useAntiCheat();

  const [textAnswers, setTextAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!examStarted) navigate('/');
  }, [examStarted, navigate]);

  const currentQuestion = questions3[currentIdx];
  const isLast = currentIdx === questions3.length - 1;
  const isFirst = currentIdx === 0;
  const currentAnswer = textAnswers[currentQuestion?.id] || '';
  const isAnswered = currentAnswer.trim().length > 0;
  const answeredCount = questions3.filter(q => textAnswers[q.id]?.trim().length > 0).length;

  const handleTextChange = (id, value) => setTextAnswers(prev => ({ ...prev, [id]: value }));

  const handleNext = () => {
    // Block: must write answer for current question before going to next
    if (!textAnswers[currentQuestion?.id]?.trim()) {
      setErrorMsg('សូមសរសើរ​ចម្លើយ​សំណួរ​នេះ​ជាមុន​សិន!');
      setTimeout(() => setErrorMsg(''), 2500);
      return;
    }
    if (!isLast) setCurrentIdx(p => p + 1);
  };
  const handlePrev = () => { if (!isFirst) setCurrentIdx(p => p - 1); };

  const handleSubmitClick = () => {
    // Only need to check last question (all previous enforced by handleNext)
    if (!textAnswers[currentQuestion?.id]?.trim()) {
      setErrorMsg('សូមសរសើរ​ចម្លើយ​សំណួរ​នេះ​ជាមុន​សិន!');
      setTimeout(() => setErrorMsg(''), 2500);
      return;
    }
    setErrorMsg('');
    setShowSubmitModal(true);
  };

  /* ── ONLY REAL SUBMIT IN THE ENTIRE APP ── */
  const doSubmit = async () => {
    setShowSubmitModal(false);
    setIsSubmitting(true);
    try {
      const formattedSection3 = {};
      questions3.forEach(q => {
        formattedSection3[q.id] = {
          question: q.question,
          answer: textAnswers[q.id] || ""
        };
      });

      await submitToGoogleSheets({
        studentInfo,
        answers: { ...answers, section3: formattedSection3 },
        tabSwitches,
        remainingTime: 'Final Submit',
      });
      submitExam();          // sets submitted: true → stops timer
      navigate('/success');
    } catch {
      setIsSubmitting(false);
      alert('មានបញ្ហាក្នុងការបញ្ជូន។ សូមទាក់ទងគ្រូ!');
    }
  };

  if (!examStarted) return null;
  if (isSubmitting) return <SubmittingOverlay />;
  if (!currentQuestion) return null;

  return (
    <>
      <AntiCheatOverlay />
      {showSubmitModal && (
        <SubmitModal
          answeredCount={answeredCount}
          totalCount={questions3.length}
          onConfirm={doSubmit}
          onCancel={() => setShowSubmitModal(false)}
        />
      )}

      <div className={`min-h-screen bg-transparent flex flex-col items-center pt-3 px-3 pb-6 md:pt-5 md:px-5 ${isPenalized ? 'pointer-events-none blur-sm' : ''}`}>

        {/* Header */}
        <div className="w-full max-w-3xl flex items-center gap-3 mb-3 bg-white/90 backdrop-blur-2xl px-4 py-2.5 rounded-2xl shadow-md border border-white/80 flex-shrink-0">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl text-white shadow-md shadow-blue-500/20 flex-shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-800 text-sm truncate">{studentInfo?.name}</p>
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 truncate max-w-[80px]">ល.រ {studentInfo?.studentCode}</span>
                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">ថ្នាក់{studentInfo?.className}</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 flex-shrink-0">
            <span className="text-blue-600 font-bold">{answeredCount}</span>&nbsp;/ {questions3.length} ឆ្លើយ
          </div>
          <div className="flex-shrink-0">
            <Timer />
          </div>
        </div>

        {/* Content */}
        <div className="w-full max-w-3xl">
          <ProgressBar currentStep={3} />

          <div className="mt-3">
            <div className="relative w-full">
              {/* Glow when answered */}
              {isAnswered && (
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/15 via-indigo-400/15 to-purple-400/15 rounded-[2rem] blur-xl pointer-events-none" />
              )}

              <div className={`relative bg-white/95 backdrop-blur-2xl rounded-2xl border transition-all duration-500 overflow-hidden shadow-lg ${
                isAnswered ? 'border-blue-200/70 shadow-blue-100' : 'border-slate-200/80 shadow-slate-100'
              }`}>
                {/* Accent bar */}
                <div className={`h-1 w-full transition-all duration-700 ${
                  isAnswered ? 'bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500' : 'bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200'
                }`} />

                {/* Card Header */}
                <div className="px-4 pt-4 pb-3 md:px-6 md:pt-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs transition-all duration-500 ${
                      isAnswered ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {currentIdx + 1}
                    </div>
                    <span className="text-xs font-medium text-slate-400">/ {questions3.length}</span>
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1 ml-1">
                      <FileText size={10} /> សំណួរសរសេរ
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-slate-800 leading-snug select-none">
                    {currentQuestion.question}
                  </h3>
                </div>

                <div className="mx-4 md:mx-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                {/* Textarea */}
                <div className="px-4 pb-5 pt-4 md:px-6 md:pb-6">
                  <div className="relative group">
                    <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition duration-500 ${isAnswered ? 'opacity-10' : ''}`} />
                    <textarea
                      value={currentAnswer}
                      onChange={(e) => handleTextChange(currentQuestion.id, e.target.value)}
                      placeholder={currentQuestion.placeholder}
                      rows={6}
                      className={`relative w-full resize-none rounded-xl border-2 px-4 py-3.5 text-sm md:text-base text-slate-800 placeholder:text-slate-300 leading-relaxed transition-all duration-300 outline-none ${
                        isAnswered
                          ? 'border-blue-300 bg-blue-50/20 focus:border-blue-400 focus:bg-white'
                          : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 focus:border-blue-400 focus:bg-white'
                      }`}
                    />
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                      {isAnswered && <CheckCircle2 size={12} className="text-blue-500" />}
                      <span className="text-[10px] font-bold text-slate-400">{currentAnswer.length} អក្សរ</span>
                    </div>
                  </div>

                  {/* Question dots */}
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">ដំណើរការ:</span>
                    <div className="flex gap-2">
                      {questions3.map((q, i) => (
                        <button key={q.id} onClick={() => setCurrentIdx(i)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center ${
                            i === currentIdx
                              ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20 scale-110'
                              : textAnswers[q.id]?.trim().length > 0
                                ? 'bg-blue-50 text-blue-600 border-2 border-blue-200 hover:bg-blue-100'
                                : 'bg-slate-50 text-slate-400 border-2 border-slate-200 hover:border-slate-300'
                          }`}>
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mt-3 text-sm font-semibold shadow-sm animate-in slide-in-from-top duration-300">
              <AlertCircle size={16} className="flex-shrink-0 text-red-500" />
              {errorMsg}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-200/60">
            <button
              onClick={handlePrev}
              disabled={isFirst}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isFirst
                  ? 'bg-slate-50 text-slate-300 cursor-not-allowed border border-transparent'
                  : 'bg-white text-slate-700 hover:bg-slate-50 shadow-sm border border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <ChevronLeft size={16} /> ថយក្រោយ
            </button>

            {!isLast ? (
              <button onClick={handleNext}
                className="flex items-center gap-1.5 px-7 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                បន្ទាប់ <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={handleSubmitClick}
                className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md shadow-green-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                <span>បញ្ជូនចម្លើយ</span><Send size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
