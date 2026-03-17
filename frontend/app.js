const API = '';
let currentCategory = 'all';
let installedSkills = JSON.parse(localStorage.getItem('installedSkills') || '[]');
let allSkillsCache = null;

// ============ SVG Icons ============
const ICONS = {
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>',
  package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M16.5 9.4l-9-5.19"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  shieldCheck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>',
  file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>',
};

// ============ Init ============
document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadFeatured();
  loadSkills();
  loadStats();
  setupSearch();

  document.getElementById('menuToggle').addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      document.getElementById('sidebar').classList.toggle('open');
    }
  });
});

// ============ Stats ============
async function loadStats() {
  try {
    const res = await fetch(`${API}/api/skills?limit=200`);
    const data = await res.json();
    allSkillsCache = data.skills;
    const totalSkills = data.total;
    const totalDownloads = data.skills.reduce((s, sk) => s + sk.downloads, 0);
    const totalAuthors = new Set(data.skills.map(s => s.author)).size;
    const avgRating = (data.skills.reduce((s, sk) => s + sk.rating, 0) / data.skills.length).toFixed(1);

    document.getElementById('statsBar').innerHTML = `
      <div class="stat-item"><div class="stat-value">${totalSkills}</div><div class="stat-label">Total Skills</div></div>
      <div class="stat-item"><div class="stat-value">${formatNum(totalDownloads)}</div><div class="stat-label">Downloads</div></div>
      <div class="stat-item"><div class="stat-value">${totalAuthors}</div><div class="stat-label">Authors</div></div>
      <div class="stat-item"><div class="stat-value">${avgRating}</div><div class="stat-label">Avg Rating</div></div>
    `;
  } catch(e) {
    console.error('Load stats failed:', e);
  }
}

// ============ Categories ============
async function loadCategories() {
  try {
    const res = await fetch(`${API}/api/categories`);
    const data = await res.json();
    const list = document.getElementById('categoryList');
    const totalCount = data.categories.reduce((s, c) => s + c.count, 0);

    let html = `<div class="cat-item active" onclick="selectCategory('all', this)">
      <span><span class="cat-icon">${getCategoryIcon('all')}</span>All</span>
      <span class="cat-count">${totalCount}</span>
    </div>`;

    data.categories.forEach(cat => {
      html += `<div class="cat-item" onclick="selectCategory('${cat.name}', this)">
        <span><span class="cat-icon">${getCategoryIcon(cat.name)}</span>${cat.name}</span>
        <span class="cat-count">${cat.count}</span>
      </div>`;
    });

    list.innerHTML = html;
  } catch(e) {
    console.error('Load categories failed:', e);
  }
}

function getCategoryIcon(name) {
  const icons = {
    'all': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    'DeFi & Trading': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    'Data & Analytics': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    'AI & Automation': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 1 4 4v2H8V6a4 4 0 0 1 4-4z"/><rect x="4" y="8" width="16" height="12" rx="2"/><line x1="9" y1="13" x2="9" y2="16"/><line x1="15" y1="13" x2="15" y2="16"/></svg>',
    'Wallet & Infra': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20"/><circle cx="16" cy="14" r="1.5"/></svg>',
    'Security & Audit': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    'Social & Community': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    'NFT & Gaming': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="12" y1="6" x2="12" y2="18"/></svg>',
    'Dev Tools': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    'Cross-chain': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>',
    'General / Popular': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
  };
  return icons[name] || icons['all'];
}

function selectCategory(cat, el) {
  currentCategory = cat;
  document.querySelectorAll('.cat-item').forEach(e => e.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('sectionTitle').textContent = cat === 'all' ? 'All Skills' : cat;
  loadSkills();
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('open');
  }
}

// ============ Featured ============
async function loadFeatured() {
  try {
    const res = await fetch(`${API}/api/featured`);
    const data = await res.json();
    const container = document.getElementById('featuredScroll');

    container.innerHTML = data.skills.map(s => `
      <div class="featured-card" onclick="openDetail('${s.id}')">
        <div class="featured-tag">Featured</div>
        <div class="fc-top">
          <img class="fc-icon" src="${proxyIcon(s.icon)}" alt="${s.name}" onerror="this.src='${fallbackIcon(s.name)}'">
          <div class="fc-info">
            <h3>${s.name}</h3>
            <div class="fc-author">${s.author}</div>
          </div>
        </div>
        <div class="fc-desc">${s.description}</div>
        <div class="fc-bottom">
          <span class="fc-downloads">${formatNum(s.downloads)} downloads</span>
          <span class="fc-rating">${renderStars(s.rating)} ${s.rating}</span>
        </div>
      </div>
    `).join('');
  } catch(e) {
    console.error('Load featured failed:', e);
  }
}

// ============ Skills List ============
async function loadSkills() {
  const grid = document.getElementById('skillsGrid');
  grid.innerHTML = '<div class="loading">Loading</div>';

  try {
    const sort = document.getElementById('sortSelect').value;
    const search = document.getElementById('searchInput').value;
    const params = new URLSearchParams({ sort, dir: 'desc' });
    if (currentCategory !== 'all') params.set('category', currentCategory);
    if (search) params.set('search', search);

    const res = await fetch(`${API}/api/skills?${params}`);
    const data = await res.json();

    if (!data.skills.length) {
      grid.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><p>No skills found</p></div>';
      return;
    }

    grid.innerHTML = data.skills.map(s => {
      const isInstalled = installedSkills.includes(s.id);
      return `
      <div class="skill-card" onclick="openDetail('${s.id}')">
        <img class="sc-icon" src="${proxyIcon(s.icon)}" alt="${s.name}" onerror="this.src='${fallbackIcon(s.name)}'">
        <div class="sc-info">
          <div class="sc-name-row">
            <span class="sc-name">${s.name}</span>
            <span class="sc-author">${s.author}</span>
          </div>
          <div class="sc-desc">${s.description}</div>
        </div>
        <div class="sc-meta">
          <span class="sc-meta-item">${ICONS.download} ${formatNum(s.downloads)}</span>
          <span class="sc-meta-item sc-rating">${ICONS.star} ${s.rating}</span>
        </div>
        <div class="sc-actions">
          <button class="btn-install ${isInstalled ? 'installed' : 'not-installed'}" onclick="event.stopPropagation();toggleInstall('${s.id}',this)">
            ${isInstalled ? 'Installed' : 'Install'}
          </button>
          <button class="btn-download" onclick="event.stopPropagation();downloadSkill('${s.id}')" title="Download ZIP">
            ${ICONS.download}
          </button>
        </div>
      </div>`;
    }).join('');
  } catch(e) {
    grid.innerHTML = '<div class="empty-state"><p>Failed to load. Please refresh.</p></div>';
    console.error('Load skills failed:', e);
  }
}

// ============ Search ============
function setupSearch() {
  let timer;
  document.getElementById('searchInput').addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(loadSkills, 300);
  });
}

// ============ Detail Modal ============
async function openDetail(id) {
  const overlay = document.getElementById('modalOverlay');
  const body = document.getElementById('modalBody');
  overlay.classList.add('open');
  body.innerHTML = '<div class="loading">Loading</div>';

  try {
    const res = await fetch(`${API}/api/skills/${id}`);
    const s = await res.json();
    const isInstalled = installedSkills.includes(s.id);

    const secBadge = s.securityScan && s.securityScan.status === 'passed'
      ? `<span class="sec-badge sec-verified">${ICONS.shieldCheck} Verified</span>`
      : `<span class="sec-badge sec-pending">${ICONS.shield} Unverified</span>`;

    body.innerHTML = `
      <div class="detail-header">
        <img class="detail-icon" src="${proxyIcon(s.icon)}" alt="${s.name}" onerror="this.src='${fallbackIcon(s.name, 64)}'">
        <div class="detail-info">
          <h2>${s.name} ${secBadge}</h2>
          <div class="detail-author">${s.author} <span class="detail-version">v${s.version}</span></div>
          <div class="detail-stats-row">
            <div class="detail-stat-box">
              <div class="detail-stat-num">${formatNum(s.downloads)}</div>
              <div class="detail-stat-lbl">Downloads</div>
            </div>
            <div class="detail-stat-box">
              <div class="detail-stat-num">${ICONS.star} ${s.rating}</div>
              <div class="detail-stat-lbl">Rating</div>
            </div>
            <div class="detail-stat-box">
              <div class="detail-stat-num">${ICONS.heart} ${formatNum(s.favorites || 0)}</div>
              <div class="detail-stat-lbl">Favorites</div>
            </div>
            <div class="detail-stat-box">
              <div class="detail-stat-num">${s.size}</div>
              <div class="detail-stat-lbl">Size</div>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-body">
        <div class="detail-desc">${s.description}</div>
        <div class="detail-tags">
          ${s.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>

        <div class="detail-meta-grid">
          <div class="detail-meta-item">
            <span class="detail-meta-label">Category</span>
            <span class="detail-meta-value">${s.category}</span>
          </div>
          <div class="detail-meta-item">
            <span class="detail-meta-label">Last Updated</span>
            <span class="detail-meta-value">${s.lastUpdated || 'N/A'}</span>
          </div>
          <div class="detail-meta-item">
            <span class="detail-meta-label">Compatibility</span>
            <span class="detail-meta-value">${(s.compatibility || []).join(', ')}</span>
          </div>
          <div class="detail-meta-item">
            <span class="detail-meta-label">Security Scan</span>
            <span class="detail-meta-value">${s.securityScan && s.securityScan.status === 'passed' ? 'Passed (0 threats, 0 warnings)' : 'Pending review'}</span>
          </div>
        </div>

        ${s.files && s.files.length ? `
        <div class="detail-section">
          <h3>File List</h3>
          <div class="detail-file-tree">
            ${s.files.map(f => {
              const isDir = f.includes('/');
              const icon = isDir ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>' : ICONS.file;
              return '<div class="file-tree-item">' + icon + ' <span>' + f + '</span></div>';
            }).join('')}
          </div>
        </div>
        ` : ''}

        <div class="detail-section">
          <h3>Changelog</h3>
          <p>${s.changelog}</p>
        </div>
        <div class="detail-section">
          <h3>Requirements</h3>
          <p>${s.requirements}</p>
        </div>
        ${s.relatedSkills && s.relatedSkills.length ? `
        <div class="detail-section">
          <h3>Related Skills</h3>
          <div class="related-grid">
            ${s.relatedSkills.map(r => `
              <div class="related-item" onclick="closeModal();setTimeout(()=>openDetail('${r.id}'),200)">
                <img src="${proxyIcon(r.icon)}" alt="${r.name}" onerror="this.src='${fallbackIcon(r.name, 28)}'">
                <div>
                  <div class="ri-name">${r.name}</div>
                  <div class="ri-dl">${formatNum(r.downloads)} downloads</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
      </div>
      <div class="detail-actions">
        <button class="btn-detail-install ${isInstalled ? 'installed' : 'not-installed'}" onclick="toggleInstall('${s.id}',this)" data-id="${s.id}">
          ${isInstalled ? 'Installed' : 'Install Skill'}
        </button>
        <button class="btn-detail-download" onclick="downloadSkill('${s.id}')">
          ${ICONS.download} Download ZIP
        </button>
      </div>
    `;
  } catch(e) {
    body.innerHTML = '<div class="empty-state"><p>Failed to load</p></div>';
  }
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

// ============ Install / Uninstall ============
function toggleInstall(id, btn) {
  const idx = installedSkills.indexOf(id);
  if (idx >= 0) {
    // Uninstall: just remove from localStorage
    installedSkills.splice(idx, 1);
    if (btn) {
      if (btn.classList.contains('btn-detail-install')) {
        btn.className = 'btn-detail-install not-installed';
        btn.textContent = 'Install Skill';
      } else {
        btn.className = 'btn-install not-installed';
        btn.textContent = 'Install';
      }
    }
    localStorage.setItem('installedSkills', JSON.stringify(installedSkills));
  } else {
    // Install: trigger ZIP download, then mark installed
    if (btn) {
      const isDetail = btn.classList.contains('btn-detail-install');
      btn.disabled = true;
      btn.innerHTML = isDetail
        ? `<span class="dl-progress-wrap"><span class="dl-spinner"></span> Downloading...</span>`
        : `<span class="dl-spinner"></span>`;
    }
    downloadAndInstall(id, btn);
  }
}

async function downloadAndInstall(id, btn) {
  try {
    const response = await fetch(`${API}/api/skills/${id}/download`);
    if (!response.ok) throw new Error('Download failed');

    const blob = await response.blob();
    const disposition = response.headers.get('Content-Disposition') || '';
    const match = disposition.match(/filename="?([^"]+)"?/);
    const filename = match ? match[1] : `${id}.zip`;

    // Trigger browser download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Mark as installed
    if (!installedSkills.includes(id)) {
      installedSkills.push(id);
      localStorage.setItem('installedSkills', JSON.stringify(installedSkills));
    }

    if (btn) {
      btn.disabled = false;
      if (btn.classList.contains('btn-detail-install')) {
        btn.className = 'btn-detail-install installed';
        btn.textContent = 'Installed';
      } else {
        btn.className = 'btn-install installed';
        btn.textContent = 'Installed';
      }
    }
  } catch (e) {
    console.error('Download failed:', e);
    if (btn) {
      btn.disabled = false;
      if (btn.classList.contains('btn-detail-install')) {
        btn.className = 'btn-detail-install not-installed';
        btn.textContent = 'Install Failed - Retry';
      } else {
        btn.className = 'btn-install not-installed';
        btn.textContent = 'Retry';
      }
    }
  }
}

// ============ Download ============
function downloadSkill(id) {
  downloadAndInstall(id, null);
}

// ============ Profile ============
function toggleProfile() {
  const overlay = document.getElementById('profileOverlay');
  overlay.classList.toggle('open');
  if (overlay.classList.contains('open')) {
    renderInstalled();
  }
}

async function renderInstalled() {
  const grid = document.getElementById('installedGrid');
  const countEl = document.getElementById('installedCount');
  countEl.textContent = installedSkills.length;

  if (!installedSkills.length) {
    grid.innerHTML = '<div class="installed-empty" style="grid-column:1/-1">No skills installed yet</div>';
    return;
  }

  try {
    let skills = allSkillsCache;
    if (!skills) {
      const res = await fetch(`${API}/api/skills?limit=200`);
      const data = await res.json();
      skills = data.skills;
      allSkillsCache = skills;
    }
    const map = {};
    skills.forEach(s => map[s.id] = s);

    grid.innerHTML = installedSkills.map(id => {
      const s = map[id];
      if (!s) return '';
      return `
        <div class="installed-app" onclick="toggleProfile();setTimeout(()=>openDetail('${s.id}'),200)">
          <img src="${proxyIcon(s.icon)}" alt="${s.name}" onerror="this.src='${fallbackIcon(s.name, 44)}'">
          <div class="ia-name">${s.name}</div>
        </div>
      `;
    }).join('');
  } catch(e) {
    grid.innerHTML = '<div class="installed-empty" style="grid-column:1/-1">Failed to load</div>';
  }
}

// ============ Helpers ============
function formatNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n;
}

function proxyIcon(url) {
  if (!url) return '';
  if (url.startsWith('http')) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  }
  return url;
}

function fallbackIcon(name, size) {
  size = size || 40;
  const letter = (name || '?')[0].toUpperCase();
  const colors = ['6366f1','8b5cf6','ec4899','f59e0b','22c55e','06b6d4','3b82f6'];
  const colorIdx = letter.charCodeAt(0) % colors.length;
  const bg = colors[colorIdx];
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"><rect fill="#${bg}" width="${size}" height="${size}" rx="${Math.round(size*0.2)}"/><text x="${size/2}" y="${size*0.62}" text-anchor="middle" fill="#fff" font-size="${Math.round(size*0.45)}" font-family="system-ui" font-weight="600">${letter}</text></svg>`)}`;
}

function renderStars(rating) {
  const full = Math.floor(rating);
  let html = '';
  for (let i = 0; i < full; i++) html += '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
  return html;
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    document.getElementById('profileOverlay').classList.remove('open');
  }
  // Ctrl/Cmd + K to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('searchInput').focus();
  }
});
