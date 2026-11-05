import { beforeEach, describe, expect, it, vi } from "vitest";
import { initReferencePage } from "../reference-terms-client";

describe("reference pages", () => {
    beforeEach(() => {
        window.history.replaceState({}, "", "/");
        document.body.innerHTML = `<div data-reference-page="glossary">
            <div class="reference-controls" hidden><input id="reference-query"><button data-reset hidden>Clear filters</button></div>
            <nav class="reference-alphabet" hidden><select data-letter-select><option value="All">All</option><option value="C">C</option></select><button data-letter="All">All</button><button data-letter="C">C</button></nav>
            <div class="reference-actions" hidden><button data-expand>Collapse definitions</button></div>
            <article data-entry data-search="Café Definition" data-initial="C" id="cafe">Café<details open><summary>Show</summary>Definition</details></article>
            <article data-entry data-search="Access Care" data-initial="A">Access<details open><summary>Show</summary>Care</details></article>
            <p data-empty hidden>Nothing found</p></div>`;
    });

    it("filters by definition and initial, clears filters, and expands definitions", () => {
        initReferencePage("glossary");
        const input = document.querySelector<HTMLInputElement>("input")!;
        const entries = [...document.querySelectorAll<HTMLElement>("[data-entry]")];
        const reset = document.querySelector<HTMLButtonElement>("[data-reset]")!;
        expect(reset.hidden).toBe(true);
        input.value = "cafe";
        input.dispatchEvent(new Event("input"));
        expect(entries.map(entry => entry.hidden)).toEqual([false, true]);
        expect(reset.hidden).toBe(false);
        document.querySelector<HTMLButtonElement>('[data-letter="C"]')!.click();
        input.value = "care";
        input.dispatchEvent(new Event("input"));
        expect(document.querySelector<HTMLElement>("[data-empty]")!.hidden).toBe(false);
        reset.click();
        expect(entries.map(entry => entry.hidden)).toEqual([false, false]);
        expect(reset.hidden).toBe(true);
        const select = document.querySelector<HTMLSelectElement>("[data-letter-select]")!;
        select.value = "C";
        select.dispatchEvent(new Event("change"));
        expect(entries.map(entry => entry.hidden)).toEqual([false, true]);
        expect(reset.hidden).toBe(false);
        reset.click();
        const expand = document.querySelector<HTMLButtonElement>("[data-expand]")!;
        expect([...document.querySelectorAll<HTMLDetailsElement>("details")].every(item => item.open)).toBe(true);
        expand.click();
        expect([...document.querySelectorAll<HTMLDetailsElement>("details")].every(item => !item.open)).toBe(true);
        expand.click();
        expect([...document.querySelectorAll<HTMLDetailsElement>("details")].every(item => item.open)).toBe(true);
    });

    it("reveals a linked definition", () => {
        const scroll = vi.fn();
        document.getElementById("cafe")!.scrollIntoView = scroll;
        window.history.replaceState({}, "", "/#cafe");
        initReferencePage("glossary");
        expect(document.querySelector<HTMLDetailsElement>("details")!.open).toBe(true);
        expect(scroll).toHaveBeenCalled();
    });

    it("filters abbreviation groups and clears the search", () => {
        document.body.innerHTML = `<div data-reference-page="abbreviations"><div class="reference-controls" hidden><input id="reference-query"><button data-reset>Clear</button></div>
            <a data-group-link href="#general">General</a><a data-group-link href="#language">Language</a>
            <section data-group id="general"><div data-entry data-search="WHO World Health Organization">WHO World Health Organization</div></section>
            <section data-group id="language"><div data-entry data-search="FR French">FR French</div></section><p data-empty hidden>No results</p></div>`;
        initReferencePage("abbreviations");
        const input = document.querySelector<HTMLInputElement>("input")!;
        const reset = document.querySelector<HTMLButtonElement>("[data-reset]")!;
        expect(reset.hidden).toBe(true);
        input.value = "french";
        input.dispatchEvent(new Event("input"));
        expect(reset.hidden).toBe(false);
        expect([...document.querySelectorAll<HTMLElement>("[data-group-link]")].map(link => link.hidden)).toEqual([
            true,
            false,
        ]);
        expect([...document.querySelectorAll<HTMLElement>("[data-group]")].map(group => group.hidden)).toEqual([
            true,
            false,
        ]);
        reset.click();
        expect(reset.hidden).toBe(true);
        expect([...document.querySelectorAll<HTMLElement>("[data-group-link]")].every(link => !link.hidden)).toBe(true);
        expect([...document.querySelectorAll<HTMLElement>("[data-group]")].every(group => !group.hidden)).toBe(true);
    });

    it("keeps the search for a visible category and clears it for a hidden target", () => {
        document.body.innerHTML = `<div data-reference-page="abbreviations"><div class="reference-controls" hidden><input id="reference-query"><button data-reset hidden>Clear</button></div>
            <a href="#category-general">General</a><section data-group id="category-general"><div data-entry data-search="WHO World Health Organization">WHO</div></section>
            <section data-group id="category-language"><div data-entry data-search="FR French">FR</div></section><p data-empty hidden>No results</p></div>`;
        const general = document.getElementById("category-general")!;
        const language = document.getElementById("category-language")!;
        general.scrollIntoView = vi.fn();
        language.scrollIntoView = vi.fn();
        initReferencePage("abbreviations");
        const input = document.querySelector<HTMLInputElement>("input")!;
        input.value = "french";
        input.dispatchEvent(new Event("input"));
        window.history.replaceState({}, "", "/#category-language");
        window.dispatchEvent(new HashChangeEvent("hashchange"));
        expect(input.value).toBe("french");
        expect(general.hidden).toBe(true);
        expect(language.scrollIntoView).toHaveBeenCalled();
        window.history.replaceState({}, "", "/#category-general");
        window.dispatchEvent(new HashChangeEvent("hashchange"));
        expect(input.value).toBe("");
        expect(general.hidden).toBe(false);
        expect(general.scrollIntoView).toHaveBeenCalled();
        input.value = "french";
        input.dispatchEvent(new Event("input"));
        document.querySelector<HTMLAnchorElement>('a[href="#category-general"]')!.click();
        expect(input.value).toBe("");
        expect(general.hidden).toBe(false);
    });
});
