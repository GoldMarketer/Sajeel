/**
 * ============================================================
 *  PROJECT PAGE RENDERER
 *  Reads from projects-data.js and builds the page dynamically.
 *  No edits needed here — just update projects-data.js to add projects.
 * ============================================================
 */

// --- Cursor setup ---
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;
  let mouseX = 0, mouseY = 0, fx = 0, fy = 0;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });
  (function animate() {
    fx += (mouseX - fx) * 0.12;
    fy += (mouseY - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animate);
  })();
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor--hover');
      follower.classList.add('follower--hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor--hover');
      follower.classList.remove('follower--hover');
    });
  });
}

// --- Nav scroll ---
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 60);
  });
}

// --- Intersection observer ---
function initObserver() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.project-full').forEach(el => obs.observe(el));
}

// --- Carousel ---
function initCarousels() {
  document.querySelectorAll('.media-carousel').forEach(car => {
    const track = car.querySelector('.carousel-track');
    const slides = car.querySelectorAll('.carousel-slide');
    const dots = car.querySelectorAll('.carousel-dot');
    const prev = car.querySelector('.carousel-prev');
    const next = car.querySelector('.carousel-next');
    let current = 0;

    function goTo(idx) {
      current = (idx + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    if (prev) prev.addEventListener('click', () => goTo(current - 1));
    if (next) next.addEventListener('click', () => goTo(current + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
  });
}

// --- Media renderers ---
function renderImage(item) {
  return `
    <div class="media-image">
      <img src="${item.src}" alt="${item.caption || ''}" loading="lazy"
           onerror="this.closest('.media-image').innerHTML='<div class=\\'media-placeholder\\'><div class=\\'placeholder-icon\\'>🖼</div><div class=\\'placeholder-text\\'>Image: ${item.caption || ''}</div></div>'">
      ${item.caption ? `<div class="media-caption">${item.caption}</div>` : ''}
    </div>`;
}

function renderVideo(item) {
  return `
    <div class="media-video">
      <video controls preload="metadata"
             onerror="this.closest('.media-video').innerHTML='<div class=\\'media-placeholder\\'><div class=\\'placeholder-icon\\'>▶</div><div class=\\'placeholder-text\\'>Video: ${item.caption || ''}</div></div>'">
        <source src="${item.src}">
      </video>
      ${item.caption ? `<div class="media-caption">${item.caption}</div>` : ''}
    </div>`;
}

function renderYoutube(item) {
  // Accept full URL or embed URL
  let embedSrc = item.src;
  const match = item.src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
  if (match) embedSrc = `https://www.youtube.com/embed/${match[1]}`;
  return `
    <div class="media-youtube">
      <div class="youtube-wrapper">
        <iframe src="${embedSrc}" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
      </div>
      ${item.caption ? `<div class="media-caption">${item.caption}</div>` : ''}
    </div>`;
}

function renderAudio(item) {
  return `
    <div class="media-audio">
      <div class="audio-label">Audio</div>
      <audio controls>
        <source src="${item.src}">
        Your browser does not support the audio element.
      </audio>
      ${item.caption ? `<div class="media-caption" style="margin-top:0.8rem;">${item.caption}</div>` : ''}
    </div>`;
}

function renderCarousel(item) {
  const carId = 'car-' + Math.random().toString(36).slice(2, 7);
  const slides = item.items.map(s =>
    `<div class="carousel-slide">
      <img src="${s.src}" alt="${s.caption || ''}" loading="lazy"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
           >
      <div class="media-placeholder" style="display:none;min-height:300px;">
        <div class="placeholder-icon">🖼</div>
        <div class="placeholder-text">${s.caption || 'Image'}</div>
      </div>
      ${s.caption ? `<div class="media-caption">${s.caption}</div>` : ''}
    </div>`
  ).join('');
  const dots = item.items.map((_, i) =>
    `<button class="carousel-dot${i === 0 ? ' active' : ''}" aria-label="Slide ${i+1}"></button>`
  ).join('');
  return `
    <div class="media-carousel" id="${carId}">
      <div class="carousel-track-wrap">
        <div class="carousel-track">${slides}</div>
      </div>
      <div class="carousel-controls">
        <button class="carousel-btn carousel-prev" aria-label="Previous">&#8592;</button>
        <div>
          ${item.caption ? `<div class="carousel-caption">${item.caption}</div>` : ''}
          <div class="carousel-dots">${dots}</div>
        </div>
        <button class="carousel-btn carousel-next" aria-label="Next">&#8594;</button>
      </div>
    </div>`;
}

function renderEmbed(item) {
  return `
    <div class="media-embed">
      <iframe src="${item.src}" allowfullscreen loading="lazy"></iframe>
      ${item.caption ? `<div class="media-caption">${item.caption}</div>` : ''}
    </div>`;
}

function renderMediaItem(item) {
  switch (item.type) {
    case 'image':    return renderImage(item);
    case 'video':    return renderVideo(item);
    case 'youtube':  return renderYoutube(item);
    case 'audio':    return renderAudio(item);
    case 'carousel': return renderCarousel(item);
    case 'embed':    return renderEmbed(item);
    default:
      return `<div class="media-placeholder"><div class="placeholder-icon">📎</div><div class="placeholder-text">${item.type}</div></div>`;
  }
}

// --- Project card builder ---
function buildProjectCard(project, index) {
  const resultsHTML = project.results ? `
    <div>
      <div class="project-section-label">Results</div>
      <div class="results-grid">
        ${project.results.map(r => `
          <div class="result-cell">
            <div class="result-value">${r.value}</div>
            <div class="result-label">${r.label}</div>
          </div>
        `).join('')}
      </div>
    </div>` : '';

  const mediaHTML = (project.media || []).map(renderMediaItem).join('');

  return `
    <article class="project-full" id="${project.id}">
      <div class="project-info">
        <div class="project-header">
          <div class="project-meta">
            <span class="project-year">${project.year || ''}</span>
            ${project.client ? `<span class="project-client">/ ${project.client}</span>` : ''}
          </div>
          <h2 class="project-title">${project.title}</h2>
          <div class="project-tags">
            ${(project.tags || []).map(t => `<span class="project-tag">${t}</span>`).join('')}
          </div>
        </div>

        <blockquote class="project-summary">${project.summary}</blockquote>

        ${project.challenge ? `
          <div>
            <div class="project-section-label">The Challenge</div>
            <p class="project-section-text">${project.challenge}</p>
          </div>` : ''}

        ${project.approach ? `
          <div>
            <div class="project-section-label">The Approach</div>
            <p class="project-section-text">${project.approach}</p>
          </div>` : ''}

        ${resultsHTML}
      </div>

      <div class="project-media-col">
        ${mediaHTML || `<div class="media-placeholder" style="min-height:300px">
          <div class="placeholder-icon">📁</div>
          <div class="placeholder-text">Add media in projects-data.js</div>
        </div>`}
      </div>
    </article>`;
}

// --- Page builder ---
function buildPage(categoryKey) {
  const data = PROJECTS[categoryKey];
  if (!data) { document.body.innerHTML = '<p>Category not found.</p>'; return; }

  document.title = `${data.pageTitle} — Sajeel Iqbal`;

  // Hero text (first word of title for bg)
  const bgWord = data.pageTitle.split(' ')[0].toUpperCase();

  document.getElementById('cat-bg-text').textContent = bgWord;
  document.getElementById('cat-title').textContent = data.pageTitle;
  document.getElementById('cat-subtitle').textContent = data.pageSubtitle;
  document.getElementById('project-count').innerHTML =
    `<strong>${data.projects.length}</strong> project${data.projects.length !== 1 ? 's' : ''}`;

  // Collect all unique tags
  const allTags = [...new Set(data.projects.flatMap(p => p.tags || []))];
  const filterBar = document.getElementById('filter-tags');
  filterBar.innerHTML = allTags.map(t => `<span class="filter-tag">${t}</span>`).join('');

  // Build projects
  const list = document.getElementById('projects-list');
  list.innerHTML = data.projects.map((p, i) => buildProjectCard(p, i)).join('');

  initObserver();
  initCarousels();
  initCursor();
  initNav();
}
