import { useAntiCheat } from '../hooks/useAntiCheat';
import { AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AntiCheatOverlay() {
  const { isPenalized, warningMessage, penaltyRemainingMs } = useAntiCheat();
  const [timeLeft, setTimeLeft] = useState(penaltyRemainingMs);

  useEffect(() => {
    if (!isPenalized) return;
    
    setTimeLeft(penaltyRemainingMs);
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPenalized, penaltyRemainingMs]);

  if (!isPenalized) return null;

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-red-900/95 text-white">
      <AlertTriangle className="w-20 h-20 mb-6 text-yellow-400 animate-pulse" />
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">ចំណាំការព្រមាន!</h1>
      <p className="text-xl md:text-2xl mb-8 text-center max-w-2xl">
        {warningMessage}
      </p>
      
      <div className="bg-black/40 px-8 py-6 rounded-2xl shadow-xl flex flex-col items-center">
        <p className="text-gray-300 mb-2">ពេលវេលាដែលនៅសល់៖</p>
        <div className="text-5xl md:text-6xl font-mono font-bold text-yellow-400">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>
      
      <p className="mt-8 text-sm text-gray-400 text-center">
        *ម៉ោងប្រឡងនៅតែបន្តដើរធម្មតា។ សូមរង់ចាំរហូតដល់ចប់ការពិន័យ។
      </p>
    </div>
  );
}
