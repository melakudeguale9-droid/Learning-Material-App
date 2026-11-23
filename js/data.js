const TECH_CATEGORIES = ['All', 'Cyber Security', 'AI', 'Developer', 'Robotics'];
const GRADE_LEVELS = ['1 - 4 Grade', '5 - 8 Grade', '9 - 12 Grade'];
const UNIVERSITY_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];

const DEFAULT_MATERIALS = [
  // ================= 1 - 4 GRADE: CYBER SECURITY =================
  {
    id: 'g1-4-cyber-1',
    title: 'Safe Internet & Password Heroes',
    author: 'Melaku Deguale',
    category: 'Cyber Security',
    level: '1 - 4 Grade',
    year: '',
    icon: '🛡️',
    description: 'Fun illustrated guide teaching Grade 1–4 kids how to keep personal info private and build strong passwords.',
    bookChapters: [
      { title: 'Chapter 1: What is Personal Information?', content: 'Your full name, home address, school name, and phone number are private treasures. Never share them with strangers online.' },
      { title: 'Chapter 2: Building a Super Password', content: 'A strong password mixes uppercase letters, lowercase letters, numbers, and symbols—never use "123456" or your own name!' },
      { title: 'Chapter 3: Asking Trusted Adults', content: 'Whenever something on a tablet or computer looks strange or scary, stop and show a parent or teacher right away.' }
    ],
    pdfInfo: { fileName: 'Grade_1_4_Cyber_Safe_Internet.pdf', pages: '18 Pages', url: '' },
    readingLinks: [
      { title: 'Google Be Internet Awesome (Kids Guide)', source: 'beinternetawesome.withgoogle.com', url: 'https://beinternetawesome.withgoogle.com/en_us/' },
      { title: 'Staying Safe Online for Kids', source: 'BBC Bitesize Computing', url: 'https://www.bbc.co.uk/bitesize/subjects/zyhbwmn' }
    ],
    videos: {
      amharic: {
        title: 'የኢንተርኔት ደህንነት እና ጠንካራ የይለፍ ቃል (ለህፃናት)',
        summary: 'ልጆች ኢንተርኔት ሲጠቀሙ የግል መረጃቸውን እንዴት እንደሚጠብቁ እና ጠንካራ Password እንዴት እንደሚፈጥሩ የሚያስተምር የአማርኛ ቪዲዮ።',
        url: 'https://www.youtube.com/results?search_query=internet+safety+for+kids+amharic'
      },
      english: {
        title: 'Internet Safety & Strong Passwords for Kids',
        summary: 'Animated lesson explaining online privacy, password rules, and safe digital habits for grades 1 to 4.',
        url: 'https://www.youtube.com/results?search_query=internet+safety+and+passwords+for+kids+grade+1+to+4'
      }
    }
  },
  {
    id: 'g1-4-cyber-2',
    title: 'Junior Digital Detective: Secret Codes & Safe Links',
    author: 'Melaku Deguale',
    category: 'Cyber Security',
    level: '1 - 4 Grade',
    year: '',
    icon: '🛡️',
    description: 'Spot fake game pop-ups, check website padlocks, and solve secret Caesar cipher puzzles.',
    bookChapters: [
      { title: 'Chapter 1: Safe Links vs. Tricky Links', content: 'Always look closely at website names and the browser padlock before clicking.' },
      { title: 'Chapter 2: The Caesar Shift Wheel', content: 'Shift every letter forward by 1 or 2 places! With Shift +1, A becomes B, B becomes C, and CAT becomes DBU.' }
    ],
    pdfInfo: { fileName: 'Grade_1_4_Cyber_Ciphers_Links.pdf', pages: '24 Pages', url: '' },
    readingLinks: [
      { title: 'Interland: Reality River (Spot Fake Links)', source: 'Google Interland', url: 'https://beinternetawesome.withgoogle.com/en_us/interland' },
      { title: 'Caesar Cipher Explorer', source: 'CryptoClub', url: 'https://www.cryptoclub.org/' }
    ],
    videos: {
      amharic: {
        title: 'ሚስጥራዊ ኮዶች እና አታላይ ሊንኮችን መለየት',
        summary: 'አታላይ Pop-up ማስታወቂያዎችን እና ሚስጥራዊ ኮዶችን ለህፃናት በቀላሉ የሚያስረዳ ቪዲዮ።',
        url: 'https://www.youtube.com/results?search_query=cyber+security+for+kids+amharic'
      },
      english: {
        title: 'Cryptography & Spotting Fake Links for Kids',
        summary: 'Discover how Caesar ciphers and HTTPS padlocks keep messages safe.',
        url: 'https://www.youtube.com/results?search_query=caesar+cipher+and+encryption+for+kids'
      }
    }
  },

  // ================= 1 - 4 GRADE: AI =================
  {
    id: 'g1-4-ai-1',
    title: 'Hello Smart Machines! AI Around Us',
    author: 'Dr. Selamawit A.',
    category: 'AI',
    level: '1 - 4 Grade',
    year: '',
    icon: '🧠',
    description: 'Discover how voice assistants, smart cameras, and educational apps recognize voices and pictures.',
    bookChapters: [
      { title: 'Chapter 1: What is Artificial Intelligence?', content: 'AI is when computers learn to do smart tasks like recognizing faces, understanding speech, and playing games.' },
      { title: 'Chapter 2: Learning from Examples (Training Data)', content: 'To teach an AI to recognize a cat, we show it hundreds of cat pictures—this collection is called Training Data.' },
      { title: 'Chapter 3: Decision Trees (If-Then Rules)', content: 'AI uses step-by-step rules: IF it has wings AND feathers, THEN it is likely a bird!' }
    ],
    pdfInfo: { fileName: 'Grade_1_4_AI_Smart_Machines.pdf', pages: '22 Pages', url: '' },
    readingLinks: [
      { title: 'AI for Oceans (Interactive Kids Activity)', source: 'Code.org AI', url: 'https://code.org/oceans' },
      { title: 'Teachable Machine (Train AI with Camera)', source: 'Google Teachable Machine', url: 'https://teachablemachine.withgoogle.com/' }
    ],
    videos: {
      amharic: {
        title: 'አርቴፊሻል ኢንተለጀንስ (AI) ምንድን ነው? (ለህፃናት)',
        summary: 'ስማርት ኮምፒውተሮች እና AI ከምሳሌዎች (Training Data) እንዴት እንደሚማሩ በአማርኛ የሚያስተምር ቪዲዮ።',
        url: 'https://www.youtube.com/results?search_query=artificial+intelligence+for+kids+amharic'
      },
      english: {
        title: 'What is Artificial Intelligence? AI for Kids',
        summary: 'Animated introduction to AI, training data, and how machines recognize patterns.',
        url: 'https://www.youtube.com/results?search_query=artificial+intelligence+for+kids+grade+1+to+4'
      }
    }
  },

  // ================= 1 - 4 GRADE: DEVELOPER =================
  {
    id: 'g1-4-dev-1',
    title: 'Step-by-Step Coding, Scratch & Mini Games',
    author: 'Hana M.',
    category: 'Developer',
    level: '1 - 4 Grade',
    year: '',
    icon: '💻',
    description: 'Learn algorithms, repeat loops, Scratch sprites, and score variables through fun visual puzzles.',
    bookChapters: [
      { title: 'Chapter 1: Algorithms & Debugging', content: 'An algorithm is an ordered list of steps. A mistake in code is a "Bug", and fixing it is "Debugging".' },
      { title: 'Chapter 2: Sprites & Repeat Loops', content: 'Characters in Scratch are called "Sprites". Use Repeat Loops to avoid writing the same step many times.' },
      { title: 'Chapter 3: Score Variables & If-Then Rules', content: 'A Variable stores changing numbers like Score = 0, while If-Then checks game rules!' }
    ],
    pdfInfo: { fileName: 'Grade_1_4_Developer_Scratch_Logic.pdf', pages: '26 Pages', url: '' },
    readingLinks: [
      { title: 'Scratch Official Beginner Tutorials', source: 'scratch.mit.edu', url: 'https://scratch.mit.edu/projects/editor/?tutorial=getStarted' },
      { title: 'Blockly Games (Logic & Loops)', source: 'blockly.games', url: 'https://blockly.games/' }
    ],
    videos: {
      amharic: {
        title: 'ኮዲንግ እና በScratch ጌም መስራት (ለህፃናት)',
        summary: 'አልጎሪዝም፣ Loop እና Variable በመጠቀም ቀላል ጌም እና አኒሜሽን መስራት የሚያሳይ የአማርኛ ቪዲዮ።',
        url: 'https://www.youtube.com/results?search_query=scratch+programming+for+kids+amharic'
      },
      english: {
        title: 'Scratch Coding for Kids: Algorithms, Loops & Variables',
        summary: 'Step-by-step tutorial showing how sprites, loops, and score variables work.',
        url: 'https://www.youtube.com/results?search_query=scratch+tutorial+for+kids+grade+1+to+4'
      }
    }
  },

  // ================= 1 - 4 GRADE: ROBOTICS =================
  {
    id: 'g1-4-rob-1',
    title: 'Robots, Circuits & Obstacle Sensors Lab',
    author: 'Dawit K.',
    category: 'Robotics',
    level: '1 - 4 Grade',
    year: '',
    icon: '🤖',
    description: 'Explore motors, batteries, LED circuits, and Sense-Think-Act obstacle-avoiding mini robots.',
    bookChapters: [
      { title: 'Chapter 1: Parts of a Robot', content: 'Robots use batteries for power, motors to spin wheels, and sensors to see and hear.' },
      { title: 'Chapter 2: Closed Circuits & LEDs', content: 'Electricity only lights an LED when the switch is closed and wires form a complete loop.' },
      { title: 'Chapter 3: Sense → Think → Act', content: 'When an ultrasonic sensor detects a wall ahead, the robot stops and turns safely!' }
    ],
    pdfInfo: { fileName: 'Grade_1_4_Robotics_Circuits_Sensors.pdf', pages: '25 Pages', url: '' },
    readingLinks: [
      { title: 'NASA Robotics for Kids', source: 'NASA Space Place', url: 'https://spaceplace.nasa.gov/search/robots/' },
      { title: 'Tinkercad Circuits for Kids', source: 'tinkercad.com', url: 'https://www.tinkercad.com/circuits' }
    ],
    videos: {
      amharic: {
        title: 'ሮቦት፣ ኤሌክትሪክ ሰርኪዩት እና ሴንሰር (ለህፃናት)',
        summary: 'ስለ ሮቦት ክፍሎች፣ LED ሰርኪዩት እና እንቅፋት የሚያልፍ ሮቦት በአማርኛ የሚያስተምር ቪዲዮ።',
        url: 'https://www.youtube.com/results?search_query=robotics+for+kids+amharic'
      },
      english: {
        title: 'Robotics, Simple Circuits & Sensors for Kids',
        summary: 'Learn how batteries, switches, LEDs, and distance sensors power smart robots.',
        url: 'https://www.youtube.com/results?search_query=what+is+a+robot+for+kids+grade+1+to+4'
      }
    }
  }
];
