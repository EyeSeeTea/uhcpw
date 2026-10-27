import { RefObject, useEffect, useRef, useState } from "react";

// NOTICE: the width the children need in one line can only be measured while they are laid out in one line,
// so it is kept to know when they fit again after the container has switched to more lines.
export function useFitsInOneLine(containerRef: RefObject<HTMLElement>): boolean {
    const [fitsInOneLine, setFitsInOneLine] = useState(true);
    const fitsInOneLineRef = useRef(true);
    const oneLineWidthRef = useRef(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const update = () => {
            if (fitsInOneLineRef.current) oneLineWidthRef.current = getOneLineWidth(container);

            const fits = container.clientWidth >= oneLineWidthRef.current;
            fitsInOneLineRef.current = fits;
            setFitsInOneLine(fits);
        };

        // NOTICE: the layout changes in the next frame, so the observed sizes do not change inside their own
        // notification (it would raise "ResizeObserver loop completed with undelivered notifications")
        let frameId = 0;
        const observer = new ResizeObserver(() => {
            window.cancelAnimationFrame(frameId);
            frameId = window.requestAnimationFrame(update);
        });
        observer.observe(container);
        Array.from(container.children).forEach(child => observer.observe(child));

        return () => {
            observer.disconnect();
            window.cancelAnimationFrame(frameId);
        };
    }, [containerRef]);

    return fitsInOneLine;
}

// NOTICE: offsetWidth is used because it ignores CSS transforms, and some pages are rotated on small screens
function getOneLineWidth(container: HTMLElement): number {
    const style = window.getComputedStyle(container);
    const children = Array.from(container.children).filter(
        (child): child is HTMLElement => child instanceof HTMLElement
    );
    const childrenWidth = children.reduce((width, child) => width + child.offsetWidth, 0);
    const gapsWidth = (parseFloat(style.columnGap) || 0) * Math.max(children.length - 1, 0);

    return parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + childrenWidth + gapsWidth;
}
