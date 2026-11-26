import React, { useMemo, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Box, Chip, Skeleton, TablePagination, Typography } from '@mui/material';
import { FitnessCenter, FilterAltOff } from '@mui/icons-material';

import REST from '../../utils/REST';
import SingleTraining from './SingleTraining';
import ErrorAlert from '../../component/error/ErrorAlert';
import FoodPageHeader from '../../food/component/FoodPageHeader';
import { surfaceSx, HAIRLINE } from '../../food/component/foodStyles';
import {
  TYPE_GROUPS,
  groupByWeek,
  isoWeek,
  localeOf,
  parseTrainingName,
  typeGroup,
} from './trainingWeeks';

const ALL = 'all';

function WeekHeader({ monday, trainings, first }) {
  const { t, i18n } = useTranslation();
  const locale = localeOf(i18n.language);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const dayMonth = (date) => date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  const range =
    monday.getMonth() === sunday.getMonth()
      ? `${monday.getDate()}–${dayMonth(sunday)}`
      : `${dayMonth(monday)} – ${dayMonth(sunday)}`;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1.25,
        px: 2,
        pt: first ? 1.5 : 1.75,
        pb: 0.75,
        borderTop: first ? 0 : HAIRLINE,
      }}
    >
      <Typography component="h2" sx={{ fontSize: 14, fontWeight: 500 }}>
        {t('training.weekNumber', { n: isoWeek(monday) })}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {range} {sunday.getFullYear()} · {t('training.weekTrainings', { count: trainings.length })}
      </Typography>
    </Box>
  );
}

// Widok treningów: tygodnie z paskiem dni, rozwijane treningi i filtr typu.
export default function TrainingsView() {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(25);
  const [groupFilter, setGroupFilter] = useState(ALL);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['training-names', page, size],
    queryFn: () => REST.getAllTrainingNames(page, size),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minut
    gcTime: 1000 * 60 * 10, // trzymanie danych w cache przez 10 minut
  });

  const trainings = useMemo(() => (data?.content ?? []).map(parseTrainingName), [data]);
  // Filtr typu działa na bieżącej stronie – backend zwraca same nazwy treningów.
  const weeks = useMemo(
    () =>
      groupByWeek(
        groupFilter === ALL
          ? trainings
          : trainings.filter((tr) => typeGroup(tr.type).key === groupFilter)
      ),
    [trainings, groupFilter]
  );

  const handleChangeSize = (event) => {
    setSize(+event.target.value);
    setPage(0);
  };

  const filterChip = (key, label, group) => {
    const active = groupFilter === key;
    return (
      <Chip
        key={key}
        label={label}
        clickable
        variant={active ? 'filled' : 'outlined'}
        color={active && !group ? 'primary' : 'default'}
        aria-pressed={active}
        onClick={() => setGroupFilter(key)}
        icon={
          group ? (
            <Box
              component="span"
              sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: group.dot }}
            />
          ) : undefined
        }
        sx={{
          fontWeight: active ? 600 : 400,
          '& .MuiChip-icon': { ml: 1.25, mr: -0.25 },
          ...(active && group
            ? { bgcolor: group.bg, color: group.text, '&:hover': { bgcolor: group.bg } }
            : {}),
        }}
      />
    );
  };

  return (
    <Box sx={{ py: 3, px: 2, maxWidth: 1100, mx: 'auto' }}>
      <FoodPageHeader
        icon={<FitnessCenter />}
        title={t('messages.trainingView')}
        description={t('training.trainingsDesc')}
        statLabel={t('training.trainingsLabel')}
        statValue={data?.totalElements ?? 0}
        statLoading={isLoading}
      >
        {filterChip(ALL, t('training.allTypes'))}
        {TYPE_GROUPS.map((group) =>
          filterChip(group.key, t(`training.typeGroups.${group.key}`), group)
        )}
      </FoodPageHeader>

      {isError ? (
        <ErrorAlert error={error} />
      ) : isLoading ? (
        <Box sx={{ ...surfaceSx, p: 2 }}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} height={44} />
          ))}
        </Box>
      ) : trainings.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <FitnessCenter sx={{ fontSize: 40, mb: 1, opacity: 0.6 }} />
          <Typography>{t('training.noTrainings')}</Typography>
        </Box>
      ) : (
        <Box sx={surfaceSx}>
          {weeks.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
              <FilterAltOff sx={{ fontSize: 36, mb: 1, opacity: 0.6 }} />
              <Typography variant="body2">{t('training.noTrainingsOfType')}</Typography>
            </Box>
          ) : (
            weeks.map((week, index) => (
              <Box key={week.key} component="section" sx={{ pb: 0.5 }}>
                {week.monday && (
                  <WeekHeader monday={week.monday} trainings={week.trainings} first={index === 0} />
                )}
                {week.trainings.map((training) => (
                  <SingleTraining key={training.name} training={training} />
                ))}
              </Box>
            ))
          )}

          <TablePagination
            component="div"
            size="small"
            rowsPerPageOptions={[10, 25, 50]}
            count={data?.totalElements || 0}
            rowsPerPage={size}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={handleChangeSize}
            sx={{ borderTop: HAIRLINE }}
          />
        </Box>
      )}
    </Box>
  );
}
