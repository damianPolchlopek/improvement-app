// features/diet-audit/components/DietAuditTimeline.jsx
// Rewizje pogrupowane dniami: każdy dzień to karta, a rewizja – rozwijany wiersz.

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { History as HistoryIcon } from '@mui/icons-material';

import RevisionCard from './RevisionCard';
import { EmptyState, Section } from './auditUi';
import { formatTimestamp } from '../utils/auditFormatters';

const DietAuditTimeline = ({ revisions, onRevisionSelect, selectedRevision }) => {
  const { t } = useTranslation();

  if (!revisions || revisions.length === 0) {
    return (
      <EmptyState
        Icon={HistoryIcon}
        title={t('audit.noEntries')}
        description={t('audit.noEntriesDesc')}
      />
    );
  }

  const groupedByDate = revisions.reduce((groups, revision) => {
    const date = formatTimestamp(revision.revisionTimestamp).date;
    (groups[date] ??= []).push(revision);
    return groups;
  }, {});

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {Object.entries(groupedByDate).map(([date, dateRevisions]) => (
        <Section
          key={date}
          title={date}
          actions={
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {t('audit.revisionsCount', { count: dateRevisions.length })}
            </Typography>
          }
        >
          {dateRevisions.map((revision) => {
            const isSelected = selectedRevision?.revisionNumber === revision.revisionNumber;
            return (
              <RevisionCard
                key={revision.revisionNumber}
                revision={revision}
                isSelected={isSelected}
                onClick={() => onRevisionSelect(isSelected ? null : revision)}
              />
            );
          })}
        </Section>
      ))}

      <Typography
        variant="caption"
        sx={{ color: 'text.secondary', textAlign: 'center', display: 'block', py: 1 }}
      >
        {t('audit.endOfHistory')}
      </Typography>
    </Box>
  );
};

export default DietAuditTimeline;
