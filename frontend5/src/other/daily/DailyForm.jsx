import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Box, Button, Chip, CircularProgress, Typography } from '@mui/material';
import { Check, Save } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import REST, { queryClient } from '../../utils/REST';
import { useSnackbar } from '../../component/snackbar/SnackbarProvider';
import { surfaceSx } from '../../food/component/foodStyles';
import { DAILY_HABITS, fieldSx } from '../component/otherStyles';

// Ten sam format co w historii wpisów i w API (dd-MM-yyyy)
const DATE_FORMAT = 'DD-MM-YYYY';
const EMPTY = { health: false, exercise: false, book: false, software: false };

export default function DailyForm() {
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  // Domyślnie dzisiaj; po zapisie data zostaje, żeby łatwo uzupełniać kolejne dni wstecz
  const [date, setDate] = useState(() => dayjs());
  const [dailyFields, setDailyFields] = useState(EMPTY);

  const { mutate, isPending } = useMutation({
    mutationFn: () => REST.addDaily({ ...dailyFields, date: date.format(DATE_FORMAT) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-list'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      showSnackbar(t('common.addedSuccessfully'), 'success');
      setDailyFields(EMPTY);
    },
    onError: () => {
      showSnackbar(t('common.addFailed'), 'error');
    },
    retry: false,
  });

  const toggle = (key) => setDailyFields((prev) => ({ ...prev, [key]: !prev[key] }));
  const doneCount = DAILY_HABITS.filter((habit) => dailyFields[habit.key]).length;

  return (
    <Box
      component="section"
      aria-label={t('daily.addEntry')}
      sx={{
        ...surfaceSx,
        mb: 3,
        p: { xs: 2, md: 2.5 },
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={t('daily.date')}
          value={date}
          onChange={(newDate) => setDate(newDate)}
          format={DATE_FORMAT}
          disableFuture
          slotProps={{ textField: { size: 'small', sx: { ...fieldSx, width: 170 } } }}
        />
      </LocalizationProvider>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, flex: '1 1 320px' }}>
        {DAILY_HABITS.map((habit) => {
          const active = dailyFields[habit.key];
          return (
            <Chip
              key={habit.key}
              label={t(`daily.${habit.key}`)}
              clickable
              variant={active ? 'filled' : 'outlined'}
              aria-pressed={active}
              onClick={() => toggle(habit.key)}
              icon={
                active ? (
                  <Check sx={{ fontSize: 16 }} />
                ) : (
                  <Box
                    component="span"
                    sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: habit.dot }}
                  />
                )
              }
              sx={{
                fontWeight: active ? 600 : 400,
                '& .MuiChip-icon': { ml: 1.25, mr: -0.25, color: 'inherit' },
                ...(active
                  ? { bgcolor: habit.bg, color: habit.text, '&:hover': { bgcolor: habit.bg } }
                  : {}),
              }}
            />
          );
        })}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: { md: 'auto' } }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
          {doneCount}/{DAILY_HABITS.length}
        </Typography>
        <Button
          variant="contained"
          onClick={() => mutate()}
          disabled={isPending || !date?.isValid()}
          startIcon={isPending ? <CircularProgress size={18} color="inherit" /> : <Save />}
        >
          {isPending ? t('common.saving') : t('daily.save')}
        </Button>
      </Box>
    </Box>
  );
}
