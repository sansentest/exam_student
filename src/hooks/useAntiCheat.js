import React, { useEffect, useState, useRef } from 'react';
import useExamStore from '../store/useExamStore';

const PENALTY_DURATION_MS = 2 * 1000; // 2 seconds

export const useAntiCheat = () => {
  const { 
    examStarted, 
    submitted,
    incrementTabSwitches, 
    tabSwitches,
    penaltyEndTime,
    setPenaltyEndTime
  } = useExamStore();
  
  const [warningMessage, setWarningMessage] = useState('');
  const lastViolationTime = useRef(0);

  // Check if currently under penalty
  const isPenalized = penaltyEndTime && Date.now() < penaltyEndTime;
  const penaltyRemainingMs = isPenalized ? penaltyEndTime - Date.now() : 0;

  useEffect(() => {
    if (!examStarted || submitted) return;

    // 1. Prevent Right-Click
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // 2. Prevent Copy/Cut/Paste
    const handleCopyPaste = (e) => {
      e.preventDefault();
    };

    // 3. Prevent specific Keyboard Shortcuts (F12, Ctrl+C, etc)
    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') || 
        (e.ctrlKey && e.key === 'c') ||
        (e.ctrlKey && e.key === 'v')
      ) {
        e.preventDefault();
      }
    };

    // 4. Tab Visibility and Blur (Minimize/Switch app)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation();
      }
    };

    const handleBlur = () => {
      // On mobile, blur sometimes triggers when interacting with browser UI.
      // But we will use it carefully.
      handleViolation();
    };

    const handleViolation = () => {
      const now = Date.now();
      // Prevent double counting if blur and visibilitychange fire at the same time (within 1 second)
      if (now - lastViolationTime.current < 1000) return;
      lastViolationTime.current = now;

      incrementTabSwitches();
      // Apply 2-minute penalty
      const newPenaltyEnd = now + PENALTY_DURATION_MS;
      setPenaltyEndTime(newPenaltyEnd);
      setWarningMessage('បម្រាម៖ ហាមចាកចេញពីផ្ទាំងប្រឡង (Switch Tabs) ឬប្តូរកម្មវិធី។ នោះវានឹងចាប់ ២ នាទី ដោយស្វ័យប្រវត្តិ។');
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('cut', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('cut', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [examStarted, submitted, incrementTabSwitches, setPenaltyEndTime]);

  // Clear warning when penalty is over
  useEffect(() => {
    let interval;
    if (isPenalized) {
      interval = setInterval(() => {
        if (Date.now() >= penaltyEndTime) {
          setWarningMessage('');
          setPenaltyEndTime(null);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPenalized, penaltyEndTime, setPenaltyEndTime]);

  return { isPenalized, warningMessage, penaltyRemainingMs, tabSwitches };
};
