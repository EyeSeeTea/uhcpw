import { toPng } from "html-to-image";

export function downloadHtmlElement(
    element: HTMLDivElement,
    name: string,
    options: { backgroundColor?: string; exclusionClasses?: string[] }
) {
    if (element === null) {
        return;
    }

    // Prevent title from wrapping
    const titleElement: HTMLDivElement | null = element.querySelector(".visualization-plugin-header");
    if (titleElement !== null) {
        titleElement.style.whiteSpace = "nowrap";
        titleElement.style.overflow = "hidden";
        titleElement.style.textOverflow = "ellipsis";
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
        width: element.scrollWidth,
        height: element.scrollHeight,
    }).then(dataUrl => {
        const link = document.createElement("a");
        link.download = name;
        link.href = dataUrl;
        link.click();
    });
}
