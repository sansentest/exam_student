import { CheckCircle2, CheckSquare } from 'lucide-react';
import MatchingQuestion from './MatchingQuestion';

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function QuestionCard({ question, selectedOption, onSelect, questionIndex, totalQuestions }) {
  const handleOptionClick = (option) => {
    if (question.multiSelect) {
      const currentSelected = Array.isArray(selectedOption) ? selectedOption : [];
      const isAlready = currentSelected.includes(option);
      const newSelected = isAlready
        ? currentSelected.filter(i => i !== option)
        : [...currentSelected, option];
      onSelect(newSelected.length > 0 ? newSelected : null);
    } else {
      onSelect(selectedOption === option ? null : option);
    }
  };

  const isAnswered = selectedOption !== undefined && selectedOption !== null &&
    (!Array.isArray(selectedOption) || selectedOption.length > 0);

  return (
    <div className="relative w-full">
      {/* Glow when answered */}
      {isAnswered && (
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/15 via-indigo-400/15 to-purple-400/15 rounded-[2rem] blur-xl pointer-events-none" />
      )}

      <div className={`relative bg-white/95 backdrop-blur-2xl rounded-2xl border transition-all duration-500 overflow-hidden shadow-lg ${
        isAnswered ? 'border-blue-200/70 shadow-blue-100' : 'border-slate-200/80 shadow-slate-100'
      }`}>

        {/* Top accent bar */}
        <div className={`h-1 w-full transition-all duration-700 ${
          isAnswered
            ? 'bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500'
            : 'bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200'
        }`} />

        {/* Header */}
        <div className="px-4 pt-4 pb-3 md:px-6 md:pt-5">
          <div className="flex items-center gap-2 mb-2">
            {/* Question number badge */}
            <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs transition-all duration-500 ${
              isAnswered
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30'
                : 'bg-slate-100 text-slate-500'
            }`}>
              {(questionIndex ?? 0) + 1}
            </div>
            {totalQuestions && (
              <span className="text-xs text-slate-400 font-medium">/ {totalQuestions}</span>
            )}
            {question.type === 'matching' && (
              <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                🔗 គូសផ្គង
              </span>
            )}
            {question.multiSelect && (
              <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                ☑️ ជ្រើសបានច្រើន
              </span>
            )}
          </div>

          {/* Question Text */}
          <h3 className="text-base md:text-lg font-bold text-slate-800 leading-snug select-none">
            {question.question}
          </h3>
        </div>

        {/* Divider */}
        <div className="mx-4 md:mx-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {/* Body */}
        <div className="px-4 pb-4 pt-3 md:px-6 md:pb-5">

          {/* Question Image */}
          {question.image && (
            <div className="mb-3 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
              <img
                src={question.image}
                alt="Question reference"
                className="w-full object-cover hover:scale-105 transition-transform duration-700"
                style={{ maxHeight: '160px' }}
              />
            </div>
          )}

          {/* Matching Type */}
          {question.type === 'matching' ? (
            <MatchingQuestion
              question={question}
              selectedOption={selectedOption}
              onSelect={onSelect}
            />
          ) : question.optionType === 'image' ? (
            /* Image Grid Options */
            <div className="grid grid-cols-2 gap-2.5">
              {question.options.map((option, index) => {
                const isSelected = selectedOption === option;
                return (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-300 focus:outline-none ${
                      isSelected
                        ? 'border-blue-500 shadow-lg shadow-blue-500/20 scale-[1.02]'
                        : 'border-transparent hover:border-blue-300 hover:shadow-md hover:scale-[1.01]'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 bg-blue-500/15 z-10 flex items-center justify-center">
                        <div className="bg-blue-500 rounded-full p-1.5 shadow-lg">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                    <div className="w-full h-28 sm:h-40 bg-slate-100">
                      <img src={option} alt={`Option ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className={`absolute top-2 left-2 z-20 w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold shadow ${
                      isSelected ? 'bg-blue-500 text-white' : 'bg-white/90 text-slate-600'
                    }`}>
                      {OPTION_LABELS[index]}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Standard Text Options */
            <div className="space-y-2">
              {question.options.map((option, index) => {
                const isSelected = question.multiSelect
                  ? Array.isArray(selectedOption) && selectedOption.includes(option)
                  : selectedOption === option;
                const label = OPTION_LABELS[index];

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    className={`group w-full flex items-center gap-3 px-3 py-2.5 md:px-4 md:py-3 rounded-xl border-2 text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                      isSelected
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md shadow-blue-500/10 scale-[1.01]'
                        : 'border-slate-200 bg-slate-50/80 hover:bg-white hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    {/* Label badge */}
                    <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isSelected
                        ? 'bg-blue-500 text-white shadow-sm shadow-blue-500/30'
                        : 'bg-white text-slate-500 border border-slate-200 group-hover:border-blue-300 group-hover:text-blue-500'
                    }`}>
                      {isSelected
                        ? (question.multiSelect ? <CheckSquare className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />)
                        : label}
                    </div>

                    {/* Option text */}
                    <span className={`flex-1 text-sm md:text-base leading-snug font-medium select-none transition-colors ${
                      isSelected ? 'text-blue-900' : 'text-slate-700 group-hover:text-slate-900'
                    }`}>
                      {option}
                    </span>

                    {isSelected && !question.multiSelect && (
                      <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mr-1" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
