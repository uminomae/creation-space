import { normalizeLang } from '../i18n.js';

const PJDHIRO_PAGES_BASE = 'https://uminomae.github.io/pjdhiro';
const PJDHIRO_RAW_BASE = 'https://raw.githubusercontent.com/uminomae/pjdhiro/main';
const CREATION_PATH = '/assets/creation';
const PJDHIRO_CREATION_PAGES = `${PJDHIRO_PAGES_BASE}${CREATION_PATH}`;
const PJDHIRO_CREATION_RAW = `${PJDHIRO_RAW_BASE}${CREATION_PATH}`;
const REPORTS_SCENARIO_BASE = 'assets/reports/scenarios';
const DOMAIN_ID_PATTERN = /^D\d+$/i;
const CREATION_GUIDE_GENERATOR_MODEL = 'claude-opus-4-6';

export const DEFAULT_REPORTS_DATA_URL = `${PJDHIRO_CREATION_RAW}/manifests/domains.json`;
export const DEFAULT_REPORTS_ASSET_BASE = `${PJDHIRO_CREATION_PAGES}/`;
export const DEFAULT_REPORTS_MD_ASSET_BASE = `${PJDHIRO_RAW_BASE}${CREATION_PATH}/`;

export const GUIDES_MANIFEST_URL = `${PJDHIRO_CREATION_RAW}/manifests/guides.json`;

export const SURVEY_MANIFEST_URL = `${PJDHIRO_CREATION_RAW}/manifests/survey.json`;

export const PHASE8_THEMES_MANIFEST_URL = `${PJDHIRO_CREATION_RAW}/manifests/phase8-themes.json`;

export const SYNTHESIS_REPORT_LINKS = {
    ja: {
        mdUrl: `${PJDHIRO_CREATION_RAW}/synthesis/ja/md/cross-domain-synthesis-ja.md`,
        pdfUrl: `${PJDHIRO_CREATION_PAGES}/synthesis/ja/pdf/cross-domain-synthesis-ja.pdf`,
        generatorModel: CREATION_GUIDE_GENERATOR_MODEL,
        generated: '2026-03-20',
    },
};

export const SYNTHESIS_PRESENTATION_LINKS = {
    ja: {
        mdUrl: `${PJDHIRO_CREATION_RAW}/synthesis/ja/md/cross-domain-synthesis-presentation-ja.md`,
        pdfUrl: `${PJDHIRO_CREATION_PAGES}/synthesis/ja/pdf/cross-domain-synthesis-presentation-ja.pdf`,
        htmlUrl: `${PJDHIRO_CREATION_PAGES}/synthesis/ja/html/cross-domain-synthesis-presentation-ja.html`,
        generatorModel: CREATION_GUIDE_GENERATOR_MODEL,
        generated: '2026-03-20',
    },
    en: {
        mdUrl: `${PJDHIRO_CREATION_RAW}/synthesis/en/md/cross-domain-synthesis-presentation-en.md`,
        pdfUrl: `${PJDHIRO_CREATION_PAGES}/synthesis/en/pdf/cross-domain-synthesis-presentation-en.pdf`,
        htmlUrl: `${PJDHIRO_CREATION_PAGES}/synthesis/en/html/cross-domain-synthesis-presentation-en.html`,
        generatorModel: CREATION_GUIDE_GENERATOR_MODEL,
        generated: '2026-03-20',
    },
};
export const STATUS_REPORT_LINKS = {
    ja: {
        mdUrl: `${PJDHIRO_CREATION_RAW}/survey/ja/md/survey-status.md`,
        pdfUrl: `${PJDHIRO_CREATION_PAGES}/survey/ja/pdf/survey-status.pdf`,
    },
    en: {
        mdUrl: `${PJDHIRO_CREATION_RAW}/survey/en/md/survey-status.md`,
        pdfUrl: `${PJDHIRO_CREATION_PAGES}/survey/en/pdf/survey-status.pdf`,
    },
};

export const MODEL_GUIDE_LINKS = [
    {
        key: 'general',
        links: {
            ja: {
                mdUrl: `${PJDHIRO_CREATION_RAW}/guides/ja/md/creation-general.md`,
                pdfUrl: `${PJDHIRO_CREATION_PAGES}/guides/ja/pdf/creation-general.pdf`,
                generatorModel: CREATION_GUIDE_GENERATOR_MODEL,
            },
            en: {
                mdUrl: `${PJDHIRO_CREATION_RAW}/guides/en/md/creation-general.md`,
                pdfUrl: `${PJDHIRO_CREATION_PAGES}/guides/en/pdf/creation-general.pdf`,
                generatorModel: CREATION_GUIDE_GENERATOR_MODEL,
            },
        },
    },
    {
        key: 'designer',
        links: {
            ja: {
                mdUrl: `${PJDHIRO_CREATION_RAW}/guides/ja/md/creation-designer.md`,
                pdfUrl: `${PJDHIRO_CREATION_PAGES}/guides/ja/pdf/creation-designer.pdf`,
                generatorModel: CREATION_GUIDE_GENERATOR_MODEL,
            },
            en: {
                mdUrl: `${PJDHIRO_CREATION_RAW}/guides/en/md/creation-designer.md`,
                pdfUrl: `${PJDHIRO_CREATION_PAGES}/guides/en/pdf/creation-designer.pdf`,
                generatorModel: CREATION_GUIDE_GENERATOR_MODEL,
            },
        },
    },
    {
        key: 'expert',
        links: {
            ja: {
                mdUrl: `${PJDHIRO_CREATION_RAW}/guides/ja/md/creation-academic.md`,
                pdfUrl: `${PJDHIRO_CREATION_PAGES}/guides/ja/pdf/creation-academic.pdf`,
                generatorModel: CREATION_GUIDE_GENERATOR_MODEL,
            },
            en: {
                mdUrl: `${PJDHIRO_CREATION_RAW}/guides/en/md/creation-academic.md`,
                pdfUrl: `${PJDHIRO_CREATION_PAGES}/guides/en/pdf/creation-academic.pdf`,
                generatorModel: CREATION_GUIDE_GENERATOR_MODEL,
            },
        },
    },
];

// 正本: docs/evidence-metadata-creation.md §2 (v2.0 — Phase ベース, cs#123)
export const DEFAULT_PROGRESS_TAXONOMY = [
    {
        id: 'not_surveyed',
        labelJa: '調査前',
        labelEn: 'Not yet surveyed',
        descriptionJa: 'AI支援調査が未実施',
        descriptionEn: 'No AI-assisted survey conducted yet',
        tone: 'secondary',
        order: 10,
    },
    {
        id: 'initial_scan',
        labelJa: '初期スキャン済',
        labelEn: 'Initial scan',
        descriptionJa: '幅優先スキャンで候補理論を抽出した（Phase 1-2）',
        descriptionEn: 'Candidate theories extracted via breadth-first scan (Phase 1-2)',
        tone: 'warning',
        order: 20,
    },
    {
        id: 'cross_reviewed',
        labelJa: '独立照合済',
        labelEn: 'Cross-reviewed',
        descriptionJa: '複数AIエンジンによる独立レビューと突き合わせを実施した（Phase 3-4）',
        descriptionEn: 'Independent review and cross-check by multiple AI engines (Phase 3-4)',
        tone: 'primary',
        order: 30,
    },
    {
        id: 'deep_investigated',
        labelJa: '多段階検証済',
        labelEn: 'Multi-stage verified',
        descriptionJa: '複数AIエンジンによる論拠監査・構造再読・統合検証を実施した（Phase 5-7）',
        descriptionEn: 'Multi-stage verification by multiple AI engines: audit, structural re-reading, and integration (Phase 5-7)',
        tone: 'primary',
        order: 40,
    },
    {
        id: 'cross_explored',
        labelJa: '領域横断探索済',
        labelEn: 'Cross-domain explored',
        descriptionJa: '領域横断的な構造探索を実施した（Phase 8）',
        descriptionEn: 'Cross-domain structural exploration conducted (Phase 8)',
        tone: 'primary',
        order: 50,
    },
    {
        id: 'human_reviewed',
        labelJa: '人間レビュー済',
        labelEn: 'Human-reviewed',
        descriptionJa: '著者による最終確認を実施した',
        descriptionEn: 'Author final confirmation conducted',
        tone: 'success',
        order: 60,
    },
];

export function hasText(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

export function sanitizeReportsScenarioName(value) {
    if (!hasText(value)) return '';
    return value.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '');
}

export function getReportsScenarioName(search = window.location.search) {
    try {
        const params = new URLSearchParams(search);
        return sanitizeReportsScenarioName(params.get('reportsScenario') || params.get('reportsTaxonomyTest'));
    } catch {
        return '';
    }
}

export function formatReportsScenarioFallbackLabel(name) {
    const sanitized = sanitizeReportsScenarioName(name);
    return sanitized || '';
}

export function normalizeDomainId(value) {
    if (!hasText(value)) return '';
    const normalized = value.trim().toUpperCase();
    return DOMAIN_ID_PATTERN.test(normalized) ? normalized : '';
}

export function normalizeProgressLevelId(value) {
    return hasText(value) ? value.trim().toLowerCase() : '';
}

export function slugToTitle(slug) {
    if (typeof slug !== 'string' || !slug.trim()) return '';
    return slug
        .trim()
        .split('-')
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function formatProgressLevelFallbackLabel(level) {
    const normalizedLevel = normalizeProgressLevelId(level);
    if (!normalizedLevel) return '';
    return slugToTitle(normalizedLevel.replace(/_/g, '-')) || normalizedLevel;
}

export function getDefaultProgressTaxonomyEntry(level) {
    const normalizedLevel = normalizeProgressLevelId(level);
    const matched = DEFAULT_PROGRESS_TAXONOMY.find((entry) => entry.id === normalizedLevel);
    if (matched) {
        return { ...matched };
    }

    const fallbackLabel = formatProgressLevelFallbackLabel(normalizedLevel);
    return {
        id: normalizedLevel,
        labelJa: fallbackLabel || normalizedLevel,
        labelEn: fallbackLabel || normalizedLevel,
        descriptionJa: '',
        descriptionEn: '',
        tone: 'secondary',
        order: Number.MAX_SAFE_INTEGER,
    };
}

export function normalizeProgressTaxonomy(rawTaxonomy, reports = []) {
    const sourceEntries = Array.isArray(rawTaxonomy) && rawTaxonomy.length
        ? rawTaxonomy
        : DEFAULT_PROGRESS_TAXONOMY;
    const normalized = [];
    const seen = new Set();

    sourceEntries.forEach((entry, index) => {
        const id = normalizeProgressLevelId(entry?.id);
        if (!id || seen.has(id)) return;

        const fallback = getDefaultProgressTaxonomyEntry(id);
        const order = Number(entry?.order);
        normalized.push({
            id,
            labelJa: hasText(entry?.label_ja) ? entry.label_ja.trim() : fallback.labelJa,
            labelEn: hasText(entry?.label_en) ? entry.label_en.trim() : fallback.labelEn,
            descriptionJa: hasText(entry?.description_ja) ? entry.description_ja.trim() : fallback.descriptionJa,
            descriptionEn: hasText(entry?.description_en) ? entry.description_en.trim() : fallback.descriptionEn,
            tone: hasText(entry?.tone) ? entry.tone.trim().toLowerCase() : fallback.tone,
            order: Number.isFinite(order) ? order : (fallback.order + index),
        });
        seen.add(id);
    });

    reports.forEach((report, index) => {
        const id = normalizeProgressLevelId(report?.progressLevel);
        if (!id || seen.has(id)) return;

        const fallback = getDefaultProgressTaxonomyEntry(id);
        normalized.push({
            ...fallback,
            order: fallback.order === Number.MAX_SAFE_INTEGER ? 1000 + index : fallback.order,
        });
        seen.add(id);
    });

    return normalized.sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.id.localeCompare(b.id, 'en');
    });
}

function getManifestProgressTaxonomy(payload) {
    if (!payload || typeof payload !== 'object') return [];
    if (Array.isArray(payload.progress_taxonomy)) return payload.progress_taxonomy;
    if (Array.isArray(payload.progress_levels)) return payload.progress_levels;
    return [];
}

function resolveReportsScenarioUrl(name) {
    const scenarioName = sanitizeReportsScenarioName(name);
    if (!scenarioName) return '';
    return `${REPORTS_SCENARIO_BASE}/${scenarioName}.json`;
}

function mergeProgressTaxonomyEntries(baseEntries = [], overrideEntries = []) {
    const merged = [];
    const indexById = new Map();

    const appendEntry = (entry) => {
        const id = normalizeProgressLevelId(entry?.id);
        if (!id) return;

        const nextEntry = { ...entry, id };
        if (indexById.has(id)) {
            merged[indexById.get(id)] = {
                ...merged[indexById.get(id)],
                ...nextEntry,
                id,
            };
            return;
        }

        indexById.set(id, merged.length);
        merged.push(nextEntry);
    };

    (Array.isArray(baseEntries) ? baseEntries : []).forEach(appendEntry);
    (Array.isArray(overrideEntries) ? overrideEntries : []).forEach(appendEntry);
    return merged;
}

function mergeReportOverride(report, override) {
    if (!report || !override || typeof override !== 'object') return report;

    const nextReport = { ...report };
    Object.entries(override).forEach(([key, value]) => {
        if (value === null || value === undefined) return;
        if ((key === 'md' || key === 'pdf') && typeof value === 'object') {
            nextReport[key] = value;
            return;
        }
        if (typeof value === 'string') {
            const trimmed = value.trim();
            if (!trimmed) return;
            nextReport[key] = trimmed;
            return;
        }
        nextReport[key] = value;
    });
    return nextReport;
}

function applyReportScenarioPayload(payload, scenarioPayload) {
    if (!payload || !scenarioPayload || typeof scenarioPayload !== 'object') {
        return payload;
    }

    const baseReports = Array.isArray(payload?.reports) ? payload.reports : [];
    const reportOverrides = scenarioPayload?.report_overrides && typeof scenarioPayload.report_overrides === 'object'
        ? scenarioPayload.report_overrides
        : {};
    const defaultOverride = reportOverrides.default;
    const nextReports = baseReports.map((report) => {
        const withDefault = mergeReportOverride(report, defaultOverride);
        return mergeReportOverride(withDefault, reportOverrides[report?.id]);
    });

    return {
        ...payload,
        generated_at: hasText(scenarioPayload?.generated_at) ? scenarioPayload.generated_at.trim() : payload?.generated_at,
        progress_taxonomy: mergeProgressTaxonomyEntries(
            getManifestProgressTaxonomy(payload),
            getManifestProgressTaxonomy(scenarioPayload),
        ),
        reports: nextReports,
    };
}

function normalizeReportsScenarioMeta(name, scenarioPayload) {
    if (!hasText(name)) return null;
    const scenarioName = sanitizeReportsScenarioName(name);
    if (!scenarioName) return null;
    return {
        name: scenarioName,
        labelJa: hasText(scenarioPayload?.label_ja) ? scenarioPayload.label_ja.trim() : '',
        labelEn: hasText(scenarioPayload?.label_en) ? scenarioPayload.label_en.trim() : '',
        descriptionJa: hasText(scenarioPayload?.description_ja) ? scenarioPayload.description_ja.trim() : '',
        descriptionEn: hasText(scenarioPayload?.description_en) ? scenarioPayload.description_en.trim() : '',
    };
}

export function formatDate(isoStr) {
    if (!isoStr) return '';
    const match = String(isoStr).match(/^(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : String(isoStr);
}

export function parseFrontmatter(text) {
    const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { meta: {}, body: text.trim() };

    const meta = {};
    match[1].split('\n').forEach((line) => {
        const idx = line.indexOf(':');
        if (idx <= 0) return;
        const key = line.slice(0, idx).trim();
        const val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        meta[key] = val;
    });

    return { meta, body: match[2].trim() };
}

export function normalizeAssetBaseUrl(url, fallback = DEFAULT_REPORTS_ASSET_BASE) {
    if (typeof url !== 'string' || !url.trim()) {
        return fallback;
    }
    return url.endsWith('/') ? url : `${url}/`;
}

export function safeUrl(rawUrl, fallback = '#', baseHref = window.location.href) {
    if (typeof rawUrl !== 'string') return fallback;
    const trimmed = rawUrl.trim();
    if (!trimmed) return fallback;
    try {
        const resolved = new URL(trimmed, baseHref);
        if (resolved.protocol === 'http:' || resolved.protocol === 'https:') {
            return resolved.toString();
        }
    } catch {
        return fallback;
    }
    return fallback;
}

export function normalizePdfBrowserUrl(rawUrl) {
    const resolved = safeUrl(rawUrl, '');
    if (!resolved) return '';

    try {
        const parsed = new URL(resolved);
        if (!/\.pdf(?:$|[?#])/i.test(parsed.pathname)) {
            return resolved;
        }

        if (parsed.hostname === 'raw.githubusercontent.com') {
            const parts = parsed.pathname.split('/').filter(Boolean);
            if (parts.length >= 4) {
                const [owner, repo, _branch, ...restPath] = parts;
                return `https://${owner}.github.io/${repo}/${restPath.join('/')}`;
            }
        }

        if (parsed.hostname === 'github.com') {
            const parts = parsed.pathname.split('/').filter(Boolean);
            if (parts.length >= 5 && parts[2] === 'blob') {
                const [owner, repo, _blob, _branch, ...restPath] = parts;
                return `https://${owner}.github.io/${repo}/${restPath.join('/')}`;
            }
        }

        return resolved;
    } catch {
        return '';
    }
}

async function isPdfReachable(pdfUrl) {
    const normalizedPdfUrl = normalizePdfBrowserUrl(pdfUrl);
    if (!normalizedPdfUrl) return false;

    try {
        const headResponse = await fetch(normalizedPdfUrl, { method: 'HEAD', cache: 'no-store' });
        if (headResponse.ok) return true;
        if (headResponse.status !== 405 && headResponse.status !== 501) {
            return false;
        }
    } catch {
        // Fall through to range request fallback.
    }

    try {
        const rangeResponse = await fetch(normalizedPdfUrl, {
            method: 'GET',
            headers: { Range: 'bytes=0-0' },
            cache: 'no-store',
        });
        return rangeResponse.ok || rangeResponse.status === 206;
    } catch {
        return false;
    }
}

export async function resolveFirstAvailablePdfUrl(sources = []) {
    for (const source of sources) {
        const candidate = normalizePdfBrowserUrl(source?.pdfUrl);
        if (!candidate) continue;
        if (await isPdfReachable(candidate)) {
            return candidate;
        }
    }
    return '';
}

export function buildMarkdownFetchCandidates(rawUrl) {
    const primary = safeUrl(rawUrl, '');
    if (!primary) return [];

    const candidates = [primary];
    if (!/\.md(?:$|[?#])/i.test(primary)) {
        return candidates;
    }

    try {
        const parsed = new URL(primary);
        const pathParts = parsed.pathname.split('/').filter(Boolean);
        const assetsIndex = pathParts.findIndex((part) => part === 'assets');
        if (assetsIndex >= 0) {
            const filePath = pathParts.slice(assetsIndex).join('/');
            candidates.push(`${PJDHIRO_RAW_BASE}/${filePath}`);
        }
    } catch {
        // keep primary candidate only
    }

    return [...new Set(candidates)];
}

export function looksLikeHtmlDocument(text) {
    if (typeof text !== 'string') return false;
    const sample = text.slice(0, 1024).trimStart().toLowerCase();
    return sample.startsWith('<!doctype html') || sample.startsWith('<html');
}

function normalizeProgressLevel(rawLevel, rawStatus) {
    const level = normalizeProgressLevelId(rawLevel);
    // v3.0 以前の旧 level → Phase ベース新 level
    if (level === 'quick_scan') return 'initial_scan';
    if (level === 'structure_exploration') return 'initial_scan';
    if (level === 'analysis_complete') return 'cross_reviewed';
    // v4.2 以前の旧 level → Phase ベース新 level (cs#123)
    if (level === 'claude_screened') return 'initial_scan';
    if (level === 'claude_gpt_reviewed') return 'cross_reviewed';
    if (level === 'api_deepdive') return 'deep_investigated';
    if (level === 'codex_parallel_deepdive') return 'deep_investigated';
    if (level) return level;

    // progress_level が空でも published ステータスを根拠に暗黙変換しない。
    // 値が空の場合は 'not_surveyed' にフォールバックし、console で警告する。
    if (rawStatus === 'published') {
        console.warn(`[reports] domain has status=published but empty progress_level — defaulting to not_surveyed. Fix index.json.`);
    }
    return 'not_surveyed';
}

function normalizeReport(report, index) {
    const id = typeof report?.id === 'string' && report.id.trim()
        ? report.id.trim()
        : `D${String(index + 1).padStart(2, '0')}`;

    // v1.0 format uses "name" (slug) instead of "name_ja"; derive display name from slug
    const rawSlug = typeof report?.slug === 'string' && report.slug.trim()
        ? report.slug.trim()
        : (typeof report?.name === 'string' ? report.name.trim() : '');

    const nameJa = typeof report?.name_ja === 'string' && report.name_ja.trim()
        ? report.name_ja.trim()
        : (slugToTitle(rawSlug) || id);

    const fallbackEn = slugToTitle(rawSlug) || nameJa;
    const nameEn = typeof report?.name_en === 'string' && report.name_en.trim()
        ? report.name_en.trim()
        : fallbackEn;

    const mdRaw = report?.md;
    const pdfRaw = report?.pdf;

    return {
        id,
        slug: rawSlug,
        nameJa,
        nameEn,
        status: report?.status === 'published' ? 'published' : 'planned',
        progressLevel: normalizeProgressLevel(report?.progress_level, report?.status),
        generatorModel: typeof report?.generator_model === 'string' ? report.generator_model.trim() : '',
        progressNote: typeof report?.progress_note === 'string' ? report.progress_note.trim() : '',
        generated: typeof report?.generated === 'string' ? report.generated.trim() : '',
        mdPath: typeof mdRaw === 'string' ? mdRaw.trim() : '',
        pdfPath: typeof pdfRaw === 'string' ? pdfRaw.trim() : '',
        mdByLang: typeof mdRaw === 'object' && mdRaw !== null ? mdRaw : null,
        pdfByLang: typeof pdfRaw === 'object' && pdfRaw !== null ? pdfRaw : null,
        thumbnail: typeof report?.thumbnail === 'string' ? report.thumbnail.trim() : '',
    };
}

function isMarkdownAssetPath(path) {
    return /\.md(?:$|[?#])/i.test(path);
}

function resolveReportAssetUrl(path, { assetBaseUrl, assetMdBaseUrl }) {
    if (typeof path !== 'string' || !path.trim()) return '';
    const trimmed = path.trim();

    if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('/')) {
        return safeUrl(trimmed, '');
    }

    const relativePath = trimmed.replace(/^\.\//, '');
    const baseUrl = isMarkdownAssetPath(relativePath) ? assetMdBaseUrl : assetBaseUrl;
    return safeUrl(`${baseUrl}${relativePath}`, '');
}

function sortReportsById(list) {
    return [...list].sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));
}

function dedupeSources(sources = []) {
    const seenMdUrls = new Set();
    const normalized = [];

    sources.forEach((source) => {
        const safeMarkdownUrl = safeUrl(source?.mdUrl, '');
        if (!safeMarkdownUrl || seenMdUrls.has(safeMarkdownUrl)) return;
        seenMdUrls.add(safeMarkdownUrl);
        normalized.push({
            mdUrl: safeMarkdownUrl,
            pdfUrl: normalizePdfBrowserUrl(source?.pdfUrl),
            generatorModel: hasText(source?.generatorModel) ? source.generatorModel.trim() : '',
            generated: hasText(source?.generated) ? source.generated.trim() : '',
        });
    });

    return normalized;
}

export function normalizeModalSources({ mdUrl = '', pdfUrl = '', sources = [] } = {}) {
    const merged = Array.isArray(sources) ? [...sources] : [];
    if (mdUrl) merged.push({ mdUrl, pdfUrl });
    return dedupeSources(merged);
}

function withEnglishAssetSuffix(path) {
    if (typeof path !== 'string' || !path.trim()) return '';
    const trimmed = path.trim();
    if (/-en(?=\.[a-z0-9]+(?:[?#].*)?$)/i.test(trimmed)) {
        return trimmed;
    }
    if (/-ja(?=\.[a-z0-9]+(?:[?#].*)?$)/i.test(trimmed)) {
        return trimmed.replace(/-ja(?=\.[a-z0-9]+(?:[?#].*)?$)/i, '-en');
    }
    if (/\.[a-z0-9]+(?:[?#].*)?$/i.test(trimmed)) {
        return trimmed.replace(/(\.[a-z0-9]+(?:[?#].*)?)$/i, '-en$1');
    }
    return `${trimmed}-en`;
}

function hasExplicitEnglishDirectory(path) {
    if (typeof path !== 'string') return false;
    return /\/en\/(?:md|pdf)\//i.test(path);
}

function buildLocalizedSourceCandidates(source, lang = 'ja') {
    const normalizedLang = normalizeLang(lang);
    const baseSource = {
        mdUrl: safeUrl(source?.mdUrl, ''),
        pdfUrl: safeUrl(source?.pdfUrl, ''),
        generatorModel: hasText(source?.generatorModel) ? source.generatorModel.trim() : '',
        generated: hasText(source?.generated) ? source.generated.trim() : '',
    };

    if (normalizedLang !== 'en') {
        return dedupeSources([baseSource]);
    }

    const enSource = {
        mdUrl: safeUrl(
            hasExplicitEnglishDirectory(baseSource.mdUrl) ? baseSource.mdUrl : withEnglishAssetSuffix(baseSource.mdUrl),
            '',
        ),
        pdfUrl: safeUrl(
            hasExplicitEnglishDirectory(baseSource.pdfUrl) ? baseSource.pdfUrl : withEnglishAssetSuffix(baseSource.pdfUrl),
            '',
        ),
        generatorModel: baseSource.generatorModel,
        generated: baseSource.generated,
    };
    return dedupeSources([enSource]);
}

export function resolveLocalizedSources(linksByLang, lang = 'ja') {
    const normalizedLang = normalizeLang(lang);
    const primary = linksByLang?.[normalizedLang];
    const sources = [];

    if (primary) {
        sources.push(...buildLocalizedSourceCandidates(primary, normalizedLang));
    }
    return dedupeSources(sources);
}

function buildCreationDomainSource(report, lang = 'ja') {
    if (typeof report?.id !== 'string' || typeof report?.slug !== 'string') return null;
    if (!report.id.trim() || !report.slug.trim()) return null;
    const idOrig = report.id.trim();
    const slug = report.slug.trim();
    const normalizedLang = normalizeLang(lang);
    const baseName = `domain-${idOrig}-${slug}`;
    return {
        mdUrl: `${PJDHIRO_CREATION_RAW}/domains/${normalizedLang}/md/${baseName}.md`,
        pdfUrl: `${PJDHIRO_CREATION_PAGES}/domains/${normalizedLang}/pdf/${baseName}.pdf`,
    };
}

function buildCreationDomainPresentationSource(report, lang = 'ja') {
    if (typeof report?.id !== 'string' || typeof report?.slug !== 'string') return null;
    if (!report.id.trim() || !report.slug.trim()) return null;
    const idOrig = report.id.trim();
    const slug = report.slug.trim();
    const normalizedLang = normalizeLang(lang);
    const baseName = `domain-${idOrig}-${slug}-presentation-${normalizedLang}`;
    return {
        mdUrl: `${PJDHIRO_CREATION_RAW}/domains/${normalizedLang}/presentations/md/${baseName}.md`,
        pdfUrl: `${PJDHIRO_CREATION_PAGES}/domains/${normalizedLang}/presentations/pdf/${baseName}.pdf`,
        htmlUrl: `${PJDHIRO_CREATION_PAGES}/domains/${normalizedLang}/presentations/html/${baseName}.html`,
    };
}

export function resolveDomainPresentationSources(report, { lang = 'ja' } = {}) {
    const normalizedLang = normalizeLang(lang);
    const source = buildCreationDomainPresentationSource(report, normalizedLang);
    if (!source) return [];
    return [source];
}

function resolveV2LangPath(pathByLang, lang, urlBase) {
    if (!pathByLang || typeof pathByLang !== 'object') return '';
    const relPath = pathByLang[lang];
    if (typeof relPath !== 'string' || !relPath.trim()) return '';
    return `${urlBase}/${relPath.trim()}`;
}

export function resolveDomainReportSources(
    report,
    {
        lang = 'ja',
        assetBaseUrl = DEFAULT_REPORTS_ASSET_BASE,
        assetMdBaseUrl = DEFAULT_REPORTS_MD_ASSET_BASE,
    } = {},
) {
    const normalizedLang = normalizeLang(lang);
    const sources = [];

    const reportGenerated = hasText(report?.generated) ? report.generated.trim() : '';
    const reportGeneratorModel = hasText(report?.generatorModel) ? report.generatorModel.trim() : '';

    if (report?.mdByLang) {
        const mdUrl = resolveV2LangPath(report.mdByLang, normalizedLang, PJDHIRO_CREATION_RAW);
        const pdfUrl = resolveV2LangPath(report.pdfByLang, normalizedLang, PJDHIRO_CREATION_PAGES);
        if (mdUrl) {
            sources.push({ mdUrl, pdfUrl: pdfUrl || '', generated: reportGenerated, generatorModel: reportGeneratorModel });
        }
    }

    const creationSource = buildCreationDomainSource(report, normalizedLang);
    if (creationSource) {
        creationSource.generated = reportGenerated;
        creationSource.generatorModel = reportGeneratorModel;
        sources.push(...buildLocalizedSourceCandidates(creationSource, normalizedLang));
    }

    if (typeof report?.mdPath === 'string' && report.mdPath.trim()) {
        const baseSource = {
            mdUrl: resolveReportAssetUrl(report.mdPath, { assetBaseUrl, assetMdBaseUrl }),
            pdfUrl: resolveReportAssetUrl(report?.pdfPath, { assetBaseUrl, assetMdBaseUrl }),
            generated: reportGenerated,
            generatorModel: reportGeneratorModel,
        };
        sources.push(...buildLocalizedSourceCandidates(baseSource, normalizedLang));
    }

    return dedupeSources(sources);
}

export function resolveDomainThumbnailUrl(report) {
    if (typeof report?.thumbnail === 'string' && report.thumbnail.trim()) {
        return `${PJDHIRO_CREATION_PAGES}/${report.thumbnail.trim()}`;
    }
    return '';
}

export function countReportsByProgressLevel(reports = []) {
    return reports.reduce((counts, report) => {
        const level = normalizeProgressLevelId(report?.progressLevel);
        if (!level) return counts;
        counts[level] = (counts[level] || 0) + 1;
        return counts;
    }, {});
}

export async function loadGuidesGeneratedAt(url = GUIDES_MANIFEST_URL) {
    try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) return '';
        const payload = await response.json();
        return typeof payload?.generated_at === 'string' ? payload.generated_at : '';
    } catch {
        return '';
    }
}

export async function loadReportsData({
    dataUrl = DEFAULT_REPORTS_DATA_URL,
    lang = 'ja',
    assetBaseUrl = DEFAULT_REPORTS_ASSET_BASE,
    assetMdBaseUrl = DEFAULT_REPORTS_MD_ASSET_BASE,
    search = window.location.search,
} = {}) {
    const response = await fetch(dataUrl, { cache: 'no-store' });
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    let payload = await response.json();
    let activeScenario = null;
    const scenarioName = getReportsScenarioName(search);
    const scenarioUrl = resolveReportsScenarioUrl(scenarioName);

    if (scenarioUrl) {
        try {
            const scenarioResponse = await fetch(scenarioUrl, { cache: 'no-store' });
            if (!scenarioResponse.ok) {
                throw new Error(`HTTP ${scenarioResponse.status}`);
            }
            const scenarioPayload = await scenarioResponse.json();
            activeScenario = normalizeReportsScenarioMeta(scenarioName, scenarioPayload);
            payload = applyReportScenarioPayload(payload, scenarioPayload);
        } catch (error) {
            console.warn(`[reports] scenario load failed (${scenarioName}):`, error);
        }
    }

    const normalizedAssetBaseUrl = normalizeAssetBaseUrl(assetBaseUrl);
    const normalizedAssetMdBaseUrl = normalizeAssetBaseUrl(assetMdBaseUrl, DEFAULT_REPORTS_MD_ASSET_BASE);
    const rawReports = Array.isArray(payload?.reports) ? payload.reports : (Array.isArray(payload?.domains) ? payload.domains : []);
    const reports = sortReportsById(rawReports.map(normalizeReport));
    const progressTaxonomy = normalizeProgressTaxonomy(getManifestProgressTaxonomy(payload), reports);

    return {
        lang: normalizeLang(lang),
        generatedAt: typeof payload?.generated_at === 'string' ? payload.generated_at : '',
        reports,
        progressTaxonomy,
        progressLevelCounts: countReportsByProgressLevel(reports),
        activeScenario,
        assetBaseUrl: normalizedAssetBaseUrl,
        assetMdBaseUrl: normalizedAssetMdBaseUrl,
    };
}
