import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import Grid from '@mui/material/Grid';
import { Box, Button, Card, Chip, TextField, Typography } from '@mui/material';
import {
  Check as CheckIcon,
  FitnessCenter,
  MonitorWeight,
  Restaurant,
  Schedule,
  TaskAlt,
} from '@mui/icons-material';

import REST, { queryClient } from '../utils/REST';
import { useSnackbar } from '../component/snackbar/SnackbarProvider';
import { FoodAddUrl, TrainingAddUrl } from '../utils/URLHelper';
import { MODULE_COLORS } from './dashboardStatus';
import { ROW_LINE } from '../tokens';

const DATE_FORMAT = 'DD-MM-YYYY';
const DAILY_FIELDS = ['health', 'exercise', 'book', 'software'];
const WEIGHT_PATTERN = /^\d+([.,]\d+)?$/;

// Wystarcza na najwyższą akcję (pole wagi z komunikatem błędu + przycisk).
const TILE_MIN_HEIGHT = 236;

const ICONS = {
  diet: <Restaurant fontSize="small" />,
  training: <FitnessCenter fontSize="small" />,
  daily: <TaskAlt fontSize="small" />,
  weekly: <MonitorWeight fontSize="small" />,
};

// Każdy moduł ma stałe miejsce: zaległy pokazuje akcję, wykonany tylko kolejny termin
function ModuleTile({ moduleKey, status, rhythm, lastDate, children }) {
  const { t } = useTranslation();
  const colors = MODULE_COLORS[moduleKey];

  let caption = t('home.noEntries');
  if (!status.due) {
    caption =
      status.days === 0
        ? t('home.savedToday')
        : t('home.doneNext', {
            last: dayjs(lastDate).format(DATE_FORMAT),
            next: status.next.format(DATE_FORMAT),
          });
  } else if (status.days !== null) {
    if (rhythm === 1) caption = t('home.daysWithoutEntry', { count: status.days });
    else if (status.overdue > 0) caption = t('home.overdueDays', { count: status.overdue });
    else caption = t('home.dueToday');
  }

  return (
    <Card
      elevation={0}
      component="section"
      aria-label={t(`home.module.${moduleKey}`)}
      sx={{
        p: 2,
        height: '100%',
        // Stała wysokość: kafle są równe niezależnie od tego, czy pokazują akcję.
        minHeight: TILE_MIN_HEIGHT,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2.5,
        bgcolor: 'surface.tile',
        border: '1px solid',
        borderColor: status.due ? 'status.dueBorder' : 'line.hairline',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            borderRadius: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: colors.bg,
            color: colors.text,
          }}
        >
          {ICONS[moduleKey]}
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography sx={{ fontWeight: 500, lineHeight: 1.3 }}>
            {t(`home.module.${moduleKey}`)}
          </Typography>
          <Typography
            variant="caption"
            component="div"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: status.due ? 'status.due' : 'status.done',
            }}
          >
            {status.due ? <Schedule sx={{ fontSize: 14 }} /> : <CheckIcon sx={{ fontSize: 14 }} />}
            {caption}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: status.due ? 'flex-start' : 'center',
          mt: 2,
          pt: 1.5,
          borderTop: ROW_LINE,
        }}
      >
        {status.due ? (
          children
        ) : (
          <Typography
            variant="body2"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.75,
              color: 'text.secondary',
            }}
          >
            <CheckIcon sx={{ fontSize: 18, color: 'status.done' }} />
            {t('home.nothingToDo')}
          </Typography>
        )}
      </Box>
    </Card>
  );
}

function DailyAction() {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [fields, setFields] = useState({});

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      REST.addDaily({
        date: dayjs().format(DATE_FORMAT),
        ...Object.fromEntries(DAILY_FIELDS.map((field) => [field, Boolean(fields[field])])),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      queryClient.invalidateQueries({ queryKey: ['daily-list'] });
      showSnackbar(t('common.addedSuccessfully'), 'success');
    },
    onError: () => showSnackbar(t('common.addFailed'), 'error'),
    retry: false,
  });

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.5 }}>
        {DAILY_FIELDS.map((field) => (
          <Chip
            key={field}
            label={t(`daily.${field}`)}
            size="small"
            color={fields[field] ? 'success' : 'default'}
            variant={fields[field] ? 'filled' : 'outlined'}
            onClick={() => setFields((prev) => ({ ...prev, [field]: !prev[field] }))}
          />
        ))}
      </Box>
      <Button size="small" variant="outlined" onClick={() => mutate()} disabled={isPending}>
        {t('home.saveToday')}
      </Button>
    </>
  );
}

function WeeklyAction() {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [weight, setWeight] = useState('');
  const [invalid, setInvalid] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => REST.addRecordToWeeklyList({ name: weight.trim(), category: 'Waga' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-records'] });
      showSnackbar(t('weekly.addSuccess'), 'success');
    },
    onError: () => showSnackbar(t('weekly.addError'), 'error'),
    retry: false,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!WEIGHT_PATTERN.test(weight.trim())) {
      setInvalid(true);
      return;
    }
    mutate();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <TextField
        size="small"
        fullWidth
        label={t('home.weightKg')}
        value={weight}
        error={invalid}
        helperText={invalid ? t('home.weightInvalid') : undefined}
        slotProps={{ htmlInput: { inputMode: 'decimal' } }}
        onChange={(event) => {
          setWeight(event.target.value);
          setInvalid(false);
        }}
        sx={{ mb: 1.5, '& .MuiInputBase-root': { bgcolor: 'surface.field' } }}
      />
      <Button type="submit" size="small" variant="outlined" disabled={isPending}>
        {t('home.saveWeight')}
      </Button>
    </Box>
  );
}

function LinkAction({ to, label }) {
  return (
    <Button component={RouterLink} to={to} size="small" variant="outlined">
      {label}
    </Button>
  );
}

// Kafle modułów na dziś (status liczy HomeView – potrzebuje go też nagłówek).
export default function TodayPanel({ modules, summary }) {
  const { t } = useTranslation();

  const actions = {
    daily: <DailyAction />,
    weekly: <WeeklyAction />,
    diet: <LinkAction to={FoodAddUrl} label={t('home.addDay')} />,
    training: <LinkAction to={TrainingAddUrl} label={t('home.addTraining')} />,
  };

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {modules.map((module) => (
        <Grid key={module.key} size={{ xs: 12, sm: 6, lg: 3 }}>
          <ModuleTile
            moduleKey={module.key}
            status={module.status}
            rhythm={module.rhythm}
            lastDate={summary[module.lastField]}
          >
            {actions[module.key]}
          </ModuleTile>
        </Grid>
      ))}
    </Grid>
  );
}
