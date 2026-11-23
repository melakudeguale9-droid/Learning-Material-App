let selectedCategory = 'All';
let selectedLevel = 'All Levels';
let selectedYear = '';
let universityExpanded = true;

let currentMaterial = null;
let currentTab = 'book';
let currentVideoLang = 'amharic';
let currentQuizLevel = 1;
let currentQuizQuestions = [];
let userQuizAnswers = {};
let quizSubmitted = false;

// Wizard State for Adding Resources:
// Step 1: Select Level (1-4 Grade, 5-8 Grade, 9-12 Grade, University)
// Step 2: Select Resource Type (Book, PDF, Link, Video)
// Step 3: Select Source (File vs YouTube / Link) + Details
let wizardState = {
  step: 1,
  level: '1 - 4 Grade',
  year: '',
  resourceType: '', // 'book' | 'pdf' | 'link' | 'video'
  sourceMode: ''    // 'file' | 'online'
};

let materials = StoreStorage.getMaterials();
let cart = StoreStorage.getCart();

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = String(text ?? '');
  return div.innerHTML;
}

function sanitizeUrl(url) {
  if (!url) return '';
  if (url.startsWith('blob:')) return url;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : '';
  } catch {
    return '';
  }
}

function getCategoryIcon(category) {
  const icons = {
    'Cyber Security': '🛡️',
    AI: '🧠',
    Developer: '💻',
    Robotics: '🤖'
  };
  return icons[category] || '📘';
}

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

/* 1. Combined Top Row: Categories + Search */
function renderChips() {
  const container = document.getElementById('categoryChips');
  container.innerHTML = TECH_CATEGORIES.map(cat => `
    <button class="chip ${selectedCategory === cat ? 'active' : ''}" onclick="selectCategory('${cat}')">
      ${cat}
    </button>
  `).join('');
}

function selectCategory(cat) {
  selectedCategory = cat;
  renderChips();
  renderCatalog();
}

/* 2. Left Nested Grade & University Year Sidebar */
function renderLevelSidebar() {
  const sidebar = document.getElementById('levelSidebar');

  const gradeItems = GRADE_LEVELS.map(lvl => `
    <li>
      <button
        class="level-item ${selectedLevel === lvl ? 'active' : ''}"
        onclick="selectLevel('${lvl}')"
      >
        <span class="level-bullet"><span class="dot"></span> ${lvl}</span>
      </button>
    </li>
  `).join('');

  const yearItems = UNIVERSITY_YEARS.map(yr => `
    <li>
      <button
        class="year-item ${selectedLevel === 'University' && selectedYear === yr ? 'active' : ''}"
        onclick="selectUniversityYear('${yr}')"
      >
        <span class="dot"></span> ${yr}
      </button>
    </li>
  `).join('');

  sidebar.innerHTML = `
    <div class="sidebar-title">Academic Level</div>
    <ul class="level-list">
      <li>
        <button
          class="level-item ${selectedLevel === 'All Levels' ? 'active' : ''}"
          onclick="selectLevel('All Levels')"
        >
          <span class="level-bullet"><span class="dot"></span> All Levels</span>
        </button>
      </li>
      ${gradeItems}
      <li>
        <button
          class="level-item ${selectedLevel === 'University' && !selectedYear ? 'active' : ''}"
          onclick="selectUniversity()"
        >
          <span class="level-bullet"><span class="dot"></span> University</span>
          <span>${universityExpanded ? '▾' : '▸'}</span>
        </button>
        ${universityExpanded ? `<ul class="year-sublist">${yearItems}</ul>` : ''}
      </li>
    </ul>
  `;
}

function selectLevel(lvl) {
  selectedLevel = lvl;
  selectedYear = '';
  renderLevelSidebar();
  renderCatalog();
}

function selectUniversity() {
  if (selectedLevel === 'University' && !selectedYear) {
    universityExpanded = !universityExpanded;
  } else {
    selectedLevel = 'University';
    selectedYear = '';
    universityExpanded = true;
  }
  renderLevelSidebar();
  renderCatalog();
}

function selectUniversityYear(yr) {
  selectedLevel = 'University';
  selectedYear = yr;
  universityExpanded = true;
  renderLevelSidebar();
  renderCatalog();
}

function clearAllFilters() {
  selectedCategory = 'All';
  selectedLevel = 'All Levels';
  selectedYear = '';
  document.getElementById('searchInput').value = '';
  renderChips();
  renderLevelSidebar();
  renderCatalog();
}

/* 3. Render Filtered Materials */
function renderCatalog() {
  const query = document.getElementById('searchInput').value.toLowerCase();

  const filtered = materials.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);

    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;

    let matchesLevel = true;
    if (selectedLevel !== 'All Levels') {
      if (selectedLevel === 'University') {
        matchesLevel = item.level === 'University' && (!selectedYear || item.year === selectedYear);
      } else {
        matchesLevel = item.level === selectedLevel;
      }
    }

    return matchesSearch && matchesCat && matchesLevel;
  });

  const filterBar = document.getElementById('activeFilterBar');
  const levelLabel = selectedLevel === 'University' && selectedYear
    ? `University • ${selectedYear}`
    : selectedLevel;
  const hasFilter = selectedCategory !== 'All' || selectedLevel !== 'All Levels' || query !== '';

  filterBar.innerHTML = `
    <span>Showing <strong>${filtered.length}</strong> (${escapeHtml(selectedCategory)} • ${escapeHtml(levelLabel)})</span>
    <div style="display:flex; gap:10px; align-items:center;">
      ${hasFilter ? `<button class="clear-filter-btn" onclick="clearAllFilters()">Reset Filters</button>` : ''}
      <button class="clear-filter-btn" onclick="openAddModal('${escapeHtml(selectedLevel)}', '${escapeHtml(selectedYear)}')">＋ Add to ${escapeHtml(levelLabel)}</button>
    </div>
  `;

  const list = document.getElementById('materialsList');
  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty-state">No learning materials found for this selection.</div>`;
    return;
  }

  list.innerHTML = filtered.map(item => {
    const badgeText = item.level === 'University' && item.year
      ? `${item.level} • ${item.year}`
      : item.level;

    return `
      <div class="card" onclick="openDetail('${escapeHtml(item.id)}')">
        <div class="avatar">${item.icon}</div>
        <div class="card-info">
          <div class="card-title">${escapeHtml(item.title)}</div>
          <div class="card-sub">${escapeHtml(item.author)} • Book • PDF • Quiz • Video</div>
          <div class="card-tags">
            <span class="mini-tag">${escapeHtml(item.category)}</span>
            <span class="mini-tag">${escapeHtml(badgeText)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* 4. Detail Screen with 5 Tabs */
function openDetail(id, initialTab = 'book') {
  const item = materials.find(m => m.id === id);
  if (!item) return;

  currentMaterial = item;
  currentTab = initialTab;
  currentVideoLang = 'amharic';
  currentQuizLevel = 1;

  const levelDisplay = item.level === 'University' && item.year
    ? `University (${item.year})`
    : item.level;

  document.getElementById('detailHeaderTitle').textContent = item.title;
  document.getElementById('detailIcon').textContent = item.icon;
  document.getElementById('detailTitle').textContent = item.title;
  document.getElementById('detailAuthor').textContent = `By ${item.author}`;
  document.getElementById('detailCategory').textContent = item.category;
  document.getElementById('detailLevel').textContent = levelDisplay;

  document.getElementById('addToCartBtn').onclick = () => {
    addToCart(item);
    showToast(`"${item.title}" saved to your list!`);
  };

  document.getElementById('deleteBookBtn').onclick = () => {
    deleteMaterial(item.id);
  };

  switchResourceTab(initialTab);
  showScreen('detailScreen');
}

function switchResourceTab(tabName) {
  currentTab = tabName;
  document.querySelectorAll('.res-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  if (tabName === 'book') renderBookTab();
  else if (tabName === 'pdf') renderPdfTab();
  else if (tabName === 'links') renderLinksTab();
  else if (tabName === 'quiz') loadQuizLevel(currentQuizLevel);
  else if (tabName === 'video') renderVideoTab();
}

/* TAB 1: BOOK */
function renderBookTab() {
  const item = currentMaterial;
  const chapters = item.bookChapters && item.bookChapters.length
    ? item.bookChapters
    : [{ title: 'Book Overview', content: item.description }];

  const safeBookFileUrl = sanitizeUrl(item.bookFileUrl || '');

  document.getElementById('resourceTabContent').innerHTML = `
    <div class="panel-heading">📘 Book Reader & Chapters</div>
    <p class="panel-subtext">${escapeHtml(item.description)}</p>
    ${safeBookFileUrl ? `
      <div class="resource-box">
        <div>
          <div class="card-title">📁 Uploaded Book File: ${escapeHtml(item.bookFileName || 'Book_File')}</div>
          <div class="card-sub">Open or download the uploaded book file</div>
        </div>
        <a class="btn-primary" href="${safeBookFileUrl}" target="_blank" rel="noopener noreferrer">Open Book File ↗</a>
      </div>
    ` : ''}
    <div class="chapter-list">
      ${chapters.map(ch => `
        <div class="chapter-card">
          <div class="chapter-title">${escapeHtml(ch.title)}</div>
          <div class="chapter-text">${escapeHtml(ch.content)}</div>
        </div>
      `).join('')}
    </div>
  `;
}

/* TAB 2: PDF */
function renderPdfTab() {
  const item = currentMaterial;
  const pdf = item.pdfInfo || {
    fileName: `${item.title.replace(/\s+/g, '_')}.pdf`,
    pages: 'Study PDF',
    url: ''
  };
  const safePdfUrl = sanitizeUrl(pdf.url);

  document.getElementById('resourceTabContent').innerHTML = `
    <div class="panel-heading">📄 PDF Study Material</div>
    <p class="panel-subtext">View, open, or print the PDF for <strong>${escapeHtml(item.title)}</strong>.</p>
    <div class="resource-box">
      <div>
        <div class="card-title">📄 ${escapeHtml(pdf.fileName)}</div>
        <div class="card-sub">${escapeHtml(pdf.pages)} • ${escapeHtml(item.level)}</div>
      </div>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        ${safePdfUrl ? `<a class="btn-primary" href="${safePdfUrl}" target="_blank" rel="noopener noreferrer">Open PDF ↗</a>` : ''}
        <button class="btn-primary" onclick="downloadPrintablePdf()">⬇️ Save / Print PDF</button>
      </div>
    </div>
    ${safePdfUrl ? `<iframe class="pdf-viewer-frame" src="${safePdfUrl}" title="PDF Preview"></iframe>` : ''}
  `;
}

function downloadPrintablePdf() {
  const item = currentMaterial;
  const chapters = item.bookChapters || [{ title: 'Summary', content: item.description }];
  const win = window.open('', '_blank');
  if (!win) {
    showToast('Please allow pop-ups to generate the PDF.');
    return;
  }

  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${escapeHtml(item.title)} - PDF</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 36px; line-height: 1.6; color: #1c1b1f; }
        h1 { color: #4527a0; margin-bottom: 4px; }
        .meta { color: #555; margin-bottom: 20px; font-size: 14px; }
        .chapter { margin-bottom: 18px; padding: 14px; border-left: 4px solid #5e35b1; background: #f8f7fc; }
        .chapter h3 { margin: 0 0 6px; color: #311b92; }
      </style>
    </head>
    <body>
      <h1>${escapeHtml(item.title)}</h1>
      <div class="meta">Author: ${escapeHtml(item.author)} | Category: ${escapeHtml(item.category)} | Level: ${escapeHtml(item.level)}</div>
      <p>${escapeHtml(item.description)}</p>
      <hr/>
      ${chapters.map(c => `<div class="chapter"><h3>${escapeHtml(c.title)}</h3><p>${escapeHtml(c.content)}</p></div>`).join('')}
      <script>window.onload = () => window.print();<\/script>
    </body>
    </html>
  `);
  win.document.close();
}

/* TAB 3: LINK READING */
function renderLinksTab() {
  const item = currentMaterial;
  const links = item.readingLinks && item.readingLinks.length
    ? item.readingLinks
    : [{
        title: `Explore ${item.category} Lessons`,
        source: 'code.org',
        url: 'https://code.org/'
      }];

  document.getElementById('resourceTabContent').innerHTML = `
    <div class="panel-heading">🔗 Link Reading</div>
    <p class="panel-subtext">Open the reading links or uploaded files below.</p>
    <div class="chapter-list">
      ${links.map(lk => {
        const href = sanitizeUrl(lk.url) || 'https://code.org/';
        return `
          <a class="link-item" href="${href}" target="_blank" rel="noopener noreferrer">
            <div>
              <div class="card-title">${escapeHtml(lk.title)}</div>
              <div class="card-sub">${escapeHtml(lk.source)}</div>
            </div>
            <span class="link-badge">Read ↗</span>
          </a>
        `;
      }).join('')}
    </div>
  `;
}

/* TAB 4: SELF-TESTING (10 QUESTIONS CHOICE • LEVEL 1 TO 100 • EASY -> MEDIUM -> HARD + IMAGE QUESTIONS) */
function loadQuizLevel(lvl) {
  currentQuizLevel = Math.min(100, Math.max(1, Number(lvl) || 1));
  currentQuizQuestions = QuizEngine.getQuestionsForLevel(currentMaterial, currentQuizLevel);
  userQuizAnswers = {};
  quizSubmitted = false;
  renderQuizTab();
}

function selectQuizChoice(qIdx, choiceIdx) {
  if (quizSubmitted) return;
  userQuizAnswers[qIdx] = choiceIdx;
  renderQuizTab();
}

function submitQuiz() {
  const answeredCount = Object.keys(userQuizAnswers).length;
  if (answeredCount < 10) {
    showToast(`Please answer all 10 questions (${answeredCount}/10 answered).`);
    return;
  }

  quizSubmitted = true;
  let score = 0;
  currentQuizQuestions.forEach((q, idx) => {
    if (userQuizAnswers[idx] === q.answer) score++;
  });

  if (score >= 6) {
    StoreStorage.markLevelPassed(currentMaterial.id, currentQuizLevel, score);
  }

  renderQuizTab();
}

function renderQuizTab() {
  const progress = StoreStorage.getQuizProgress()[currentMaterial.id] || {};
  const passedCount = Object.keys(progress).length;
  const tier = QuizEngine.getTierInfo(currentQuizLevel);

  let optionsHtml = '';
  for (let i = 1; i <= 100; i++) {
    const tierTag = i <= 30 ? 'Easy' : i <= 70 ? 'Medium' : 'Hard';
    const passedMark = progress[i] ? ` ✓ (${progress[i]}/10)` : '';
    optionsHtml += `<option value="${i}" ${i === currentQuizLevel ? 'selected' : ''}>Level ${i} (${tierTag})${passedMark}</option>`;
  }

  let scoreHtml = '';
  if (quizSubmitted) {
    let score = 0;
    currentQuizQuestions.forEach((q, idx) => {
      if (userQuizAnswers[idx] === q.answer) score++;
    });
    const passed = score >= 6;
    const nextLvl = Math.min(100, currentQuizLevel + 1);

    scoreHtml = `
      <div class="quiz-result-box">
        <div class="panel-heading">Your Score: ${score} / 10 (${passed ? 'Passed! 🎉' : 'Try Again 💪'})</div>
        <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">
          <button class="btn-secondary" onclick="loadQuizLevel(${currentQuizLevel})">Retry Level ${currentQuizLevel}</button>
          ${currentQuizLevel < 100 ? `<button class="btn-primary" onclick="loadQuizLevel(${nextLvl})">Next: Level ${nextLvl} →</button>` : ''}
        </div>
      </div>
    `;
  }

  const letters = ['A', 'B', 'C', 'D'];
  const questionsHtml = currentQuizQuestions.map((q, qIdx) => {
    const chosen = userQuizAnswers[qIdx];

    const choicesHtml = q.choices.map((cText, cIdx) => {
      let cls = 'choice-btn';
      if (!quizSubmitted && chosen === cIdx) cls += ' selected';
      if (quizSubmitted) {
        if (cIdx === q.answer) cls += ' correct';
        else if (chosen === cIdx && chosen !== q.answer) cls += ' wrong';
      }
      return `
        <button class="${cls}" onclick="selectQuizChoice(${qIdx}, ${cIdx})">
          <strong>${letters[cIdx]}.</strong> ${escapeHtml(cText)}
        </button>
      `;
    }).join('');

    const visualHtml = q.svg
      ? `<div class="q-visual-box">${q.svg}</div>`
      : '';

    const explainHtml = quizSubmitted
      ? `<div class="card-sub" style="margin-top:4px; color:var(--primary-dark);">💡 ${escapeHtml(q.explain)}</div>`
      : '';

    return `
      <div class="question-block">
        <div class="q-header-row">
          <div class="q-title">${q.number}. ${escapeHtml(q.q)}</div>
          ${q.svg ? `<span class="q-img-tag">🖼️ Image</span>` : ''}
        </div>
        ${visualHtml}
        <div class="choice-list">${choicesHtml}</div>
        ${explainHtml}
      </div>
    `;
  }).join('');

  document.getElementById('resourceTabContent').innerHTML = `
    <div class="panel-heading">📝 Self-Testing: 10 Choice Questions (Level 1 to 100)</div>
    <div class="quiz-toolbar">
      <div class="level-picker">
        <label for="quizLevelSelect"><strong>Level:</strong></label>
        <select id="quizLevelSelect" onchange="loadQuizLevel(this.value)">
          ${optionsHtml}
        </select>
        <span class="tier-badge ${tier.cls}">${tier.label}</span>
      </div>
      <span class="quiz-progress-pill">Completed: ${passedCount} / 100</span>
    </div>

    ${scoreHtml}
    ${questionsHtml}

    ${!quizSubmitted ? `<button class="btn-primary full-btn" onclick="submitQuiz()">Submit 10 Answers (Level ${currentQuizLevel})</button>` : ''}
  `;
}

/* TAB 5: VIDEO (AMHARIC & ENGLISH + UPLOADED FILE OR YOUTUBE) */
function switchVideoLang(lang) {
  currentVideoLang = lang;
  renderVideoTab();
}

function renderVideoTab() {
  const item = currentMaterial;
  const videos = item.videos || {
    amharic: {
      title: `${item.title} - የአማርኛ ትምህርት`,
      summary: `ስለ ${item.title} በአማርኛ የተዘጋጀ የቪዲዮ ትምህርት።`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(item.title + ' amharic')}`,
      isLocalFile: false
    },
    english: {
      title: `${item.title} - English Video Lesson`,
      summary: `Educational video lesson for ${item.title}.`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(item.title + ' for kids')}`,
      isLocalFile: false
    }
  };

  const activeVideo = currentVideoLang === 'amharic' ? videos.amharic : videos.english;
  const videoUrl = sanitizeUrl(activeVideo.url) || 'https://www.youtube.com/';
  const isLocal = activeVideo.isLocalFile || videoUrl.startsWith('blob:');

  document.getElementById('resourceTabContent').innerHTML = `
    <div class="panel-heading">🎬 Video Lessons (Amharic & English)</div>
    <div class="video-lang-bar">
      <button class="lang-btn ${currentVideoLang === 'amharic' ? 'active' : ''}" onclick="switchVideoLang('amharic')">
        🇪🇹 አማርኛ (Amharic)
      </button>
      <button class="lang-btn ${currentVideoLang === 'english' ? 'active' : ''}" onclick="switchVideoLang('english')">
        🇬🇧 English
      </button>
    </div>

    <div class="video-card">
      <h4>${escapeHtml(activeVideo.title)}</h4>
      <p>${escapeHtml(activeVideo.summary)}</p>
      ${isLocal
        ? `<video class="local-video-player" controls src="${videoUrl}"></video>`
        : `<a class="btn-primary" href="${videoUrl}" target="_blank" rel="noopener noreferrer" style="align-self:flex-start;">
            ${currentVideoLang === 'amharic' ? '▶️ ቪዲዮውን YouTube ላይ ክፈት' : '▶️ Watch on YouTube'}
          </a>`
      }
    </div>
  `;
}

/* 5. 3-STEP RESOURCE ADDING WIZARD
   Step 1: Choose Level (1 - 4 Grade, 5 - 8 Grade, 9 - 12 Grade, University)
   Step 2: Choose Resource Type (Book, PDF, Link, Video)
   Step 3: Choose Source (From File vs From YouTube / Online Link) & Save
*/
function openAddModal(preLevel = '', preYear = '') {
  if (preLevel && preLevel !== 'All Levels') {
    wizardState = {
      step: 2,
      level: preLevel,
      year: preLevel === 'University' ? (preYear || '1st Year') : '',
      resourceType: '',
      sourceMode: ''
    };
  } else {
    wizardState = {
      step: 1,
      level: '1 - 4 Grade',
      year: '',
      resourceType: '',
      sourceMode: ''
    };
  }
  renderAddWizard();
  document.getElementById('addBookOverlay').classList.add('open');
}

function closeAddModal(e) {
  if (!e || e.target.id === 'addBookOverlay') {
    document.getElementById('addBookOverlay').classList.remove('open');
  }
}

function wizardSelectLevel(level, year = '') {
  wizardState.level = level;
  wizardState.year = year;
  wizardState.step = 2;
  renderAddWizard();
}

function wizardSelectType(type) {
  wizardState.resourceType = type;
  wizardState.step = 3;
  wizardState.sourceMode = '';
  renderAddWizard();
}

function wizardSelectSource(mode) {
  wizardState.sourceMode = mode;
  wizardState.step = 4;
  renderAddWizard();
}

function renderAddWizard() {
  const titleEl = document.getElementById('wizardTitle');
  const bodyEl = document.getElementById('addWizardBody');
  const levelDisplay = wizardState.level === 'University' && wizardState.year
    ? `University • ${wizardState.year}`
    : wizardState.level;

  // STEP 1: Select Grade Level
  if (wizardState.step === 1) {
    titleEl.textContent = 'Step 1: Select Grade / Level';
    bodyEl.innerHTML = `
      <p style="margin-bottom:8px;">Choose the academic level where you want to add resources:</p>
      <div class="wizard-grid">
        <button type="button" class="wizard-option-btn" onclick="wizardSelectLevel('1 - 4 Grade')">
          <span class="wizard-opt-icon">🎒</span>
          <span class="wizard-opt-title">1 - 4 Grade</span>
          <span class="wizard-opt-sub">Book, PDF, Link, Video</span>
        </button>
        <button type="button" class="wizard-option-btn" onclick="wizardSelectLevel('5 - 8 Grade')">
          <span class="wizard-opt-icon">📚</span>
          <span class="wizard-opt-title">5 - 8 Grade</span>
          <span class="wizard-opt-sub">Book, PDF, Link, Video</span>
        </button>
        <button type="button" class="wizard-option-btn" onclick="wizardSelectLevel('9 - 12 Grade')">
          <span class="wizard-opt-icon">🎓</span>
          <span class="wizard-opt-title">9 - 12 Grade</span>
          <span class="wizard-opt-sub">Book, PDF, Link, Video</span>
        </button>
        <button type="button" class="wizard-option-btn" onclick="wizardSelectLevel('University', '1st Year')">
          <span class="wizard-opt-icon">🏛️</span>
          <span class="wizard-opt-title">University</span>
          <span class="wizard-opt-sub">1st – 5th Year</span>
        </button>
      </div>
    `;
    return;
  }

  // STEP 2: Choose Book, PDF, Link, or Video
  if (wizardState.step === 2) {
    titleEl.textContent = 'Step 2: Choose Resource Type';
    const yearSelector = wizardState.level === 'University' ? `
      <div class="form-group">
        <label for="wizUniYear">University Year</label>
        <select id="wizUniYear" onchange="wizardState.year = this.value">
          ${UNIVERSITY_YEARS.map(y => `<option value="${y}" ${wizardState.year === y ? 'selected' : ''}>${y}</option>`).join('')}
        </select>
      </div>
    ` : '';

    bodyEl.innerHTML = `
      <div class="wizard-breadcrumb">Selected: ${escapeHtml(levelDisplay)}</div>
      ${yearSelector}
      <p style="margin-bottom:8px;">What do you want to add?</p>
      <div class="wizard-grid">
        <button type="button" class="wizard-option-btn" onclick="wizardSelectType('book')">
          <span class="wizard-opt-icon">📘</span>
          <span class="wizard-opt-title">Book</span>
          <span class="wizard-opt-sub">File or Chapter Text</span>
        </button>
        <button type="button" class="wizard-option-btn" onclick="wizardSelectType('pdf')">
          <span class="wizard-opt-icon">📄</span>
          <span class="wizard-opt-title">PDF</span>
          <span class="wizard-opt-sub">Upload PDF or Link</span>
        </button>
        <button type="button" class="wizard-option-btn" onclick="wizardSelectType('link')">
          <span class="wizard-opt-icon">🔗</span>
          <span class="wizard-opt-title">Link</span>
          <span class="wizard-opt-sub">File or Reading URL</span>
        </button>
        <button type="button" class="wizard-option-btn" onclick="wizardSelectType('video')">
          <span class="wizard-opt-icon">🎬</span>
          <span class="wizard-opt-title">Video</span>
          <span class="wizard-opt-sub">From File or YouTube</span>
        </button>
      </div>
      <div class="dialog-actions">
        <button type="button" class="btn-secondary" onclick="wizardState.step=1; renderAddWizard()">← Back</button>
      </div>
    `;
    return;
  }

  const typeLabels = { book: '📘 Book', pdf: '📄 PDF', link: '🔗 Link', video: '🎬 Video' };
  const onlineLabels = {
    book: { title: 'Write / Online Book', sub: 'Enter chapters or online book link', icon: '✍️' },
    pdf: { title: 'From PDF Link', sub: 'Paste online PDF URL', icon: '🌐' },
    link: { title: 'From Web URL', sub: 'Paste reading website link', icon: '🌐' },
    video: { title: 'From YouTube', sub: 'Paste YouTube video link', icon: '▶️' }
  };

  // STEP 3: Choose Source (From File vs From YouTube / Online Link)
  if (wizardState.step === 3) {
    const onlineOpt = onlineLabels[wizardState.resourceType];
    titleEl.textContent = `Step 3: ${typeLabels[wizardState.resourceType]} Source`;
    bodyEl.innerHTML = `
      <div class="wizard-breadcrumb">${escapeHtml(levelDisplay)} → ${typeLabels[wizardState.resourceType]}</div>
      <p style="margin-bottom:8px;">Choose how you want to add this ${wizardState.resourceType}:</p>
      <div class="wizard-grid">
        <button type="button" class="wizard-option-btn" onclick="wizardSelectSource('file')">
          <span class="wizard-opt-icon">📁</span>
          <span class="wizard-opt-title">From File</span>
          <span class="wizard-opt-sub">Choose file from computer/phone</span>
        </button>
        <button type="button" class="wizard-option-btn" onclick="wizardSelectSource('online')">
          <span class="wizard-opt-icon">${onlineOpt.icon}</span>
          <span class="wizard-opt-title">${onlineOpt.title}</span>
          <span class="wizard-opt-sub">${onlineOpt.sub}</span>
        </button>
      </div>
      <div class="dialog-actions">
        <button type="button" class="btn-secondary" onclick="wizardState.step=2; renderAddWizard()">← Back</button>
      </div>
    `;
    return;
  }

  // STEP 4: Final Input Form
  const isFile = wizardState.sourceMode === 'file';
  const rType = wizardState.resourceType;
  titleEl.textContent = `Add ${typeLabels[rType]} (${isFile ? 'From File' : onlineLabels[rType].title})`;

  const acceptAttr = rType === 'video'
    ? 'video/*'
    : rType === 'pdf'
      ? '.pdf,application/pdf'
      : '*/*';

  const sourceInputHtml = isFile
    ? `
      <div class="form-group">
        <label for="wizFile">Select ${rType.toUpperCase()} File</label>
        <input type="file" id="wizFile" accept="${acceptAttr}" required />
      </div>
    `
    : `
      <div class="form-group">
        <label for="wizUrl">${rType === 'video' ? 'YouTube Video URL' : rType === 'book' ? 'Online Book URL (Optional)' : 'URL Link'}</label>
        <input type="url" id="wizUrl" placeholder="${rType === 'video' ? 'https://www.youtube.com/watch?v=...' : 'https://...'}" ${rType === 'book' ? '' : 'required'} />
      </div>
    `;

  const videoLangHtml = rType === 'video' ? `
    <div class="form-group">
      <label for="wizVideoLang">Video Language</label>
      <select id="wizVideoLang">
        <option value="amharic">🇪🇹 አማርኛ (Amharic)</option>
        <option value="english">🇬🇧 English</option>
      </select>
    </div>
  ` : '';

  bodyEl.innerHTML = `
    <div class="wizard-breadcrumb">${escapeHtml(levelDisplay)} → ${typeLabels[rType]} → ${isFile ? '📁 File' : onlineLabels[rType].title}</div>
    <form onsubmit="saveWizardResource(event)">
      <div class="form-row">
        <div class="form-group">
          <label for="wizCategory">Category</label>
          <select id="wizCategory">
            <option value="Cyber Security">Cyber Security</option>
            <option value="AI">AI</option>
            <option value="Developer">Developer</option>
            <option value="Robotics">Robotics</option>
          </select>
        </div>
        ${videoLangHtml}
      </div>
      <div class="form-group">
        <label for="wizTitle">Title</label>
        <input type="text" id="wizTitle" placeholder="Enter title..." required />
      </div>
      <div class="form-group">
        <label for="wizAuthor">Author / Instructor</label>
        <input type="text" id="wizAuthor" value="Melaku Deguale" required />
      </div>
      ${sourceInputHtml}
      <div class="form-group">
        <label for="wizDesc">${rType === 'book' ? 'Book Chapter / Content' : 'Short Description'}</label>
        <textarea id="wizDesc" rows="3" placeholder="Write summary or lesson text..." required></textarea>
      </div>
      <div class="dialog-actions">
        <button type="button" class="btn-secondary" onclick="wizardState.step=3; renderAddWizard()">← Back</button>
        <button type="submit" class="btn-primary">Save Resource</button>
      </div>
    </form>
  `;
}

function saveWizardResource(event) {
  event.preventDefault();
  const category = document.getElementById('wizCategory').value;
  const title = document.getElementById('wizTitle').value.trim();
  const author = document.getElementById('wizAuthor').value.trim();
  const desc = document.getElementById('wizDesc').value.trim();
  const rType = wizardState.resourceType;
  const isFile = wizardState.sourceMode === 'file';

  let fileUrl = '';
  let fileName = '';
  if (isFile) {
    const fileInput = document.getElementById('wizFile');
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const f = fileInput.files[0];
      fileName = f.name;
      fileUrl = URL.createObjectURL(f);
    }
  } else {
    const urlInput = document.getElementById('wizUrl');
    fileUrl = urlInput ? urlInput.value.trim() : '';
  }

  const newItem = {
    id: Date.now().toString(),
    title,
    author,
    category,
    level: wizardState.level,
    year: wizardState.year,
    icon: getCategoryIcon(category),
    description: desc,
    bookChapters: [{ title: 'Chapter 1: Lesson Content', content: desc }],
    bookFileUrl: rType === 'book' && isFile ? fileUrl : '',
    bookFileName: rType === 'book' && isFile ? fileName : '',
    pdfInfo: {
      fileName: rType === 'pdf' && fileName ? fileName : `${title.replace(/\s+/g, '_')}.pdf`,
      pages: isFile ? 'Uploaded PDF' : 'PDF Document',
      url: rType === 'pdf' ? fileUrl : ''
    },
    readingLinks: rType === 'link'
      ? [{ title: fileName || title, source: isFile ? 'Uploaded File' : fileUrl, url: fileUrl }]
      : [{ title: `More ${category} Reading`, source: 'Code.org', url: 'https://code.org/' }],
    videos: {
      amharic: {
        title: `${title} (አማርኛ)`,
        summary: desc,
        url: rType === 'video' && document.getElementById('wizVideoLang')?.value === 'amharic'
          ? fileUrl
          : `https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' amharic')}`,
        isLocalFile: rType === 'video' && isFile && document.getElementById('wizVideoLang')?.value === 'amharic'
      },
      english: {
        title: `${title} (English)`,
        summary: desc,
        url: rType === 'video' && document.getElementById('wizVideoLang')?.value === 'english'
          ? fileUrl
          : `https://www.youtube.com/results?search_query=${encodeURIComponent(title)}`,
        isLocalFile: rType === 'video' && isFile && document.getElementById('wizVideoLang')?.value === 'english'
      }
    }
  };

  materials.unshift(newItem);
  StoreStorage.saveMaterials(materials);
  closeAddModal();
  renderCatalog();

  const tabMap = { book: 'book', pdf: 'pdf', link: 'links', video: 'video' };
  openDetail(newItem.id, tabMap[rType] || 'book');
  showToast(`"${title}" added!`);
}

/* 6. Save / Delete / Reset */
function addToCart(item) {
  const exists = cart.some(c => c.id === item.id);
  if (!exists) {
    cart.push({ ...item });
    StoreStorage.saveCart(cart);
    updateCartBadge();
  }
}

function deleteMaterial(id) {
  materials = materials.filter(m => m.id !== id);
  cart = cart.filter(c => c.id !== id);
  StoreStorage.saveMaterials(materials);
  StoreStorage.saveCart(cart);
  updateCartBadge();
  renderCatalog();
  showScreen('catalogScreen');
  showToast('Material removed.');
}

function resetCatalog() {
  materials = StoreStorage.resetMaterials();
  clearAllFilters();
  showToast('Default catalog restored!');
}

/* 7. Saved Materials List */
function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (cart.length > 0) {
    badge.style.display = 'flex';
    badge.textContent = cart.length;
  } else {
    badge.style.display = 'none';
  }
}

function openCart() {
  renderCart();
  showScreen('cartScreen');
}

function renderCart() {
  const list = document.getElementById('cartList');
  const checkoutBar = document.getElementById('checkoutBar');

  if (cart.length === 0) {
    list.innerHTML = `<div class="empty-state">No saved materials yet.</div>`;
    checkoutBar.style.display = 'none';
    return;
  }

  checkoutBar.style.display = 'block';

  list.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div class="avatar">${item.icon}</div>
      <div class="card-info" onclick="openDetail('${escapeHtml(item.id)}')" style="cursor:pointer;">
        <div class="card-title">${escapeHtml(item.title)}</div>
        <div class="card-sub">${escapeHtml(item.category)} • ${escapeHtml(item.level)}</div>
      </div>
      <button class="delete-btn" onclick="removeFromCart(${idx})" title="Remove">🗑️</button>
    </div>
  `).join('');
}

function removeFromCart(index) {
  cart.splice(index, 1);
  StoreStorage.saveCart(cart);
  updateCartBadge();
  renderCart();
}

function completeOrder() {
  document.getElementById('confirmMessage').textContent =
    `Your ${cart.length} selected learning material(s) are ready with Book, PDF, Reading Links, Level 1–100 Quiz, and Videos.`;
  document.getElementById('confirmDialog').classList.add('open');
}

function finishOrder() {
  document.getElementById('confirmDialog').classList.remove('open');
  cart = [];
  StoreStorage.saveCart(cart);
  updateCartBadge();
  showScreen('catalogScreen');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

renderChips();
renderLevelSidebar();
renderCatalog();
updateCartBadge();
