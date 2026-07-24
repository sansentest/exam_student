import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useExamStore = create(
  persist(
    (set) => ({
      // User Info
      studentInfo: null,
      setStudentInfo: (info) => set({ studentInfo: info }),

      // Exam State — timer starts when startExam() is called (Section 1 done)
      examStarted: false,
      startTime: null,
      startExam: () => set({
        examStarted: true,
        startTime: Date.now(),
        submitted: false,
        answers: {},
        tabSwitches: 0,
        penaltyEndTime: null,
      }),

      // Answers (Section 2 MCQ stored here during exam)
      answers: {},
      setAnswer: (questionId, answer) =>
        set((state) => {
          if (answer === null || (Array.isArray(answer) && answer.length === 0)) {
            const newAnswers = { ...state.answers };
            delete newAnswers[questionId];
            return { answers: newAnswers };
          }
          return { answers: { ...state.answers, [questionId]: answer } };
        }),

      // Anti-Cheat Stats
      tabSwitches: 0,
      incrementTabSwitches: () => set((state) => ({ tabSwitches: state.tabSwitches + 1 })),

      penaltyEndTime: null,
      setPenaltyEndTime: (time) => set({ penaltyEndTime: time }),

      // Final Submission (Section 3 — one and only submit)
      submitted: false,
      submitExam: () => set({ submitted: true }),

      // Reset
      resetExam: () => set({
        studentInfo: null,
        examStarted: false,
        startTime: null,
        answers: {},
        tabSwitches: 0,
        penaltyEndTime: null,
        submitted: false,
      }),
    }),
    { name: 'exam-storage' }
  )
);

export default useExamStore;
