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
    setLines(newLines);
  }, [matches, shuffledRight]);

  // Update lines when matches change, options shuffle, or window resizes
  useEffect(() => {
    // We use a small timeout to let the DOM paint the updated border/colors before getting rects.
    // Also, when animating scale, the rect might shift slightly, but this is acceptable.
    const timeout = setTimeout(updateLines, 50);
    window.addEventListener('resize', updateLines);
    // Observe DOM changes (like layout shifts)
    const observer = new ResizeObserver(() => updateLines());
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updateLines);
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
    if (selectedRight) {
      // Right was selected first → now completing the match
      createMatch(leftText, selectedRight);
    } else {
      // Toggle left selection
      setSelectedLeft(prev => prev === leftText ? null : leftText);
    }
  };

  const handleRightClick = (rightText) => {
    if (selectedLeft) {
      // Left was selected first → completing the match
      createMatch(selectedLeft, rightText);
    } else {
      // Toggle right selection
      setSelectedRight(prev => prev === rightText ? null : rightText);
    }
  };

  const handleUnmatch = (e, leftText) => {
    e.stopPropagation();
    const newMatches = { ...matches };
    delete newMatches[leftText];
    onSelect(Object.keys(newMatches).length > 0 ? newMatches : null);
    if (selectedLeft === leftText) setSelectedLeft(null);
    if (selectedRight && matches[leftText] === selectedRight) setSelectedRight(null);
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

  return (
    <div className="w-full mt-4 select-none relative" ref={containerRef}>
      
      {/* SVG Canvas for Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ minHeight: '100%' }}>
        {lines.map((line) => {
          // Calculate Bezier curve control points
          // To make a smooth S-curve connecting them horizontally:
          const controlPointOffsetX = Math.abs(line.endX - line.startX) * 0.5;
          const cp1x = line.startX + controlPointOffsetX;
          const cp1y = line.startY;
          const cp2x = line.endX - controlPointOffsetX;
          const cp2y = line.endY;

          // If stacked vertically (mobile), the curve might look a bit weird, 
          // we adjust control points to make a generic nice curve.
          const isStacked = line.startX > line.endX - 50; 
          
          const pathD = isStacked
            ? `M ${line.startX} ${line.startY} C ${line.startX} ${line.startY + 50}, ${line.endX} ${line.endY - 50}, ${line.endX} ${line.endY}`
            : `M ${line.startX} ${line.startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${line.endX} ${line.endY}`;

          return (
            <g key={line.id}>
              {/* Outer stroke for depth */}
              <path
                d={pathD}
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                className="opacity-60"
              />
              {/* Inner colored stroke */}
              <path
                d={pathD}
                fill="none"
                stroke={line.color}
                strokeWidth="4"
                strokeLinecap="round"
                className="animate-in fade-in duration-500 shadow-sm"
                strokeDasharray="1000"
                strokeDashoffset="0"
                style={{ animation: 'dash 0.5s ease-out forwards' }}
              />
              <circle cx={line.startX} cy={line.startY} r="5" fill={line.color} stroke="white" strokeWidth="2" />
              <circle cx={line.endX} cy={line.endY} r="5" fill={line.color} stroke="white" strokeWidth="2" />
            </g>
          );
        })}
        <style>{`
          @keyframes dash {
            from { stroke-dashoffset: 1000; }
            to { stroke-dashoffset: 0; }
          }
        `}</style>
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
            // Rematch: already matched but selected again to swap
            const isRematch = isMatched && isSelectedL;

            return (
              <div key={pair.left} className="relative group">
                <button
                  ref={(el) => (leftRefs.current[pair.left] = el)}
                  onClick={() => handleLeftClick(pair.left)}
                  className={`w-full flex items-center justify-between px-1.5 py-1.5 sm:px-3 sm:py-3 md:px-4 md:py-3 rounded-xl transition-all duration-300 border-2 text-left shadow-sm min-h-[44px] md:min-h-[64px] ${
                    isRematch
                      ? `${colorObj.bg} ${colorObj.border} ring-2 ring-offset-1 ring-blue-400 scale-[1.02] shadow-md`
                      : isMatched
                        ? `${colorObj.bg} ${colorObj.border} shadow-md`
                        : isSelectedL
                          ? 'border-blue-400 bg-blue-50 shadow-blue-500/20 scale-[1.02] ring-2 ring-blue-400/20'
                          : isWaiting
                            ? 'border-purple-300 bg-purple-50/60 hover:border-purple-400 hover:bg-purple-100 cursor-pointer hover:shadow-md'
                            : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md hover:bg-slate-50'
                  }`}
                >
                  <span className={`font-semibold text-[10px] sm:text-sm md:text-base leading-tight ${
                    isMatched ? colorObj.text : isSelectedL ? 'text-blue-700' : isWaiting ? 'text-purple-700' : 'text-slate-700'
                  }`}>
                    {pair.left}
                  </span>

                  {isMatched && !isRematch && (
                    <div
                      onClick={(e) => handleUnmatch(e, pair.left)}
                      className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-white/80 hover:bg-red-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                    >
                      <Unlink size={12} className="md:w-3.5 md:h-3.5" />
                    </div>
                  )}
                  {isRematch && (
                    <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping" />
                  )}
                  {!isMatched && isSelectedL && (
                    <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                  )}
                  {!isMatched && isWaiting && !isSelectedL && (
                    <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse" />
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
            // When left is selected, ALL right items are clickable targets (even matched)
            const isTarget = !!selectedLeft && !isSelectedR;

            return (
              <div key={index} className="relative">
                <button
                  ref={(el) => (rightRefs.current[rightText] = el)}
                  onClick={() => handleRightClick(rightText)}
                  className={`w-full flex items-center justify-between px-1.5 py-1.5 sm:px-3 sm:py-3 md:px-4 md:py-3 rounded-xl transition-all duration-300 border-2 text-left shadow-sm min-h-[44px] md:min-h-[64px] ${
                    isRematch
                      ? `${colorObj.bg} ${colorObj.border} ring-2 ring-offset-1 ring-purple-400 scale-[1.02] shadow-md`
                      : isMatched && isTarget
                        ? `${colorObj.bg} ${colorObj.border} opacity-70 hover:opacity-100 hover:ring-2 hover:ring-blue-300 cursor-pointer`
                      : isMatched
                        ? `${colorObj.bg} ${colorObj.border} shadow-md`
                        : isSelectedR
                          ? 'border-purple-400 bg-purple-50 shadow-purple-500/20 scale-[1.02] ring-2 ring-purple-400/20'
                          : isTarget
                            ? 'border-blue-200 bg-blue-50/50 hover:border-blue-400 hover:bg-blue-100 cursor-pointer hover:shadow-md'
                            : 'border-slate-200 bg-white hover:border-purple-300 hover:shadow-md hover:bg-slate-50 cursor-pointer'
                  }`}
                >
                  <span className={`font-medium text-[10px] sm:text-sm md:text-base leading-tight pr-1 ${
                    isMatched ? colorObj.text : isSelectedR ? 'text-purple-700' : isTarget ? 'text-slate-800' : 'text-slate-700'
                  }`}>
                    {rightText}
                  </span>

                  {isMatched && !isRematch && (
                    <div
                      onClick={(e) => {
                        const matchedLeft = Object.keys(matches).find(l => matches[l] === rightText);
                        if (matchedLeft) handleUnmatch(e, matchedLeft);
                      }}
                      className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-white/80 hover:bg-red-100 flex items-center justify-center transition-colors shadow-sm cursor-pointer group/unmatch"
                    >
                      <Check size={12} className={`md:w-4 md:h-4 ${colorObj.text} group-hover/unmatch:text-red-500`} />
                    </div>
                  )}
                  {isRematch && (
                    <div className="w-3 h-3 rounded-full bg-purple-500 animate-ping" />
                  )}
                  {!isMatched && isSelectedR && (
                    <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}
