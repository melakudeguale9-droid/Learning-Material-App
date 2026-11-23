let selectedCategory = 'All';
let selectedDifficulty = 'All';
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

let materials = StoreStorage.getMaterials();
let cart = StoreStorage.getCart();

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = String(text ?? '');
  return div.innerHTML;
}

function sanitizeUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : '';
  } catch {
    return '';
  }
}

function getCategoryIcon(category) {
  const icons = {
    Cyber: '🛡️',
    AI: '🧠',
    Developer: '💻',
    Robotics: '🤖'
  };
  return icons[category] || '📘';
}

function getDifficultyClass(difficulty) {
  const map = {
    Beginner: 'diff-beginner',
    Intermediate: 'diff-intermediate',
    Advanced: 'diff-advanced'
  };
  return map[difficulty] || '';
}

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

/* 1. Top Horizontal Domain Chips */
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

/* 2. Second Row: Difficulty Chips */
function renderDifficultyChips() {
  const container = document.getElementById('difficultyChips');
  const buttons = DIFFICULTY_LEVELS.map(diff => `
    <button class="diff-chip ${selectedDifficulty === diff ? 'active' : ''}" onclick="selectDifficulty('${diff}')">
      ${diff}
    </button>
  `).join('');

  container.innerHTML = `<span class="diff-label">Level:</span>${buttons}`;
}

function selectDifficulty(diff) {
  selectedDifficulty = diff;
  renderDifficultyChips();
  renderCatalog();
}

/* 3. Left Nested Grade & University Year Sidebar */
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
  selectedDifficulty = 'All';
  selectedLevel = 'All Levels';
  selectedYear = '';
  document.getElementById('searchInput').value = '';
  renderChips();
  renderDifficultyChips();
  renderLevelSidebar();
  renderCatalog();
}

/* 4. Render Filtered Materials */
function renderCatalog() {
  const query = document.getElementById('searchInput').value.toLowerCase();

  const filtered = materials.filter(item => {
    const itemDifficulty = item.difficulty || 'Beginner';
    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      itemDifficulty.toLowerCase().includes(query);

    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesDiff = selectedDifficulty === 'All' || itemDifficulty === selectedDifficulty;

    let matchesLevel = true;
    if (selectedLevel !== 'All Levels') {
      if (selectedLevel === 'University') {
        matchesLevel = item.level === 'University' && (!selectedYear || item.year === selectedYear);
      } else {
        matchesLevel = item.level === selectedLevel;
      }
    }

    return matchesSearch && matchesCat && matchesDiff && matchesLevel;
  });

  const filterBar = document.getElementById('activeFilterBar');
  const levelLabel = selectedLevel === 'University' && selectedYear
    ? `University • ${selectedYear}`
    : selectedLevel;
  const hasFilter =
    selectedCategory !== 'All' ||
    selectedDifficulty !== 'All' ||
    selectedLevel !== 'All Levels' ||
    query !== '';

  filterBar.innerHTML = `
    <span>Showing <strong>${filtered.length}</strong> (${escapeHtml(selectedCategory)} • ${escapeHtml(selectedDifficulty)} • ${escapeHtml(levelLabel)})</span>
    ${hasFilter ? `<button class="clear-filter-btn" onclick="clearAllFilters()">Reset Filters</button>` : ''}
  `;

  const list = document.getElementById('materialsList');
  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty-state">No learning materials found for this selection.</div>`;
    return;
  }

  list.innerHTML = filtered.map(item => {
    const itemDifficulty = item.difficulty || 'Beginner';
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
            <span class="mini-tag ${getDifficultyClass(itemDifficulty)}">${escapeHtml(itemDifficulty)}</span>
            <span class="mini-tag">${escapeHtml(badgeText)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* 5. Detail Screen with 5 Tabs */
function openDetail(id) {
  const item = materials.find(m => m.id === id);
  if (!item) return;

  currentMaterial = item;
  currentTab = 'book';
  currentVideoLang = 'amharic';
  currentQuizLevel = 1;

  const itemDifficulty = item.difficulty || 'Beginner';
  const levelDisplay = item.level === 'University' && item.year
    ? `University (${item.year})`
    : item.level;

  document.getElementById('detailHeaderTitle').textContent = item.title;
  document.getElementById('detailIcon').textContent = item.icon;
  document.getElementById('detailTitle').textContent = item.title;
  document.getElementById('detailAuthor').textContent = `By ${item.author}`;
  document.getElementById('detailCategory').textContent = item.category;

  const diffEl = document.getElementById('detailDifficulty');
  diffEl.textContent = itemDifficulty;
  diffEl.className = `type-pill ${getDifficultyClass(itemDifficulty)}`;

  document.getElementById('detailLevel').textContent = levelDisplay;

  document.getElementById('addToCartBtn').onclick = () => {
    addToCart(item);
    showToast(`"${item.title}" saved to your list!`);
  };

  document.getElementById('deleteBookBtn').onclick = () => {
    deleteMaterial(item.id);
  };

  switchResourceTab('book');
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

  document.getElementById('resourceTabContent').innerHTML = `
    <div class="panel-heading">📘 Book Reader & Chapters</div>
    <p class="panel-subtext">${escapeHtml(item.description)}</p>
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
    pages: '15 Pages',
    url: ''
  };
  const safePdfUrl = sanitizeUrl(pdf.url);

  document.getElementById('resourceTabContent').innerHTML = `
    <div class="panel-heading">📄 PDF Study Material</div>
    <p class="panel-subtext">Read or save the printable PDF study sheet for <strong>${escapeHtml(item.title)}</strong>.</p>
    <div class="resource-box">
      <div>
        <div class="card-title">📄 ${escapeHtml(pdf.fileName)}</div>
        <div class="card-sub">${escapeHtml(pdf.pages)} • ${escapeHtml(item.level)} (${escapeHtml(item.difficulty)})</div>
      </div>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        ${safePdfUrl ? `<a class="btn-primary" href="${safePdfUrl}" target="_blank" rel="noopener noreferrer">Open PDF Link</a>` : ''}
        <button class="btn-primary" onclick="downloadPrintablePdf()">⬇️ Save / Print PDF</button>
      </div>
    </div>
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
      <div class="meta">Author: ${escapeHtml(item.author)} | Category: ${escapeHtml(item.category)} | Level: ${escapeHtml(item.difficulty)} (${escapeHtml(item.level)})</div>
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
        title: `Explore ${item.category} Lessons for Kids`,
        source: 'code.org',
        url: 'https://code.org/'
      }];

  document.getElementById('resourceTabContent').innerHTML = `
    <div class="panel-heading">🔗 Link Reading (External Resources)</div>
    <p class="panel-subtext">Click any trusted reading link below to practice and read more online.</p>
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

/* TAB 4: SELF-TESTING (10 QUESTIONS CHOICE • LEVEL 1 TO 100) */
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

  let optionsHtml = '';
  for (let i = 1; i <= 100; i++) {
    const passedMark = progress[i] ? ` ✓ (${progress[i]}/10)` : '';
    optionsHtml += `<option value="${i}" ${i === currentQuizLevel ? 'selected' : ''}>Level ${i}${passedMark}</option>`;
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

    const explainHtml = quizSubmitted
      ? `<div class="card-sub" style="margin-top:4px; color:var(--primary-dark);">💡 ${escapeHtml(q.explain)}</div>`
      : '';

    return `
      <div class="question-block">
        <div class="q-title">${q.number}. ${escapeHtml(q.q)}</div>
        <div class="choice-list">${choicesHtml}</div>
        ${explainHtml}
      </div>
    `;
  }).join('');

  document.getElementById('resourceTabContent').innerHTML = `
    <div class="panel-heading">📝 Self-Testing: 10 Choice Questions (Level 1 to 100)</div>
    <div class="quiz-toolbar">
      <div class="level-picker">
        <label for="quizLevelSelect"><strong>Select Level:</strong></label>
        <select id="quizLevelSelect" onchange="loadQuizLevel(this.value)">
          ${optionsHtml}
        </select>
      </div>
      <span class="quiz-progress-pill">Completed: ${passedCount} / 100 Levels</span>
    </div>

    ${scoreHtml}
    ${questionsHtml}

    ${!quizSubmitted ? `<button class="btn-primary full-btn" onclick="submitQuiz()">Submit 10 Answers (Level ${currentQuizLevel})</button>` : ''}
  `;
}

/* TAB 5: VIDEO (AMHARIC & ENGLISH) */
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
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(item.title + ' amharic')}`
    },
    english: {
      title: `${item.title} - English Video Lesson`,
      summary: `Educational video lesson for ${item.title} (${item.level}).`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(item.title + ' for kids')}`
    }
  };

  const activeVideo = currentVideoLang === 'amharic' ? videos.amharic : videos.english;
  const videoUrl = sanitizeUrl(activeVideo.url) || 'https://www.youtube.com/';

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
      <div style="font-size:2.2rem;">▶️</div>
      <h4>${escapeHtml(activeVideo.title)}</h4>
      <p>${escapeHtml(activeVideo.summary)}</p>
      <a class="btn-primary" href="${videoUrl}" target="_blank" rel="noopener noreferrer" style="align-self:flex-start;">
        ${currentVideoLang === 'amharic' ? '▶️ ቪዲዮውን በአማርኛ ክፈት' : '▶️ Watch English Video'}
      </a>
    </div>
  `;
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
  showToast('Material removed from catalog.');
}

function resetCatalog() {
  materials = StoreStorage.resetMaterials();
  clearAllFilters();
  showToast('Default 1–4 Grade catalog restored!');
}

/* 7. Add New Book Modal */
function openAddModal() {
  document.getElementById('addBookOverlay').classList.add('open');
}

function closeAddModal(e) {
  if (!e || e.target.id === 'addBookOverlay') {
    document.getElementById('addBookOverlay').classList.remove('open');
  }
}

function addNewBook(event) {
  event.preventDefault();
  const title = document.getElementById('bookTitle').value.trim();
  const author = document.getElementById('bookAuthor').value.trim();
  const category = document.getElementById('bookCategory').value;
  const difficulty = document.getElementById('bookDifficulty').value;
  const levelRaw = document.getElementById('bookLevel').value;
  const pdfUrl = document.getElementById('bookPdfUrl').value.trim();
  const amharicVideo = document.getElementById('bookAmharicVideo').value.trim();
  const englishVideo = document.getElementById('bookEnglishVideo').value.trim();
  const description = document.getElementById('bookDesc').value.trim();

  if (!title || !author) return;

  const [level, year = ''] = levelRaw.split('|');

  const newBook = {
    id: Date.now().toString(),
    title,
    author,
    category,
    difficulty,
    level,
    year,
    icon: getCategoryIcon(category),
    description,
    bookChapters: [{ title: 'Chapter 1: Overview', content: description }],
    pdfInfo: {
      fileName: `${title.replace(/\s+/g, '_')}.pdf`,
      pages: 'Printable PDF',
      url: pdfUrl
    },
    readingLinks: [
      { title: `More ${category} Reading Resources`, source: 'Code.org', url: 'https://code.org/' }
    ],
    videos: {
      amharic: {
        title: `${title} (አማርኛ)`,
        summary: `ስለ ${title} በአማርኛ የተዘጋጀ ቪዲዮ።`,
        url: amharicVideo || `https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' amharic')}`
      },
      english: {
        title: `${title} (English)`,
        summary: `Video lesson for ${title}.`,
        url: englishVideo || `https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' for kids')}`
      }
    }
  };

  materials.unshift(newBook);
  StoreStorage.saveMaterials(materials);
  document.getElementById('addBookForm').reset();
  closeAddModal();
  renderCatalog();
  showToast(`"${title}" added with Book, PDF, Links, 10-Q Quiz & Videos!`);
}

/* 8. Saved Materials List */
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
        <div class="card-sub">${escapeHtml(item.category)} • ${escapeHtml(item.difficulty || 'Beginner')} • ${escapeHtml(item.level)}</div>
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
renderDifficultyChips();
renderLevelSidebar();
renderCatalog();
updateCartBadge();
