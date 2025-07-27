import { useEffect, useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

export function useInfinityScroll(queryKey, fetchFn, limit = 20) {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: useQueryLoading, // Renamed to avoid confusion with custom isLoading
        isError,
        error,
        status
    } = useInfiniteQuery({
        queryKey: queryKey,
        queryFn: async ({ pageParam = 0 }) => {
            const currentSearchQuery = queryKey[queryKey.length - 1];
            const result = await fetchFn({ limit, pageParam, searchQuery: currentSearchQuery });

            // --- Crucial part: Log the result received from fetchFn ---
            console.log("Result received in useInfinityScroll (from fetchFn):", result);

            if (!result || !Array.isArray(result.documents) || typeof result.total === 'undefined' || typeof result.nextOffset === 'undefined') {
                console.error("fetchFn must return { documents: [], total: number, nextOffset: number }", result);
                throw new Error("Invalid data structure returned from fetchFn.");
            }
            return result;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            // lastPage.nextOffset এখন fetchFn দ্বারা সঠিকভাবে undefined বা একটি নাম্বার হবে বলে আশা করা হচ্ছে
            return lastPage.nextOffset;
        },
        staleTime: 1000 * 60 * 5,
        onSettled: (data, err, variables, state) => {
            // Optionally, you can add logic here if needed after each fetch
        }
    });

    const lastItemRef = useRef(null);

    const handleObserver = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    useEffect(() => {
        const currentElem = lastItemRef.current;
        let observer;

        if (currentElem) {
            observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
            observer.observe(currentElem);
        }

        return () => {
            if (observer) {
                observer.disconnect();
            }
        };
    }, [handleObserver]);

    const flattenedData = data?.pages?.flatMap(page => page.documents) || [];
    // Only show isLoading when initially loading or when a search query is active
    const isLoading = useQueryLoading && (flattenedData.length === 0 || queryKey[queryKey.length - 1] !== '');

    return {
        data: flattenedData,
        isLoading,
        isError,
        error,
        isFetchingNextPage,
        hasNextPage,
        lastItemRef,
        status
    };
}