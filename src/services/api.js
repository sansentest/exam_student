// Replace this with your actual Google Apps Script Web App URL
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwkhEvVTJmanxELyS27nvr_n7SNWFuhwFOuY-grrRgz9Q4i-AeBI8bmIvpd5V4e3ptu-A/exec';

import { questions } from '../data/questions';

export const submitToGoogleSheets = async (data) => {
  // We format the data to match the expected Google Sheets columns:
  // Timestamp, Student ID, Name, Gender, Class, Q1, Q2, ..., Score, Submit Time

  let score = 0;

  if (data.answers) {
    questions.forEach(q => {
      const userAnswer = data.answers[q.id];
      if (q.type === 'matching' && typeof userAnswer === 'object') {
        let isCorrect = true;
        let matchedCount = 0;
        for (const key in q.answer) {
          if (userAnswer[key] !== q.answer[key]) {
            isCorrect = false;
          }
          if (userAnswer[key]) matchedCount++;
        }
        if (isCorrect && matchedCount === Object.keys(q.answer).length) {
          score += (q.points || 1);
        }
      } else if (userAnswer === q.answer) {
        score += (q.points || 1);
      }
    });
  }

  const totalScore = questions.reduce((sum, q) => sum + (q.points || 1), 0);

  const payload = {
    ...data.studentInfo,
    answers: data.answers,
    score: score,
    totalScore: totalScore,
    tabSwitches: data.tabSwitches,
    remainingTime: data.remainingTime,
    timestamp: new Date().toISOString()
  };

  let attempt = 0;
  const maxRetries = 3;
  const retryDelayMs = 15000; // 15 seconds

  while (attempt < maxRetries) {
    try {
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const resultData = await response.json();
      if (resultData.result !== 'success') {
        const errorMsg = typeof resultData.error === 'object' 
          ? JSON.stringify(resultData.error) 
          : (resultData.error || 'Unknown error from script');
        throw new Error(errorMsg);
      }

      return resultData; // Success
    } catch (error) {
      attempt++;
      console.error(`[Auto Retry] Submission attempt ${attempt} failed:`, error);
      
      if (attempt >= maxRetries) {
        console.error('Max retries reached. Giving up.');
        throw error;
      }
      
      console.log(`Waiting 15 seconds before retrying...`);
      await new Promise(resolve => setTimeout(resolve, retryDelayMs));
    }
  }
};
