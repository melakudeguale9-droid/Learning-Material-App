const TECH_CATEGORIES = ['All', 'Cyber', 'AI', 'Developer', 'Robotics'];
const DIFFICULTY_LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const GRADE_LEVELS = ['1 - 4 Grade', '5 - 8 Grade', '9 - 12 Grade'];
const UNIVERSITY_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];

const DEFAULT_MATERIALS = [
  // ================= 1 - 4 GRADE: CYBER =================
  {
    id: 'g1-4-cyber-1',
    title: 'Safe Internet & Password Heroes',
    author: 'Melaku Deguale',
    category: 'Cyber',
    difficulty: 'Beginner',
    level: '1 - 4 Grade',
    year: '',
    icon: '🛡️',
    description: 'Fun illustrated guide teaching Grade 1–4 kids how to keep personal info private and build strong passwords.',
    bookChapters: [
      { title: 'Chapter 1: What is Personal Information?', content: 'Your full name, home address, school name, and phone number are private treasures. Never share them with strangers online.' },
      { title: 'Chapter 2: Building a Super Password', content: 'A strong password mixes uppercase letters, lowercase letters, numbers, and symbols—never use "123456" or your own name!' },
      { title: 'Chapter 3: Asking Trusted Adults', content: 'Whenever something on a tablet or computer looks strange or scary, stop and show a parent or teacher right away.' }
    ],
    pdfInfo: { fileName: 'Grade_1_4_Cyber_Beginner_Safe_Internet.pdf', pages: '18 Pages', url: '' },
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
    title: 'Spotting Tricks, Pop-Ups & Unsafe Links',
    author: 'Melaku Deguale',
    category: 'Cyber',
    difficulty: 'Intermediate',
    level: '1 - 4 Grade',
    year: '',
    icon: '🛡️',
    description: 'Learn how to recognize fake game rewards, suspicious pop-ups, and phishing traps.',
    bookChapters: [
      { title: 'Chapter 1: Too Good to Be True!', content: 'If a pop-up says "You won 1,000 free game coins! Click here!", it is a trick designed to fool you.' },
      { title: 'Chapter 2: Safe Links vs. Tricky Links', content: 'Always look closely at website names before clicking. Misspelled names are warning signs.' },
      { title: 'Chapter 3: Safe Downloading Rules', content: 'Never download unknown files or apps without permission from your parent or teacher.' }
    ],
    pdfInfo: { fileName: 'Grade_1_4_Cyber_Intermediate_Safe_Links.pdf', pages: '22 Pages', url: '' },
    readingLinks: [
      { title: 'Interland: Reality River (Spot Fake Links)', source: 'Google Interland', url: 'https://beinternetawesome.withgoogle.com/en_us/interland' },
      { title: 'Digital Citizenship for Young Students', source: 'Common Sense Education', url: 'https://www.commonsense.org/education/digital-citizenship' }
    ],
    videos: {
      amharic: {
        title: 'አታላይ ሊንኮችን እና Pop-up ማስታወቂያዎችን መለየት',
        summary: 'በጌም እና በዌብሳይት ላይ የሚመጡ አታላይ መልዕክቶችን እንዴት መለየት እንደሚቻል የሚያሳይ የአማርኛ ትምህርት።',
        url: 'https://www.youtube.com/results?search_query=cyber+security+for+kids+amharic'
      },
      english: {
        title: 'How to Spot Fake Links & Pop-Ups for Kids',
        summary: 'Learn how phishing tricks work and how young learners can avoid unsafe downloads.',
        url: 'https://www.youtube.com/results?search_query=phishing+and+safe+links+for+kids'
      }
    }
  },
  {
    id: 'g1-4-cyber-3',
    title: 'Junior Digital Detective: Secret Codes & Ciphers',
    author: 'Melaku Deguale',
    category: 'Cyber',
    difficulty: 'Advanced',
    level: '1 - 4 Grade',
    year: '',
    icon: '🛡️',
    description: 'Hands-on puzzle book introducing secret Caesar ciphers, encryption, and how computers protect messages.',
    bookChapters: [
      { title: 'Chapter 1: What is Encryption?', content: 'Encryption turns readable text (Plaintext) into a secret code (Ciphertext) so only the right person can read it.' },
      { title: 'Chapter 2: The Caesar Shift Wheel', content: 'Shift every letter forward by 1 or 2 places! For example, with Shift +1, A becomes B, B becomes C, and CAT becomes DBU.' },
      { title: 'Chapter 3: Protecting Devices', content: 'Locking tablets, updating apps, and keeping Wi-Fi safe protect our digital world.' }
    ],
    pdfInfo: { fileName: 'Grade_1_4_Cyber_Advanced_Secret_Ciphers.pdf', pages: '26 Pages', url: '' },
    readingLinks: [
      { title: 'Caesar Cipher Interactive Explorer', source: 'CryptoClub for Kids', url: 'https://www.cryptoclub.org/' },
      { title: 'How Computers Keep Secrets', source: 'CS Unplugged', url: 'https://www.csunplugged.org/en/' }
    ],
    videos: {
      amharic: {
        title: 'ሚስጥራዊ ኮዶች እና Encryption እንዴት ይሰራሉ?',
        summary: 'ኮምፒውተሮች መልዕክቶችን በሚስጥር ኮድ (Cipher) እንዴት እንደሚደብቁ ለህፃናት በቀላሉ የሚያስረዳ ቪዲዮ።',
        url: 'https://www.youtube.com/results?search_query=encryption+for+kids+amharic'
      },
      english: {
        title: 'Cryptography & Secret Ciphers for Kids',
        summary: 'Discover how Caesar ciphers and encryption keep messages safe on the internet.',
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
    difficulty: 'Beginner',
    level: '1 - 4 Grade',
    year: '',
    icon: '🧠',
    description: 'Discover how voice assistants, smart cameras, and educational apps recognize voices and pictures.',
    bookChapters: [
      { title: 'Chapter 1: What is Artificial Intelligence?', content: 'AI is when computers learn to do smart tasks like recognizing faces, understanding speech, and playing chess.' },
      { title: 'Chapter 2: AI Helpers at Home & School', content: 'Voice assistants, language translators, and smart spell-checkers all use AI.' },
      { title: 'Chapter 3: Machines vs. Humans', content: 'Computers are fast at math and patterns, while humans have feelings, imagination, and kindness.' }
    ],
    pdfInfo: { fileName: 'Grade_1_4_AI_Beginner_Smart_Machines.pdf', pages: '20 Pages', url: '' },
    readingLinks: [
      { title: 'AI for Oceans (Interactive Kids Activity)', source: 'Code.org AI', url: 'https://code.org/oceans' },
      { title: 'What is AI? Kid-Friendly Guide', source: 'MIT Media Lab Kids', url: 'https://raise.mit.edu/' }
    ],
    videos: {
      amharic: {
        title: 'አርቴፊሻል ኢንተለጀንስ (AI) ምንድን ነው? (ለህፃናት)',
        summary: 'ስማርት ኮምፒውተሮች እና AI በዕለት ተዕለት ህይወታችን እንዴት እንደሚረዱን በአማርኛ የሚያስተምር ቪዲዮ።',
        url: 'https://www.youtube.com/results?search_query=artificial+intelligence+for+kids+amharic'
      },
      english: {
        title: 'What is Artificial Intelligence? AI for Kids',
        summary: 'Simple animated introduction to AI, smart machines, and how computers learn.',
        url: 'https://www.youtube.com/results?search_query=artificial+intelligence+for+kids+grade+1+to+4'
      }
    }
  },
  {
    id: 'g1-4-ai-2',
    title: 'Teaching Computers with Patterns & Pictures',
    author: 'Dr. Selamawit A.',
    category: 'AI',
    difficulty: 'Intermediate',
    level: '1 - 4 Grade',
    year: '',
    icon: '🧠',
    description: 'Interactive activities showing how machines learn from examples by sorting shapes, animals, and sounds.',
    bookChapters: [
      { title: 'Chapter 1: Learning from Examples (Training Data)', content: 'To teach an AI to recognize a cat, we show it hundreds of cat pictures—this collection is called Training Data.' },
      { title: 'Chapter 2: Finding Patterns', content: 'AI looks for features like pointy ears, whiskers, and shapes to tell cats apart from dogs.' },
      { title: 'Chapter 3: Testing What AI Learned', content: 'After training, we test the AI with brand-new pictures to see if it guesses correctly!' }
    ],
    pdfInfo: { fileName: 'Grade_1_4_AI_Intermediate_Patterns.pdf', pages: '24 Pages', url: '' },
    readingLinks: [
      { title: 'Teachable Machine (Train AI with Camera/Sound)', source: 'Google Teachable Machine', url: 'https://teachablemachine.withgoogle.com/' },
      { title: 'Quick, Draw! (AI Drawing Recognition)', source: 'Google AI Experiments', url: 'https://quickdraw.withgoogle.com/' }
    ],
    videos: {
      amharic: {
        title: 'ኮምፒውተሮች ምስሎችን እና ድምጾችን እንዴት ይለያሉ?',
        summary: 'AI ከምሳሌዎች (Training Data) በመማር እንስሳትን እና ቅርጾችን እንዴት እንደሚለይ የሚያሳይ የአማርኛ ቪዲዮ።',
        url: 'https://www.youtube.com/results?search_query=machine+learning+for+kids+amharic'
      },
      english: {
        title: 'How Machine Learning Works for Kids',
        summary: 'See how computers use training data and patterns to recognize drawings, faces, and voices.',
        url: 'https://www.youtube.com/results?search_query=machine+learning+for+kids+explained'
      }
    }
  },
  {
    id: 'g1-4-ai-3',
    title: 'AI Logic & Smart Decisions for Kids',
    author: 'Dr. Selamawit A.',
    category: 'AI',
    difficulty: 'Advanced',
    level: '1 - 4 Grade',
    year: '',
    icon: '🧠',
    description: 'Learn how AI makes step-by-step decisions, why fair examples matter, and how smart sensors work together.',
    bookChapters: [
      { title: 'Chapter 1: Decision Trees (If-Then Rules)', content: 'AI uses decision trees: IF it has wings AND feathers, THEN it is likely a bird!' },
      { title: 'Chapter 2: Fair & Complete Data', content: 'If we only show AI red apples, it might not recognize green apples. Good AI needs balanced examples.' },
      { title: 'Chapter 3: Responsible AI Use', content: 'Always double-check AI answers and use AI tools to help you learn, not to cheat.' }
    ],
    pdfInfo: { fileName: 'Grade_1_4_AI_Advanced_Smart_Decisions.pdf', pages: '28 Pages', url: '' },
    readingLinks: [
      { title: 'Machine Learning for Kids (Scratch + AI)', source: 'machinelearningforkids.co.uk', url: 'https://machinelearningforkids.co.uk/' },
      { title: 'AI Ethics for Young Learners', source: 'Code.org', url: 'https://code.org/ai' }
    ],
    videos: {
      amharic: {
        title: 'AI ውሳኔዎችን እንዴት ይወስናል? (Decision Trees)',
        summary: 'አርቴፊሻል ኢንተለጀንስ ጥያቄዎችን እየጠየቀ ትክክለኛ ውሳኔ ላይ እንዴት እንደሚደርስ የሚያስተምር ቪዲዮ።',
        url: 'https://www.youtube.com/results?search_query=ai+decision+making+for+kids+amharic'
      },
      english: {
        title: 'How AI Makes Decisions & Fair Data for Kids',
        summary: 'Learn about decision trees, bias in training data, and building smart AI projects.',
        url: 'https://www.youtube.com/results?search_query=ai+ethics+and+decision+trees+for+kids'
      }
    }
  },

  // ================= 1 - 4 GRADE: DEVELOPER =================
  {
    id: 'g1-4-dev-1',
    title: 'Step-by-Step Logic & Unplugged Coding',
    author: 'Hana M.',
    category: 'Developer',
    difficulty: 'Beginner',
    level: '1 - 4 Grade',
    year: '',
    icon: '💻',
    description: 'Learn sequences, algorithms, and debugging using fun maze puzzles and everyday instructions.',
    bookChapters: [
      { title: 'Chapter 1: What is an Algorithm?', content: 'An algorithm is a clear list of steps to solve a problem—just like a recipe for making tea or brushing your teeth!' },
      { title: 'Chapter 2: Sequence Matters', content: 'Computers follow instructions in exact order. Putting on shoes before socks causes a silly bug!' },
      { title: 'Chapter 3: Finding & Fixing Bugs', content: 'A mistake in code is called a "Bug", and fixing it is called "Debugging".' }
    ],
    pdfInfo: { fileName: 'Grade_1_4_Developer_Beginner_Logic.pdf', pages: '19 Pages', url: '' },
    readingLinks: [
      { title: 'Code.org Pre-Reader Express Course', source: 'studio.code.org', url: 'https://studio.code.org/courses' },
      { title: 'CS Unplugged: Kid-Friendly Algorithms', source: 'csunplugged.org', url: 'https://www.csunplugged.org/en/' }
    ],
    videos: {
      amharic: {
        title: 'ኮዲንግ (Coding) እና አልጎሪዝም ምንድን ናቸው? (ለህፃናት)',
        summary: 'ለኮምፒውተር ደረጃ በደረጃ ትዕዛዝ መስጠትን እና ስህተትን (Bug) ማስተካከልን በአማርኛ የሚያስተምር ቪዲዮ።',
        url: 'https://www.youtube.com/results?search_query=coding+for+kids+in+amharic'
      },
      english: {
        title: 'Algorithms, Sequences & Debugging for Kids',
        summary: 'Learn the building blocks of computer programming with fun real-world examples.',
        url: 'https://www.youtube.com/results?search_query=coding+algorithms+and+debugging+for+kids'
      }
    }
  },
  {
    id: 'g1-4-dev-2',
    title: 'ScratchJr & Visual Block Storytelling',
    author: 'Hana M.',
    category: 'Developer',
    difficulty: 'Intermediate',
    level: '1 - 4 Grade',
    year: '',
    icon: '💻',
    description: 'Create animated stories, talking characters, and loops using drag-and-drop coding blocks.',
    bookChapters: [
      { title: 'Chapter 1: Meet the Sprites & Stage', content: 'Characters in Scratch are called "Sprites", and the background where they move is called the "Stage".' },
      { title: 'Chapter 2: Repeat Loops Save Time!', content: 'Instead of writing "Move Forward" 10 times, use a Repeat (10) Loop block!' },
      { title: 'Chapter 3: Adding Sounds & Speech Bubbles', content: 'Make your characters talk, jump, and change costumes when clicked.' }
    ],
    pdfInfo: { fileName: 'Grade_1_4_Developer_Intermediate_Scratch.pdf', pages: '25 Pages', url: '' },
    readingLinks: [
      { title: 'Scratch Official Beginner Tutorials', source: 'scratch.mit.edu', url: 'https://scratch.mit.edu/projects/editor/?tutorial=getStarted' },
      { title: 'ScratchJr Activities Guide', source: 'scratchjr.org', url: 'https://www.scratchjr.org/teach/activities' }
    ],
    videos: {
      amharic: {
        title: 'በScratch ጌም እና አኒሜሽን መስራት (ለጀማሪ ልጆች)',
        summary: 'የኮድ ብሎኮችን በማገናኘት ተንቀሳቃሽ ታሪኮችን እና ሉፖችን (Loops) መስራት የሚያሳይ የአማርኛ ቪዲዮ።',
        url: 'https://www.youtube.com/results?search_query=scratch+programming+for+kids+amharic'
      },
      english: {
        title: 'Scratch Coding for Kids: Sprites & Loops',
        summary: 'Step-by-step Scratch tutorial showing how to animate characters and use repeat loops.',
        url: 'https://www.youtube.com/results?search_query=scratch+tutorial+for+kids+grade+1+to+4'
      }
    }
  },
  {
    id: 'g1-4-dev-3',
    title: 'Junior Game Maker: Events & Variables',
    author: 'Hana M.',
    category: 'Developer',
    difficulty: 'Advanced',
    level: '1 - 4 Grade',
    year: '',
    icon: '💻',
    description: 'Build multi-level mini games with score counters (Variables), If-Else conditions, and keyboard controls.',
    bookChapters: [
      { title: 'Chapter 1: Events (When Key Pressed)', content: 'Events trigger actions—such as pressing the Spacebar to make a hero jump.' },
      { title: 'Chapter 2: Score Variables', content: 'A Variable is like a labeled box that stores changing numbers, such as Score = 0 or Lives = 3.' },
      { title: 'Chapter 3: If-Then Conditions', content: 'Use "If touching star, then add +1 to Score" to make interactive game rules!' }
    ],
    pdfInfo: { fileName: 'Grade_1_4_Developer_Advanced_GameMaker.pdf', pages: '30 Pages', url: '' },
    readingLinks: [
      { title: 'Scratch Chase & Score Game Tutorial', source: 'scratch.mit.edu', url: 'https://scratch.mit.edu/ideas' },
      { title: 'Blockly Games (Logic & Conditionals)', source: 'blockly.games', url: 'https://blockly.games/' }
    ],
    videos: {
      amharic: {
        title: 'በScratch ነጥብ የሚቆጥር ጌም መስራት (Variables & Conditions)',
        summary: 'Variable እና If-Then በመጠቀም ሙሉ ጌም እንዴት እንደሚሰራ የሚያሳይ የአማርኛ ቪዲዮ።',
        url: 'https://www.youtube.com/results?search_query=scratch+game+tutorial+amharic'
      },
      english: {
        title: 'Make a Score Game in Scratch: Variables & Conditionals',
        summary: 'Learn how events, variables, and if-then logic power real video games.',
        url: 'https://www.youtube.com/results?search_query=scratch+variables+and+conditionals+for+kids'
      }
    }
  },

  // ================= 1 - 4 GRADE: ROBOTICS =================
  {
    id: 'g1-4-rob-1',
    title: 'Meet the Robots: Parts & Simple Machines',
    author: 'Dawit K.',
    category: 'Robotics',
    difficulty: 'Beginner',
    level: '1 - 4 Grade',
    year: '',
    icon: '🤖',
    description: 'Explore wheels, gears, motors, and batteries to understand how robots move and help people.',
    bookChapters: [
      { title: 'Chapter 1: What Makes a Machine a Robot?', content: 'A robot is a programmable machine that can sense the world, think with a controller, and move or act.' },
      { title: 'Chapter 2: Motors, Wheels & Gears', content: 'Motors spin wheels and gears so a robot can drive forward, turn left, or lift objects.' },
      { title: 'Chapter 3: Power & Batteries', content: 'Batteries store electrical energy that powers the robot’s brain and motors.' }
    ],
    pdfInfo: { fileName: 'Grade_1_4_Robotics_Beginner_Parts.pdf', pages: '20 Pages', url: '' },
    readingLinks: [
      { title: 'NASA Robotics for Kids', source: 'NASA Space Place', url: 'https://spaceplace.nasa.gov/search/robots/' },
      { title: 'How Robots Work (DK Find Out)', source: 'DK Kids Science', url: 'https://www.dkfindout.com/us/science/robots/' }
    ],
    videos: {
      amharic: {
        title: 'ሮቦት ምንድን ነው? እንዴትስ ይንቀሳቀሳል? (ለህፃናት)',
        summary: 'ስለ ሮቦት ዋና ዋና ክፍሎች (ሞተር፣ ባትሪ፣ ጎማ እና ሴንሰር) በአማርኛ የሚያስተምር ቪዲዮ።',
        url: 'https://www.youtube.com/results?search_query=robotics+for+kids+amharic'
      },
      english: {
        title: 'What is a Robot? Robotics for Kids',
        summary: 'Discover robot parts, motors, gears, and how robots help doctors, explorers, and factories.',
        url: 'https://www.youtube.com/results?search_query=what+is+a+robot+for+kids+grade+1+to+4'
      }
    }
  },
  {
    id: 'g1-4-rob-2',
    title: 'Lights, Buzzers & Basic Circuits Lab',
    author: 'Dawit K.',
    category: 'Robotics',
    difficulty: 'Intermediate',
    level: '1 - 4 Grade',
    year: '',
    icon: '🤖',
    description: 'Safe beginner experiments with LEDs, switches, buzzers, and simple sensors.',
    bookChapters: [
      { title: 'Chapter 1: Complete Electrical Circuits', content: 'Electricity flows in a closed loop from the battery (+), through an LED light, and back to (-).' },
      { title: 'Chapter 2: Switches & Buzzers', content: 'A switch opens or closes the path—just like a light switch on your classroom wall!' },
      { title: 'Chapter 3: Robot Sensors (Eyes & Ears)', content: 'Light sensors, touch buttons, and distance sensors let robots detect walls and objects.' }
    ],
    pdfInfo: { fileName: 'Grade_1_4_Robotics_Intermediate_Circuits.pdf', pages: '24 Pages', url: '' },
    readingLinks: [
      { title: 'Tinkercad Circuits for Kids', source: 'tinkercad.com', url: 'https://www.tinkercad.com/circuits' },
      { title: 'Simple Circuits & Electricity Guide', source: 'BBC Bitesize Science', url: 'https://www.bbc.co.uk/bitesize/topics/zj44jxs' }
    ],
    videos: {
      amharic: {
        title: 'ቀላል የኤሌክትሪክ ሰርኪዩት እና LED መብራት መስራት',
        summary: 'ባትሪ፣ ስዊች እና LED በማገናኘት ሰርኪዩት እንዴት እንደሚሰራ የሚያሳይ የአማርኛ ቪዲዮ።',
        url: 'https://www.youtube.com/results?search_query=simple+circuits+for+kids+amharic'
      },
      english: {
        title: 'Simple Circuits, LEDs & Sensors for Kids',
        summary: 'Learn how closed circuits, switches, and robot sensors work together.',
        url: 'https://www.youtube.com/results?search_query=simple+circuits+and+sensors+for+kids'
      }
    }
  },
  {
    id: 'g1-4-rob-3',
    title: 'Programmable Mini-Bot Challenges',
    author: 'Dawit K.',
    category: 'Robotics',
    difficulty: 'Advanced',
    level: '1 - 4 Grade',
    year: '',
    icon: '🤖',
    description: 'Program a mini robot to follow black lines, avoid obstacles, and complete grid missions.',
    bookChapters: [
      { title: 'Chapter 1: Sense -> Think -> Act Loop', content: 'Every smart robot repeats three steps: Sense the obstacle, Think about which way to turn, and Act with its motors.' },
      { title: 'Chapter 2: Obstacle Avoidance Logic', content: 'IF distance sensor sees a wall ahead, THEN stop and turn right 90 degrees!' },
      { title: 'Chapter 3: Line-Following Robots', content: 'Infrared sensors detect dark lines on white floors so the robot stays on track.' }
    ],
    pdfInfo: { fileName: 'Grade_1_4_Robotics_Advanced_MiniBot.pdf', pages: '28 Pages', url: '' },
    readingLinks: [
      { title: 'MakeCode Micro:bit Robot Simulator', source: 'makecode.microbit.org', url: 'https://makecode.microbit.org/' },
      { title: 'VEXcode VR (Virtual Robot Playground)', source: 'vr.vex.com', url: 'https://vr.vex.com/' }
    ],
    videos: {
      amharic: {
        title: 'እንቅፋት የሚያልፍ እና መስመር የሚከተል ሮቦት ፕሮግራሚንግ',
        summary: 'ሮቦቶች ሴንሰር በመጠቀም ግድግዳ ሳይገጩ እንዴት እንደሚጓዙ የሚያሳይ የአማርኛ ቪዲዮ።',
        url: 'https://www.youtube.com/results?search_query=robot+programming+for+kids+amharic'
      },
      english: {
        title: 'Robot Sense-Think-Act & Obstacle Avoidance for Kids',
        summary: 'Explore how robots use sensors and code to solve mazes and avoid obstacles.',
        url: 'https://www.youtube.com/results?search_query=obstacle+avoiding+robot+explained+for+kids'
      }
    }
  }
];
