/**
 * Theme Verification Reports — Phase 9 verification results for 5 structural themes.
 *
 * Displays verification report cards with robustness scores, confidence labels,
 * domain counts, and links to individual theme reports and integration report.
 */

import { normalizeLang } from '../i18n.js';
import { dict } from '../i18n/dict.js';

/**
 * Static theme verification data extracted from the published reports.
 * These reports live in pjdhiro/assets/creation/phase8-themes/ja/verification/.
 */
export const THEME_VERIFICATION_BASE = 'https://raw.githubusercontent.com/uminomae/pjdhiro/main/assets/creation/phase8-themes/ja/verification';

export const THEME_DATA = [
    {
        id: 'T7+T9',
        nameJa: '盲点と反例',
        nameEn: 'Blind Spots & Counterexamples',
        descriptionJa: '秩序解体・5段階が記述できないものの体系的整理。限界を認めるテーマが最も堅牢。',
        descriptionEn: 'Systematic cataloguing of what the five-stage model cannot describe. The theme that acknowledges limits is the most robust.',
        robustness: 8,
        robustnessMax: 10,
        confidence: 'confirmed',
        domainCount: 24,
        hitRate: 90,
        formalization: 'Category theory',
        mdFile: 'theme-T7T9-blind-spots-ja.md',
    },
    {
        id: 'T5',
        nameJa: '再循環メカニズム',
        nameEn: 'Recirculation Mechanism',
        descriptionJa: '束から場への還流構造。束は終点ではなく次のサイクルの場の種。',
        descriptionEn: 'Feedback loop from bundle to field. The bundle is not an endpoint but the seed of the next cycle.',
        robustness: 6,
        robustnessMax: 10,
        confidence: 'strong',
        domainCount: 19,
        hitRate: 100,
        formalization: 'Dynamical systems',
        mdFile: 'theme-T5-recirculation-ja.md',
    },
    {
        id: 'T6',
        nameJa: '場の多層性',
        nameEn: 'Multi-layered Field',
        descriptionJa: '原初的場・循環的場・存在論的場の区別。場は空虚ではなく条件付き潜在性。',
        descriptionEn: 'Distinguishing primordial, cyclical, and ontological fields. The field is not emptiness but conditioned potentiality.',
        robustness: 6,
        robustnessMax: 10,
        confidence: 'strong',
        domainCount: 18,
        hitRate: 100,
        formalization: 'Topological spaces',
        mdFile: 'theme-T6-field-layers-ja.md',
    },
    {
        id: 'T1',
        nameJa: '縁の類型学',
        nameEn: 'Edge Typology',
        descriptionJa: '28/30領域が「縁」を独立に記述。統一分類枠組みの提案。',
        descriptionEn: '28 of 30 domains independently describe "edges." A unified classification framework.',
        robustness: 5,
        robustnessMax: 10,
        confidence: 'strong',
        domainCount: 26,
        hitRate: 96,
        formalization: 'Graph theory',
        mdFile: 'theme-T1-edge-typology-ja.md',
    },
    {
        id: 'T2',
        nameJa: '閾値構造',
        nameEn: 'Threshold Structure',
        descriptionJa: '縁から渦への遷移は閾値的。自然科学での支持は堅いが横断性で最低評価。',
        descriptionEn: 'The edge-to-vortex transition is threshold-based. Strong support in natural sciences but lowest cross-domain rating.',
        robustness: 4,
        robustnessMax: 10,
        confidence: 'hypothesis',
        domainCount: 11,
        hitRate: null,
        formalization: 'Bifurcation theory',
        mdFile: 'theme-T2-threshold-ja.md',
    },
];

export const INTEGRATION_REPORT = {
    nameJa: '5テーマ統合レポート',
    nameEn: 'Five-Theme Integration Report',
    descriptionJa: '5テーマ比較・テーマ間の構造的関係・モデル全体の堅牢性評価。',
    descriptionEn: 'Five-theme comparison, structural relationships, and overall model robustness assessment.',
    mdFile: 'theme-integration-ja.md',
};

function getVerificationStrings(lang = 'ja') {
    const l = normalizeLang(lang);
    return dict[l]?.reports?.themeVerification || dict.ja.reports.themeVerification;
}

function getThemeName(theme, lang) {
    const useJa = normalizeLang(lang) === 'ja';
    return useJa ? theme.nameJa : (theme.nameEn || theme.nameJa);
}

function getThemeDescription(theme, lang) {
    const useJa = normalizeLang(lang) === 'ja';
    return useJa ? theme.descriptionJa : (theme.descriptionEn || theme.descriptionJa);
}

function getConfidenceBadgeClass(confidence) {
    switch (confidence) {
        case 'confirmed': return 'tv-confidence-badge tv-confidence-confirmed';
        case 'strong': return 'tv-confidence-badge tv-confidence-strong';
        case 'hypothesis': return 'tv-confidence-badge tv-confidence-hypothesis';
        default: return 'tv-confidence-badge';
    }
}

function getConfidenceLabel(confidence, strings) {
    switch (confidence) {
        case 'confirmed': return strings.confidenceConfirmed;
        case 'strong': return strings.confidenceStrong;
        case 'hypothesis': return strings.confidenceHypothesis;
        default: return confidence;
    }
}

function getRobustnessColorClass(score) {
    if (score >= 7) return 'tv-robustness-high';
    if (score >= 5) return 'tv-robustness-mid';
    return 'tv-robustness-low';
}

/**
 * Create the theme verification renderer.
 *
 * @param {object} opts
 * @param {Function} opts.openMarkdownModal - from the modal controller
 * @param {Function} opts.getLang - returns current language
 */
export function createThemeVerificationRenderer({ openMarkdownModal, getLang }) {
    let containerEl = null;
    let headingEl = null;
    let descriptionEl = null;

    function cacheDom() {
        containerEl = document.getElementById('reports-theme-verification-grid');
        headingEl = document.getElementById('reports-theme-verification-heading');
        descriptionEl = document.getElementById('reports-theme-verification-description');
    }

    function renderIntegrationCard(strings, lang, fragment) {
        const col = document.createElement('div');
        col.className = 'col-12';

        const card = document.createElement('article');
        card.className = 'card kesson-card kesson-panel h-100 tv-card tv-integration-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');

        const name = normalizeLang(lang) === 'ja'
            ? INTEGRATION_REPORT.nameJa
            : (INTEGRATION_REPORT.nameEn || INTEGRATION_REPORT.nameJa);
        const desc = normalizeLang(lang) === 'ja'
            ? INTEGRATION_REPORT.descriptionJa
            : (INTEGRATION_REPORT.descriptionEn || INTEGRATION_REPORT.descriptionJa);
        card.setAttribute('aria-label', name);

        const body = document.createElement('div');
        body.className = 'card-body p-2 p-md-3 d-flex flex-column gap-1';

        const titleNode = document.createElement('h4');
        titleNode.className = 'h6 mb-0 text-light';
        titleNode.textContent = name;

        const descNode = document.createElement('p');
        descNode.className = 'small mb-0 reports-feature-description';
        descNode.textContent = desc;

        // Summary comparison chips
        const summaryRow = document.createElement('div');
        summaryRow.className = 'tv-integration-summary mt-2';

        const summaryChips = document.createElement('div');
        summaryChips.className = 'tv-comparison-mini d-flex flex-wrap gap-2';
        THEME_DATA.forEach((theme) => {
            const chip = document.createElement('span');
            chip.className = 'tv-comparison-chip ' + getRobustnessColorClass(theme.robustness);
            chip.textContent = theme.id + ' ' + theme.robustness + '/' + theme.robustnessMax;
            summaryChips.appendChild(chip);
        });
        summaryRow.appendChild(summaryChips);

        body.appendChild(titleNode);
        body.appendChild(descNode);
        body.appendChild(summaryRow);

        const openCard = () => {
            const mdUrl = THEME_VERIFICATION_BASE + '/' + INTEGRATION_REPORT.mdFile;
            openMarkdownModal({
                title: name,
                sources: [{ mdUrl }],
                modalContext: { type: 'generic', modalKey: 'verify-integration', historyMode: 'push' },
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

    function renderThemeCards(strings, lang, fragment) {
        THEME_DATA.forEach((theme) => {
            const col = document.createElement('div');
            col.className = 'col';

            const card = document.createElement('article');
            card.className = 'card kesson-card kesson-panel h-100 tv-card';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');

            const name = getThemeName(theme, lang);
            const description = getThemeDescription(theme, lang);
            card.setAttribute('aria-label', name);

            const body = document.createElement('div');
            body.className = 'card-body p-2 p-md-3 d-flex flex-column gap-1';

            // Header row: confidence badge + theme ID
            const headerRow = document.createElement('div');
            headerRow.className = 'd-flex align-items-center gap-2 mb-1';

            const badge = document.createElement('span');
            badge.className = getConfidenceBadgeClass(theme.confidence);
            badge.textContent = getConfidenceLabel(theme.confidence, strings);

            const themeIdNode = document.createElement('span');
            themeIdNode.className = 'tv-theme-id';
            themeIdNode.textContent = theme.id;

            headerRow.appendChild(badge);
            headerRow.appendChild(themeIdNode);

            // Theme name
            const titleNode = document.createElement('h4');
            titleNode.className = 'h6 mb-1 text-light';
            titleNode.textContent = name;

            // Description
            const descNode = document.createElement('p');
            descNode.className = 'tv-description small mb-0 reports-feature-description';
            descNode.textContent = description;

            body.appendChild(headerRow);
            body.appendChild(titleNode);
            body.appendChild(descNode);

            // Robustness score bar
            const robustnessWrap = document.createElement('div');
            robustnessWrap.className = 'tv-robustness-wrap mt-1';

            const robustnessLabel = document.createElement('div');
            robustnessLabel.className = 'tv-robustness-label';
            robustnessLabel.textContent = strings.robustnessLabel + ': ' + theme.robustness + '/' + theme.robustnessMax;

            const barOuter = document.createElement('div');
            barOuter.className = 'tv-robustness-bar-outer';

            const barInner = document.createElement('div');
            barInner.className = 'tv-robustness-bar-inner ' + getRobustnessColorClass(theme.robustness);
            barInner.style.width = (theme.robustness / theme.robustnessMax * 100) + '%';

            barOuter.appendChild(barInner);
            robustnessWrap.appendChild(robustnessLabel);
            robustnessWrap.appendChild(barOuter);
            body.appendChild(robustnessWrap);

            // Meta info row
            const metaRow = document.createElement('div');
            metaRow.className = 'tv-meta-row d-flex flex-wrap gap-2 mt-1';

            const domainChip = document.createElement('span');
            domainChip.className = 'tv-meta-chip';
            domainChip.textContent = strings.domains.replace('{count}', String(theme.domainCount));
            metaRow.appendChild(domainChip);

            if (theme.hitRate !== null) {
                const hitChip = document.createElement('span');
                hitChip.className = 'tv-meta-chip';
                hitChip.textContent = strings.hitRate.replace('{rate}', String(theme.hitRate));
                metaRow.appendChild(hitChip);
            }

            const formalChip = document.createElement('span');
            formalChip.className = 'tv-meta-chip';
            formalChip.textContent = strings.formalization + ': ' + theme.formalization;
            metaRow.appendChild(formalChip);

            body.appendChild(metaRow);

            // Card click
            const normalizedId = theme.id.replace(/\+/g, '');
            const openCard = () => {
                const mdUrl = THEME_VERIFICATION_BASE + '/' + theme.mdFile;
                openMarkdownModal({
                    title: name,
                    sources: [{ mdUrl }],
                    modalContext: { type: 'generic', modalKey: 'verify-' + normalizedId, historyMode: 'push' },
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
    }

    function renderVerification() {
        if (!containerEl) return;

        const lang = getLang();
        const strings = getVerificationStrings(lang);

        if (headingEl) headingEl.textContent = strings.heading;
        if (descriptionEl) descriptionEl.textContent = strings.description;

        containerEl.innerHTML = '';

        const fragment = document.createDocumentFragment();

        // Integration card first (full width)
        renderIntegrationCard(strings, lang, fragment);

        // Individual theme cards
        renderThemeCards(strings, lang, fragment);

        containerEl.appendChild(fragment);
    }

    return { cacheDom, renderVerification };
}
