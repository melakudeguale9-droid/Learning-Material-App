const QuizEngine = {
  // Deterministic seeded random so every Level (1..100) generates a consistent 10-question set
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

  // Dynamic level-scaled questions so Levels 1 to 100 stay fresh and progressive
  buildDynamicQuestions(category, level) {
    const shift = (level % 5) + 1;
    const stepCount = (level % 8) + 2;
    const scoreStart = (level % 6) + 1;
    const scoreAdd = (level % 4) + 2;

    const shiftChar = (ch, s) =>
      String.fromCharCode(((ch.charCodeAt(0) - 65 + s) % 26) + 65);

    const encA = shiftChar('A', shift);
    const encC = shiftChar('C', shift);

    if (category === 'Cyber') {
      return [
        {
          q: `[Level ${level}] Using a Caesar Cipher with Shift +${shift}, what does the letter "A" become?`,
          choices: [encA, shiftChar('A', shift + 1), 'Z', 'A'],
          answer: 0,
          explain: `Shifting "A" forward by ${shift} letter(s) gives "${encA}".`
        },
        {
          q: `[Level ${level}] Using a Caesar Cipher with Shift +${shift}, what does the letter "C" become?`,
          choices: ['A', encC, shiftChar('C', shift + 2), 'X'],
          answer: 1,
          explain: `Shifting "C" forward by ${shift} letter(s) gives "${encC}".`
        }
      ];
    }

    if (category === 'Developer') {
      return [
        {
          q: `[Level ${level}] A sprite starts at Score = ${scoreStart}. If it collects ${stepCount} stars worth ${scoreAdd} points each, what is the final Score?`,
          choices: [
            `${scoreStart + stepCount * scoreAdd}`,
            `${scoreStart + stepCount}`,
            `${stepCount * scoreAdd}`,
            `${scoreStart + scoreAdd}`
          ],
          answer: 0,
          explain: `Score = ${scoreStart} + (${stepCount} × ${scoreAdd}) = ${scoreStart + stepCount * scoreAdd}.`
        },
        {
          q: `[Level ${level}] If a "Repeat ${stepCount}" loop runs "Move 2 steps" inside it, how many total steps does the character move?`,
          choices: [
            `${stepCount}`,
            `${stepCount + 2}`,
            `${stepCount * 2}`,
            `2`
          ],
          answer: 2,
          explain: `${stepCount} repeats × 2 steps = ${stepCount * 2} total steps.`
        }
      ];
    }

    if (category === 'AI') {
      const catPics = level * 2 + 10;
      return [
        {
          q: `[Level ${level}] You train an AI with ${catPics} cat pictures and 0 dog pictures. What will happen when it sees a dog?`,
          choices: [
            'It may get confused because it had no dog training examples',
            'It will automatically know every animal in the world',
            'The computer screen will turn off',
            'It will become a robot'
          ],
          answer: 0,
          explain: 'AI only learns from the examples given in its Training Data.'
        },
        {
          q: `[Level ${level}] Look at the AI number pattern: ${level}, ${level + 2}, ${level + 4}, ___. What comes next?`,
          choices: [
            `${level + 5}`,
            `${level + 6}`,
            `${level + 8}`,
            `${level + 1}`
          ],
          answer: 1,
          explain: `The pattern adds +2 each step, so after ${level + 4} comes ${level + 6}.`
        }
      ];
    }

    // Robotics
    const wheelTurns = (level % 7) + 2;
    return [
      {
        q: `[Level ${level}] If 1 wheel turn moves a robot 10 cm, how far will it travel in ${wheelTurns} wheel turns?`,
        choices: [
          `${wheelTurns * 10} cm`,
          `${wheelTurns + 10} cm`,
          `${wheelTurns} cm`,
          `100 cm`
        ],
        answer: 0,
        explain: `${wheelTurns} turns × 10 cm = ${wheelTurns * 10} cm.`
      },
      {
        q: `[Level ${level}] A robot checks distance ${stepCount} times per second. What loop does it use to avoid walls?`,
        choices: [
          'Sense → Think → Act',
          'Sleep → Turn Off → Stop',
          'Paint → Draw → Erase',
          'Print → Delete → Exit'
        ],
        answer: 0,
        explain: 'Robots continuously Sense, Think, and Act to navigate safely.'
      }
    ];
  },

  QUESTION_BANKS: {
    Cyber: [
      { q: 'Which of these is the strongest password?', choices: ['123456', 'melaku', 'Tr!g3r#92', 'abcdef'], answer: 2, explain: 'Strong passwords mix uppercase, lowercase, numbers, and symbols.' },
      { q: 'What should you do if a stranger asks for your home address in a game chat?', choices: ['Tell them right away', 'Keep it private and tell a parent/teacher', 'Send a photo of your house', 'Share your school name'], answer: 1, explain: 'Never share personal information with strangers online.' },
      { q: 'What does a pop-up saying "Click here for 1,000,000 FREE coins!" usually mean?', choices: ['It is a trick/scam link', 'Your teacher sent you a gift', 'Your battery is full', 'The internet is faster'], answer: 0, explain: 'Too-good-to-be-true pop-ups are tricks to get you to click unsafe links.' },
      { q: 'Should you share your password with your friends?', choices: ['Yes, everyone', 'No, keep passwords secret (except parents)', 'Write it on the classroom board', 'Post it online'], answer: 1, explain: 'Passwords should stay private so nobody else can enter your account.' },
      { q: 'What is turning a readable message into a secret code called?', choices: ['Painting', 'Encryption', 'Printing', 'Deleting'], answer: 1, explain: 'Encryption scrambles readable text into secret ciphertext.' },
      { q: 'Before downloading a new game on a tablet, what is the safest step?', choices: ['Click every download button', 'Ask a parent or teacher first', 'Turn off the screen', 'Share your password'], answer: 1, explain: 'Always ask a trusted adult before downloading files or apps.' },
      { q: 'Which information is SAFE to share in a kid coding club?', choices: ['Your favorite color or hobby', 'Your home street address', 'Your parent’s bank PIN', 'Your account password'], answer: 0, explain: 'Favorite colors or hobbies do not reveal private personal identity.' },
      { q: 'What do we call a secret code made by shifting letters of the alphabet?', choices: ['Caesar Cipher', 'Solar Panel', 'Keyboard', 'Monitor'], answer: 0, explain: 'A Caesar Cipher shifts each letter by a fixed number of positions.' },
      { q: 'Why do we lock a computer or tablet when we walk away?', choices: ['To waste battery', 'So nobody else changes our work or account', 'To make it heavier', 'To delete all books'], answer: 1, explain: 'Locking your device protects your files and accounts.' },
      { q: 'What does HTTPS with a padlock icon in a browser mean?', choices: ['The connection to the website is encrypted', 'The computer is broken', 'You won a prize', 'The sound is muted'], answer: 0, explain: 'The padlock means communication with the site is encrypted.' },
      { q: 'If a link spells a famous site wrongly (like "g00gle-free-prize.com"), what is it?', choices: ['A suspicious fake link', 'The official school page', 'A math calculator', 'A safe dictionary'], answer: 0, explain: 'Misspelled website addresses are a classic sign of fake links.' },
      { q: 'Who is a "Trusted Adult" you can ask for help online?', choices: ['A parent, guardian, or teacher', 'An unknown player online', 'A pop-up robot', 'A random comment'], answer: 0, explain: 'Parents, guardians, and teachers help keep you safe online.' }
    ],
    AI: [
      { q: 'What does "AI" stand for?', choices: ['Animal Island', 'Artificial Intelligence', 'Apple Internet', 'Automatic Ice'], answer: 1, explain: 'AI stands for Artificial Intelligence.' },
      { q: 'How does an AI learn to tell cats apart from dogs?', choices: ['By looking at many example pictures (Training Data)', 'By eating cat food', 'By sleeping all day', 'By guessing without data'], answer: 0, explain: 'AI learns patterns from examples called Training Data.' },
      { q: 'Which of these uses AI in daily life?', choices: ['A voice assistant that answers spoken questions', 'A wooden pencil', 'A paper notebook', 'A plastic ruler'], answer: 0, explain: 'Voice assistants use speech recognition AI.' },
      { q: 'What can humans do that AI computers CANNOT truly feel?', choices: ['Real emotions, kindness, and imagination', 'Adding numbers quickly', 'Sorting a list of words', 'Playing chess'], answer: 0, explain: 'Computers process data, while humans have real feelings and empathy.' },
      { q: 'If you only train an AI with pictures of red apples, what might happen when it sees a green apple?', choices: ['It might not recognize it as an apple', 'It will turn the apple red', 'It will turn off Wi-Fi', 'It will cook dinner'], answer: 0, explain: 'AI needs diverse, balanced examples to recognize all types.' },
      { q: 'What does a face-unlock camera on a phone use?', choices: ['Computer Vision AI', 'A magnifying glass only', 'Water power', 'A bicycle wheel'], answer: 0, explain: 'Computer Vision helps machines recognize faces and objects.' },
      { q: 'What is a "Decision Tree" in AI?', choices: ['A set of If-Then questions that lead to an answer', 'A tree growing in the forest', 'A wooden desk', 'A battery charger'], answer: 0, explain: 'Decision trees follow step-by-step If-Then rules.' },
      { q: 'What does Google "Quick, Draw!" use AI to recognize?', choices: ['Hand-drawn sketches and doodles', 'Your shoe size', 'The weather outside', 'Your weight'], answer: 0, explain: 'Quick, Draw! uses pattern recognition AI to guess sketches.' },
      { q: 'Why should students still check answers given by an AI?', choices: ['Because AI can sometimes make mistakes', 'Because AI never uses electricity', 'Because books are illegal', 'Because screens are soft'], answer: 0, explain: 'AI predicts answers from patterns and can occasionally be wrong.' },
      { q: 'Which sensor helps a smart speaker hear your voice?', choices: ['Microphone', 'Wheel', 'Flashlight', 'Thermometer'], answer: 0, explain: 'A microphone captures sound waves for speech AI.' },
      { q: 'Finding repeated shapes, colors, or sounds in data is called:', choices: ['Pattern Recognition', 'Painting', 'Printing', 'Hammering'], answer: 0, explain: 'Pattern recognition is how AI spots similarities.' },
      { q: 'How should we use AI tools for schoolwork?', choices: ['To help understand ideas and practice', 'To copy without reading anything', 'To bully classmates', 'To share private passwords'], answer: 0, explain: 'AI is best used as a learning helper.' }
    ],
    Developer: [
      { q: 'What is a step-by-step list of instructions for a computer called?', choices: ['An Algorithm', 'A Battery', 'A Monitor', 'A Sticker'], answer: 0, explain: 'An algorithm is an ordered set of instructions to solve a task.' },
      { q: 'What do programmers call a mistake in computer code?', choices: ['A Bug', 'A Leaf', 'A Cloud', 'A Pillow'], answer: 0, explain: 'An error in code is called a bug.' },
      { q: 'What is fixing mistakes in your program called?', choices: ['Debugging', 'Cooking', 'Erasing the screen', 'Painting'], answer: 0, explain: 'Debugging means finding and fixing bugs.' },
      { q: 'In Scratch, what are the characters that move on the stage called?', choices: ['Sprites', 'Batteries', 'Wires', 'Keyboards'], answer: 0, explain: 'Characters/objects in Scratch are called Sprites.' },
      { q: 'Which coding block repeats actions without writing them over and over?', choices: ['A Loop (Repeat block)', 'A Stop sign', 'A Delete button', 'A Sound mute'], answer: 0, explain: 'Loops repeat instructions automatically.' },
      { q: 'What is a "Variable" in a game?', choices: ['A container that stores changing values like Score', 'A type of computer mouse', 'A broken wire', 'A screen saver'], answer: 0, explain: 'Variables store data that can change, such as Score or Lives.' },
      { q: 'Why does sequence (order) matter in coding?', choices: ['Computers run steps in exact order from top to bottom', 'Computers read backwards only', 'Order never matters', 'Screens only show blue'], answer: 0, explain: 'Executing steps in the wrong order produces wrong results.' },
      { q: 'What does an "If-Then" block do?', choices: ['Runs an action only when a condition is true', 'Turns off the computer', 'Deletes all sprites', 'Changes the monitor size'], answer: 0, explain: 'Conditionals check whether something is true before acting.' },
      { q: 'Which of these is an "Event" in a game?', choices: ['When the Green Flag or Spacebar is pressed', 'A plastic ruler', 'A paper book', 'A desk chair'], answer: 0, explain: 'Events trigger code when a user clicks or presses a key.' },
      { q: 'What is the background area in Scratch called?', choices: ['The Stage', 'The Engine', 'The Tire', 'The Antenna'], answer: 0, explain: 'Sprites perform on the Stage.' },
      { q: 'If you write instructions on paper without a computer, it is called:', choices: ['Unplugged Coding', 'Wireless Charging', '3D Printing', 'Video Editing'], answer: 0, explain: 'Unplugged coding teaches logic through offline puzzles.' },
      { q: 'Which block makes a character wait 1 second before moving?', choices: ['Wait (1) seconds', 'Forever', 'Hide', 'Stop all'], answer: 0, explain: 'The Wait block pauses execution for the given seconds.' }
    ],
    Robotics: [
      { q: 'Which part gives a robot electrical energy to work?', choices: ['Battery', 'Wooden wheel', 'Paper sticker', 'Plastic cover'], answer: 0, explain: 'Batteries supply electrical power to motors and controllers.' },
      { q: 'What part spins to make a robot’s wheels move?', choices: ['Motor', 'Speaker', 'Camera lens', 'Rubber tire'], answer: 0, explain: 'Electric motors convert electricity into spinning motion.' },
      { q: 'Which robot part acts like "eyes" to detect walls ahead?', choices: ['Distance / Ultrasonic Sensor', 'Battery', 'Wheel', 'Screw'], answer: 0, explain: 'Distance sensors measure how close an obstacle is.' },
      { q: 'For electricity to light up an LED, the circuit must be:', choices: ['A complete closed loop', 'Broken in the middle', 'Made of wood', 'Without a battery'], answer: 0, explain: 'Electricity only flows through a closed circuit.' },
      { q: 'What does a switch do in a simple circuit?', choices: ['Opens or closes the path of electricity', 'Makes the battery bigger', 'Changes red light to water', 'Paints the robot'], answer: 0, explain: 'A switch controls whether current can flow.' },
      { q: 'What are the 3 main steps a smart robot repeats?', choices: ['Sense → Think → Act', 'Eat → Sleep → Dream', 'Draw → Fold → Cut', 'Read → Write → Erase'], answer: 0, explain: 'Robots Sense their environment, Think with code, and Act.' },
      { q: 'Which simple machine helps gears transfer spinning power?', choices: ['Wheel and Axle / Gears', 'A sponge', 'A feather', 'A string'], answer: 0, explain: 'Gears and axles transfer rotational motion and force.' },
      { q: 'What does LED stand for?', choices: ['Light Emitting Diode', 'Long Electric Door', 'Little Energy Disk', 'Loud Engine Device'], answer: 0, explain: 'LED stands for Light Emitting Diode.' },
      { q: 'How does a line-following robot see a black line on a white floor?', choices: ['With an Infrared (IR) light sensor', 'With a thermometer', 'With a clock', 'With a speaker'], answer: 0, explain: 'IR sensors detect differences between dark and light surfaces.' },
      { q: 'What is the small computer "brain" inside a robot called?', choices: ['Microcontroller', 'Tire', 'Screwdriver', 'Gearbox'], answer: 0, explain: 'A microcontroller runs the robot’s program and reads sensors.' },
      { q: 'If an ultrasonic sensor sees a wall 5 cm ahead, what should the robot do?', choices: ['Stop and turn away from the wall', 'Drive faster into the wall', 'Turn off its sensors', 'Drop its battery'], answer: 0, explain: 'Obstacle-avoiding robots stop and turn when a wall is close.' },
      { q: 'What component makes a beeping sound in a robot?', choices: ['Buzzer', 'Wheel', 'LED', 'Switch'], answer: 0, explain: 'A buzzer produces audio tones and alerts.' }
    ]
  },

  // Returns exactly 10 multiple-choice questions for the selected material & level (1..100)
  getQuestionsForLevel(material, level) {
    const safeLevel = Math.min(100, Math.max(1, Number(level) || 1));
    const category = this.QUESTION_BANKS[material.category] ? material.category : 'Cyber';
    const rng = this.createRng(`${material.id}-lvl-${safeLevel}`);

    const dynamicQs = this.buildDynamicQuestions(category, safeLevel);
    const bankQs = this.shuffleWithRng(this.QUESTION_BANKS[category], rng).slice(0, 8);

    const combined = [...dynamicQs, ...bankQs].slice(0, 10);

    return combined.map((item, idx) => {
      const indexedChoices = item.choices.map((text, cIdx) => ({
        text,
        isCorrect: cIdx === item.answer
      }));
      const shuffledChoices = this.shuffleWithRng(indexedChoices, rng);
      const correctIndex = shuffledChoices.findIndex(c => c.isCorrect);

      return {
        number: idx + 1,
        q: item.q,
        choices: shuffledChoices.map(c => c.text),
        answer: correctIndex,
        explain: item.explain
      };
    });
  }
};
