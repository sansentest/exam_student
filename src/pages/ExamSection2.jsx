import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '../data/questions';
import useExamStore from '../store/useExamStore';
import { useAntiCheat } from '../hooks/useAntiCheat';

import Timer from '../components/Timer';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';
import AntiCheatOverlay from '../components/AntiCheatOverlay';
import {
  ChevronLeft, ChevronRight, ArrowRight, User,
  ClipboardList, AlertCircle
} from 'lucide-react';


/* ── Section Transition Overlay (instead of loading spinner) ── */
function SectionTransition() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/90" />
      <div className="relative flex flex-col items-center gap-5 bg-slate-800 border border-slate-700 rounded-[2.5rem] px-12 py-10 shadow-2xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center mb-2">
          <ClipboardList className="w-8 h-8 text-white" />
        </div>
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Section ទី ២ ចប់</p>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">កំពុងឆ្លងទៅ Section ៣</h2>
        <p className="text-white/70 text-sm">សំណួរសរសេរ — ម៉ោងប្រឡងបន្ត</p>
        <div className="flex gap-2 mt-2">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-white/50 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ExamSection2() {
  const navigate = useNavigate();
  const { examStarted, studentInfo, answers, setAnswer } = useExamStore();
  const { isPenalized } = useAntiCheat();
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [shuffledQuestions] = useState(() => {
    const shuffled = [...questions].map(q => {
      if (!q.options) return { ...q };
      const newOptions = [...q.options];
      for (let i = newOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newOptions[i], newOptions[j]] = [newOptions[j], newOptions[i]];
      }
      return { ...q, options: newOptions };
    });
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  useEffect(() => {
    if (!examStarted) navigate('/');
  }, [examStarted, navigate]);

  const currentQuestion = shuffledQuestions[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === shuffledQuestions.length - 1;
  const isFirstQuestion = currentQuestionIdx === 0;
  const answeredCount = Object.keys(answers).filter(k => !k.startsWith('s3_')).length;

  const handleNext = () => {
    const currentAnswer = answers[currentQuestion?.id];
    const isMatching = currentQuestion?.type === 'matching';

    if (isMatching) {
      // For matching: must match ALL pairs
      const totalPairs = currentQuestion.pairs?.length || 0;
      const matchedPairs = currentAnswer ? Object.keys(currentAnswer).length : 0;
      if (matchedPairs < totalPairs) {
        setErrorMsg(`សូម​គូស​ផ្គង​ឱ្យ​គ្រប់​ (${matchedPairs}/${totalPairs} គូ) ជា​មុន​សិន!`);
        setTimeout(() => setErrorMsg(''), 2500);
        return;
      }
    } else {
      // For MCQ: must select one option
      if (!currentAnswer) {
        setErrorMsg('សូម​ឆ្លើយ​សំណួរ​នេះ​ជា​មុន​សិន!');
        setTimeout(() => setErrorMsg(''), 2500);
        return;
      }
    }
    if (!isLastQuestion) setCurrentQuestionIdx(p => p + 1);
  };

  const handleNextSection = () => {
    // Same check for the last question
    const currentAnswer = answers[currentQuestion?.id];
    const isMatching = currentQuestion?.type === 'matching';

    if (isMatching) {
      const totalPairs = currentQuestion.pairs?.length || 0;
      const matchedPairs = currentAnswer ? Object.keys(currentAnswer).length : 0;
      if (matchedPairs < totalPairs) {
        setErrorMsg(`សូម​គូស​ផ្គង​ឱ្យ​គ្រប់​ (${matchedPairs}/${totalPairs} គូ) ជា​មុន​សិន!`);
        setTimeout(() => setErrorMsg(''), 2500);
        return;
      }
    } else {
      if (!currentAnswer) {
        setErrorMsg('សូម​ឆ្លើយ​សំណួរ​នេះ​ជា​មុន​សិន!');
        setTimeout(() => setErrorMsg(''), 2500);
        return;
      }
    }
    setErrorMsg('');
    setTransitioning(true);
    setTimeout(() => navigate('/section-3'), 1800);
  };

  const handlePrev = () => { if (!isFirstQuestion) setCurrentQuestionIdx(p => p - 1); };

  if (!examStarted) return null;
  if (transitioning) return <SectionTransition />;

  return (
    <>
      <AntiCheatOverlay />

      <div className={`min-h-screen bg-transparent flex flex-col items-center pt-3 px-3 pb-6 md:pt-5 md:px-5 ${isPenalized ? 'pointer-events-none blur-sm' : ''}`}>

        {/* Compact Single-Row Header */}
        <div className="w-full max-w-3xl flex items-center gap-3 mb-3 bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-slate-200 flex-shrink-0">
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
            <span className="text-blue-600 font-bold">{answeredCount}</span>&nbsp;/ {shuffledQuestions.length} ឆ្លើយ
          </div>
          <div className="flex-shrink-0">
            <Timer />
          </div>
        </div>

        {/* Question Area */}
        <div className="w-full max-w-3xl">
          <ProgressBar currentStep={2} />

          <div className="mt-3">
            <QuestionCard
              question={currentQuestion}
              selectedOption={answers[currentQuestion?.id]}
              onSelect={(option) => setAnswer(currentQuestion.id, option)}
              questionIndex={currentQuestionIdx}
              totalQuestions={shuffledQuestions.length}
            />
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mt-3 text-sm font-semibold shadow-sm animate-in slide-in-from-top duration-300">
              <AlertCircle size={16} className="flex-shrink-0 text-red-500" />
              {errorMsg}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200/60">
            <button
              onClick={handlePrev}
              disabled={isFirstQuestion}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isFirstQuestion
                  ? 'bg-slate-50 text-slate-300 cursor-not-allowed border border-transparent'
                  : 'bg-white text-slate-700 hover:bg-slate-50 shadow-sm border border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <ChevronLeft size={16} /> ថយក្រោយ
            </button>

            {!isLastQuestion ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-7 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                បន្ទាប់ <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleNextSection}
                className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md shadow-indigo-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Section ទី ៣ <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
