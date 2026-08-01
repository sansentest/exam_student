import { useState, useEffect, useRef, useCallback } from 'react';
import { Link2, Unlink, Check } from 'lucide-react';

const COLORS = [
  { bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-700', stroke: '#ef4444' },
  { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-700', stroke: '#3b82f6' },
  { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-700', stroke: '#22c55e' },
  { bg: 'bg-purple-50', border: 'border-purple-400', text: 'text-purple-700', stroke: '#a855f7' },
  { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-700', stroke: '#f97316' },
  { bg: 'bg-teal-50', border: 'border-teal-400', text: 'text-teal-700', stroke: '#14b8a6' }
];

export default function MatchingQuestion({ question, selectedOption, onSelect }) {
  // matches: { [leftText]: rightText }
  const matches = selectedOption || {};
  
  const [shuffledRight, setShuffledRight] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [lines, setLines] = useState([]);

  const containerRef = useRef(null);
  const leftRefs = useRef({});
  const rightRefs = useRef({});

  useEffect(() => {
    // Shuffle the right side items only once when the question mounts
    const rightItems = question.pairs.map(p => p.right);
    for (let i = rightItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rightItems[i], rightItems[j]] = [rightItems[j], rightItems[i]];
    }
    setShuffledRight(rightItems);
  }, [question.pairs]);

  const updateLines = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const newLines = [];
    Object.entries(matches).forEach(([leftText, rightText]) => {
      const leftEl = leftRefs.current[leftText];
      const rightEl = rightRefs.current[rightText];
      
      if (leftEl && rightEl) {
        const leftRect = leftEl.getBoundingClientRect();
        const rightRect = rightEl.getBoundingClientRect();
        
        // Ensure elements are visible/mounted properly
        if (leftRect.width === 0 || rightRect.width === 0) return;

        // Calculate anchor points relative to the container
        // Left side uses right edge, Right side uses left edge.
        // We use Math.max/min to avoid negative issues if wrapped differently, but standard flex grid works fine.
        let startX = leftRect.right - containerRect.left;
        let startY = leftRect.top + (leftRect.height / 2) - containerRect.top;
        
        let endX = rightRect.left - containerRect.left;
        let endY = rightRect.top + (rightRect.height / 2) - containerRect.top;
        
        // For mobile (stacked vertically), lines should go from bottom of left to top of right.
        // If startX >= endX, they are likely stacked or wrapped incorrectly.
        // We will just draw a generic curve, it will look fine even if stacked.
        
        const matchIndex = Object.keys(matches).indexOf(leftText);
        const strokeColor = COLORS[matchIndex % COLORS.length].stroke;
        
        newLines.push({ id: `${leftText}-${rightText}`, startX, startY, endX, endY, color: strokeColor });
      }
    });

    setLines((prev) => {
      if (
        prev.length === newLines.length &&
        prev.every((item, i) =>
          item.id === newLines[i].id &&
          Math.abs(item.startX - newLines[i].startX) < 1 &&
          Math.abs(item.startY - newLines[i].startY) < 1 &&
          Math.abs(item.endX - newLines[i].endX) < 1 &&
          Math.abs(item.endY - newLines[i].endY) < 1
        )
      ) {
        return prev;
      }
      return newLines;
    });
  }, [matches, shuffledRight]);

  // Update lines when matches change, options shuffle, or window resizes
  useEffect(() => {
    const timeout1 = setTimeout(updateLines, 50);
    const timeout2 = setTimeout(updateLines, 200);
    const timeout3 = setTimeout(updateLines, 500);
    window.addEventListener('resize', updateLines);
    window.addEventListener('scroll', updateLines, { passive: true });
    const observer = new ResizeObserver(() => updateLines());
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      window.removeEventListener('resize', updateLines);
      window.removeEventListener('scroll', updateLines);
      observer.disconnect();
    };
  }, [updateLines]);

  // Helper: create a match between leftText and rightText
  const createMatch = (leftText, rightText) => {
    const newMatches = { ...matches };
    // Remove any existing match for leftText
    delete newMatches[leftText];
    // Remove if rightText is already matched to another leftText
    Object.keys(newMatches).forEach(l => {
      if (newMatches[l] === rightText) delete newMatches[l];
    });
    newMatches[leftText] = rightText;
    onSelect(Object.keys(newMatches).length > 0 ? newMatches : null);
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const handleLeftClick = (leftText) => {
    if (selectedLeft === leftText) {
      setSelectedLeft(null);
      return;
    }
    if (selectedRight) {
      createMatch(leftText, selectedRight);
    } else {
      setSelectedLeft(leftText);
    }
  };

  const handleRightClick = (rightText) => {
    if (selectedRight === rightText) {
      setSelectedRight(null);
      return;
    }
    if (selectedLeft) {
      createMatch(selectedLeft, rightText);
    } else {
      setSelectedRight(rightText);
    }
  };

  const handleUnmatch = (e, leftText) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const newMatches = { ...matches };
    delete newMatches[leftText];
    onSelect(Object.keys(newMatches).length > 0 ? newMatches : null);
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const getColorObject = (leftText) => {
    const matchIndex = Object.keys(matches).indexOf(leftText);
    if (matchIndex === -1) return null;
    return COLORS[matchIndex % COLORS.length];
  };

  const getRightColorObject = (rightText) => {
    const leftText = Object.keys(matches).find(l => matches[l] === rightText);
    if (!leftText) return null;
    return getColorObject(leftText);
  };

  const answeredCount = Object.keys(matches).length;
  const totalCount = question.pairs.length;

  return (
    <div className="w-full space-y-4 md:space-y-6 select-none">
      
      {/* Helper instruction banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-xl p-3 md:p-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-500 text-white p-1.5 rounded-lg shadow-sm">
            <Link2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs md:text-sm font-bold text-blue-900">
              ចុចជ្រើសរើសចម្លើយខាងឆ្វេង ហើយចុចផ្គូផ្គងជាមួយចម្លើយខាងស្តាំ
            </p>
            <p className="text-[11px] text-blue-600 hidden sm:block">
              អ្នកអាចចុចលើសញ្ញាខ្វែង ✖ ដើម្បីលុបការផ្គូផ្គងវិញបាន
            </p>
          </div>
        </div>
        <div className="bg-white px-3 py-1 rounded-lg border border-blue-200 shadow-sm text-xs font-bold text-blue-700 flex-shrink-0">
          {answeredCount} / {totalCount} គូ
        </div>
      </div>

      <div className="relative w-full min-h-[220px] sm:min-h-[260px]" ref={containerRef}>
        
        {/* SVG Canvas for Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ minHeight: '100%' }}>
          {lines.map((line) => {
            const controlPointOffsetX = Math.max(20, Math.abs(line.endX - line.startX) * 0.4);
            const cp1x = line.startX + controlPointOffsetX;
            const cp1y = line.startY;
            const cp2x = line.endX - controlPointOffsetX;
            const cp2y = line.endY;

            const pathD = `M ${line.startX} ${line.startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${line.endX} ${line.endY}`;

            return (
              <g key={line.id}>
                <path
                  d={pathD}
                  fill="none"
                  stroke="white"
                  strokeWidth="7"
                  strokeLinecap="round"
                  className="opacity-75"
                />
                <path
                  d={pathD}
                  fill="none"
                  stroke={line.color}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx={line.startX} cy={line.startY} r="4" fill={line.color} stroke="white" strokeWidth="2" />
                <circle cx={line.endX} cy={line.endY} r="4" fill={line.color} stroke="white" strokeWidth="2" />
              </g>
            );
          })}
        </svg>

        <div className="grid grid-cols-2 gap-8 sm:gap-12 md:gap-24 relative z-10">
          
          {/* Left Column */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-slate-700 mb-3 text-center pb-2 border-b-2 border-slate-100">គ្រឿងបន្លាស់</h4>
            {question.pairs.map((pair) => {
              const colorObj = getColorObject(pair.left);
              const isMatched = !!colorObj;
              const isSelectedL = selectedLeft === pair.left;
              const isWaiting = !!selectedRight && !isSelectedL;
              const isRematch = isMatched && isSelectedL;

              return (
                <div key={pair.left} className="relative group">
                  <button
                    type="button"
                    ref={(el) => (leftRefs.current[pair.left] = el)}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLeftClick(pair.left);
                    }}
                    className={`w-full flex items-center justify-between px-2 py-2.5 sm:px-3 sm:py-3 md:px-4 md:py-3 rounded-xl transition-colors duration-150 border-2 text-left shadow-sm min-h-[50px] md:min-h-[64px] touch-manipulation cursor-pointer ${
                      isRematch
                        ? `${colorObj.bg} ${colorObj.border} ring-2 ring-offset-1 ring-blue-400`
                        : isMatched
                          ? `${colorObj.bg} ${colorObj.border}`
                          : isSelectedL
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-400/20'
                            : isWaiting
                              ? 'border-purple-300 bg-purple-50/60 hover:border-purple-400 hover:bg-purple-100'
                              : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`font-semibold text-xs sm:text-sm md:text-base leading-tight pointer-events-none ${
                      isMatched ? colorObj.text : isSelectedL ? 'text-blue-700' : isWaiting ? 'text-purple-700' : 'text-slate-700'
                    }`}>
                      {pair.left}
                    </span>

                    {isMatched && !isRematch && (
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.preventDefault();
                          handleUnmatch(e, pair.left);
                        }}
                        className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/90 hover:bg-red-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm cursor-pointer z-20"
                      >
                        <Unlink size={14} className="md:w-3.5 md:h-3.5 pointer-events-none" />
                      </div>
                    )}
                    {isRematch && (
                      <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping pointer-events-none" />
                    )}
                    {!isMatched && isSelectedL && (
                      <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse pointer-events-none" />
                    )}
                    {!isMatched && isWaiting && !isSelectedL && (
                      <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse pointer-events-none" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right Column */}
        <div className="space-y-3">
          <h4 className="text-base font-bold text-slate-700 mb-3 text-center pb-2 border-b-2 border-slate-100">តួនាទី / អត្ថន័យ</h4>
          {shuffledRight.map((rightText, index) => {
            const colorObj = getRightColorObject(rightText);
            const isMatched = !!colorObj;
            const isSelectedR = selectedRight === rightText;
            const isRematch = isMatched && isSelectedR;
            const isTarget = !!selectedLeft && !isSelectedR;

            return (
              <div key={index} className="relative">
                <button
                  type="button"
                  ref={(el) => (rightRefs.current[rightText] = el)}
                  onClick={(e) => {
                    e.preventDefault();
                    handleRightClick(rightText);
                  }}
                  className={`w-full flex items-center justify-between px-2 py-2.5 sm:px-3 sm:py-3 md:px-4 md:py-3 rounded-xl transition-colors duration-150 border-2 text-left shadow-sm min-h-[50px] md:min-h-[64px] touch-manipulation cursor-pointer ${
                    isRematch
                      ? `${colorObj.bg} ${colorObj.border} ring-2 ring-offset-1 ring-purple-400`
                      : isMatched && isTarget
                        ? `${colorObj.bg} ${colorObj.border} opacity-70 hover:opacity-100 hover:ring-2 hover:ring-blue-300`
                      : isMatched
                        ? `${colorObj.bg} ${colorObj.border}`
                        : isSelectedR
                          ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-400/20'
                          : isTarget
                            ? 'border-blue-200 bg-blue-50/50 hover:border-blue-400 hover:bg-blue-100'
                            : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-slate-50'
                  }`}
                >
                  <span className={`font-medium text-xs sm:text-sm md:text-base leading-tight pr-1 pointer-events-none ${
                    isMatched ? colorObj.text : isSelectedR ? 'text-purple-700' : isTarget ? 'text-slate-800' : 'text-slate-700'
                  }`}>
                    {rightText}
                  </span>

                  {isMatched && !isRematch && (
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const matchedLeft = Object.keys(matches).find(l => matches[l] === rightText);
                        if (matchedLeft) handleUnmatch(e, matchedLeft);
                      }}
                      className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/90 hover:bg-red-100 flex items-center justify-center transition-colors shadow-sm cursor-pointer z-20 group/unmatch"
                    >
                      <Check size={14} className={`md:w-4 md:h-4 ${colorObj.text} group-hover/unmatch:text-red-500 pointer-events-none`} />
                    </div>
                  )}
                  {isRematch && (
                    <div className="w-3 h-3 rounded-full bg-purple-500 animate-ping pointer-events-none" />
                  )}
                  {!isMatched && isSelectedR && (
                    <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse pointer-events-none" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      </div>
    </div>
  );
}
