const normalize = (value: string) =>
    value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

type PageKind = "glossary" | "abbreviations";

export function initReferencePage(kind: PageKind): void {
    const root = document.querySelector<HTMLElement>(`[data-reference-page="${kind}"]`);
    const query = root?.querySelector<HTMLInputElement>("#reference-query");
    if (!root || !query) return;

    root.querySelectorAll<HTMLElement>(".reference-controls, .reference-alphabet, .reference-actions").forEach(
        element => {
            element.hidden = false;
        }
    );
    const clearFilters = setupFilters(root, query);
    setupDefinitions(root);
    setupFragmentNavigation(root, clearFilters);
}

function setupFilters(root: HTMLElement, query: HTMLInputElement): () => void {
    const entries = [...root.querySelectorAll<HTMLElement>("[data-entry]")];
    const groups = [...root.querySelectorAll<HTMLElement>("[data-group]")];
    const letters = [...root.querySelectorAll<HTMLButtonElement>("[data-letter]")];
    const letterSelect = root.querySelector<HTMLSelectElement>("[data-letter-select]");
    const groupLinks = [...root.querySelectorAll<HTMLAnchorElement>("[data-group-link]")];
    const empty = root.querySelector<HTMLElement>("[data-empty]");
    const reset = root.querySelector<HTMLButtonElement>("[data-reset]");
    let letter = "All";

    const filter = () => {
        const search = normalize(query.value.trim());
        if (reset) reset.hidden = !query.value && letter === "All";
        entries.forEach(entry => {
            entry.hidden =
                !normalize(entry.dataset.search ?? "").includes(search) ||
                (letter !== "All" && entry.dataset.initial !== letter);
        });
        groups.forEach(group => {
            group.hidden = !group.querySelector("[data-entry]:not([hidden])");
        });
        groupLinks.forEach(link => {
            const group = groups.find(item => `#${item.id}` === link.getAttribute("href"));
            link.hidden = group?.hidden ?? false;
        });
        if (letterSelect) letterSelect.value = letter;
        if (empty) empty.hidden = entries.length === 0 || entries.some(entry => !entry.hidden);
        letters.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.letter === letter)));
    };
    const clearFilters = () => {
        query.value = "";
        letter = "All";
        filter();
    };

    query.addEventListener("input", filter);
    letters.forEach(button =>
        button.addEventListener("click", () => {
            letter = button.dataset.letter ?? "All";
            filter();
        })
    );
    letterSelect?.addEventListener("change", () => {
        letter = letterSelect.value;
        filter();
    });
    reset?.addEventListener("click", () => {
        clearFilters();
        query.focus();
    });
    filter();
    return clearFilters;
}

function setupDefinitions(root: HTMLElement): void {
    const expand = root.querySelector<HTMLButtonElement>("[data-expand]");
    const details = [...root.querySelectorAll<HTMLDetailsElement>("[data-entry] details")];
    const updateExpandLabel = () => {
        if (expand)
            expand.textContent =
                details.length > 0 && details.every(item => item.open)
                    ? "Collapse definitions"
                    : "Expand all definitions";
    };
    details.forEach(item => item.addEventListener("toggle", updateExpandLabel));
    expand?.addEventListener("click", () => {
        const shouldOpen = details.some(item => !item.open);
        details.forEach(item => {
            item.open = shouldOpen;
        });
        updateExpandLabel();
    });
}

function setupFragmentNavigation(root: HTMLElement, clearFilters: () => void): void {
    const revealHash = () => {
        let id: string;
        try {
            id = decodeURIComponent(window.location.hash.slice(1));
        } catch {
            return;
        }
        const target = document.getElementById(id);
        if (!id || !target || !root.contains(target)) return;
        if (target.closest("[hidden]")) clearFilters();
        const details = target.querySelector<HTMLDetailsElement>("details");
        if (details) details.open = true;
        target.scrollIntoView();
    };
    window.addEventListener("hashchange", revealHash);
    root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const target = document.getElementById(link.hash.slice(1));
            if (target && root.contains(target) && link.hash === window.location.hash) {
                event.preventDefault();
                revealHash();
            }
        });
    });
    revealHash();
}
