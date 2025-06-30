import { useCallback, useEffect, useRef, useState } from "react";

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
    const [isMounted, setIsMounted] = useState(false);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const target = entries[0];
            if (target?.isIntersecting && hasMore && !loadingMore && isMounted) {
                setTimeout(() => {
                    if (hasMore && !loadingMore) {
                        onLoadMore();
                    }
                }, 50);
            }
        },
        [hasMore, loadingMore, onLoadMore, isMounted]
    );

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 200);
        return () => clearTimeout(timer);
    }, [hasMore, loadingMore]);

    useEffect(() => {
        const element = loadingRef.current;
        if (!element) return;

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
    }, [handleObserver, threshold]);

    return { loadingRef };
} 