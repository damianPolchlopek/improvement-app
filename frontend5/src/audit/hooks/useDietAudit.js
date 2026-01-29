// features/diet-audit/hooks/useDietAudit.js

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import REST from '../../utils/REST';

/**
 * Hook do pobierania listy rewizji (lekkie dane)
 */
export const useDietRevisions = (dietSummaryId) => {
  return useQuery({
    queryKey: ['dietRevisions', dietSummaryId],
    queryFn: () => REST.getRevisions(dietSummaryId),
    enabled: !!dietSummaryId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook do pobierania pełnych danych konkretnej rewizji (lazy loading)
 */
export const useRevisionDetails = (dietSummaryId, revisionNumber) => {
  return useQuery({
    queryKey: ['revisionDetails', dietSummaryId, revisionNumber],
    queryFn: () => REST.getRevisionDetails(dietSummaryId, revisionNumber),
    enabled: !!dietSummaryId && !!revisionNumber,
    staleTime: 10 * 60 * 1000, // 10 minut - dane historyczne się nie zmieniają
  });
};

export const useRevisionComparison = (dietSummaryId, olderRevision, newerRevision) => {
  return useQuery({
    queryKey: ['revision-comparison', dietSummaryId, olderRevision, newerRevision],
    queryFn: () => REST.getRevisionComparsion(dietSummaryId, olderRevision, newerRevision),
    enabled: !!dietSummaryId && 
             olderRevision !== undefined && 
             olderRevision !== null &&
             newerRevision !== undefined && 
             newerRevision !== null,
  });
};