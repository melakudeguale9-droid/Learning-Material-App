let selectedCategory = 'All';
let selectedLevel = 'All Levels';
let selectedYear = '';
let universityExpanded = true;

let materials = StoreStorage.getMaterials();
let cart = StoreStorage.getCart();

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
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

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

/* 1. Top Horizontal Category Chips */
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
    <span>Showing <strong>${filtered.length}</strong> materials (${escapeHtml(selectedCategory)} • ${escapeHtml(levelLabel)})</span>
    ${hasFilter ? `<button class="clear-filter-btn" onclick="clearAllFilters()">Reset Filters</button>` : ''}
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
          <div class="card-sub">${escapeHtml(item.author)} • ${escapeHtml(item.type)}</div>
          <div class="card-tags">
            <span class="mini-tag">${escapeHtml(item.category)}</span>
            <span class="mini-tag">${escapeHtml(badgeText)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* 4. Detail Screen */
function openDetail(id) {
  const item = materials.find(m => m.id === id);
  if (!item) return;

  const levelDisplay = item.level === 'University' && item.year
    ? `University (${item.year})`
    : item.level;

  document.getElementById('detailHeaderTitle').textContent = item.title;
  document.getElementById('detailIcon').textContent = item.icon;
  document.getElementById('detailTitle').textContent = item.title;
  document.getElementById('detailAuthor').textContent = `By ${item.author}`;
  document.getElementById('detailCategory').textContent = item.category;
  document.getElementById('detailLevel').textContent = levelDisplay;
  document.getElementById('detailType').textContent = item.type;
  document.getElementById('detailDesc').textContent = item.description;

  document.getElementById('addToCartBtn').onclick = () => {
    addToCart(item);
    showToast(`${item.title} saved to your list!`);
    showScreen('catalogScreen');
  };

  document.getElementById('deleteBookBtn').onclick = () => {
    deleteMaterial(item.id);
  };

  showScreen('detailScreen');
}

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
  showToast('Default catalog restored!');
}

/* 5. Add New Book Modal */
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
  const levelRaw = document.getElementById('bookLevel').value;
  const type = document.getElementById('bookType').value;
  const description = document.getElementById('bookDesc').value.trim();

  if (!title || !author) return;

  const [level, year = ''] = levelRaw.split('|');

  const newBook = {
    id: Date.now().toString(),
    title,
    author,
    category,
    level,
    year,
    type,
    description,
    icon: getCategoryIcon(category)
  };

  materials.unshift(newBook);
  StoreStorage.saveMaterials(materials);
  document.getElementById('addBookForm').reset();
  closeAddModal();
  renderCatalog();
  showToast(`"${title}" added!`);
}

/* 6. Saved Materials List */
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
      <div class="card-info">
        <div class="card-title">${escapeHtml(item.title)}</div>
        <div class="card-sub">${escapeHtml(item.author)} • ${escapeHtml(item.type)}</div>
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
    `Your ${cart.length} selected learning material(s) are ready to read and download.`;
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
