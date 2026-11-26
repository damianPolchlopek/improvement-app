import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Box, Button, Skeleton, Tooltip, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { CloudDownload, FitnessCenter, Restaurant, Today } from '@mui/icons-material';

import REST, { queryClient } from '../utils/REST';
import ErrorAlert from '../component/error/ErrorAlert';
import FoodPageHeader from '../food/component/FoodPageHeader';
import { surfaceSx, HAIRLINE } from '../food/component/foodStyles';
import LogComponent from './LogComponent';
import TodayPanel from './TodayPanel';
import ActivityMosaic from './ActivityMosaic';
import { MODULES, MODULE_COLORS, moduleStatus } from './dashboardStatus';

// Pasek postępu dnia: jeden segment na moduł, wypełniony kolorem modułu, gdy zrobiony.
function ProgressSegments({ modules }) {
  const { t } = useTranslation();
  return (
    <Box sx={{ display: 'flex', gap: 0.75, width: '100%' }}>
      {modules.map((module) => (
        <Tooltip key={module.key} title={t(`home.module.${module.key}`)}>
          <Box
            sx={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              bgcolor: module.status.due ? 'rgba(255,255,255,0.08)' : MODULE_COLORS[module.key].dot,
            }}
          />
        </Tooltip>
      ))}
    </Box>
  );
}

function HomeView() {
  const [loadingTrainingModule, setLoadingTrainingModule] = useState(false);
  const [loadingFoodModule, setLoadingFoodModule] = useState(false);
  const { t, i18n } = useTranslation();

  const {
    data: summary,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: REST.getDashboardSummary,
  });

  const modules = summary
    ? MODULES.map((module) => ({
        ...module,
        status: moduleStatus(summary[module.lastField], module.rhythm),
      }))
    : [];
  const doneCount = modules.filter((module) => !module.status.due).length;

  const dateLabel = new Intl.DateTimeFormat(i18n.language, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  function handleClickTrainingModule() {
    setLoadingTrainingModule(true);
    REST.initTrainingModule()
      .catch((error) => {
        console.error('Failed to init training module', error);
      })
      .finally(() => {
        setLoadingTrainingModule(false);
        // Import podmienia dane — odśwież panel
        queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      });
  }

  function handleClickFoodModule() {
    setLoadingFoodModule(true);
    REST.initFoodModule()
      .catch((error) => {
        console.error('Failed to init food module', error);
      })
      .finally(() => {
        setLoadingFoodModule(false);
        queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      });
  }

  return (
    <Box sx={{ py: 3, px: 2, maxWidth: 1200, mx: 'auto' }}>
      <FoodPageHeader
        icon={<Today />}
        title={
          <Box component="span" sx={{ '&::first-letter': { textTransform: 'uppercase' } }}>
            {dateLabel}
          </Box>
        }
        description={
          summary
            ? doneCount === modules.length
              ? t('home.allDone')
              : t('home.todayProgress', { done: doneCount, total: modules.length })
            : t('messages.loading')
        }
        statLabel={t('home.today')}
        statValue={`${doneCount}/${MODULES.length}`}
        statLoading={isLoading}
      >
        {summary ? (
          <ProgressSegments modules={modules} />
        ) : (
          <Skeleton variant="rounded" height={6} sx={{ width: '100%' }} />
        )}
      </FoodPageHeader>

      {isError && (
        <Box sx={{ mb: 3 }}>
          <ErrorAlert error={error} />
        </Box>
      )}

      {isLoading && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {MODULES.map((module) => (
            <Grid key={module.key} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Skeleton variant="rounded" height={236} sx={{ borderRadius: 2.5 }} />
            </Grid>
          ))}
        </Grid>
      )}

      {summary && (
        <>
          <TodayPanel modules={modules} summary={summary} />
          <ActivityMosaic summary={summary} />
        </>
      )}

      {/* Import działa też wtedy, gdy podsumowanie się nie wczytało */}
      <Box component="section" sx={surfaceSx}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1.5,
            px: 2.5,
            py: 1.5,
            borderBottom: HAIRLINE,
          }}
        >
          <CloudDownload fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography component="h2" sx={{ fontWeight: 500, flex: 1, minWidth: 160 }}>
            {t('home.importTitle')}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FitnessCenter />}
            onClick={handleClickTrainingModule}
            loading={loadingTrainingModule}
            sx={{ textTransform: 'none' }}
          >
            {t('home.importTraining')}
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Restaurant />}
            onClick={handleClickFoodModule}
            loading={loadingFoodModule}
            sx={{ textTransform: 'none' }}
          >
            {t('home.importFood')}
          </Button>
        </Box>
        <Box sx={{ px: 2.5, py: 1.5 }}>
          <LogComponent />
        </Box>
      </Box>
    </Box>
  );
}

export default HomeView;
