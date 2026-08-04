# 🎓 IT Student Examination System (Interactive Exam Portal)

![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?style=for-the-badge&logo=tailwind-css)
![Google Apps Script](https://img.shields.io/badge/Google_Apps_Script-Serverless-4285F4?style=for-the-badge&logo=google)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-Automated_Grading-8E75B2?style=for-the-badge&logo=google)

A modern, highly responsive, and mobile-optimized web-based examination platform designed for IT students. Featuring **Interactive SVG Matching Questions**, **Gemini AI Automated Essay Grading**, **Anti-Cheat Protection**, and a **Zero-Cost Serverless Backend powered by Google Apps Script & Google Sheets**.

---

## ✨ Key Features

- 📱 **Mobile Optimized & Zero-Lag Performance:** Built with high-performance CSS and hardware-accelerated animations to ensure smooth touch interactions without phone overheating or freezing.
- 🎯 **Interactive SVG Matching Questions:** Connect matching pairs using pixel-perfect horizontal Bezier curves that dynamically scale and align on both mobile and desktop screens.
- 🤖 **Gemini AI Automated Grading:** Automatically grades student essay responses (Section 3) using Google Gemini AI integrated directly into the backend script.
- 🛡️ **Anti-Cheat & Tab-Switch Monitoring:** Detects when a student switches browser tabs or leaves the exam window, tracking violation counts and displaying a time-penalty overlay.
- 📊 **Serverless Google Sheets Backend:** Zero server costs! Submits exam data and scores concurrently to Google Sheets via Google Apps Script (`doPost`), handling multiple simultaneous student submissions smoothly.
- 💾 **State Persistence (Zustand):** Automatically backs up exam progress to `localStorage`, preventing data loss if a student accidentally refreshes the browser.

---

## 📋 Prerequisites

Before cloning and running this project, ensure you have the following installed on your system:
- **Node.js** (v18.0.0 or higher) - [Download Node.js](https://nodejs.org/)
- **Git** - [Download Git](https://git-scm.com/)
- A **Google Account** (for setting up Google Sheets & Google Apps Script backend)

---

## 🚀 Getting Started (Cloning & Running Locally)

### 1. Clone the Repository
Open your terminal (Command Prompt, PowerShell, or macOS/Linux Terminal) and run:

```bash
# Clone the repository
git clone https://github.com/sansentest/exam_student.git

# Navigate into the project directory
cd exam_student
```

### 2. Install Dependencies
Install all required Node.js packages using `npm`:

```bash
npm install
```

### 3. Start the Development Server
Launch the local Vite development server:

```bash
npm run dev
```
> 🌐 The application will start at **`http://localhost:5173`**

---

## ⚙️ Google Apps Script & Google Sheets Setup (Backend Configuration)

This application uses **Google Apps Script as a Serverless REST API** to store exam submissions into a Google Sheet and invoke Gemini AI for essay grading.

### Step 1: Prepare Your Google Sheet
1. Create a new Google Sheet at [sheets.google.com](https://sheets.google.com/).
2. Add appropriate column headers in Row 1 (e.g., `Timestamp`, `Student ID`, `Name`, `Gender`, `Class`, `Score`, `Total Score`, `Tab Switches`, `Remaining Time`, `Answers`).

### Step 2: Set Up Google Apps Script (Production Backend Code)
1. In your Google Sheet, navigate to **Extensions > Apps Script**.
2. Replace the default `Code.gs` content with the complete, production-ready `doPost(e)` script below.
3. This script includes **High-Concurrency Optimization** (AI evaluation is performed *before* locking the spreadsheet) and **Automatic Gemini API Key Rotation & Model Failover** to prevent `429 Too Many Requests` or `404 Model Not Found` errors during exams.

```javascript
/**
 * Production IT Examination Backend - Google Apps Script
 * Supports concurrent multi-student submissions, Gemini AI automated essay grading,
 * API Key rotation, model failover, and zero-collision sheet locking.
 */
function doPost(e) {
  // 1. Parse Data (No script lock here so AI can evaluate multiple students concurrently)
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error", 
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }

  var qcmAnswers = {};
  var essayAnswers = {};
  if (data.answers) {
    for (var key in data.answers) {
      if (key === 'section3') essayAnswers = data.answers.section3;
      else qcmAnswers[key] = data.answers[key];
    }
  }

  // 2. Prepare prompt for Gemini AI (Essay grading & feedback in Khmer)
  var prompt = "អ្នកគឺជាគ្រូបង្រៀនផ្នែកព័ត៌មានវិទ្យាដ៏ពូកែម្នាក់។ សូមជួយកែ និងដាក់ពិន្ទុ (០ ដល់ ៥ពិន្ទុ ក្នុងមួយសំណួរ) ទៅលើចម្លើយរបស់សិស្សខាងក្រោម។ បន្ទាប់មកបូកពិន្ទុបញ្ជូលគ្នា។ អ្នកត្រូវតែឆ្លើយតបជាទម្រង់ JSON តែមួយគត់ ដែលមាន 2 properties គឺ:\n1. 'score' (ជាលេខ ពិន្ទុសរុបដែលសិស្សទទួលបាន)\n2. 'feedback' (ជាចំណុចខ្លីបានហើយមិនយកវែងទេ បើសិស្សខុសអ្វីប្រាប់ថាខុសនិងបានហើយជាភាសាខ្មែរ)\n\nនេះជាចម្លើយសិស្ស:\n";
  
  for (var k in essayAnswers) {
     var q = essayAnswers[k].question || "មិនមានសំណួរ";
     var ans = essayAnswers[k].answer || "(អត់បានឆ្លើយ)";
     prompt += "សំណួរ: " + q + "\n";
     prompt += "ចម្លើយសិស្ស: " + ans + "\n\n";
  }

  // 3. Gemini API Key Rotation & Automatic Model Failover
  // Replace these strings with your actual Gemini API keys from Google AI Studio
  var apiKeys = [
    "YOUR_GEMINI_API_KEY_1",
    "YOUR_GEMINI_API_KEY_2"
  ];
  
  // Use active, fast models with generous free-tier rate limits
  var models = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-flash-latest",
    "gemma-4-31b-it"
  ];

  var aiFeedback = "មិនមានការកែពី AI ទេ";
  var aiScore = 0;
  var success = false;
  
  if (Object.keys(essayAnswers).length > 0) {
    // Random start key index to distribute load across API keys when 30+ students submit at once
    var startKeyIdx = Math.floor(Math.random() * apiKeys.length);
    
    for (var m = 0; m < models.length && !success; m++) {
      for (var k = 0; k < apiKeys.length && !success; k++) {
        var keyIdx = (startKeyIdx + k) % apiKeys.length;
        var currentKey = apiKeys[keyIdx];
        
        try {
          var url = "https://generativelanguage.googleapis.com/v1beta/models/" + models[m] + ":generateContent?key=" + currentKey;
          var payloadObj = { "contents": [{ "parts":[{"text": prompt}] }] };
          var options = {
            "method" : "post",
            "contentType": "application/json",
            "payload" : JSON.stringify(payloadObj),
            "muteHttpExceptions": true
          };

          var response = UrlFetchApp.fetch(url, options);
          var resCode = response.getResponseCode();
          var contentText = response.getContentText();

          if (resCode === 200) {
            var json = JSON.parse(contentText);
            if (json.candidates && json.candidates[0]) {
              var aiText = json.candidates[0].content.parts[0].text;
              aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
              var jsonMatch = aiText.match(/\{[\s\S]*\}/);
              if (jsonMatch) aiText = jsonMatch[0];
              
              var aiData = JSON.parse(aiText);
              aiScore = Math.round(parseFloat(aiData.score) || 0);
              aiFeedback = aiData.feedback || "";
              success = true;
              break;
            }
          } else if (resCode === 404 || resCode === 400) {
            // Model 404/400 -> skip to next model automatically
            aiFeedback = "Model " + models[m] + " (404) - ប្តូរ Model ស្វ័យប្រវត្តិ";
            continue;
          } else if (resCode === 429 || resCode === 503) {
            aiFeedback = "AI Server Busy (" + resCode + ") - សូមកែដៃ";
            Utilities.sleep(1500);
          } else {
            aiFeedback = "កំហុស AI (" + resCode + "): " + contentText;
          }
        } catch (e) {
          aiFeedback = "បរាជ័យក្នុងការហៅ AI: " + e.toString();
        }
      }
      if (!success && m < models.length - 1) {
        Utilities.sleep(2000);
      }
    }
  }

  var qcmScore = Math.round(parseFloat(data.score) || 0);
  var totalScore = Math.round(qcmScore + aiScore);

  // 4. Lock Spreadsheet ONLY when appending row (takes ~0.1 seconds, preventing sheet collisions)
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp", "លេខរៀង", "ឈ្មោះសិស្ស", "ភេទ", "ថ្នាក់",
        "ពិន្ទុសរុប", "ពិន្ទុ QCM", "ពិន្ទុពី Ai", "Tab Switches", 
        "ចម្លើយ QCM", "ចម្លើយសរសេរ", "ពេលវេលាសល់", "ការកែពី AI (Gemini)"
      ]);
      sheet.getRange(1, 1, 1, 13).setFontWeight("bold").setBackground("#d9ead3");
    }

    var row = [
      data.timestamp || new Date().toISOString(),
      data.studentCode || "",
      data.name || "",
      data.gender || "",
      data.className || "",
      totalScore,
      qcmScore,
      aiScore,
      data.tabSwitches || 0,
      JSON.stringify(qcmAnswers),
      JSON.stringify(essayAnswers),
      data.remainingTime || "",
      aiFeedback
    ];
    sheet.appendRow(row);
    
    try {
      if (typeof writeStudent === "function") {
        writeStudent({
          studentNo: Number(data.studentCode),
          name: data.name || "",
          gender: data.gender || "",
          classLevel: data.className || "",
          totalScore: (totalScore !== undefined && totalScore !== "") ? totalScore : 0, 
          tabSwitches: (data.tabSwitches !== undefined && data.tabSwitches !== "") ? data.tabSwitches : 0,
          aiFeedback: aiFeedback
        });
      }
    } catch(err) {
      console.log("Error writing student sheet:", err);
    }

    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      totalScore: totalScore,
      qcmScore: qcmScore,
      aiScore: aiScore,
      aiFeedback: aiFeedback
    })).setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error", 
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

### Step 3: Deploy as a Web App
1. Click the **Deploy** button in the top right of the Apps Script editor > **New deployment**.
2. Select type: **Web app**.
3. Configure the deployment settings:
   - **Execute as:** `Me (your Google account)`
   - **Who has access:** `Anyone` *(Required so students can submit without logging into a Google account)*
4. Click **Deploy** and copy the **Web App URL** (starts with `https://script.google.com/macros/s/.../exec`).

### Step 4: Configure the Web App URL in Your Frontend
1. Open **`src/services/api.js`** in your code editor.
2. Replace the placeholder on line 2 with your deployed Google Apps Script URL:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```

### Step 5: Class Password Configuration
By default, the exam requires a student class password to begin.
- The default password is set to **`5555`** in **`src/pages/ExamHome.jsx`**.
- You can modify this string in `ExamHome.jsx` to match your classroom requirements.

---

## ✏️ How to Add or Modify Exam Questions

You can easily customize exam questions without touching the UI components by modifying the data files in `src/data/`.

### 1. Multiple-Choice (MCQ) & Matching Questions
Edit **`src/data/questions.js`** to add or modify Section 2 questions.

**Example Multiple-Choice (MCQ) Format:**
```javascript
{
  id: 1,
  question: "តើ Hardware (ផ្នែករឹង) គឺជាអ្វី?",
  points: 1,
  options: [
    "កម្មវិធីដែលដំណើរការលើកុំព្យូទ័រ",
    "ផ្នែករបស់កុំព្យូទ័រដែលអាចប៉ះ និងមើលឃើញបាន",
    "ឯកសារដែលរក្សាទុកក្នុងកុំព្យូទ័រ",
    "ប្រព័ន្ធអ៊ីនធឺណិត"
  ],
  answer: "ផ្នែករបស់កុំព្យូទ័រដែលអាចប៉ះ និងមើលឃើញបាន"
}
```

**Example SVG Matching Question Format:**
```javascript
{
  id: 31,
  type: "matching",
  question: "សូមគូសផ្គងកម្មវិធី Google ទៅនឹងមុខងាររបស់វា៖",
  points: 1,
  pairs: [
    { left: "Google Docs", right: "បង្កើតឯកសារ និងសរសេរអត្ថបទ" },
    { left: "Google Slides", right: "បង្កើតបទបង្ហាញ" }
  ],
  answer: {
    "Google Docs": "បង្កើតឯកសារ និងសរសេរអត្ថបទ",
    "Google Slides": "បង្កើតបទបង្ហាញ"
  }
}
```

### 2. Essay Questions (Graded Automatically by Gemini AI)
Edit **`src/data/questions3.js`** to add or modify Section 3 essay prompts.

**Example Essay Question Format:**
```javascript
{
  id: "s3_1",
  question: "តើបច្ចេកវិទ្យាបញ្ញាសិប្បនិម្មិត (AI) មានគុណសម្បត្តិ និងគុណវិបត្តិអ្វីខ្លះនៅក្នុងការរស់នៅប្រចាំថ្ងៃ?",
  placeholder: "សូមសរសេរចម្លើយពន្យល់នៅទីនេះ...",
  minLength: 5
}
```

---

## 👥 How to Add Students & Class Passwords

You can register student rosters and assign class passwords by editing **`src/data/students.js`**.

### 1. Assign Class Passwords
In `src/data/students.js`, update the `classPasswords` object with your class names and their respective passwords:
```javascript
export const classPasswords = {
  '10A': '6677',
  '10B': '7890',
  '10C': '1972',
};
```

### 2. Register Student List
Add student objects to the `studentData` array. Each student should have their `className`, `studentCode`, `name`, and `gender`:
```javascript
export const studentData = [
  { className: '10A', studentCode: '01', name: 'កន ច័ន្ទណារី', gender: 'Female' },
  { className: '10A', studentCode: '02', name: 'កប ស្រីនាត', gender: 'Female' },
  { className: '10A', studentCode: '03', name: 'កាន រិទ្ធិស័ក្ដិ', gender: 'Male' },
];
```

---

## 📦 Production Build & Deployment

### 1. Build for Production
To bundle and optimize the application for production deployment:

```bash
npm run build
```
> The optimized static files will be generated in the **`dist/`** directory.

### 2. Deploy to GitHub Pages
The project includes a built-in automated deployment script using `gh-pages`. Ensure `base` in `vite.config.js` matches your repository name, then run:

```bash
npm run deploy
```
> This command automatically builds the project and publishes the `dist/` directory to your repository's `gh-pages` branch.

---

## 📁 Project Structure

```text
Project exam/
├── src/
│   ├── components/
│   │   ├── AntiCheatOverlay.jsx   # Tab-switch warning & time penalty modal
│   │   ├── MatchingQuestion.jsx   # SVG Bezier-curve matching question component
│   │   ├── QuestionCard.jsx       # Multiple-choice question (MCQ) component
│   │   └── Timer.jsx              # Exam countdown timer
│   ├── data/
│   │   ├── questions.js           # Section 2 questions (MCQ & Matching pairs)
│   │   └── questions3.js          # Section 3 questions (Essay prompts for AI grading)
│   ├── pages/
│   │   ├── ExamHome.jsx           # Student registration & password verification
│   │   ├── ExamSection2.jsx       # Section 2 exam interface (MCQ & Matching)
│   │   └── ExamSection3.jsx       # Section 3 exam interface (Essay questions)
│   ├── services/
│   │   └── api.js                 # Google Apps Script backend communication service
│   ├── store/
│   │   └── useExamStore.js        # Zustand global state & localStorage persistence
│   ├── App.jsx                    # Application routing & layout
│   └── index.css                  # Tailwind CSS rules & mobile GPU optimizations
├── public/
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🤝 License & Credits

Developed for standard IT education and technical examination purposes.
Feel free to fork, customize, and adapt this examination portal for your educational institution.
