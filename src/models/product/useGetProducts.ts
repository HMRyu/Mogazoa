import { isServer, queryOptions, useQuery } from '@tanstack/react-query';
import axios from '@/shared/utils/axios';

export const bestProductsQueryOption = (categoryId: number) =>
  queryOptions({
    queryKey: ['bestProduct', categoryId],
    queryFn: async () => {
      const requestUri = isServer
        ? 'https://mogazoa-api.vercel.app/5-5/products?'
        : 'products?';
      const categoryParam = categoryId ? `&category=${categoryId}` : '';
      const { data } = await axios.get(
        `${requestUri}order=rating${categoryParam}`,
      );
      return data.list;
    },
    staleTime: 60 * 1000 * 10,
  });

const useGetBestProducts = (categoryId: number) => {
  return useQuery(bestProductsQueryOption(categoryId));
};

export default useGetBestProducts;