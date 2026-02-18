// scroll-coordinator.js
// IMPORTANT: window.scrollTo must be owned by this module only.
// Other modules must request scrolling through requestScroll().

export const SCROLL_RESTORATION_ONCE_KEY = 'kesson.scroll-restoration-once.v1';
export const SCROLL_PRIORITY = Object.freeze({
  DEEP_LINK: 100,
  RETURN_RESTORE: 50,
  INITIAL_TOP: 10,
  BFCACHE: 5,
  DEFAULT: 1,
});
const PAGE_EXIT_ARM_SOURCE = 'page-exit';

let lockDepth = 0;
let activeRequestId = 0;
let pendingRequest = null;
let isFlushing = false;
let lifecycleInitialized = false;
let initPhase = false;

function normalizeY(targetY) {
  if (!Number.isFinite(targetY)) return 0;
  return Math.max(0, Math.round(targetY));
}

function normalizeBehavior(behavior) {
  return behavior === 'smooth' ? 'smooth' : 'auto';
}

function toPromise(waitFor) {
  if (!waitFor) return Promise.resolve();
  return Promise.resolve(waitFor).catch(() => {});
}

function hasWindow() {
  return typeof window !== 'undefined';
}

function canControlHistoryRestoration() {
  return hasWindow() && typeof history !== 'undefined' && 'scrollRestoration' in history;
}

function readAndConsumeManualArm() {
  if (!hasWindow()) return false;
  try {
    const armedPayload = window.sessionStorage.getItem(SCROLL_RESTORATION_ONCE_KEY);
    const shouldUseManual = Boolean(armedPayload);
    if (shouldUseManual) {
      window.sessionStorage.removeItem(SCROLL_RESTORATION_ONCE_KEY);
    }
    return shouldUseManual;
  } catch (error) {
    return false;
  }
}

function setScrollRestorationMode(mode) {
  if (!canControlHistoryRestoration()) return;
  history.scrollRestoration = mode === 'manual' ? 'manual' : 'auto';
}

function resetRestorationToAutoOnNextPageShow() {
  if (!hasWindow() || !canControlHistoryRestoration()) return;
  window.addEventListener('pageshow', () => {
    setScrollRestorationMode('auto');
  }, { once: true });
}

function waitForTwoAnimationFrames() {
  if (!hasWindow() || typeof window.requestAnimationFrame !== 'function') {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(resolve);
    });
  });
}

function requestTop(source = 'unknown', priority = SCROLL_PRIORITY.INITIAL_TOP) {
  requestScroll(0, source, {
    behavior: 'auto',
    waitFor: waitForTwoAnimationFrames(),
    priority,
  });
}

function flushPendingRequest() {
  if (isFlushing || lockDepth > 0 || !pendingRequest) return;
  isFlushing = true;

  const req = pendingRequest;
  req.waitFor.then(() => {
    if (!pendingRequest || pendingRequest.id !== req.id || lockDepth > 0) return;
    pendingRequest = null;
    window.scrollTo({ top: req.targetY, behavior: req.behavior });
  }).finally(() => {
    isFlushing = false;
    if (pendingRequest && lockDepth === 0) {
      flushPendingRequest();
    }
  });
}

export function requestScroll(targetY, source = 'unknown', options = {}) {
  const priority = Number.isFinite(options.priority) ? options.priority : SCROLL_PRIORITY.DEFAULT;

  if (initPhase && pendingRequest && pendingRequest.priority >= priority) {
    return;
  }

  activeRequestId += 1;
  pendingRequest = {
    id: activeRequestId,
    targetY: normalizeY(targetY),
    source,
    behavior: normalizeBehavior(options.behavior),
    waitFor: toPromise(options.waitFor),
    priority,
  };

  if (!initPhase) {
    flushPendingRequest();
  }
}

export function commitNavigationIntent(source = 'unknown') {
  if (!initPhase) return;
  initPhase = false;
  console.log('[scroll] commitNavigationIntent:', source,
    pendingRequest ? `winner=${pendingRequest.source}(p=${pendingRequest.priority})` : 'no-pending');
  flushPendingRequest();
}

export function lockScroll(source = 'unknown') {
  lockDepth += 1;
  return source;
}

export function unlockScroll(source = 'unknown') {
  if (lockDepth > 0) {
    lockDepth -= 1;
  }
  if (lockDepth === 0) {
    flushPendingRequest();
  }
  return source;
}

export function armManualRestoration(source = 'unknown') {
  if (!hasWindow()) return;
  try {
    window.sessionStorage.setItem(SCROLL_RESTORATION_ONCE_KEY, JSON.stringify({
      armedAt: Date.now(),
      source,
    }));
  } catch (error) {
    // Ignore sessionStorage failures in restrictive environments.
  }
}

export function applyInitialScrollRestoration() {
  if (!canControlHistoryRestoration()) return false;

  const shouldUseManual = readAndConsumeManualArm();
  setScrollRestorationMode(shouldUseManual ? 'manual' : 'auto');
  if (shouldUseManual) {
    resetRestorationToAutoOnNextPageShow();
  }
  return shouldUseManual;
}

export function initScrollCoordinator({ forceTopOnLoad = true } = {}) {
  if (lifecycleInitialized || !hasWindow()) return;
  lifecycleInitialized = true;
  initPhase = true;

  applyInitialScrollRestoration();

  const armForNextLoad = () => {
    armManualRestoration(PAGE_EXIT_ARM_SOURCE);
  };

  window.addEventListener('pagehide', armForNextLoad, { capture: true });
  window.addEventListener('beforeunload', armForNextLoad, { capture: true });

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      console.log('[scroll] bfcache pageshow - no forced scroll');
    }
  });

  if (forceTopOnLoad) {
    requestTop('initial-load', SCROLL_PRIORITY.INITIAL_TOP);
  }

  const autoCommit = () => {
    waitForTwoAnimationFrames().then(() => {
      commitNavigationIntent('auto-commit');
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoCommit, { once: true });
  } else {
    autoCommit();
  }
}
