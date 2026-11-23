const QuizEngine = {
  createRng(seedStr) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < seedStr.length; i++) {
      h ^= seedStr.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return function () {
      h += h << 13;
      h ^= h >>> 7;
      h += h << 3;
      h ^= h >>> 17;
      h += h << 5;
      return (h >>> 0) / 4294967296;
    };
  },

  shuffleWithRng(arr, rng) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  },

  getTierInfo(level) {
    if (level <= 30) return { key: 'easy', label: 'Easy (ቀላል)', cls: 'tier-easy' };
    if (level <= 70) return { key: 'medium', label: 'Medium (መካከለኛ)', cls: 'tier-medium' };
    return { key: 'hard', label: 'Hard (ከባድ)', cls: 'tier-hard' };
  },

  /* ================= VISUAL / IMAGE QUESTIONS (SVG DIAGRAMS) ================= */
  getImageQuestions(category, level) {
    const shift = (level % 4) + 1;
    const shiftChar = (ch, s) => String.fromCharCode(((ch.charCodeAt(0) - 65 + s) % 26) + 65);

    if (category === 'Cyber Security') {
      const encC = shiftChar('C', shift);
      const encA = shiftChar('A', shift);
      const encT = shiftChar('T', shift);

      return [
        {
          tier: 'easy',
          q: 'Look at the browser bar image below. Why is this website UNSAFE to enter your password?',
          svg: `
            <svg width="340" height="86" viewBox="0 0 340 86" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="6" width="332" height="74" rx="12" fill="#fff" stroke="#d32f2f" stroke-width="2"/>
              <rect x="16" y="22" width="308" height="42" rx="20" fill="#fce8e6"/>
              <text x="30" y="48" font-size="18">🔓</text>
              <text x="58" y="47" font-family="monospace" font-size="13" font-weight="bold" fill="#c5221f">http://g00gle-free-coins.com</text>
            </svg>`,
          choices: [
            'It has an open padlock (HTTP) and a fake misspelled address',
            'The screen is too small',
            'It has too many math numbers',
            'The battery is low'
          ],
          answer: 0,
          explain: 'An open padlock (HTTP) and misspelled URL ("g00gle-free-coins") warn of a fake phishing website.'
        },
        {
          tier: 'medium',
          q: 'Look at the two password cards in the picture. Which password is stronger and safer?',
          svg: `
            <svg width="340" height="96" viewBox="0 0 340 96" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="10" width="152" height="76" rx="10" fill="#f4f3f8" stroke="#999"/>
              <text x="84" y="34" text-anchor="middle" font-size="12" font-weight="bold" fill="#555">Card A</text>
              <text x="84" y="60" text-anchor="middle" font-family="monospace" font-size="15" font-weight="bold" fill="#1c1b1f">123456</text>
              <rect x="180" y="10" width="152" height="76" rx="10" fill="#ede7f6" stroke="#5e35b1" stroke-width="2"/>
              <text x="256" y="34" text-anchor="middle" font-size="12" font-weight="bold" fill="#4527a0">Card B</text>
              <text x="256" y="60" text-anchor="middle" font-family="monospace" font-size="15" font-weight="bold" fill="#1b873f">L!on#2026</text>
            </svg>`,
          choices: [
            'Card B (L!on#2026) because it mixes letters, numbers, and symbols',
            'Card A (123456) because it is easy for strangers to guess',
            'Neither card has any letters',
            'Both are equally weak'
          ],
          answer: 0,
          explain: 'Card B combines uppercase, lowercase, symbols (!, #), and numbers.'
        },
        {
          tier: 'hard',
          q: `Look at the Cipher Key diagram (Shift +${shift}). Encode the secret word "CAT" using the chart!`,
          svg: `
            <svg width="340" height="96" viewBox="0 0 340 96" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="8" width="328" height="80" rx="12" fill="#ede7f6" stroke="#5e35b1"/>
              <text x="170" y="28" text-anchor="middle" font-size="12" font-weight="bold" fill="#4527a0">Secret Cipher Chart (Shift +${shift})</text>
              <text x="170" y="54" text-anchor="middle" font-family="monospace" font-size="14" font-weight="bold" fill="#1c1b1f">A → ${encA}   |   C → ${encC}   |   T → ${encT}</text>
              <text x="170" y="76" text-anchor="middle" font-size="12" fill="#555">Plain Word: C - A - T</text>
            </svg>`,
          choices: [
            `${encC}${encA}${encT}`,
            `${encA}${encC}${encT}`,
            `CAT`,
            `XYZ`
          ],
          answer: 0,
          explain: `From the diagram: C→${encC}, A→${encA}, T→${encT}, forming "${encC}${encA}${encT}".`
        }
      ];
    }

    if (category === 'AI') {
      return [
        {
          tier: 'easy',
          q: 'Look at the AI pattern picture below. Which shape comes next in the sequence?',
          svg: `
            <svg width="340" height="86" viewBox="0 0 340 86" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="8" width="328" height="70" rx="12" fill="#f4f3f8" stroke="#d0cde0"/>
              <polygon points="48,22 28,62 68,62" fill="#5e35b1"/>
              <circle cx="115" cy="43" r="19" fill="#1b873f"/>
              <polygon points="182,22 162,62 202,62" fill="#5e35b1"/>
              <circle cx="248" cy="43" r="19" fill="#1b873f"/>
              <rect x="286" y="23" width="36" height="40" rx="8" fill="#fff" stroke="#5e35b1" stroke-dasharray="4"/>
              <text x="304" y="50" text-anchor="middle" font-size="20" font-weight="bold" fill="#5e35b1">?</text>
            </svg>`,
          choices: [
            'Purple Triangle',
            'Green Circle',
            'Yellow Star',
            'Black Square'
          ],
          answer: 0,
          explain: 'The pattern alternates Triangle → Circle → Triangle → Circle → Triangle.'
        },
        {
          tier: 'medium',
          q: 'Look at the Training Data picture below. Why did the AI fail to recognize the Green Apple?',
          svg: `
            <svg width="340" height="104" viewBox="0 0 340 104" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="8" width="185" height="88" rx="10" fill="#fff" stroke="#5e35b1"/>
              <text x="98" y="26" text-anchor="middle" font-size="11" font-weight="bold" fill="#4527a0">AI Training Box</text>
              <text x="98" y="56" text-anchor="middle" font-size="24">🍎 🍎 🍎 🍎</text>
              <text x="98" y="80" text-anchor="middle" font-size="11" fill="#555">Only Red Apples Given</text>
              <text x="210" y="58" font-size="20">➔</text>
              <rect x="235" y="18" width="98" height="68" rx="10" fill="#fce8e6" stroke="#c5221f"/>
              <text x="284" y="48" text-anchor="middle" font-size="24">🍏❓</text>
              <text x="284" y="72" text-anchor="middle" font-size="11" font-weight="bold" fill="#c5221f">Unknown!</text>
            </svg>`,
          choices: [
            'The AI was only trained on red apples and had zero green apple examples',
            'Green apples are not fruit',
            'The monitor was unplugged',
            'AI cannot see colors at all'
          ],
          answer: 0,
          explain: 'AI only learns from the examples in its Training Data.'
        },
        {
          tier: 'hard',
          q: 'Follow the AI Decision Tree image for an animal with: Wings = YES, Feathers = NO. What does the AI decide?',
          svg: `
            <svg width="340" height="118" viewBox="0 0 340 118" xmlns="http://www.w3.org/2000/svg">
              <rect x="95" y="6" width="150" height="30" rx="8" fill="#5e35b1"/>
              <text x="170" y="25" text-anchor="middle" font-size="12" font-weight="bold" fill="#fff">Has Wings?</text>
              <line x1="130" y1="36" x2="75" y2="56" stroke="#555" stroke-width="2"/>
              <line x1="210" y1="36" x2="265" y2="56" stroke="#555" stroke-width="2"/>
              <text x="86" y="48" font-size="11" font-weight="bold" fill="#1b873f">YES</text>
              <text x="245" y="48" font-size="11" font-weight="bold" fill="#c5221f">NO</text>
              <rect x="14" y="56" width="122" height="28" rx="8" fill="#ede7f6" stroke="#5e35b1"/>
              <text x="75" y="74" text-anchor="middle" font-size="11" font-weight="bold" fill="#4527a0">Has Feathers?</text>
              <rect x="215" y="56" width="110" height="28" rx="8" fill="#f4f3f8" stroke="#999"/>
              <text x="270" y="74" text-anchor="middle" font-size="11" fill="#333">Land Animal</text>
              <text x="28" y="106" font-size="11" font-weight="bold" fill="#137333">YES → Bird</text>
              <text x="96" y="106" font-size="11" font-weight="bold" fill="#b06000">NO → Bat / Insect</text>
            </svg>`,
          choices: [
            'Bat / Insect',
            'Bird',
            'Land Animal',
            'Fish'
          ],
          answer: 0,
          explain: 'Following Wings = YES goes to "Has Feathers?", and NO leads to "Bat / Insect".'
        }
      ];
    }

    if (category === 'Developer') {
      const repeatN = (level % 4) + 3;
      const stepPts = (level % 3) + 2;
      return [
        {
          tier: 'easy',
          q: 'Look at the grid map below. If the robot follows [ ⬆️ Up, ➡️ Right, ➡️ Right ], which star does it reach?',
          svg: `
            <svg width="340" height="106" viewBox="0 0 340 106" xmlns="http://www.w3.org/2000/svg">
              <rect x="70" y="10" width="200" height="86" fill="#fff" stroke="#5e35b1" stroke-width="2"/>
              <line x1="136" y1="10" x2="136" y2="96" stroke="#d0cde0"/>
              <line x1="203" y1="10" x2="203" y2="96" stroke="#d0cde0"/>
              <line x1="70" y1="53" x2="270" y2="53" stroke="#d0cde0"/>
              <text x="103" y="38" text-anchor="middle" font-size="16">🔵</text>
              <text x="236" y="38" text-anchor="middle" font-size="16">⭐ Gold</text>
              <text x="103" y="80" text-anchor="middle" font-size="18">🤖 Start</text>
              <text x="236" y="80" text-anchor="middle" font-size="16">🟢</text>
            </svg>`,
          choices: [
            '⭐ Gold (Top-Right)',
            '🔵 (Top-Left)',
            '🟢 (Bottom-Right)',
            '🤖 Start (Bottom-Left)'
          ],
          answer: 0,
          explain: 'Moving 1 step Up reaches Top-Left, and 2 steps Right reaches Top-Right (⭐ Gold).'
        },
        {
          tier: 'medium',
          q: 'Look at the Scratch code blocks in the image. What happens when the user presses the Spacebar?',
          svg: `
            <svg width="340" height="104" viewBox="0 0 340 104" xmlns="http://www.w3.org/2000/svg">
              <rect x="40" y="10" width="260" height="34" rx="10" fill="#ffab19"/>
              <text x="170" y="32" text-anchor="middle" font-size="13" font-weight="bold" fill="#fff">When [Space] Key Pressed</text>
              <rect x="52" y="48" width="236" height="34" rx="8" fill="#4c97ff"/>
              <text x="170" y="70" text-anchor="middle" font-size="13" font-weight="bold" fill="#fff">Change Y by +20 (Jump!)</text>
            </svg>`,
          choices: [
            'The character jumps upward (Y changes by +20)',
            'The game deletes itself',
            'The computer shuts down',
            'Nothing happens at all'
          ],
          answer: 0,
          explain: 'The orange Event block triggers the blue Motion block when Space is pressed.'
        },
        {
          tier: 'hard',
          q: `Look at the Loop & Variable blocks in the picture. What will "Score" equal when the loop finishes?`,
          svg: `
            <svg width="340" height="116" viewBox="0 0 340 116" xmlns="http://www.w3.org/2000/svg">
              <rect x="35" y="8" width="270" height="28" rx="8" fill="#ff8c1a"/>
              <text x="170" y="26" text-anchor="middle" font-size="12" font-weight="bold" fill="#fff">Set [Score] to 0</text>
              <rect x="35" y="40" width="270" height="68" rx="10" fill="#ffab19"/>
              <text x="170" y="60" text-anchor="middle" font-size="12" font-weight="bold" fill="#fff">Repeat (${repeatN}) times:</text>
              <rect x="55" y="68" width="230" height="28" rx="6" fill="#ff8c1a"/>
              <text x="170" y="86" text-anchor="middle" font-size="12" font-weight="bold" fill="#fff">Change [Score] by +${stepPts}</text>
            </svg>`,
          choices: [
            `${repeatN * stepPts}`,
            `${repeatN + stepPts}`,
            `${stepPts}`,
            `0`
          ],
          answer: 0,
          explain: `Starting at 0 and adding +${stepPts} a total of ${repeatN} times gives ${repeatN * stepPts}.`
        }
      ];
    }

    // Robotics
    return [
      {
        tier: 'easy',
        q: 'Look at the circuit picture below. Why is the LED light bulb currently OFF?',
        svg: `
          <svg width="340" height="96" viewBox="0 0 340 96" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="26" width="54" height="44" rx="6" fill="#5e35b1"/>
            <text x="47" y="52" text-anchor="middle" font-size="11" font-weight="bold" fill="#fff">Battery</text>
            <line x1="74" y1="36" x2="145" y2="36" stroke="#333" stroke-width="3"/>
            <line x1="145" y1="36" x2="182" y2="16" stroke="#d32f2f" stroke-width="3"/>
            <text x="165" y="54" text-anchor="middle" font-size="11" font-weight="bold" fill="#c5221f">Open Switch</text>
            <line x1="190" y1="36" x2="265" y2="36" stroke="#333" stroke-width="3"/>
            <circle cx="285" cy="48" r="20" fill="#e0e0e0" stroke="#777" stroke-width="2"/>
            <text x="285" y="52" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">LED</text>
            <line x1="74" y1="62" x2="265" y2="62" stroke="#333" stroke-width="3"/>
          </svg>`,
        choices: [
          'The switch is OPEN, so electricity cannot complete the loop',
          'LEDs never use batteries',
          'The wire is too short',
          'Robots do not use electricity'
        ],
        answer: 0,
        explain: 'Electricity only flows when the switch is closed to form a complete circuit.'
      },
      {
        tier: 'medium',
        q: 'Look at the robot sensor diagram below. The ultrasonic sensor sees a wall 5 cm ahead. What should the robot do?',
        svg: `
          <svg width="340" height="96" viewBox="0 0 340 96" xmlns="http://www.w3.org/2000/svg">
            <rect x="24" y="24" width="90" height="48" rx="12" fill="#5e35b1"/>
            <text x="69" y="53" text-anchor="middle" font-size="13" font-weight="bold" fill="#fff">🤖 Robot</text>
            <line x1="122" y1="48" x2="255" y2="48" stroke="#1b873f" stroke-width="2" stroke-dasharray="5"/>
            <text x="188" y="38" text-anchor="middle" font-size="12" font-weight="bold" fill="#c5221f">Wall: 5 cm!</text>
            <rect x="265" y="12" width="32" height="72" rx="4" fill="#424242"/>
          </svg>`,
        choices: [
          'Stop and turn right/left to avoid hitting the wall',
          'Speed up straight into the wall',
          'Turn off its sensors',
          'Drop its wheels'
        ],
        answer: 0,
        explain: 'Obstacle-avoiding robots stop and turn when a wall is detected close ahead.'
      },
      {
        tier: 'hard',
        q: 'Look at the Line-Follower Robot picture. Left IR sensor sees WHITE, Right IR sensor sees BLACK line. Which way must the robot steer?',
        svg: `
          <svg width="340" height="106" viewBox="0 0 340 106" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="10" width="300" height="86" rx="12" fill="#fff" stroke="#ccc"/>
            <path d="M 185 10 Q 210 53 235 96" stroke="#1c1b1f" stroke-width="14" fill="none"/>
            <rect x="115" y="34" width="96" height="38" rx="8" fill="#ede7f6" stroke="#5e35b1" stroke-width="2"/>
            <circle cx="132" cy="53" r="7" fill="#fff" stroke="#333"/>
            <circle cx="194" cy="53" r="7" fill="#1c1b1f"/>
            <text x="82" y="57" font-size="11" font-weight="bold" fill="#555">L: White</text>
            <text x="242" y="57" font-size="11" font-weight="bold" fill="#1c1b1f">R: Black</text>
          </svg>`,
        choices: [
          'Steer Right to stay centered on the black track',
          'Steer Left away from the track',
          'Drive backwards forever',
          'Spin in place without moving'
        ],
        answer: 0,
        explain: 'Since the black line curves under the Right sensor, the robot steers Right to follow it.'
      }
    ];
  },

  /* ================= TEXT QUESTIONS GRADED BY TIER (EASY -> MEDIUM -> HARD) ================= */
  QUESTION_BANKS: {
    'Cyber Security': {
      easy: [
        { q: 'What should you do if a stranger asks for your home address online?', choices: ['Keep it private and tell a parent or teacher', 'Send your address right away', 'Post your phone number', 'Share your password'], answer: 0, explain: 'Personal information must stay private.' },
        { q: 'Should you share your account password with classmates?', choices: ['No, keep passwords secret', 'Yes, write it on the board', 'Post it in group chat', 'Tell everyone'], answer: 0, explain: 'Passwords protect your private accounts.' },
        { q: 'Who is a "Trusted Adult" you can ask for help when something looks strange online?', choices: ['A parent, guardian, or teacher', 'An unknown gamer', 'A pop-up ad', 'A stranger'], answer: 0, explain: 'Parents and teachers help you stay safe.' },
        { q: 'Why do we lock a tablet or computer when stepping away?', choices: ['So nobody else changes our files or account', 'To make the screen heavier', 'To delete our books', 'To turn off the lights'], answer: 0, explain: 'Locking devices protects your work.' }
      ],
      medium: [
        { q: 'What does a pop-up saying "You won 1,000,000 FREE coins! Click now!" usually mean?', choices: ['It is a phishing trick to fool you', 'Your teacher sent free money', 'Your Wi-Fi is upgrading', 'The battery is charging'], answer: 0, explain: 'Fake prize pop-ups try to trick users into clicking unsafe links.' },
        { q: 'What is turning a readable message into a secret code called?', choices: ['Encryption', 'Printing', 'Painting', 'Erasing'], answer: 0, explain: 'Encryption scrambles readable text into secret code.' },
        { q: 'Before downloading a new game on a shared tablet, what should you do?', choices: ['Ask a parent or teacher first', 'Click every download button', 'Turn off antivirus', 'Enter your parent’s PIN'], answer: 0, explain: 'Always verify downloads with a trusted adult.' },
        { q: 'Which information is SAFE to share in a school coding club?', choices: ['Your favorite hobby or color', 'Your home street address', 'Your password', 'Your phone number'], answer: 0, explain: 'Hobbies do not expose private identity.' }
      ],
      hard: [
        { q: 'If "DOG" is shifted forward by +1 letter (Caesar Cipher), what is the encrypted word?', choices: ['EPH', 'CNF', 'DOG', 'FQI'], answer: 0, explain: 'D+1=E, O+1=P, G+1=H → EPH.' },
        { q: 'Why does HTTPS encrypt data sent between your browser and a website?', choices: ['So hackers on public Wi-Fi cannot read your passwords', 'To make text purple', 'To drain battery faster', 'To turn off the keyboard'], answer: 0, explain: 'HTTPS protects data in transit from eavesdroppers.' },
        { q: 'An email claims to be from your school ("admin@sch00l-prize.net") asking for your password. What attack is this?', choices: ['Phishing', 'Robotics', '3D Printing', 'Debugging'], answer: 0, explain: 'Phishing uses fake look-alike addresses to steal passwords.' },
        { q: 'To unlock an encrypted message made with Shift +3, what must the receiver do?', choices: ['Shift each letter backward by 3 (-3)', 'Shift forward by +10', 'Delete every vowel', 'Reverse the monitor'], answer: 0, explain: 'Decryption reverses the encryption shift (-3).' }
      ]
    },
    AI: {
      easy: [
        { q: 'What does "AI" stand for?', choices: ['Artificial Intelligence', 'Animal Island', 'Apple Internet', 'Automatic Ice'], answer: 0, explain: 'AI stands for Artificial Intelligence.' },
        { q: 'Which everyday helper uses AI?', choices: ['A voice assistant that answers spoken questions', 'A wooden pencil', 'A paper notebook', 'A plastic ruler'], answer: 0, explain: 'Voice assistants use speech AI.' },
        { q: 'What can humans feel that AI computers CANNOT truly feel?', choices: ['Real emotions, kindness, and empathy', 'Adding numbers fast', 'Sorting words', 'Playing chess'], answer: 0, explain: 'Humans have genuine feelings and consciousness.' },
        { q: 'Which sensor helps a smart speaker hear your voice?', choices: ['Microphone', 'Wheel', 'Flashlight', 'Thermometer'], answer: 0, explain: 'Microphones capture sound waves.' }
      ],
      medium: [
        { q: 'How does an AI learn to recognize cats and dogs?', choices: ['By practicing on many labeled example pictures (Training Data)', 'By eating food', 'By guessing with zero examples', 'By sleeping'], answer: 0, explain: 'AI learns patterns from Training Data.' },
        { q: 'What does a phone’s face-unlock feature use?', choices: ['Computer Vision AI', 'A magnifying glass', 'Solar water', 'A bicycle gear'], answer: 0, explain: 'Computer Vision analyzes visual features.' },
        { q: 'Finding repeated shapes, colors, or sounds in data is called:', choices: ['Pattern Recognition', 'Painting', 'Hammering', 'Printing'], answer: 0, explain: 'Pattern recognition lets AI classify inputs.' },
        { q: 'Why should students double-check answers from an AI tool?', choices: ['Because AI can occasionally make mistakes', 'Because AI never uses power', 'Because books are banned', 'Because screens are soft'], answer: 0, explain: 'AI predicts from patterns and is not 100% infallible.' }
      ],
      hard: [
        { q: 'An AI trained on 500 daytime car photos fails at night. What is the best fix?', choices: ['Add nighttime car photos to its Training Data', 'Delete all daytime photos', 'Make the speaker louder', 'Change the mouse color'], answer: 0, explain: 'Diverse training data improves accuracy across conditions.' },
        { q: 'In a Decision Tree: IF Temperature > 30°C AND Sunny = YES → Turn on Fan. If Temp = 25°C, what happens?', choices: ['The fan stays OFF because Temperature > 30°C is False', 'The fan turns ON anyway', 'The tree catches fire', 'The sensor breaks'], answer: 0, explain: 'Both AND conditions must be true for the action to trigger.' },
        { q: 'What is "Bias" in an AI system?', choices: ['Unfair or inaccurate results caused by unbalanced training data', 'A fast processor', 'A robot wheel', 'A strong password'], answer: 0, explain: 'Biased or incomplete data causes skewed AI predictions.' },
        { q: 'Which sequence shows the correct order of building a smart AI classifier?', choices: ['Collect Data → Train Model → Test on New Examples', 'Test First → Delete Data → Shut Down', 'Print Paper → Paint Screen → Sleep', 'Guess Randomly → Ignore Errors'], answer: 0, explain: 'AI models are trained on collected data before testing.' }
      ]
    },
    Developer: {
      easy: [
        { q: 'What is a step-by-step list of instructions for a computer called?', choices: ['An Algorithm', 'A Battery', 'A Sticker', 'A Pillow'], answer: 0, explain: 'Algorithms are ordered instructions.' },
        { q: 'What do programmers call a mistake in code?', choices: ['A Bug', 'A Leaf', 'A Cloud', 'A Shoe'], answer: 0, explain: 'Coding errors are called bugs.' },
        { q: 'What is fixing mistakes in a program called?', choices: ['Debugging', 'Cooking', 'Erasing', 'Painting'], answer: 0, explain: 'Debugging removes errors from code.' },
        { q: 'In Scratch, what are the characters on the stage called?', choices: ['Sprites', 'Batteries', 'Tires', 'Cables'], answer: 0, explain: 'Characters in Scratch are Sprites.' }
      ],
      medium: [
        { q: 'Which block repeats actions without writing them many times?', choices: ['A Repeat Loop', 'A Stop Sign', 'A Mute Button', 'A Delete Key'], answer: 0, explain: 'Loops repeat code automatically.' },
        { q: 'What is a "Variable" in a game?', choices: ['A labeled container that stores changing values like Score', 'A computer mouse', 'A broken wire', 'A desk'], answer: 0, explain: 'Variables store values that update during play.' },
        { q: 'Why does the order (sequence) of instructions matter?', choices: ['Computers execute instructions strictly from top to bottom', 'Computers read backwards', 'Order never matters', 'Screens only show text'], answer: 0, explain: 'Wrong order produces wrong behavior.' },
        { q: 'What does an "If-Then" block do?', choices: ['Runs code only when a condition is true', 'Turns off Wi-Fi', 'Deletes all variables', 'Restarts Windows'], answer: 0, explain: 'Conditionals make decisions in code.' }
      ],
      hard: [
        { q: 'A sprite starts at X = 0. Inside a "Repeat 4" loop, it runs "Change X by +5" then "Change X by -2". What is final X?', choices: ['12', '20', '8', '0'], answer: 0, explain: 'Each loop adds (+5 - 2) = +3. After 4 loops: 4 × 3 = 12.' },
        { q: 'In an "If Score >= 10 Then Win Else Keep Playing" block, what happens when Score is 10?', choices: ['Win runs because 10 >= 10 is True', 'Keep Playing runs', 'Score resets to -1', 'Nothing runs'], answer: 0, explain: '">=" means greater than OR equal to, so 10 satisfies the condition.' },
        { q: 'A loop runs forever without any condition to stop it. What is this called?', choices: ['An Infinite Loop', 'A Variable', 'A Sprite Costume', 'A Sound Effect'], answer: 0, explain: 'An infinite loop repeats endlessly unless stopped.' },
        { q: 'Which order correctly swaps the values of Box A = 5 and Box B = 9 using a Temp box?', choices: ['Temp = A → A = B → B = Temp', 'A = B → B = A', 'Temp = 0 → A = 0', 'B = Temp → A = 5'], answer: 0, explain: 'Saving A into Temp first prevents losing its value.' }
      ]
    },
    Robotics: {
      easy: [
        { q: 'Which part supplies electrical power to a robot?', choices: ['Battery', 'Wooden wheel', 'Paper sticker', 'Plastic cover'], answer: 0, explain: 'Batteries provide electrical energy.' },
        { q: 'What part spins to make a robot’s wheels move?', choices: ['Motor', 'Speaker', 'Camera lens', 'Rubber tire'], answer: 0, explain: 'Motors convert electricity into motion.' },
        { q: 'What does LED stand for?', choices: ['Light Emitting Diode', 'Long Electric Door', 'Little Energy Disk', 'Loud Engine Device'], answer: 0, explain: 'LED means Light Emitting Diode.' },
        { q: 'What component produces beeping alert sounds in a robot?', choices: ['Buzzer', 'Wheel', 'Screw', 'Tire'], answer: 0, explain: 'Buzzers create sound tones.' }
      ],
      medium: [
        { q: 'Which sensor acts like "eyes" to measure distance to a wall?', choices: ['Ultrasonic Distance Sensor', 'Thermometer', 'Clock', 'Buzzer'], answer: 0, explain: 'Ultrasonic sensors measure distance using sound waves.' },
        { q: 'What are the 3 continuous steps of a smart robot?', choices: ['Sense → Think → Act', 'Sleep → Eat → Stop', 'Draw → Cut → Fold', 'Read → Erase → Exit'], answer: 0, explain: 'Robots Sense, Think, and Act.' },
        { q: 'What is the programmable "brain" chip inside a robot called?', choices: ['Microcontroller', 'Tire', 'Gearbox', 'Switch'], answer: 0, explain: 'Microcontrollers run the robot’s control program.' },
        { q: 'How does a line-following robot detect a black line on a white floor?', choices: ['Infrared (IR) light sensor', 'Microphone', 'Thermometer', 'Compass'], answer: 0, explain: 'IR sensors detect dark vs. bright surfaces.' }
      ],
      hard: [
        { q: 'A robot’s left wheel spins forward while its right wheel stops. Which way does the robot turn?', choices: ['Turns Right', 'Turns Left', 'Drives straight backward', 'Flies upward'], answer: 0, explain: 'When the left wheel pushes forward and the right stays still, the robot pivots Right.' },
        { q: 'If a gear with 10 teeth drives a larger gear with 20 teeth, how many times must the small gear spin for 1 full turn of the big gear?', choices: ['2 turns', '1 turn', '10 turns', '20 turns'], answer: 0, explain: '20 ÷ 10 = 2 full rotations of the smaller gear.' },
        { q: 'Why do engineers add a resistor in series with an LED in a circuit?', choices: ['To limit electric current so the LED does not burn out', 'To make the battery heavier', 'To turn the LED into a motor', 'To block all electricity'], answer: 0, explain: 'Resistors protect LEDs from excessive current.' },
        { q: 'A robot travels 15 cm per second. How long does it take to cross a 90 cm bridge?', choices: ['6 seconds', '4 seconds', '15 seconds', '90 seconds'], answer: 0, explain: '90 cm ÷ 15 cm/s = 6 seconds.' }
      ]
    }
  },

  /* ================= GENERATE 10 PROGRESSIVE QUESTIONS FOR LEVEL 1..100 ================= */
  getQuestionsForLevel(material, level) {
    const safeLevel = Math.min(100, Math.max(1, Number(level) || 1));
    const category = this.QUESTION_BANKS[material.category] ? material.category : 'Cyber Security';
    const rng = this.createRng(`${material.id}-lvl-${safeLevel}`);
    const bank = this.QUESTION_BANKS[category];
    const imgQuestions = this.getImageQuestions(category, safeLevel);

    let selectedPool = [];

    if (safeLevel <= 30) {
      // EASY TIER (Levels 1-30): Easy image + Easy text + 1 Medium challenge at the end
      selectedPool = [
        imgQuestions[0],
        ...this.shuffleWithRng(bank.easy, rng),
        imgQuestions[1],
        ...this.shuffleWithRng(bank.medium, rng).slice(0, 4)
      ];
    } else if (safeLevel <= 70) {
      // MEDIUM TIER (Levels 31-70): Easy warm-up -> Medium & Hard image/text progression
      selectedPool = [
        ...this.shuffleWithRng(bank.easy, rng).slice(0, 2),
        imgQuestions[0],
        ...this.shuffleWithRng(bank.medium, rng).slice(0, 3),
        imgQuestions[1],
        imgQuestions[2],
        ...this.shuffleWithRng(bank.hard, rng).slice(0, 2)
      ];
    } else {
      // HARD TIER (Levels 71-100): Medium -> Hard text & complex SVG diagram questions
      selectedPool = [
        ...this.shuffleWithRng(bank.medium, rng).slice(0, 3),
        imgQuestions[1],
        ...this.shuffleWithRng(bank.hard, rng),
        imgQuestions[2],
        imgQuestions[0]
      ];
    }

    const finalTen = selectedPool.slice(0, 10);

    return finalTen.map((item, idx) => {
      const indexedChoices = item.choices.map((text, cIdx) => ({
        text,
        isCorrect: cIdx === item.answer
      }));
      const shuffledChoices = this.shuffleWithRng(indexedChoices, rng);
      const correctIndex = shuffledChoices.findIndex(c => c.isCorrect);

      return {
        number: idx + 1,
        q: item.q,
        svg: item.svg || '',
        choices: shuffledChoices.map(c => c.text),
        answer: correctIndex,
        explain: item.explain
      };
    });
  }
};
