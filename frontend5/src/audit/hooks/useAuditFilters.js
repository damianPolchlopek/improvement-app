// features/diet-audit/hooks/useAuditFilters.js

import { useState, useMemo } from 'react';

export const useAuditFilters = (revisions) => {
  const [filters, setFilters] = useState({
    dateFrom: null,
    dateTo: null,
    revisionType: 'ALL', // 'ADD', 'MOD', 'DEL', 'ALL'
    searchTerm: '',
  });

  const filteredRevisions = useMemo(() => {
    if (!revisions) return [];

    return revisions.filter(revision => {
      // Filtr po dacie
      if (filters.dateFrom) {
        const revDate = new Date(revision.revisionTimestamp);
        if (revDate < new Date(filters.dateFrom)) return false;
      }
      
      if (filters.dateTo) {
        const revDate = new Date(revision.revisionTimestamp);
        if (revDate > new Date(filters.dateTo)) return false;
      }

      // Filtr po typie rewizji
      if (filters.revisionType !== 'ALL') {
        if (revision.revisionType !== filters.revisionType) return false;
      }

      // Filtr po wyszukiwanym terminie (np. nazwa posiłku)
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const hasMatchingMeal = revision.dietSummary.meals.some(meal =>
          meal.name.toLowerCase().includes(searchLower)
        );
        if (!hasMatchingMeal) return false;
      }

      return true;
    });
  }, [revisions, filters]);

  return {
    filters,
    setFilters,
    filteredRevisions,
  };
};