// ============ DATA ============
const defaultGames = [
    {
        id: 1,
        name: "Cyberpunk 2077",
        price: 1499,
        discount: 40,
        category: "rpg",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
        desc: "Відкритий світ майбутнього, де технології змінили все. Досліджуй Найт-Сіті та стань легендою.",
        rating: 4.5,
        dev: "CD Projekt RED",
        color: "#fbbf24"
    },
    {
        id: 2,
        name: "Elden Ring",
        price: 1799,
        discount: 0,
        category: "rpg",
        image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=600&h=400&fit=crop",
        desc: "Епічна фентезі пригода від творців Dark Souls. Досліджуй Проміжні Землі та перемагай богів.",
        rating: 4.9,
        dev: "FromSoftware",
        color: "#f59e0b"
    },
    {
        id: 3,
        name: "God of War: Ragnarök",
        price: 1999,
        discount: 25,
        category: "action",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop",
        desc: "Кратос та Атрей протистоять Рагнарьоку. Епічні битви та скандинавська міфологія.",
        rating: 4.8,
        dev: "Santa Monica Studio",
        color: "#3b82f6"
    },
    {
        id: 4,
        name: "Hogwarts Legacy",
        price: 1699,
        discount: 30,
        category: "rpg",
        image: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=600&h=400&fit=crop",
        desc: "Відвідай Гоґвортс та стань чарівником. Відкритий світ магії та пригод чекає на тебе.",
        rating: 4.3,
        dev: "Avalanche Software",
        color: "#8b5cf6"
    },
    {
        id: 5,
        name: "FC 25",
        price: 1899,
        discount: 0,
        category: "sport",
        image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=400&fit=crop",
        desc: "Найреалістичніший футбольний симулятор. Нові режими, тактики та ліцензовані команди.",
        rating: 3.8,
        dev: "EA Sports",
        color: "#22c55e"
    },
    {
        id: 6,
        name: "Resident Evil 4 Remake",
        price: 1599,
        discount: 35,
        category: "horror",
        image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&h=400&fit=crop",
        desc: "Культовий хорор повертається з неймовірною графікою. Виживай серед жахів іспанського села.",
        rating: 4.7,
        dev: "Capcom",
        color: "#ef4444"
    },
    {
        id: 7,
        name: "Civilization VII",
        price: 1299,
        discount: 0,
        category: "strategy",
        image: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=600&h=400&fit=crop",
        desc: "Побудуй цивілізацію, яка переживе тисячоліття. Нова ера покрокових стратегій.",
        rating: 4.4,
        dev: "Firaxis Games",
        color: "#06b6d4"
    },
    {
        id: 8,
        name: "Hollow Knight: Silksong",
        price: 599,
        discount: 10,
        category: "indie",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop",
        desc: "Довгоочікуваний сіквел культової інді-гри. Нове королівство, нові битви, нова героїня.",
        rating: 4.6,
        dev: "Team Cherry",
        color: "#d946ef"
    },
];

const categoryEmojis = {
    action: '⚔️', rpg: '🧙', strategy: '♟️', sport: '⚽', horror: '👻', indie: '🎨'
};

const categoryNames = {
    action: 'Екшен', rpg: 'RPG', strategy: 'Стратегія', sport: 'Спорт', horror: 'Хорор', indie: 'Інді'
};

// ============ STATE ============
let games = JSON.parse(localStorage.getItem('nexus_games')) || [...defaultGames];
let cart = JSON.parse(localStorage.getItem('nexus_cart')) || [];
let isAdmin = false;
let currentCategory = 'all';
let nextId = games.length > 0 ? Math.max(...games.map(g => g.id)) + 1 : 1;

// ============ UTILITY FUNCTIONS ============

function saveData() {
    localStorage.setItem('nexus_games', JSON.stringify(games));
    localStorage.setItem('nexus_cart', JSON.stringify(cart));
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

function getDiscountedPrice(game) {
    if (game.discount > 0) {
        return Math.round(game.price * (1 - game.discount / 100));
    }
    return game.price;
}

function renderStars(rating) {
    let html = '';
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    for (let i = 0; i < 5; i++) {
        if (i < full) html += '<i class="fas fa-star star text-xs"></i>';
        else if (i === full && half) html += '<i class="fas fa-star-half-alt star text-xs"></i>';
        else html += '<i class="fas fa-star star-empty text-xs"></i>';
    }
    return html;
}

// ============ RENDER GAMES ============

function renderGames() {
    const grid = document.getElementById('gamesGrid');
    const search = document.getElementById('searchInput').value.toLowerCase();
    const sort = document.getElementById('sortSelect').value;

    let filtered = games.filter(g => {
        const matchesSearch = g.name.toLowerCase().includes(search) || (g.desc && g.desc.toLowerCase().includes(search));
        const matchesCat = currentCategory === 'all' || 
            (currentCategory === 'sale' ? g.discount > 0 : g.category === currentCategory);
        return matchesSearch && matchesCat;
    });

    // Sort
    filtered.sort((a, b) => {
        switch(sort) {
            case 'price-asc': return getDiscountedPrice(a) - getDiscountedPrice(b);
            case 'price-desc': return getDiscountedPrice(b) - getDiscountedPrice(a);
            case 'name': return a.name.localeCompare(b.name);
            case 'rating': return (b.rating || 0) - (a.rating || 0);
            default: return (b.rating || 0) - (a.rating || 0);
        }
    });

    document.getElementById('emptyState').classList.toggle('hidden', filtered.length > 0);

    grid.innerHTML = filtered.map((game, i) => {
        const dp = getDiscountedPrice(game);
        const emoji = categoryEmojis[game.category] || '🎮';
        const catName = categoryNames[game.category] || game.category;
        const color = game.color || '#8b5cf6';

        return `
        <div class="game-card animate-in" style="animation-delay: ${i * 0.05}s" onclick="openGameDetail(${game.id})">
            <div class="relative h-48 overflow-hidden">
                ${game.discount > 0 ? `<div class="discount-badge">-${game.discount}%</div>` : ''}
                ${game.image ? 
                    `<img src="${game.image}" alt="${game.name}" class="card-img" loading="lazy" onerror="this.parentElement.innerHTML='<div class=game-img-placeholder style=background:linear-gradient(135deg,${color}22,${color}44)><span>${emoji}</span></div>'">` : 
                    `<div class="game-img-placeholder" style="background:linear-gradient(135deg,${color}22,${color}44)"><span>${emoji}</span></div>`
                }
            </div>
            <div class="p-4">
                <div class="flex items-center gap-2 mb-2">
                    <span class="tag bg-white/5 text-gray-400">${emoji} ${catName}</span>
                    ${game.rating ? `<span class="text-xs text-gray-500">${renderStars(game.rating)}</span>` : ''}
                </div>
                <h3 class="font-bold text-white mb-1 text-base leading-tight">${game.name}</h3>
                ${game.dev ? `<p class="text-xs text-gray-500 mb-3">${game.dev}</p>` : '<div class="mb-3"></div>'}
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="font-bold text-lg text-white">${dp} ₴</span>
                        ${game.discount > 0 ? `<span class="text-sm text-gray-500 line-through">${game.price} ₴</span>` : ''}
                    </div>
                    <button onclick="event.stopPropagation(); addToCart(${game.id})" class="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition" title="Додати в кошик">
                        <i class="fas fa-cart-plus text-sm"></i>
                    </button>
                </div>
            </div>
            ${isAdmin ? `
            <div class="flex border-t border-white/5">
                <button onclick="event.stopPropagation(); editGame(${game.id})" class="flex-1 py-2.5 text-xs text-blue-400 hover:bg-blue-500/10 transition"><i class="fas fa-pen mr-1"></i> Редагувати</button>
                <button onclick="event.stopPropagation(); deleteGame(${game.id})" class="flex-1 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition border-l border-white/5"><i class="fas fa-trash mr-1"></i> Видалити</button>
            </div>
            ` : ''}
        </div>
        `;
    }).join('');
}

// ============ CATEGORY FILTER & NAVIGATION ============

function filterCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', 
            (cat === 'all' && btn.textContent.includes('Усі')) ||
            (cat === 'action' && btn.textContent.includes('Екшен')) ||
            (cat === 'rpg' && btn.textContent.includes('RPG')) ||
            (cat === 'strategy' && btn.textContent.includes('Стратегія')) ||
            (cat === 'sport' && btn.textContent.includes('Спорт')) ||
            (cat === 'horror' && btn.textContent.includes('Хорор')) ||
            (cat === 'indie' && btn.textContent.includes('Інді')) ||
            (cat === 'sale' && btn.textContent.includes('Знижки'))
        );
    });
    document.getElementById('heroSection').style.display = 'none';
    renderGames();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goHome() {
    document.getElementById('heroSection').style.display = 'flex';
    currentCategory = 'all';
    document.getElementById('searchInput').value = '';
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.includes('Усі'));
    });
    renderGames();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============ GAME DETAIL ============

function openGameDetail(id) {
    const game = games.find(g => g.id === id);
    if (!game) return;
    const dp = getDiscountedPrice(game);
    const emoji = categoryEmojis[game.category] || '🎮';
    const catName = categoryNames[game.category] || game.category;
    const color = game.color || '#8b5cf6';

    document.getElementById('gameDetailContent').innerHTML = `
        <div class="relative h-56 md:h-72 overflow-hidden rounded-t-xl">
            ${game.discount > 0 ? `<div class="discount-badge text-sm">-${game.discount}%</div>` : ''}
            ${game.image ? 
                `<img src="${game.image}" alt="${game.name}" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='<div class=game-img-placeholder style=background:linear-gradient(135deg,${color}22,${color}44);height:100%><span style=font-size:80px>${emoji}</span></div>'">` :
                `<div class="game-img-placeholder" style="background:linear-gradient(135deg,${color}22,${color}44);height:100%"><span style="font-size:80px">${emoji}</span></div>`
            }
            <button onclick="closeGameDetail()" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition">
                <i class="fas fa-xmark"></i>
            </button>
        </div>
        <div class="p-6 md:p-8">
            <div class="flex flex-wrap items-center gap-2 mb-3">
                <span class="tag bg-purple-500/10 text-purple-300">${emoji} ${catName}</span>
                ${game.rating ? `<span class="text-sm">${renderStars(game.rating)} <span class="text-gray-400 ml-1">${game.rating}</span></span>` : ''}
            </div>
            <h2 class="text-2xl md:text-3xl font-black text-white mb-1">${game.name}</h2>
            ${game.dev ? `<p class="text-sm text-gray-500 mb-4">${game.dev}</p>` : ''}
            ${game.desc ? `<p class="text-gray-400 leading-relaxed mb-6">${game.desc}</p>` : ''}
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/3 border border-white/5">
                <div>
                    <div class="text-xs text-gray-500 mb-1">Ціна</div>
                    <div class="flex items-center gap-3">
                        <span class="text-3xl font-black text-white">${dp} ₴</span>
                        ${game.discount > 0 ? `<span class="text-lg text-gray-500 line-through">${game.price} ₴</span>` : ''}
                    </div>
                </div>
                <button onclick="addToCart(${game.id}); closeGameDetail()" class="btn-primary px-8 py-4 text-base w-full sm:w-auto">
                    <i class="fas fa-cart-plus mr-2"></i> Купити
                </button>
            </div>
        </div>
    `;
    document.getElementById('gameDetailModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeGameDetail() {
    document.getElementById('gameDetailModal').classList.remove('active');
    document.body.style.overflow = '';
}

// ============ CART ============

function updateCartBadge() {
    const count = cart.length;
    ['cartBadge', 'cartBadgeMobile'].forEach(id => {
        const el = document.getElementById(id);
        el.textContent = count;
        el.classList.toggle('hidden', count === 0);
    });
}

function addToCart(id) {
    const game = games.find(g => g.id === id);
    if (!game) return;
    if (cart.find(c => c.id === id)) {
        showToast('⚠️ Ця гра вже в кошику!');
        return;
    }
    cart.push({ id: game.id, name: game.name, price: getDiscountedPrice(game), image: game.image, color: game.color, category: game.category });
    saveData();
    updateCartBadge();
    showToast(`✅ ${game.name} додано в кошик!`);
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    saveData();
    updateCartBadge();
    renderCart();
}

function showCart() {
    renderCart();
    document.getElementById('cartModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cartModal').classList.remove('active');
    document.body.style.overflow = '';
}

function renderCart() {
    const container = document.getElementById('cartItems');
    const footer = document.getElementById('cartFooter');
    const empty = document.getElementById('cartEmpty');

    if (cart.length === 0) {
        container.innerHTML = '';
        footer.classList.add('hidden');
        empty.classList.remove('hidden');
        return;
    }

    empty.classList.add('hidden');
    footer.classList.remove('hidden');

    container.innerHTML = cart.map(item => {
        const emoji = categoryEmojis[item.category] || '🎮';
        const color = item.color || '#8b5cf6';
        return `
        <div class="flex items-center gap-4 p-3 rounded-xl hover:bg-white/3 transition mb-2">
            <div class="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                ${item.image ? 
                    `<img src="${item.image}" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='<div class=game-img-placeholder style=background:linear-gradient(135deg,${color}22,${color}44);font-size:20px>${emoji}</div>'">` :
                    `<div class="game-img-placeholder" style="background:linear-gradient(135deg,${color}22,${color}44);font-size:20px">${emoji}</div>`
                }
            </div>
            <div class="flex-1 min-w-0">
                <p class="font-semibold text-sm text-white truncate">${item.name}</p>
                <p class="text-sm text-purple-400 font-bold">${item.price} ₴</p>
            </div>
            <button onclick="removeFromCart(${item.id})" class="text-gray-500 hover:text-red-400 transition p-2">
                <i class="fas fa-trash-can text-sm"></i>
            </button>
        </div>
        `;
    }).join('');

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cartTotal').textContent = total + ' ₴';
}

function checkout() {
    showToast('🎉 Замовлення оформлено! Дякуємо!');
    cart = [];
    saveData();
    updateCartBadge();
    closeCart();
}

// ============ ADMIN ============

function toggleAdmin() {
    if (isAdmin) {
        isAdmin = false;
        showToast('🔒 Режим адміна вимкнено');
        document.getElementById('adminBar').classList.add('hidden');
        document.getElementById('adminToggle').innerHTML = '<i class="fas fa-lock mr-1"></i> Адмін';
        document.getElementById('adminToggleMobile').textContent = '🔐 Вхід як Адмін';
        renderGames();
    } else {
        document.getElementById('adminLoginModal').classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => document.getElementById('adminPassword').focus(), 200);
    }
}

function closeAdminLogin() {
    document.getElementById('adminLoginModal').classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('adminPassword').value = '';
}

function loginAdmin(e) {
    e.preventDefault();
    const pw = document.getElementById('adminPassword').value;
    if (pw === 'admin') {
        isAdmin = true;
        closeAdminLogin();
        showToast('🔓 Ви увійшли як адміністратор!');
        document.getElementById('adminBar').classList.remove('hidden');
        document.getElementById('adminToggle').innerHTML = '<i class="fas fa-unlock mr-1"></i> Вийти';
        document.getElementById('adminToggleMobile').textContent = '🔓 Вийти з адмін';
        renderGames();
    } else {
        showToast('❌ Невірний пароль!');
        document.getElementById('adminPassword').value = '';
    }
}

// ============ ADD / EDIT GAME ============

function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Додати нову гру';
    document.getElementById('gameForm').reset();
    document.getElementById('editId').value = '';
    document.getElementById('addGameModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAddModal() {
    document.getElementById('addGameModal').classList.remove('active');
    document.body.style.overflow = '';
}

function editGame(id) {
    const game = games.find(g => g.id === id);
    if (!game) return;
    document.getElementById('modalTitle').textContent = 'Редагувати гру';
    document.getElementById('editId').value = id;
    document.getElementById('gameName').value = game.name;
    document.getElementById('gamePrice').value = game.price;
    document.getElementById('gameDiscount').value = game.discount || 0;
    document.getElementById('gameCategory').value = game.category;
    document.getElementById('gameImage').value = game.image || '';
    document.getElementById('gameDesc').value = game.desc || '';
    document.getElementById('gameRating').value = game.rating || '';
    document.getElementById('gameDev').value = game.dev || '';
    document.getElementById('addGameModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function deleteGame(id) {
    if (confirm('Видалити цю гру?')) {
        games = games.filter(g => g.id !== id);
        cart = cart.filter(c => c.id !== id);
        saveData();
        updateCartBadge();
        renderGames();
        showToast('🗑️ Гру видалено');
    }
}

function saveGame(e) {
    e.preventDefault();
    const editId = document.getElementById('editId').value;
    const colors = ['#fbbf24','#f59e0b','#3b82f6','#8b5cf6','#22c55e','#ef4444','#06b6d4','#d946ef','#f97316','#ec4899'];
    
    const gameData = {
        name: document.getElementById('gameName').value.trim(),
        price: parseFloat(document.getElementById('gamePrice').value),
        discount: parseInt(document.getElementById('gameDiscount').value) || 0,
        category: document.getElementById('gameCategory').value,
        image: document.getElementById('gameImage').value.trim(),
        desc: document.getElementById('gameDesc').value.trim(),
        rating: parseFloat(document.getElementById('gameRating').value) || 4.0,
        dev: document.getElementById('gameDev').value.trim(),
        color: colors[Math.floor(Math.random() * colors.length)]
    };

    if (editId) {
        const idx = games.findIndex(g => g.id === parseInt(editId));
        if (idx !== -1) {
            gameData.id = parseInt(editId);
            gameData.color = games[idx].color;
            games[idx] = gameData;
            showToast('✏️ Гру оновлено!');
        }
    } else {
        gameData.id = nextId++;
        games.push(gameData);
        showToast('✅ Гру додано до каталогу!');
    }

    saveData();
    renderGames();
    closeAddModal();
}

// ============ MOBILE MENU ============

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const icon = document.getElementById('menuIcon');
    menu.classList.toggle('open');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-xmark');
}

// ============ INIT ============

function init() {
    renderGames();
    updateCartBadge();
}

init();
