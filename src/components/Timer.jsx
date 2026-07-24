import { useEffect, useState, useRef } from 'react';
import useExamStore from '../store/useExamStore';
import { Clock } from 'lucide-react';
import { submitToGoogleSheets } from '../services/api';
import { useNavigate } from 'react-router-dom';

const EXAM_DURATION_MS = 60 * 60 * 1000; // 60 minutes

export default function Timer() {
  const { examStarted, startTime, submitted, submitExam, studentInfo, answers, tabSwitches } = useExamStore();
  const navigate = useNavigate();
  const submittingRef = useRef(false);

  // Lazy init: calculate remaining time immediately from startTime so timer
  // continues correctly when remounting in Section 3
  const [timeLeft, setTimeLeft] = useState(() => {
    if (!startTime) return EXAM_DURATION_MS;
    const remaining = EXAM_DURATION_MS - (Date.now() - startTime);
    return Math.max(0, remaining);
  });

  useEffect(() => {
    if (!examStarted || submitted || !startTime) return;

    const tick = () => {
      const remaining = EXAM_DURATION_MS - (Date.now() - startTime);
      if (remaining <= 0) {
        setTimeLeft(0);
        handleAutoSubmit();
      } else {
        setTimeLeft(remaining);
      }
    };

    // Fire immediately so display is correct on first render
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [examStarted, startTime, submitted]);

  const handleAutoSubmit = async () => {
    if (submitted || submittingRef.current) return;
    submittingRef.current = true;
    submitExam();
    try {
      await submitToGoogleSheets({
        studentInfo,
        answers,
        tabSwitches,
        remainingTime: '00:00',
      });
      navigate('/success');
    } catch (error) {
      console.error(error);
      alert('ម៉ោងអស់ហើយ! មានបញ្ហាក្នុងការបញ្ជូន។ សូមទាក់ទងគ្រូ!');
    }
  };

  if (!examStarted) return null;

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const isLowTime = timeLeft < 5 * 60 * 1000; // < 5 min

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold shadow-lg transition-all duration-300 ${
      isLowTime
        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white animate-pulse shadow-red-600/40'
        : 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-red-500/30'
    }`}>
      <Clock size={16} className="text-white flex-shrink-0" />
      <span className="text-sm tracking-wider">
        {hours > 0 && `${String(hours).padStart(2, '0')}:`}
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
