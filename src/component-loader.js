const COMPONENTS = [
    { id: 'model-section', src: './src/components/model-section.html' },
    { id: 'reports-section', src: './src/components/reports-section.html' },
    { id: 'reports-cross-analysis-section', src: './src/components/cross-analysis-section.html' },
    { id: 'articles-section', src: './src/components/articles-section.html' },
];

export async function loadComponents() {
    await Promise.all(COMPONENTS.map(async ({ id, src }) => {
        const el = document.getElementById(id);
        if (!el) return;
        try {
            const res = await fetch(src);
            if (!res.ok) throw new Error(`${res.status}`);
            el.innerHTML = await res.text();
        } catch (error) {
            console.error(`[component-loader] ${src}:`, error);
        }
    }));
}
