/**
 * Phase 9 Deep Exploration Tracks — card rendering and data loading.
 *
 * Displays deep exploration tracks that investigate Phase 8 structural
 * themes as independent clickable cards in the REPORTS section.
 */

import { normalizeLang } from '../i18n.js';
import { dict } from '../i18n/dict.js';
import {
    PHASE9_TRACKS_MANIFEST_URL,
} from './data.js';

const PJDHIRO_RAW_BASE = 'https://raw.githubusercontent.com/uminomae/pjdhiro/main';
const CREATION_PATH = '/assets/creation';
const PJDHIRO_CREATION_RAW = `${PJDHIRO_RAW_BASE}${CREATION_PATH}`;

function getPhase9Strings(lang = 'ja') {
    const l = normalizeLang(lang);
    return dict[l]?.reports?.phase9Tracks || dict.ja.reports.phase9Tracks;
}

function normalizeTrack(raw) {
    return {
        id: typeof raw?.id === 'string' ? raw.id.trim() : '',
        key: typeof raw?.key === 'string' ? raw.key.trim() : '',
        nameJa: typeof raw?.name_ja === 'string' ? raw.name_ja.trim() : '',
        nameEn: typeof raw?.name_en === 'string' ? raw.name_en.trim() : '',
        subtitleJa: typeof raw?.subtitle_ja === 'string' ? raw.subtitle_ja.trim() : '',
        subtitleEn: typeof raw?.subtitle_en === 'string' ? raw.subtitle_en.trim() : '',
        status: typeof raw?.status === 'string' ? raw.status.trim() : 'planned',
        currentTargetJa: typeof raw?.current_target_ja === 'string' ? raw.current_target_ja.trim() : '',
        currentTargetEn: typeof raw?.current_target_en === 'string' ? raw.current_target_en.trim() : '',
        loopCurrent: typeof raw?.loop_current === 'number' ? raw.loop_current : 0,
        loopMax: typeof raw?.loop_max === 'number' ? raw.loop_max : 0,
        judgments: {
            supported: typeof raw?.judgments?.supported === 'number' ? raw.judgments.supported : 0,
            partial: typeof raw?.judgments?.partial === 'number' ? raw.judgments.partial : 0,
            contradicted: typeof raw?.judgments?.contradicted === 'number' ? raw.judgments.contradicted : 0,
            novel: typeof raw?.judgments?.novel === 'number' ? raw.judgments.novel : 0,
        },
        robustnessScore: typeof raw?.robustness_score === 'number' ? raw.robustness_score : null,
        predictionAccuracy: typeof raw?.prediction_accuracy === 'number' ? raw.prediction_accuracy : null,
        planMd: typeof raw?.plan_md === 'object' && raw.plan_md !== null ? raw.plan_md : null,
        interimMd: typeof raw?.interim_md === 'object' && raw.interim_md !== null ? raw.interim_md : null,
        finalMd: typeof raw?.final_md === 'object' && raw.final_md !== null ? raw.final_md : null,
        presentationMd: typeof raw?.presentation_md === 'object' && raw.presentation_md !== null ? raw.presentation_md : null,
        githubIssue: typeof raw?.github_issue === 'number' ? raw.github_issue : null,
    };
}

function resolveTrackPlanMdUrl(track, lang = 'ja') {
    if (!track.planMd) return '';
    const normalizedLang = normalizeLang(lang);
    const relPath = track.planMd[normalizedLang] || track.planMd['ja'];
    if (!relPath) return '';
    return `${PJDHIRO_CREATION_RAW}/${relPath}`;
}

function resolveTrackInterimMdUrl(track, lang = 'ja') {
    if (!track.interimMd) return '';
    const normalizedLang = normalizeLang(lang);
    const relPath = track.interimMd[normalizedLang] || track.interimMd['ja'];
    if (!relPath) return '';
    return `${PJDHIRO_CREATION_RAW}/${relPath}`;
}

function resolveTrackFinalMdUrl(track, lang = 'ja') {
    if (!track.finalMd) return '';
    const normalizedLang = normalizeLang(lang);
    const relPath = track.finalMd[normalizedLang] || track.finalMd['ja'];
    if (!relPath) return '';
    return `${PJDHIRO_CREATION_RAW}/${relPath}`;
}

function resolveTrackPresentationMdUrl(track, lang = 'ja') {
    if (!track.presentationMd) return '';
    const normalizedLang = normalizeLang(lang);
    const relPath = track.presentationMd[normalizedLang] || track.presentationMd['ja'];
    if (!relPath) return '';
    return `${PJDHIRO_CREATION_RAW}/${relPath}`;
}

function getTrackDisplayName(track, lang = 'ja') {
    const useJa = normalizeLang(lang) === 'ja';
    return useJa
        ? (track.nameJa || track.nameEn || track.key)
        : (track.nameEn || track.nameJa || track.key);
}

function getTrackSubtitle(track, lang = 'ja') {
    const useJa = normalizeLang(lang) === 'ja';
    return useJa
        ? (track.subtitleJa || track.subtitleEn || '')
        : (track.subtitleEn || track.subtitleJa || '');
}

function getTrackCurrentTarget(track, lang = 'ja') {
    const useJa = normalizeLang(lang) === 'ja';
    return useJa
        ? (track.currentTargetJa || track.currentTargetEn || '')
        : (track.currentTargetEn || track.currentTargetJa || '');
}

function getStatusBadgeClass(status) {
    switch (status) {
        case 'investigating': return 'phase9-badge phase9-badge-investigating';
        case 'completed': return 'phase9-badge phase9-badge-completed';
        default: return 'phase9-badge phase9-badge-planned';
    }
}

function getStatusLabel(status, strings) {
    switch (status) {
        case 'investigating': return strings.statusInvestigating;
        case 'completed': return strings.statusCompleted;
        default: return strings.statusPlanned;
    }
}

export async function loadPhase9Tracks(url = PHASE9_TRACKS_MANIFEST_URL) {
    try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        const rawTracks = Array.isArray(payload?.tracks) ? payload.tracks : [];
        return {
            generatedAt: typeof payload?.generated_at === 'string' ? payload.generated_at : '',
            tracks: rawTracks.map(normalizeTrack).filter((t) => t.id && t.key),
            overviewPlanMd: typeof payload?.overview_plan_md === 'object' && payload.overview_plan_md !== null
                ? payload.overview_plan_md
                : null,
        };
    } catch (error) {
        console.warn('[phase9] manifest load failed:', error);
        return { generatedAt: '', tracks: [], overviewPlanMd: null };
    }
}

/**
 * Create the Phase 9 deep exploration tracks renderer.
 *
 * @param {object} opts
 * @param {Function} opts.openMarkdownModal - from the modal controller
 * @param {Function} opts.getLang - returns current language
 */
export function createPhase9Renderer({ openMarkdownModal, getLang }) {
    let containerEl = null;
    let headingEl = null;
    let descriptionEl = null;

    function cacheDom() {
        containerEl = document.getElementById('reports-phase9-grid');
        headingEl = document.getElementById('reports-phase9-heading');
        descriptionEl = document.getElementById('reports-phase9-description');
    }

    function renderOverviewCard(overviewPlanMd, strings, lang, fragment) {
        if (!overviewPlanMd) return;

        const col = document.createElement('div');
        col.className = 'col';

        const card = document.createElement('article');
        card.className = 'card kesson-card h-100 reports-phase9-card phase9-overview-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', strings.overviewTitle);

        const body = document.createElement('div');
        body.className = 'card-body p-2 p-md-3 d-flex flex-column gap-1';

        const titleNode = document.createElement('h4');
        titleNode.className = 'h6 mb-0 text-light';
        titleNode.textContent = strings.overviewTitle;

        const descNode = document.createElement('p');
        descNode.className = 'small mb-0 reports-feature-description';
        descNode.textContent = strings.overviewDescription;

        body.appendChild(titleNode);
        body.appendChild(descNode);

        const openCard = () => {
            const normalizedLang = normalizeLang(lang);
            const relPath = overviewPlanMd[normalizedLang] || overviewPlanMd['ja'];
            if (!relPath) return;
            const mdUrl = `${PJDHIRO_CREATION_RAW}/${relPath}`;
            openMarkdownModal({
                title: strings.overviewTitle,
                sources: [{ mdUrl }],
            });
        };

        card.addEventListener('click', openCard);
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openCard();
            }
        });

        card.appendChild(body);
        col.appendChild(card);
        fragment.appendChild(col);
    }

    function renderTracks(tracks = [], overviewPlanMd = null) {
        if (!containerEl) return;

        const lang = getLang();
        const strings = getPhase9Strings(lang);

        if (headingEl) headingEl.textContent = strings.heading;
        if (descriptionEl) descriptionEl.textContent = strings.description;

        containerEl.innerHTML = '';

        if (!tracks.length && !overviewPlanMd) {
            const empty = document.createElement('div');
            empty.className = 'col-12 text-body-secondary';
            empty.textContent = strings.empty;
            containerEl.appendChild(empty);
            return;
        }

        const fragment = document.createDocumentFragment();

        // Overview card first
        renderOverviewCard(overviewPlanMd, strings, lang, fragment);

        // Track cards
        tracks.forEach((track) => {
            const col = document.createElement('div');
            col.className = 'col';

            const card = document.createElement('article');
            card.className = 'card kesson-card h-100 reports-phase9-card';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');

            const name = getTrackDisplayName(track, lang);
            card.setAttribute('aria-label', name);

            const body = document.createElement('div');
            body.className = 'card-body p-2 p-md-3 d-flex flex-column gap-1';

            // Status badge + Track ID row
            const headerRow = document.createElement('div');
            headerRow.className = 'd-flex align-items-center gap-2 mb-1';

            const badge = document.createElement('span');
            badge.className = getStatusBadgeClass(track.status);
            badge.textContent = getStatusLabel(track.status, strings);

            const trackIdNode = document.createElement('span');
            trackIdNode.className = 'phase9-track-id';
            trackIdNode.textContent = track.id;

            headerRow.appendChild(badge);
            headerRow.appendChild(trackIdNode);

            // Track name
            const titleNode = document.createElement('h4');
            titleNode.className = 'h6 mb-0 text-light';
            titleNode.textContent = name;

            // Subtitle
            const subtitle = getTrackSubtitle(track, lang);
            const subtitleNode = document.createElement('p');
            subtitleNode.className = 'phase9-subtitle mb-0';
            subtitleNode.textContent = subtitle;

            body.appendChild(headerRow);
            body.appendChild(titleNode);
            if (subtitle) body.appendChild(subtitleNode);

            // Current target
            const currentTarget = getTrackCurrentTarget(track, lang);
            if (currentTarget) {
                const targetNode = document.createElement('p');
                targetNode.className = 'phase9-meta mb-0';
                targetNode.textContent = `${strings.currentTarget}: ${currentTarget}`;
                body.appendChild(targetNode);
            }

            // Loop progress
            if (track.loopMax > 0) {
                const loopNode = document.createElement('p');
                loopNode.className = 'phase9-meta mb-0';
                loopNode.textContent = `${strings.loopProgress}: ${track.loopCurrent}/${track.loopMax}`;
                body.appendChild(loopNode);
            }

            // Judgments
            const j = track.judgments;
            const hasJudgments = j.supported > 0 || j.partial > 0 || j.contradicted > 0 || j.novel > 0;
            if (hasJudgments) {
                const judgNode = document.createElement('div');
                judgNode.className = 'phase9-judgments';
                const parts = [];
                if (j.supported > 0) parts.push('\u2705' + j.supported);
                if (j.partial > 0) parts.push('\u26A0\uFE0F' + j.partial);
                if (j.contradicted > 0) parts.push('\u274C' + j.contradicted);
                if (j.novel > 0) parts.push('\uD83C\uDD95' + j.novel);
                judgNode.textContent = strings.judgmentsLabel + ': ' + parts.join(' ');
                body.appendChild(judgNode);
            }

            // Action buttons row
            const btnRow = document.createElement('div');
            btnRow.className = 'd-flex flex-wrap gap-1 mt-1';

            const addButton = (label, resolveUrl) => {
                const url = resolveUrl(track, lang);
                if (!url) return;
                const btn = document.createElement('button');
                btn.className = 'btn btn-sm btn-outline-light';
                btn.textContent = label;
                btn.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const currentLang = getLang();
                    const currentUrl = resolveUrl(track, currentLang);
                    if (!currentUrl) return;
                    const currentName = getTrackDisplayName(track, currentLang);
                    openMarkdownModal({
                        title: currentName,
                        sources: [{ mdUrl: currentUrl }],
                    });
                });
                btnRow.appendChild(btn);
            };

            addButton(strings.btnPlan, resolveTrackPlanMdUrl);
            addButton(strings.btnInterim, resolveTrackInterimMdUrl);
            addButton(strings.btnFinal, resolveTrackFinalMdUrl);
            addButton(strings.btnSlides, resolveTrackPresentationMdUrl);

            if (btnRow.children.length > 0) {
                body.appendChild(btnRow);
            }

            // Card click opens plan MD by default
            const openCard = () => {
                const planUrl = resolveTrackPlanMdUrl(track, lang);
                const interimUrl = resolveTrackInterimMdUrl(track, lang);
                const finalUrl = resolveTrackFinalMdUrl(track, lang);
                const mdUrl = finalUrl || interimUrl || planUrl;
                if (!mdUrl) return;
                openMarkdownModal({
                    title: name,
                    sources: [{ mdUrl }],
                });
            };

            card.addEventListener('click', openCard);
            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openCard();
                }
            });

            card.appendChild(body);
            col.appendChild(card);
            fragment.appendChild(col);
        });

        containerEl.appendChild(fragment);
    }

    return { cacheDom, renderTracks };
}
