// features/diet-audit/components/DietAuditPage.jsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Alert, Box, IconButton, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CompareArrows as CompareIcon,
  History as HistoryIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';

import { useDietRevisions } from '../hooks/useDietAudit';
import { useAuditFilters } from '../hooks/useAuditFilters';
import DietAuditTimeline from './DietAuditTimeline';
import AuditFilters from './AuditFilters';
import RevisionCompare from './RevisionCompare';
import PageLoader from '../../component/loader/PageLoader';
import FoodPageHeader from '../../food/component/FoodPageHeader';

const VIEW_TIMELINE = 'timeline';
const VIEW_COMPARE = 'compare';

const DietAuditPage = () => {
  const { t } = useTranslation();
  const { dietSummaryId } = useParams();
  const navigate = useNavigate();
  const [selectedRevisions, setSelectedRevisions] = useState([]);
  const [viewMode, setViewMode] = useState(VIEW_TIMELINE);

  const { data: revisions, isLoading, error } = useDietRevisions(dietSummaryId);
  const { filters, setFilters, filteredRevisions } = useAuditFilters(revisions);

  const handleRevisionSelect = (revision) => {
    if (viewMode === VIEW_COMPARE) {
      if (!revision) {
        setSelectedRevisions([]);
      } else if (selectedRevisions.length < 2) {
        setSelectedRevisions([...selectedRevisions, revision]);
      } else {
        // Zastąp starszy wybór
        setSelectedRevisions([selectedRevisions[1], revision]);
      }
    } else {
      setSelectedRevisions(revision ? [revision] : []);
    }
  };

  const handleViewModeChange = (event, newValue) => {
    if (!newValue) return;
    setViewMode(newValue);
    setSelectedRevisions([]);
  };

  if (isLoading) {
    return <PageLoader text={t('audit.loadingHistory')} />;
  }

  if (error) {
    return (
      <Box sx={{ py: 3, px: 2, maxWidth: 1100, mx: 'auto' }}>
        <Alert severity="error">
          {t('audit.errorLoadingHistory')}: {error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3, px: 2, maxWidth: 1100, mx: 'auto' }}>
      <FoodPageHeader
        icon={<HistoryIcon />}
        title={t('audit.changeHistory')}
        description={`#${dietSummaryId} · ${t('audit.changeHistoryDesc')}`}
        statLabel={t('audit.revisionsLabel')}
        statValue={`${filteredRevisions.length} / ${revisions?.length ?? 0}`}
        actions={
          <>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={viewMode}
              onChange={handleViewModeChange}
            >
              <ToggleButton value={VIEW_TIMELINE} sx={{ px: 1.5, gap: 0.75 }}>
                <TimelineIcon fontSize="small" />
                {t('audit.timeline')}
              </ToggleButton>
              <ToggleButton value={VIEW_COMPARE} sx={{ px: 1.5, gap: 0.75 }}>
                <CompareIcon fontSize="small" />
                {t('audit.compareVersions')}
              </ToggleButton>
            </ToggleButtonGroup>
            <Tooltip title={t('audit.backToList')}>
              <IconButton aria-label={t('audit.backToList')} onClick={() => navigate(-1)}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
          </>
        }
      >
        <AuditFilters filters={filters} setFilters={setFilters} />
      </FoodPageHeader>

      {viewMode === VIEW_TIMELINE ? (
        <DietAuditTimeline
          revisions={filteredRevisions}
          onRevisionSelect={handleRevisionSelect}
          selectedRevision={selectedRevisions[0]}
        />
      ) : (
        <RevisionCompare
          dietSummaryId={dietSummaryId}
          selectedRevisions={selectedRevisions}
          onRevisionSelect={handleRevisionSelect}
          availableRevisions={filteredRevisions}
        />
      )}
    </Box>
  );
};

export default DietAuditPage;
