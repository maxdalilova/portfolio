/* ══════════════════════════════════════════════════════════
   NAV — Hamburger mobile
══════════════════════════════════════════════════════════ */
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

/* ══════════════════════════════════════════════════════════
   NAV — Lien actif au scroll
══════════════════════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 80) cur = s.id;
  });
  navAs.forEach(a => {
    a.classList.toggle('active-link', a.getAttribute('href') === '#' + cur);
  });
});

/* ══════════════════════════════════════════════════════════
   VEILLE — Onglets
══════════════════════════════════════════════════════════ */
function switchTab(btn, id) {
  document.querySelectorAll('.vtab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.vtab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(id).classList.add('active');
}

/* ══════════════════════════════════════════════════════════
   PREUVES — Chargement JSON + génération des cartes
══════════════════════════════════════════════════════════ */
const TAG_LABELS = {
  all:        'Tous',
  'Année 1':  'Année 1',
  'Année 2':  'Année 2',
  'Infrastructure': 'Infrastructure',
  'Support Technique': 'Support Technique',
  'Sécurité': 'Sécurité',
  'Web': 'Web',
  'Professionnel': 'Professionnel',
  'Gestion': 'Gestion'
};

const TAG_COLORS = {
  'Année 1':        'tag--year1',
  'Année 2':        'tag--year2',
  'Infrastructure': 'tag--infra',
  'Support Technique': 'tag--support',
  'Sécurité':       'tag--secu',
  'Web':            'tag--web',
  'Professionnel':  'tag--pro',
  'Gestion':        'tag--gestion'
};

// Mapping des tags du JSON vers les catégories
const TAG_MAPPING = {
  '1er année de stage': 'Année 1',
  '2er année de stage': 'Année 2',
  'serveur': 'Infrastructure',
  'TFT': 'Infrastructure',
  'deploiment': 'Infrastructure',
  'LAMP': 'Infrastructure',
  'réseau': 'Infrastructure',
  'iVentoy': 'Infrastructure',
  'Active Directory': 'Infrastructure',
  'support': 'Support Technique',
  'GLPI': 'Support Technique',
  'mail': 'Sécurité',
  'sécurité': 'Sécurité',
  'web': 'Web',
  'Linkedin': 'Professionnel',
  'groupe': 'Gestion',
  'La fleur': 'Web',
  'GSB': 'Infrastructure'
};

function mapTagToCategory(tag) {
  return TAG_MAPPING[tag] || tag;
}

let activeFilter = 'all';

async function loadPreuves() {
  let preuves = [];

  try {
    const res = await fetch('preuves.json');
    preuves = await res.json();
  } catch (e) {
    console.warn('Impossible de charger preuves.json :', e);
    return;
  }

  // ── Filtres ────────────────────────────────────────────
  const allTags   = ['all', ...Object.keys(TAG_LABELS).filter(k => k !== 'all')];
  const filtersEl = document.getElementById('filters');

  allTags.forEach(tag => {
    const btn = document.createElement('button');
    btn.className   = 'filter-btn' + (tag === 'all' ? ' active' : '');
    btn.textContent = TAG_LABELS[tag] || tag;
    btn.dataset.tag = tag;
    btn.addEventListener('click', () => {
      activeFilter = tag;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterCards();
    });
    filtersEl.appendChild(btn);
  });

  // ── Cartes ─────────────────────────────────────────────
  const grid = document.getElementById('preuves-grid');

  preuves.forEach(p => {
    const card = document.createElement('div');
    card.className    = 'preuve-card';
    
    // Mapper les tags du JSON vers les catégories
    const mappedTags = [...new Set(p.tags.map(mapTagToCategory))];
    card.dataset.tags = mappedTags.join(',');

    card.innerHTML = `
      <div class="preuve-icon">${p.icon}</div>
      <div class="preuve-title">${p.title}</div>
      <div class="preuve-desc">${p.desc}</div>
      <div class="preuve-tags">
        ${mappedTags.map(t =>
          `<span class="preuve-tag ${TAG_COLORS[t] || 'tag--default'}">${TAG_LABELS[t] || t}</span>`
        ).join('')}
      </div>
      <div class="preuve-open-btn">📂 Ouvrir le document →</div>
    `;

    card.addEventListener('click', () => {
      if (p.pdf && !p.pdf.includes('{')) {
        window.open(p.pdf, '_blank');
      } else {
        alert('Le chemin PDF n\'est pas encore configuré pour : ' + p.title);
      }
    });

    grid.appendChild(card);
  });

  // Observer après insertion
  observeCards();
}

function filterCards() {
  document.querySelectorAll('.preuve-card').forEach(card => {
    const match = activeFilter === 'all' || card.dataset.tags.split(',').includes(activeFilter);
    card.classList.toggle('hidden', !match);
  });
}

/* ══════════════════════════════════════════════════════════
   ANIMATIONS — Fade-in au scroll (IntersectionObserver)
══════════════════════════════════════════════════════════ */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity   = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

function observeEl(selector) {
  document.querySelectorAll(selector).forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    io.observe(el);
  });
}

function observeCards() {
  observeEl('.preuve-card');
}

/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  observeEl('.xp-card, .acad-card, .skill-zone, .veille-block, .veille-stat, .tool-card');
  loadPreuves();
});
