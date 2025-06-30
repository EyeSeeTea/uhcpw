import { useCallback, useEffect, useRef } from "react";

interface UseInfiniteScrollProps {
    onLoadMore: () => void;
    hasMore: boolean;
    loadingMore: boolean;
    threshold?: number;
}

export function useInfiniteScroll({
    onLoadMore,
    hasMore,
    loadingMore,
    threshold = 100,
}: UseInfiniteScrollProps) {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadingRef = useRef<HTMLDivElement>(null);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const target = entries[0];
            if (target?.isIntersecting && hasMore && !loadingMore) {
                onLoadMore();
            }
        },
        [hasMore, loadingMore, onLoadMore]
    );

    useEffect(() => {
        const element = loadingRef.current;
        if (!element) return;

        if (!hasMore) {
            return;
        }

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(handleObserver, {
            rootMargin: `${threshold}px`,
        });

        observerRef.current.observe(element);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [handleObserver, threshold, hasMore]);

    return { loadingRef };
} 