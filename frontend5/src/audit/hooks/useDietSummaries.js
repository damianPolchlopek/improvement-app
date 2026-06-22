// features/diet-audit/hooks/useDietSummaries.js

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import REST from '../../utils/REST';

export const useDietSummaries = (page, size) => {
  return useQuery({
    queryKey: ['diet-summaries-for-audit', page, size],
    queryFn: () => REST.getDietSummaries(page, size),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
};
