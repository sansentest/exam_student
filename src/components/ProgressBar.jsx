import { CheckCircle2, ClipboardList, PenLine, User } from 'lucide-react';

const steps = [
  { label: 'ព័ត៌មានសិស្ស', icon: User },
  { label: 'សំណួរ QCM', icon: ClipboardList },
  { label: 'សំណួរសរសេរ', icon: PenLine },
];

export default function ProgressBar({ currentStep }) {
  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 z-0 mx-8" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 z-0 transition-all duration-700 mx-8"
          style={{ width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 0px)` }}
        />

        {steps.map((step, i) => {
          const stepNum = i + 1;
          const isDone = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          const Icon = step.icon;

          return (
            <div key={i} className="flex flex-col items-center z-10 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${
                isDone
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-400/30'
                  : isActive
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/30 ring-4 ring-blue-100'
                    : 'bg-slate-100 border-2 border-slate-200'
              }`}>
                {isDone
                  ? <CheckCircle2 size={20} className="text-white" strokeWidth={2.5} />
                  : <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                }
              </div>
              <span className={`mt-1.5 text-[10px] font-bold tracking-wide text-center ${
                isDone ? 'text-emerald-600' : isActive ? 'text-blue-600' : 'text-slate-400'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
