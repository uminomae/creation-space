import { getCurrentLang, normalizeLang } from './i18n.js';
import { dict } from './i18n/dict.js';

let overlayEl = null;
let titleEl = null;
let bodyEl = null;
let triggerBtnEl = null;
let closeBtnEl = null;

export function initAboutModal() {
  createAboutButton();
  createAboutOverlay();
}

function t(lang) {
  const l = normalizeLang(lang);
  return dict[l].about;
}

function createAboutButton() {
    const overlay = document.getElementById('overlay');
    if (!overlay) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'about-trigger';
    btn.innerHTML = '<span class="about-trigger__letter">i</span>';

  btn.style.marginTop = '0.8rem';

    btn.addEventListener('click', () => openAbout());

    overlay.appendChild(btn);
    triggerBtnEl = btn;
    setAboutLanguage(getCurrentLang());
}

function createAboutOverlay() {
  const el = document.createElement('div');
  el.id = 'about-overlay';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.tabIndex = -1;

  const glass = document.createElement('div');
  glass.className = 'about-glass';

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'about-close';
  closeBtn.textContent = '✕';

  titleEl = document.createElement('h2');
  titleEl.className = 'about-title';

  bodyEl = document.createElement('div');
  bodyEl.className = 'about-body';

  glass.appendChild(closeBtn);
  glass.appendChild(titleEl);
  glass.appendChild(bodyEl);
  el.appendChild(glass);
  document.body.appendChild(el);

  overlayEl = el;
  closeBtnEl = closeBtn;

  closeBtn.addEventListener('click', () => closeAbout());
  el.addEventListener('click', (e) => {
    if (e.target === el) closeAbout();
  });
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAbout();
  });
}

function renderContent(lang) {
  const d = t(lang);
  titleEl.textContent = d.title;
  const paragraphs = d.body;
  bodyEl.innerHTML = '';
  for (const text of paragraphs) {
    if (text.startsWith('__stages__')) {
      const span = document.createElement('span');
      span.className = 'about-stages';
      span.textContent = d.stages;
      bodyEl.appendChild(span);
    } else {
      const p = document.createElement('p');
      p.textContent = text;
      bodyEl.appendChild(p);
    }
  }
}

function openAbout() {
  if (!overlayEl) return;
  const lang = getCurrentLang();
  renderContent(lang);

  overlayEl.classList.add('visible');
  overlayEl.setAttribute('aria-label', t(lang).title);
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlayEl.classList.add('open');
    });
  });

  overlayEl.focus();
}

function closeAbout() {
  if (!overlayEl) return;
  overlayEl.classList.remove('open');

  const onEnd = () => {
    overlayEl.classList.remove('visible');
    document.body.style.overflow = '';
    overlayEl.removeEventListener('transitionend', onEnd);
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    onEnd();
  } else {
    overlayEl.addEventListener('transitionend', onEnd, { once: true });
    setTimeout(onEnd, 600);
  }
}

export function setAboutLanguage(lang) {
  const aboutStrings = t(lang);
  if (triggerBtnEl) {
    triggerBtnEl.setAttribute('aria-label', aboutStrings.triggerAria);
  }
  if (closeBtnEl) {
    closeBtnEl.setAttribute('aria-label', aboutStrings.closeAria);
  }
  if (overlayEl?.classList.contains('visible')) {
    renderContent(lang);
    overlayEl.setAttribute('aria-label', aboutStrings.title);
  }
}
