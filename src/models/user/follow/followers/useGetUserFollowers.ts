import axios from '@/shared/utils/axios';
import { useInfiniteQuery } from '@tanstack/react-query';

const useGetUserFollowers = (userId: number | undefined) => {
  return useInfiniteQuery({
    queryKey: ['followers', userId],
    queryFn: async ({ pageParam = 0 }) => {
      const cursorParam = pageParam ? `cursor=${pageParam}` : '';

      const { data } = await axios.get(
        `users/${userId}/followers?${cursorParam}`,
      );

      return {
        list: data.list,
        nextCursor: data.nextCursor,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 60 * 1000 * 30,
    gcTime: 60 * 1000 * 30,
    enabled: userId !== undefined,
  });
};

export default useGetUserFollowers;