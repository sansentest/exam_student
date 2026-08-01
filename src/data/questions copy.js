export const questions = [
  {
    id: 1,
    question: "តើកុំព្យូទ័រ (Computer) គឺជាអ្វី?",
    points: 1,
    options: [
      "ឧបករណ៍សម្រាប់កម្តៅម្ហូបអាហារ",
      "ឧបករណ៍អេឡិចត្រូនិកដែលអាចទទួល ដំណើរការ រក្សាទុក និងបង្ហាញទិន្នន័យ",
      "ឧបករណ៍សម្រាប់លេងហ្គេមតែប៉ុណ្ណោះ",
      "ម៉ាស៊ីនបោកខោអាវ"
    ],
    answer: "ឧបករណ៍អេឡិចត្រូនិកដែលអាចទទួល ដំណើរការ រក្សាទុក និងបង្ហាញទិន្នន័យ"
  },

  {
    id: 2,
    question: "តើ Hardware (ផ្នែករឹង) គឺជាអ្វី?",
    points: 1,
    options: [
      "កម្មវិធីដែលដំណើរការលើកុំព្យូទ័រ",
      "ផ្នែករបស់កុំព្យូទ័រដែលអាចប៉ះ និងមើលឃើញបាន",
      "ឯកសារដែលរក្សាទុកក្នុងកុំព្យូទ័រ",
      "ប្រព័ន្ធអ៊ីនធឺណិត"
    ],
    answer: "ផ្នែករបស់កុំព្យូទ័រដែលអាចប៉ះ និងមើលឃើញបាន"
  },

  {
    id: 3,
    question: "តើ CPU (អង្គដំណើរការកណ្តាល) មានតួនាទីអ្វីនៅក្នុងកុំព្យូទ័រ?",
    points: 1,
    options: [
      "រក្សាទុកឯកសារអចិន្ត្រៃយ៍",
      "ជាខួរក្បាលរបស់កុំព្យូទ័រសម្រាប់គណនា និងដំណើរការបញ្ជា",
      "បង្ហាញរូបភាពនៅលើអេក្រង់",
      "ផ្គត់ផ្គង់ថាមពល"
    ],
    answer: "ជាខួរក្បាលរបស់កុំព្យូទ័រសម្រាប់គណនា និងដំណើរការបញ្ជា"
  },

  {
    id: 4,
    question: "តើ RAM (អង្គចងចាំបណ្តោះអាសន្ន) មានតួនាទីអ្វី?",
    points: 1,
    options: [
      "ផ្ទុកទិន្នន័យបណ្តោះអាសន្ននៅពេលកម្មវិធីកំពុងដំណើរការ",
      "បង្ហាញរូបភាព",
      "ភ្ជាប់អ៊ីនធឺណិត",
      "ផ្គត់ផ្គង់ថាមពល"
    ],
    answer: "ផ្ទុកទិន្នន័យបណ្តោះអាសន្ននៅពេលកម្មវិធីកំពុងដំណើរការ"
  },

  {
    id: 5,
    question: "តើ Software (ផ្នែកទន់) គឺជាអ្វី?",
    points: 1,
    options: [
      "គ្រឿងបន្លាស់កុំព្យូទ័រដែលអាចប៉ះបាន",
      "កម្មវិធី ឬសំណុំបញ្ជាដែលធ្វើឱ្យកុំព្យូទ័រដំណើរការដែលប៉ះមិនបាន",
      "ខ្សែភ្លើងរបស់កុំព្យូទ័រ",
      "អេក្រង់កុំព្យូទ័រ"
    ],
    answer: "កម្មវិធី ឬសំណុំបញ្ជាដែលធ្វើឱ្យកុំព្យូទ័រដំណើរការដែលប៉ះមិនបាន"
  },

  {
    id: 6,
    question: "តើមួយណាជាប្រព័ន្ធប្រតិបត្តិការ (Operating System) ឬ​ OS?",
    points: 1,
    options: [
      "Microsoft Word (កម្មវិធីវាយអត្ថបទ)",
      "Google Chrome (កម្មវិធីបើកគេហទំព័រ)",
      "Windows (ប្រព័ន្ធប្រតិបត្តិការ)",
      "Adobe Photoshop (កម្មវិធីកែរូបភាព)"
    ],
    answer: "Windows (ប្រព័ន្ធប្រតិបត្តិការ)"
  },

  {
    id: 7,
    question: "តើរូបភាពមួយណាជា SSD (ឧបករណ៍ផ្ទុកទិន្នន័យល្បឿនលឿន)?",
    points: 1,
    optionType: "image",
    options: [
      "/exam_student/images/ssd.svg", // SSD
      "/exam_student/images/cpu.jpg", // CPU
      "/exam_student/images/motherboard.jpg", // Motherboard
      "/exam_student/images/ram.jpg"  // RAM
    ],
    answer: "/exam_student/images/ssd.svg"
  },

  {
    id: 8,
    question: "តើ Hard Disk ឬ SSD (ឧបករណ៍ផ្ទុកទិន្នន័យ) មានតួនាទីអ្វី?",
    points: 1,
    options: [
      "ដំណើរការគណនាទិន្នន័យ",
      "ផ្ទុកឯកសារ និងទិន្នន័យរបស់អ្នកប្រើប្រាស់",
      "បញ្ចូលទិន្នន័យ",
      "បង្ហាញរូបភាព"
    ],
    answer: "ផ្ទុកឯកសារ និងទិន្នន័យរបស់អ្នកប្រើប្រាស់"
  },

  {
    id: 9,
    question: "តើកម្មវិធីមួយណាជា Web Browser (កម្មវិធីបើកគេហទំព័រ)?",
    points: 1,
    options: [
      "Google Chrome (កម្មវិធីបើកគេហទំព័រ)",
      "RAM (អង្គចងចាំ)",
      "CPU (អង្គដំណើរការ)",
      "Motherboard (បន្ទះមេ)"
    ],
    answer: "Google Chrome (កម្មវិធីបើកគេហទំព័រ)"
  },

  {
    id: 10,
    question: "តើរូបភាពខាងក្រោមនេះជាផ្នែក Hardware (ផ្នែករឹង) អ្វី?",
    points: 1,
    image: "/exam_student/images/motherboard.jpg",
    options: [
      "Motherboard (បន្ទះមេ)",
      "RAM (អង្គចងចាំ)",
      "Hard Disk (ថាសផ្ទុកទិន្នន័យ)",
      "Power Supply (ប្រភពផ្គត់ផ្គង់ថាមពល)"
    ],
    answer: "Motherboard (បន្ទះមេ)"
  },

  {
    id: 11,
    question: "តើរូបភាពខាងក្រោមនេះជាឧបករណ៍អ្វី?",
    points: 1,
    image: "/exam_student/images/keyboard.jpg",
    options: [
      "Speaker (ឧបករណ៍បំពងសំឡេង)",
      "Mouse (កណ្ដុរ)",
      "Keyboard (ក្ដារចុច)",
      "Monitor (អេក្រង់)"
    ],
    answer: "Keyboard (ក្ដារចុច)"
  },

  {
    id: 12,
    question: "តើរូបភាពខាងក្រោមនេះជាផ្នែក Hardware (ផ្នែករឹង) អ្វី?",
    points: 1,
    image: "/exam_student/images/cpu.jpg",
    options: [
      "CPU (អង្គដំណើរការកណ្តាល)",
      "RAM (អង្គចងចាំ)",
      "SSD (ឧបករណ៍ផ្ទុកទិន្នន័យ)",
      "Motherboard (បន្ទះមេ)"
    ],
    answer: "CPU (អង្គដំណើរការកណ្តាល)"
  },

  {
    id: 13,
    question: "តើរូបភាពមួយណាជា Keyboard (ក្ដារចុច)?",
    points: 1,
    optionType: "image",
    options: [
      "/exam_student/images/keyboard.jpg",
      "/exam_student/images/mouse.jpg",
      "/exam_student/images/monitor.jpg",
      "/exam_student/images/cpu.jpg"
    ],
    answer: "/exam_student/images/keyboard.jpg"
  },

  {
    id: 14,
    question: "តើរូបភាពមួយណាជា Monitor (អេក្រង់)?",
    points: 1,
    optionType: "image",
    options: [
      "/exam_student/images/mouse.jpg",
      "/exam_student/images/monitor.jpg",
      "/exam_student/images/keyboard.jpg",
      "/exam_student/images/motherboard.jpg"
    ],
    answer: "/exam_student/images/monitor.jpg"
  },

  {
    id: 15,
    type: "matching",
    question: "សូមគូសផ្គង Hardware (ផ្នែករឹង) ទៅនឹងតួនាទីរបស់វា៖",
    points: 1,
    pairs: [
      {
        left: "CPU (អង្គដំណើរការកណ្តាល)",
        right: "ដំណើរការ និងគណនាទិន្នន័យ"
      },
      {
        left: "RAM (អង្គចងចាំបណ្តោះអាសន្ន)",
        right: "រក្សាទុកទិន្នន័យបណ្តោះអាសន្ន"
      },
      {
        left: "Hard Disk / SSD (ឧបករណ៍ផ្ទុកទិន្នន័យ)",
        right: "ផ្ទុកឯកសារអចិន្ត្រៃយ៍"
      }
    ],
    answer: {
      "CPU (អង្គដំណើរការកណ្តាល)": "ដំណើរការ និងគណនាទិន្នន័យ",
      "RAM (អង្គចងចាំបណ្តោះអាសន្ន)": "រក្សាទុកទិន្នន័យបណ្តោះអាសន្ន",
      "Hard Disk / SSD (ឧបករណ៍ផ្ទុកទិន្នន័យ)": "ផ្ទុកឯកសារអចិន្ត្រៃយ៍"
    }
  },

  {
    id: 16,
    question: "តើឧបករណ៍មួយណាជាឧបករណ៍បញ្ចូលទិន្នន័យ (Input Device)?",
    points: 1,
    options: [
      "Keyboard និង Mouse",
      "Monitor និង Printer",
      "Speaker និង Projector",
      "CPU និង RAM"
    ],
    answer: "Keyboard និង Mouse"
  },

  {
    id: 17,
    question: "តើរូបភាពខាងក្រោមនេះបង្ហាញពីឧបករណ៍អ្វី? ",
    points: 1,
    image: "/exam_student/images/mouse.jpg",
    options: [
      "Keyboard (ក្ដារចុច)",
      "Mouse (កណ្ដុរ)",
      "Monitor (អេក្រង់)",
      "Printer (ម៉ាស៊ីនបោះពុម្ព)"
    ],
    answer: "Mouse (កណ្ដុរ)"
  },

  {
    id: 18,
    question: "តើមួយណាជាផ្នែកខាងក្នុង Computer (កុំព្យូទ័រ) ដែលស្ថិតក្នុងធុងប្រព័ន្ធ?",
    points: 1,
    options: [
      "Keyboard (ក្ដារចុច)",
      "RAM (អង្គចងចាំ)",
      "Mouse (កណ្ដុរ)",
      "Monitor (អេក្រង់)"
    ],
    answer: "RAM (អង្គចងចាំ)"
  },
  {
    id: 19,
    question: "តើរូបភាពមួយណាជា RAM (Random Access Memory - អង្គចងចាំបណ្តោះអាសន្ន)?",
    points: 1,
    optionType: "image",
    options: [
      "/exam_student/images/ram.jpg", // RAM
      "/exam_student/images/cpu.jpg", // CPU
      "/exam_student/images/motherboard.jpg", // Motherboard
      "/exam_student/images/ssd.jpg"  // SSD
    ],
    answer: "/exam_student/images/ram.jpg"
  },
  {
    id: 20,
    question: "តើអ្វីជាភាពខុសគ្នារវាង HDD (ថាសរឹងប្រភេទចានម៉ាញេទិច) និង SSD (ឧបករណ៍ផ្ទុកទិន្នន័យប្រើ Chip)?",
    points: 1,
    options: [
      "HDD លឿនជាង SSD និងមានតម្លៃថ្លៃជាង",
      "SSD លឿនជាង HDD ព្រោះប្រើ Chip សម្រាប់ផ្ទុកទិន្នន័យ",
      "HDD និង SSD មានមុខងារខុសគ្នាទាំងស្រុង មិនអាចផ្ទុកទិន្នន័យបាន",
      "SSD មានផ្នែកវិលនៅខាងក្នុងដូច HDD"
    ],
    answer: "SSD លឿនជាង HDD ព្រោះប្រើ Chip សម្រាប់ផ្ទុកទិន្នន័យ"
  },



  //google doce and google slide 



  {
    id: 21,
    question: "តើរូបភាពខាងក្រោមនេះជាកម្មវិធីអ្វី?",
    points: 1,
    image: "/exam_student/images/docs_logo.png",
    options: [
      "Google Docs (ឯកសារ Google)",
      "Google Slides (ស្លាយ Google)",
      "Google Sheets (សន្លឹក Google)",
      "Google Drive (ថាស Google)"
    ],
    answer: "Google Docs (ឯកសារ Google)"
  },

  {
    id: 22,
    question: "តើ Google Docs (ឯកសារ Google) ប្រើសម្រាប់ធ្វើអ្វី?",
    points: 1,
    options: [
      "បង្កើត និងកែសម្រួលឯកសារអនឡាញ",
      "បង្កើតហ្គេម",
      "កែវីដេអូ",
      "ជួសជុល Computer"
    ],
    answer: "បង្កើត និងកែសម្រួលឯកសារអនឡាញ"
  },

  {
    id: 23,
    question: "តើរូបភាពមួយណាជា Google Slides (ស្លាយ Google)?",
    points: 1,
    optionType: "image",
    options: [
      "/exam_student/images/slides_logo.png",
      "/exam_student/images/docs_logo.png",
      "/exam_student/images/sheets_logo.png",
      "/exam_student/images/drive_logo.png"
    ],
    answer: "/exam_student/images/slides_logo.png"
  },

  {
    id: 24,
    question: "តើ Google Slides (ស្លាយ Google) ប្រើសម្រាប់ធ្វើអ្វី?",
    points: 1,
    options: [
      "បង្កើតបទបង្ហាញ (Presentation)",
      "រក្សាទុក RAM",
      "ដំឡើង Windows",
      "កែ Hardware"
    ],
    answer: "បង្កើតបទបង្ហាញ (Presentation)"
  },

  {
    id: 25,
    question: "តើរូបភាពខាងក្រោមនេះបង្ហាញពី Permission (សិទ្ធិចែករំលែក) អ្វី?",
    points: 1,
    image: "/exam_student/images/docs_sharing.svg",
    options: [
      "Viewer (អ្នកមើល)",
      "Commenter (អ្នកផ្តល់មតិយោបល់)",
      "Editor (អ្នកកែសម្រួល)",
      "Owner (ម្ចាស់ឯកសារ)"
    ],
    answer: "Viewer (អ្នកមើល)"
  },

  {
    id: 26,
    question: "តើ Editor (អ្នកកែសម្រួល) ក្នុង Google Docs អាចធ្វើអ្វីបាន?",
    points: 1,
    options: [
      "មើលតែប៉ុណ្ណោះ",
      "អាចកែប្រែឯកសារ",
      "មិនអាចបើកឯកសារ",
      "អាចប្រើ Internet"
    ],
    answer: "អាចកែប្រែឯកសារ"
  },

  {
    id: 27,
    question: "តើរូបភាពមួយណាជា Google Drive (ថាស Google)?",
    points: 1,
    optionType: "image",
    options: [
      "/exam_student/images/drive_logo.png",
      "/exam_student/images/docs_logo.png",
      "/exam_student/images/slides_logo.png",
      "/exam_student/images/sheets_logo.png"
    ],
    answer: "/exam_student/images/drive_logo.png"
  },

  {
    id: 28,
    question: "តើ Google Drive (ថាស Google) មានតួនាទីអ្វី?",
    points: 1,
    options: [
      "រក្សាទុក និងចែករំលែកឯកសារតាមអ៊ីនធឺណិត",
      "បង្កើន RAM",
      "ដំណើរការ CPU",
      "បង្កើត Website"
    ],
    answer: "រក្សាទុក និងចែករំលែកឯកសារតាមអ៊ីនធឺណិត"
  },

  {
    id: 29,
    question: "តើក្នុង Google Slides អាចបញ្ចូលអ្វីបានខ្លះ?",
    points: 1,
    options: [
      "អក្សរ រូបភាព វីដេអូ និងតារាង",
      "តែអក្សរប៉ុណ្ណោះ",
      "តែសំឡេង",
      "តែ Code"
    ],
    answer: "អក្សរ រូបភាព វីដេអូ និងតារាង"
  },

  {
    id: 30,
    question: "តើក្នុង Google Docs ប៊ូតុង 'Share' (ចែករំលែក) ស្ថិតនៅត្រង់ណា និងមានពណ៌អ្វីជាទូទៅ?",
    points: 1,
    options: [
      "នៅជ្រុងលើខាងស្តាំ មានពណ៌ខៀវ",
      "នៅជ្រុងក្រោមខាងឆ្វេង មានពណ៌ក្រហម",
      "នៅកណ្តាលអេក្រង់ មានពណ៌ខ្មៅ",
      "នៅក្នុងម៉ឺនុយ Help តែប៉ុណ្ណោះ"
    ],
    answer: "នៅជ្រុងលើខាងស្តាំ មានពណ៌ខៀវ"
  },

  {
    id: 31,
    type: "matching",
    question: "សូមគូសផ្គងកម្មវិធី Google ទៅនឹងមុខងាររបស់វា៖",
    points: 1,
    pairs: [
      {
        left: "Google Docs (ឯកសារ Google)",
        right: "បង្កើតឯកសារ និងសរសេរអត្ថបទ"
      },
      {
        left: "Google Slides (ស្លាយ Google)",
        right: "បង្កើតបទបង្ហាញ"
      },
      {
        left: "Google Drive (ថាស Google)",
        right: "រក្សាទុកឯកសារ"
      }
    ],
    answer: {
      "Google Docs (ឯកសារ Google)": "បង្កើតឯកសារ និងសរសេរអត្ថបទ",
      "Google Slides (ស្លាយ Google)": "បង្កើតបទបង្ហាញ",
      "Google Drive (ថាស Google)": "រក្សាទុកឯកសារ"
    }
  },

  {
    id: 32,
    type: "matching",
    question: "សូមគូសផ្គង Permission (សិទ្ធិ) ទៅនឹងមុខងារ៖",
    points: 1,
    pairs: [
      {
        left: "Viewer (អ្នកមើល)",
        right: "មើលឯកសារប៉ុណ្ណោះ"
      },
      {
        left: "Commenter (អ្នកផ្តល់មតិយោបល់)",
        right: "សរសេរមតិយោបល់"
      },
      {
        left: "Editor (អ្នកកែសម្រួល)",
        right: "កែប្រែឯកសារ"
      }
    ],
    answer: {
      "Viewer (អ្នកមើល)": "មើលឯកសារប៉ុណ្ណោះ",
      "Commenter (អ្នកផ្តល់មតិយោបល់)": "សរសេរមតិយោបល់",
      "Editor (អ្នកកែសម្រួល)": "កែប្រែឯកសារ"
    }
  },

  {
    id: 33,
    type: "matching",
    question: "សូមគូសផ្គងគ្រាប់ចុចកាត់ (Keyboard Shortcuts) ទៅនឹងមុខងាររបស់វា៖",
    points: 1,
    pairs: [
      {
        left: "Ctrl + C",
        right: "ចម្លង (Copy)"
      },
      {
        left: "Ctrl + V",
        right: "ដាក់បញ្ជូល (Paste)"
      },
      {
        left: "Ctrl + Z",
        right: "ត្រឡប់ក្រោយវិញ (Undo)"
      }
    ],
    answer: {
      "Ctrl + C": "ចម្លង (Copy)",
      "Ctrl + V": "ដាក់បញ្ជូល (Paste)",
      "Ctrl + Z": "ត្រឡប់ក្រោយវិញ (Undo)"
    }
  },

  {
    id: 34,
    question: "តើកម្មវិធី Google Sheets (សន្លឹក Google) ប្រើសម្រាប់ធ្វើអ្វី?",
    points: 1,
    options: [
      "គណនាលេខ ធ្វើតារាងទិន្នន័យ និងក្រាហ្វិក",
      "សរសេរអត្ថបទសំបុត្រតែប៉ុណ្ណោះ",
      "កែសម្រួលរូបភាព និងវីដេអូ",
      "លេងហ្គេមអនឡាញ"
    ],
    answer: "គណនាលេខ ធ្វើតារាងទិន្នន័យ និងក្រាហ្វិក"
  },

  {
    id: 35,
    question: "តើអត្ថប្រយោជន៍សំខាន់របស់ Google Docs និង Google Slides គឺអ្វី?",
    points: 1,
    options: [
      "អាចធ្វើការជាមួយគ្នា និងចែករំលែកតាមអ៊ីនធឺណិត",
      "ត្រូវប្រើ Computer មួយគត់",
      "មិនអាចរក្សាទុកឯកសារ",
      "មិនអាចចែករំលែក"
    ],
    answer: "អាចធ្វើការជាមួយគ្នា និងចែករំលែកតាមអ៊ីនធឺណិត"
  },


  //AI 


  {
    id: 36,
    question: "តើ AI (Artificial Intelligence - បញ្ញាសិប្បនិម្មិត) គឺជាអ្វី?",
    points: 1,
    options: [
      "បច្ចេកវិទ្យាដែលអាចឱ្យកុំព្យូទ័ររៀន គិត និងធ្វើការដូចជាមនុស្ស",
      "ឧបករណ៍ Hardware សម្រាប់ផ្ទុកទិន្នន័យ",
      "កម្មវិធីសម្រាប់លេងហ្គេមតែប៉ុណ្ណោះ",
      "ប្រព័ន្ធ Internet"
    ],
    answer: "បច្ចេកវិទ្យាដែលអាចឱ្យកុំព្យូទ័ររៀន គិត និងធ្វើការដូចជាមនុស្ស"
  },

  {
    id: 37,
    question: "តើមួយណាជាគុណវិបត្តិ (Disadvantages) របស់ AI (បញ្ញាសិប្បនិម្មិត)?",
    points: 1,
    options: [
      "អាចជួយស្វែងរកព័ត៌មានបានលឿន",
      "អាចជួយបង្កើតឯកសារ និងរូបភាព",
      "អាចផ្តល់ចម្លើយខុស ប្រសិនបើទិន្នន័យ ឬការណែនាំមិនត្រឹមត្រូវ",
      "អាចជួយបកប្រែភាសាបាន"
    ],
    answer: "អាចផ្តល់ចម្លើយខុស ប្រសិនបើទិន្នន័យ ឬការណែនាំមិនត្រឹមត្រូវ"
  },

  {
    id: 38,
    question: "តើ AI (បញ្ញាសិប្បនិម្មិត) អាចជួយធ្វើអ្វីបាន?",
    points: 1,
    options: [
      "ជួយសរសេរ បង្កើតរូបភាព បកប្រែ និងឆ្លើយសំណួរ",
      "ជួសជុល Hardware ដោយដៃ",
      "បង្កើនទំហំ RAM ក្នុង Computer",
      "ជំនួស Internet"
    ],
    answer: "ជួយសរសេរ បង្កើតរូបភាព បកប្រែ និងឆ្លើយសំណួរ"
  },

  {
    id: 39,
    type: "matching",
    question: "សូមគូសផ្គងឧបករណ៍ AI (បញ្ញាសិប្បនិម្មិត) ទៅនឹងមុខងាររបស់វា៖",
    points: 1,
    pairs: [
      {
        left: "ChatGPT (កម្មវិធីជជែកជាមួយ AI)",
        right: "ឆ្លើយសំណួរ និងជួយបង្កើតអត្ថបទ"
      },
      {
        left: "AI Image Generator (កម្មវិធីបង្កើតរូបភាពដោយ AI)",
        right: "បង្កើតរូបភាពតាមការពិពណ៌នា"
      },
      {
        left: "AI Translation (ការបកប្រែដោយ AI)",
        right: "បកប្រែភាសាពីមួយទៅមួយ"
      }
    ],
    answer: {
      "ChatGPT (កម្មវិធីជជែកជាមួយ AI)": "ឆ្លើយសំណួរ និងជួយបង្កើតអត្ថបទ",
      "AI Image Generator (កម្មវិធីបង្កើតរូបភាពដោយ AI)": "បង្កើតរូបភាពតាមការពិពណ៌នា",
      "AI Translation (ការបកប្រែដោយ AI)": "បកប្រែភាសាពីមួយទៅមួយ"
    }
  },

  {
    id: 40,
    question: "តើការប្រើប្រាស់ AI (បញ្ញាសិប្បនិម្មិត) ឱ្យមានប្រសិទ្ធភាព គួរធ្វើដូចម្តេច?",
    points: 1,
    options: [
      "ផ្តល់សំណួរ ឬបញ្ជាឱ្យច្បាស់ និងពិនិត្យលទ្ធផលមុនប្រើប្រាស់",
      "ជឿគ្រប់ចម្លើយដោយមិនពិនិត្យ",
      "ប្រើ AI ដើម្បីបន្លំការប្រឡង",
      "មិនចាំបាច់រៀនទៀត"
    ],
    answer: "ផ្តល់សំណួរ ឬបញ្ជាឱ្យច្បាស់ និងពិនិត្យលទ្ធផលមុនប្រើប្រាស់"
  }


];