import { toPng } from "html-to-image";

export function downloadHtmlElement(
    element: HTMLDivElement,
    name: string,
    options: { backgroundColor?: string; exclusionClasses?: string[] }
) {
    if (element === null) {
        return;
    }

    const filter = (element: HTMLElement) => {
        return (
            element.classList === undefined ||
            !options.exclusionClasses?.some(classname => element.classList.contains(classname))
        );
    };

    toPng(element, {
        backgroundColor: options.backgroundColor,
        filter: filter,
    }).then(dataUrl => {
        const link = document.createElement("a");
        link.download = name;
        link.href = dataUrl;
        link.click();
    });
}
