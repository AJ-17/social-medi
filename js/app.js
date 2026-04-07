// ============================================================
// APP.JS — SocialPulse Dashboard Interactivity
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ── Last Updated ── */
  const now = new Date();
  document.getElementById('lastUpdated').textContent =
    now.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  /* ── Navigation ── */
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.section');

  function showSection(name) {
    sections.forEach(s => s.classList.remove('active'));
    navItems.forEach(n => n.classList.remove('active'));
    document.getElementById('section-' + name)?.classList.add('active');
    document.querySelector(`[data-section="${name}"]`)?.classList.add('active');
    document.getElementById('pageTitle').textContent =
      name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ');
    if (name === 'followers') renderFollowerCharts();
    if (name === 'overview')  { renderEngagementChart(); renderGrowthChart(); }
  }

  navItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const section = item.dataset.section;
      showSection(section);
      // Close sidebar on mobile
      if (window.innerWidth < 768) {
        document.querySelector('.sidebar').classList.remove('open');
      }
    });
  });

  /* ── Mobile Menu ── */
  document.getElementById('menuBtn').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('open');
  });

  /* ── Theme Toggle ── */
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('change', () => {
    document.documentElement.setAttribute('data-theme', themeToggle.checked ? 'dark' : 'light');
    document.querySelector('.toggle-label').textContent = themeToggle.checked ? 'Dark Mode' : 'Light Mode';
    setTimeout(renderAllCharts, 50);
  });

  /* ── Period Selector ── */
  document.getElementById('periodSelect').addEventListener('change', () => {
    renderEngagementChart();
    renderGrowthChart();
  });

  /* ── Counter Animation ── */
  function animateCounters() {
    document.querySelectorAll('[data-target]').forEach(el => {
      const target = parseInt(el.dataset.target);
      if (!target) return;
      let start = 0;
      const duration = 1400;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 3);
        const val      = Math.floor(ease * target);
        el.textContent = val >= 1000000
          ? (val / 1000000).toFixed(1) + 'M'
          : val.toLocaleString('en-IN');
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target >= 1000000
          ? (target / 1000000).toFixed(1) + 'M'
          : target.toLocaleString('en-IN');
      };
      requestAnimationFrame(step);
    });
  }

  /* ── Progress Bars ── */
  function animateBars() {
    setTimeout(() => {
      document.querySelectorAll('.bar-fill').forEach(bar => {
        const target = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => { bar.style.width = target; }, 50);
      });
    }, 100);
  }

  /* ── Top Locations ── */
  function renderLocations() {
    const list = document.getElementById('locationList');
    if (!list) return;
    list.innerHTML = LOCATIONS.map(l => `
      <li>
        <span class="loc-name">${l.name}</span>
        <div class="loc-bar-wrap">
          <div class="loc-bar" style="width: ${l.pct}%"></div>
        </div>
        <span class="loc-pct">${l.pct}%</span>
      </li>
    `).join('');
  }

  /* ── Scheduled Posts ── */
  function renderPosts() {
    const grid = document.getElementById('postsGrid');
    if (!grid) return;
    if (SCHEDULED_POSTS.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text2);padding:40px;font-size:14px;">No scheduled posts yet. Click <strong>+ New Post</strong> to get started.</div>`;
      return;
    }
    grid.innerHTML = SCHEDULED_POSTS.map(p => {
      const tagClass = 'tag-' + p.platform.toLowerCase().replace(' / ', '').replace('twitter', 'twitter').replace('x ','').toLowerCase();
      const cleanPlatform = p.platform.toLowerCase().replace(/[^a-z]/g, '');
      const dt = new Date(p.datetime);
      const formatted = dt.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
      return `
        <div class="post-card">
          <div class="post-card-header">
            <span class="post-platform-tag tag-${cleanPlatform}">${p.platform}</span>
            <span class="post-status">⏰ ${p.status}</span>
          </div>
          <p class="post-caption">${p.caption}</p>
          <div class="post-datetime">
            <i class="fa-regular fa-clock"></i> ${formatted}
            <button class="post-delete" data-id="${p.id}" title="Delete"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      `;
    }).join('');

    // Delete handlers
    grid.querySelectorAll('.post-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        SCHEDULED_POSTS = SCHEDULED_POSTS.filter(p => p.id !== id);
        renderPosts();
      });
    });
  }

  /* ── Modal ── */
  const modal       = document.getElementById('postModal');
  const newPostBtn  = document.getElementById('newPostBtn');
  const cancelModal = document.getElementById('cancelModal');
  const savePost    = document.getElementById('savePost');

  newPostBtn?.addEventListener('click', () => modal.classList.add('open'));
  cancelModal?.addEventListener('click', () => modal.classList.remove('open'));
  modal?.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });

  savePost?.addEventListener('click', () => {
    const platform = document.getElementById('postPlatform').value;
    const caption  = document.getElementById('postCaption').value.trim();
    const datetime = document.getElementById('postDate').value;

    if (!caption) { alert('Please write a caption.'); return; }
    if (!datetime) { alert('Please select a date and time.'); return; }

    SCHEDULED_POSTS.unshift({
      id: Date.now(),
      platform,
      caption,
      datetime,
      status: 'Scheduled'
    });
    modal.classList.remove('open');
    document.getElementById('postCaption').value = '';
    document.getElementById('postDate').value    = '';
    renderPosts();
  });

  /* ── Top Content ── */
  const platformIconColors = {
    instagram: { icon: 'fa-brands fa-instagram', color: '#e1306c' },
    twitter:   { icon: 'fa-brands fa-x-twitter', color: '#1da1f2' },
    youtube:   { icon: 'fa-brands fa-youtube',   color: '#ff0000' },
    linkedin:  { icon: 'fa-brands fa-linkedin-in', color: '#0a66c2' },
  };

  function renderTopContent(filter = 'all') {
    const grid = document.getElementById('topContentGrid');
    if (!grid) return;
    const filtered = filter === 'all' ? TOP_CONTENT : TOP_CONTENT.filter(c => c.platform === filter);
    grid.innerHTML = filtered.map(c => {
      const p = platformIconColors[c.platform];
      return `
        <div class="content-card">
          <div class="content-card-header">
            <span class="content-platform" style="color:${p.color}">
              <i class="${p.icon}"></i> ${c.platform.charAt(0).toUpperCase() + c.platform.slice(1)}
            </span>
            <span class="content-rank">${c.rank}</span>
          </div>
          <div class="content-title">${c.title}</div>
          <div class="content-meta">${c.meta}</div>
          <div class="content-stats">
            <div class="cs-item"><i class="fa-solid fa-heart"></i> ${c.likes}</div>
            <div class="cs-item"><i class="fa-solid fa-comment"></i> ${c.comments}</div>
            <div class="cs-item"><i class="fa-solid fa-share-nodes"></i> ${c.shares}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  /* ── Filter Buttons ── */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTopContent(btn.dataset.filter);
    });
  });

  /* ── Export Button ── */
  document.querySelector('.btn-export')?.addEventListener('click', () => {
    const data = {
      exported: new Date().toISOString(),
      stats: { instagram: 84200, twitter: 41500, youtube: 126000, linkedin: 19800 },
      scheduledPosts: SCHEDULED_POSTS.length,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = 'socialpulse-report.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  /* ── INIT ── */
  animateCounters();
  animateBars();
  renderLocations();
  renderPosts();
  renderTopContent();
  renderAllCharts();

});
