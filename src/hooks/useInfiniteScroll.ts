import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

interface UseInfiniteScrollOptions<T> {
  queryKey: string[]
  fetchFn: (page: number) => Promise<T>
  getNextPageParam: (lastPage: T) => number | undefined
  enabled?: boolean
}

export function useInfiniteScroll<T>({
  queryKey,
  fetchFn,
  getNextPageParam,
  enabled = true,
}: UseInfiniteScrollOptions<T>) {
  const { ref, inView } = useInView()

  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => fetchFn(pageParam),
    getNextPageParam,
    initialPageParam: 1,
    enabled,
    gcTime: 24 * 60 * 60 * 1000, // Keep cache for 24 hours
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  })

  useEffect(() => {
    if (inView && query.hasNextPage && !query.isFetchingNextPage && enabled) {
      query.fetchNextPage()
    }
  }, [inView, query.hasNextPage, query.isFetchingNextPage, enabled])

  return {
    ...query,
    loadMoreRef: ref,
  }
}
