let selectedCategory = 'All';
let materials = StoreStorage.getMaterials();
let cart = StoreStorage.getCart();

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
    Cybersecurity: '🛡️',
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
  container.innerHTML = CATEGORIES.map(cat => `
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

  list.innerHTML = filtered.map(item => `
    <div class="card" onclick="openDetail('${escapeHtml(item.id)}')">
      <div class="avatar">${item.icon}</div>
      <div class="card-info">
        <div class="card-title">${escapeHtml(item.title)}</div>
        <div class="card-sub">${escapeHtml(item.author)} • ${escapeHtml(item.type)}</div>
      </div>
      <div class="price">${item.price} ETB</div>
    </div>
  `).join('');
}

function openDetail(id) {
  const item = materials.find(m => m.id === id);
  if (!item) return;

  document.getElementById('detailHeaderTitle').textContent = item.title;
  document.getElementById('detailIcon').textContent = item.icon;
  document.getElementById('detailTitle').textContent = item.title;
  document.getElementById('detailAuthor').textContent = `By ${item.author}`;
  document.getElementById('detailCategory').textContent = item.category;
  document.getElementById('detailType').textContent = item.type;
  document.getElementById('detailDesc').textContent = item.description;
  document.getElementById('detailPrice').textContent = `${item.price} ETB`;

  document.getElementById('addToCartBtn').onclick = () => {
    addToCart(item);
    showToast(`${item.title} added to cart!`);
    showScreen('catalogScreen');
  };

  document.getElementById('deleteBookBtn').onclick = () => {
    deleteMaterial(item.id);
  };

  showScreen('detailScreen');
}

function addToCart(item) {
  const existing = cart.find(c => c.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  StoreStorage.saveCart(cart);
  updateCartBadge();
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
  renderCatalog();
  showToast('Default catalog restored!');
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
  StoreStorage.saveMaterials(materials);
  document.getElementById('addBookForm').reset();
  closeAddModal();
  renderCatalog();
  showToast(`"${title}" added!`);
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  if (totalCount > 0) {
    badge.style.display = 'flex';
    badge.textContent = totalCount;
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
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById('cartTotal').textContent = `${total} ETB`;

  list.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div class="avatar">${item.icon}</div>
      <div class="card-info">
        <div class="card-title">${escapeHtml(item.title)}</div>
        <div class="card-sub">${item.price} ETB each • ${escapeHtml(item.type)}</div>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" onclick="changeQty(${idx}, -1)">−</button>
        <span class="qty-val">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
      </div>
      <button class="delete-btn" onclick="removeFromCart(${idx})" title="Remove">🗑️</button>
    </div>
  `).join('');
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  StoreStorage.saveCart(cart);
  updateCartBadge();
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  StoreStorage.saveCart(cart);
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
renderCatalog();
updateCartBadge();
