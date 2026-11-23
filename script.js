const STORAGE_KEYS = {
  MATERIALS: 'toby_store_materials_v1',
  CART: 'toby_store_cart_v1'
};

const defaultMaterials = [
  {
    id: '1',
    title: 'Grade 12 Physics & Exam Guide',
    author: 'Dr. Abebe T.',
    category: 'Science',
    price: 250,
    type: 'Physical Book',
    description: 'Comprehensive physics formulas, exercises, and past exam questions with step-by-step solutions.',
    icon: '📘'
  },
  {
    id: '2',
    title: 'Python Programming for Beginners',
    author: 'Sarah Jenkins',
    category: 'Computer Science',
    price: 180,
    type: 'PDF / E-Book',
    description: 'Learn coding from scratch. Covers variables, data structures, OOP, and mini projects.',
    icon: '📄'
  },
  {
    id: '3',
    title: 'University Calculus & Linear Algebra',
    author: 'Prof. Markos G.',
    category: 'Mathematics',
    price: 320,
    type: 'Physical Book',
    description: 'Standard textbook for engineering and natural science freshman courses.',
    icon: '🧮'
  },
  {
    id: '4',
    title: 'English Grammar & Writing Skills',
    author: 'Helen Brook',
    category: 'Languages',
    price: 150,
    type: 'PDF / E-Book',
    description: 'Essential rules, essay templates, and vocabulary lists for students and professionals.',
    icon: '🌐'
  }
];

const categories = ['All', 'Science', 'Mathematics', 'Computer Science', 'Languages'];
let selectedCategory = 'All';

let materials = loadFromStorage(STORAGE_KEYS.MATERIALS, defaultMaterials);
let cart = loadFromStorage(STORAGE_KEYS.CART, []);

function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [...fallback];
  } catch {
    return [...fallback];
  }
}

function saveMaterials() {
  localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
}

function saveCart() {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getCategoryIcon(category, type) {
  if (type === 'PDF / E-Book') return '📄';
  const icons = {
    Science: '📘',
    Mathematics: '🧮',
    'Computer Science': '💻',
    Languages: '🌐'
  };
  return icons[category] || '📚';
}

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

function renderChips() {
  const container = document.getElementById('categoryChips');
  container.innerHTML = categories
    .map(cat => `
      <button class="chip ${selectedCategory === cat ? 'active' : ''}" onclick="selectCategory('${cat}')">
        ${cat}
      </button>
    `)
    .join('');
}

function selectCategory(cat) {
  selectedCategory = cat;
  renderChips();
  renderCatalog();
}

function renderCatalog() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const filtered = materials.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query);
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const list = document.getElementById('materialsList');
  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty-state">No learning materials found.</div>`;
    return;
  }

  list.innerHTML = filtered
    .map(item => `
      <div class="card" onclick="openDetail('${escapeHtml(item.id)}')">
        <div class="avatar">${item.icon}</div>
        <div class="card-info">
          <div class="card-title">${escapeHtml(item.title)}</div>
          <div class="card-sub">${escapeHtml(item.author)} • ${escapeHtml(item.type)}</div>
        </div>
        <div class="price">${item.price} ETB</div>
      </div>
    `)
    .join('');
}

function openDetail(id) {
  const item = materials.find(m => m.id === id);
  if (!item) return;

  document.getElementById('detailHeaderTitle').textContent = item.title;
  document.getElementById('detailIcon').textContent = item.icon;
  document.getElementById('detailTitle').textContent = item.title;
  document.getElementById('detailAuthor').textContent = `By ${item.author}`;
  document.getElementById('detailType').textContent = item.type;
  document.getElementById('detailDesc').textContent = item.description;
  document.getElementById('detailPrice').textContent = `${item.price} ETB`;

  document.getElementById('addToCartBtn').onclick = () => {
    cart.push({ ...item });
    saveCart();
    updateCartBadge();
    showToast(`${item.title} added to cart!`);
    showScreen('catalogScreen');
  };

  showScreen('detailScreen');
}

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
  const price = Number(document.getElementById('bookPrice').value);
  const type = document.getElementById('bookType').value;
  const description = document.getElementById('bookDesc').value.trim();

  if (!title || !author || price <= 0) return;

  const newBook = {
    id: Date.now().toString(),
    title,
    author,
    category,
    price,
    type,
    description,
    icon: getCategoryIcon(category, type)
  };

  materials.unshift(newBook);
  saveMaterials();
  document.getElementById('addBookForm').reset();
  closeAddModal();
  renderCatalog();
  showToast(`"${title}" added to catalog!`);
}

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
    list.innerHTML = `<div class="empty-state">Your cart is empty.</div>`;
    checkoutBar.style.display = 'none';
    return;
  }

  checkoutBar.style.display = 'block';
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  document.getElementById('cartTotal').textContent = `${total} ETB`;

  list.innerHTML = cart
    .map((item, idx) => `
      <div class="cart-item">
        <div class="avatar">${item.icon}</div>
        <div class="card-info">
          <div class="card-title">${escapeHtml(item.title)}</div>
          <div class="card-sub">${item.price} ETB (${escapeHtml(item.type)})</div>
        </div>
        <button class="delete-btn" onclick="removeFromCart(${idx})" title="Remove">🗑️</button>
      </div>
    `)
    .join('');
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartBadge();
  renderCart();
}

function openPaymentSheet() {
  document.getElementById('paymentOverlay').classList.add('open');
}

function closePaymentSheet(e) {
  if (e.target.id === 'paymentOverlay') {
    document.getElementById('paymentOverlay').classList.remove('open');
  }
}

function completeOrder(method) {
  document.getElementById('paymentOverlay').classList.remove('open');
  document.getElementById('confirmMessage').textContent =
    `Payment via ${method} initiated. You will receive an SMS/Email receipt.`;
  document.getElementById('confirmDialog').classList.add('open');
}

function finishOrder() {
  document.getElementById('confirmDialog').classList.remove('open');
  cart = [];
  saveCart();
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
renderCatalog();
updateCartBadge();
