import axios from '@/shared/utils/axios';
import { useQuery } from '@tanstack/react-query';

const useGetFavoriteProducts = (userId: number | null | undefined) => {
  return useQuery({
    queryKey: ['userFavoriteProducts', userId],
    queryFn: () => axios.get(`users/${userId}/favorite-products`),
    staleTime: 60 * 1000 * 30,
    gcTime: 60 * 1000 * 30,
    enabled: !!userId && !isNaN(userId),
  });
};

export default useGetFavoriteProducts;
