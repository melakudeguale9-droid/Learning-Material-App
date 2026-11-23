const TECH_CATEGORIES = ['All', 'Cyber', 'AI', 'Developer', 'Robotics'];

const GRADE_LEVELS = [
  '1 - 4 Grade',
  '5 - 8 Grade',
  '9 - 12 Grade'
];

const UNIVERSITY_YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  '5th Year'
];

const DEFAULT_MATERIALS = [
  {
    id: '1',
    title: 'Kids Logic & Scratch Coding',
    author: 'Hana M.',
    category: 'Developer',
    level: '1 - 4 Grade',
    year: '',
    type: 'Physical Book',
    description: 'Fun visual programming puzzles and basic computer logic designed for grades 1 to 4 students.',
    icon: '💻'
  },
  {
    id: '2',
    title: 'Junior Robotics & Sensors Lab',
    author: 'Dawit K.',
    category: 'Robotics',
    level: '5 - 8 Grade',
    year: '',
    type: 'Physical Book',
    description: 'Introduction to motors, LEDs, simple circuits, and building your first mini robot.',
    icon: '🤖'
  },
  {
    id: '3',
    title: 'High School Cyber Safety & Networking',
    author: 'Melaku Deguale',
    category: 'Cyber',
    level: '9 - 12 Grade',
    year: '',
    type: 'PDF / E-Book',
    description: 'Essential internet safety, password security, Linux basics, and networking concepts for grade 9-12.',
    icon: '🛡️'
  },
  {
    id: '4',
    title: 'Introduction to Artificial Intelligence',
    author: 'Dr. Selamawit A.',
    category: 'AI',
    level: '9 - 12 Grade',
    year: '',
    type: 'PDF / E-Book',
    description: 'Understand how machine learning, neural networks, and smart assistants work.',
    icon: '🧠'
  },
  {
    id: '5',
    title: 'Freshman C++ & Programming Fundamentals',
    author: 'Prof. Markos G.',
    category: 'Developer',
    level: 'University',
    year: '1st Year',
    type: 'Physical Book',
    description: 'Complete 1st-year university programming guide covering variables, loops, functions, and arrays.',
    icon: '💻'
  },
  {
    id: '6',
    title: 'Data Structures & Algorithms in Python',
    author: 'Sarah Jenkins',
    category: 'Developer',
    level: 'University',
    year: '2nd Year',
    type: 'PDF / E-Book',
    description: 'Trees, graphs, sorting algorithms, and complexity analysis for 2nd-year CS & IT students.',
    icon: '💻'
  },
  {
    id: '7',
    title: 'Web Application Security & Penetration Testing',
    author: 'Melaku Deguale',
    category: 'Cyber',
    level: 'University',
    year: '3rd Year',
    type: 'PDF / E-Book',
    description: 'Hands-on OWASP Top 10 vulnerabilities, Burp Suite, Nmap reconnaissance, and Linux privilege escalation.',
    icon: '🛡️'
  },
  {
    id: '8',
    title: 'Deep Learning & Computer Vision',
    author: 'Dr. Abel T.',
    category: 'AI',
    level: 'University',
    year: '4th Year',
    type: 'PDF / E-Book',
    description: 'Convolutional neural networks, image classification, and modern AI model deployment.',
    icon: '🧠'
  },
  {
    id: '9',
    title: 'Autonomous Embedded Robotics Systems',
    author: 'Eng. Yonas B.',
    category: 'Robotics',
    level: 'University',
    year: '5th Year',
    type: 'Physical Book',
    description: 'ROS, microcontroller kinematics, LiDAR mapping, and capstone engineering robotics design.',
    icon: '🤖'
  }
];
