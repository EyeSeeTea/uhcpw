import "./MobileCarousel.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { resourceTagHref, type HomeResourceState } from "@/data/home/home-resource";

export interface MobileCarouselProps {
    items: ReadonlyArray<HomeResourceState>;
    ariaLabel: string;
    hideTag?: boolean;
}

export const MobileCarousel: React.FC<MobileCarouselProps> = ({
    items,
    ariaLabel,
    hideTag = false,
}) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        let frame = 0;
        const onScroll = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                // Slides can have different widths (is-full-width for news), so
                // derive the active index from each child's own offsetLeft
                // rather than a uniform slide width.
                const children = Array.from(track.children) as HTMLElement[];
                const scrollLeft = track.scrollLeft;
                const nearest = children.reduce(
                    (best, child, i) => {
                        const delta = Math.abs(child.offsetLeft - scrollLeft);
                        return delta < best.delta ? { delta, index: i } : best;
                    },
                    { delta: Infinity, index: 0 },
                );
                setActiveIndex(nearest.index);
            });
        };

        track.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            cancelAnimationFrame(frame);
            track.removeEventListener("scroll", onScroll);
        };
    }, [items.length]);

    const goTo = useCallback((index: number) => {
        const track = trackRef.current;
        if (!track) return;
        const child = track.children[index] as HTMLElement | undefined;
        if (!child) return;
        track.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
    }, []);

    if (items.length === 0) return null;

    return (
        <div className="mobile-carousel" role="region" aria-label={ariaLabel}>
            <div className="mobile-carousel-track" ref={trackRef}>
                {items.map(item => (
                    <ResourceSlide key={item.id} item={item} hideTag={hideTag} />
                ))}
            </div>

            <div className="mobile-carousel-dots" role="tablist">
                {items.map((item, index) => (
                    <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={index === activeIndex}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`mobile-carousel-dot${index === activeIndex ? " is-active" : ""}`}
                        onClick={() => goTo(index)}
                    />
                ))}
            </div>
        </div>
    );
};

const ResourceSlide: React.FC<{ item: HomeResourceState; hideTag: boolean }> = ({
    item,
    hideTag,
}) => {
    const year = new Date(item.date).getFullYear();
    const fullWidth = item.kind === "news" || item.kind === "multimedia";

    return (
        <article className="mobile-carousel-slide">
            <div className={`mobile-carousel-card${fullWidth ? " is-full-width" : ""}`}>
                <a className="mobile-carousel-image-link" href={item.url} target="_blank" rel="noreferrer">
                    {item.imageOriginal ? (
                        <img
                            className="mobile-carousel-image"
                            src={item.imageOriginal}
                            alt={item.title}
                            loading="lazy"
                        />
                    ) : (
                        <div className="mobile-carousel-image-placeholder" />
                    )}
                </a>

                <div className="mobile-carousel-body">
                    <div className="mobile-carousel-meta">
                        {!hideTag && (
                            <a className="mobile-carousel-tag" href={resourceTagHref(item.kind)}>
                                {item.tagLabel}
                            </a>
                        )}
                        <span className="mobile-carousel-year">{year}</span>
                    </div>

                    <h3 className="mobile-carousel-title">
                        <a href={item.url} target="_blank" rel="noreferrer">
                            {item.title}
                        </a>
                    </h3>
                </div>
            </div>
        </article>
    );
};
