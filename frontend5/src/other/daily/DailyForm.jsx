import React, { useState } from 'react';
import REST from '../../utils/REST';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../utils/REST';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../../component/snackbar/SnackbarProvider';

import Grid from '@mui/material/Grid';
import {
  Typography,
  Card,
  CardContent,
  Box,
  FormControlLabel,
  Checkbox,
  Button,
  useTheme,
} from '@mui/material';
import { ChecklistRtl } from '@mui/icons-material';

export default function DailyForm() {
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const theme = useTheme();

  const [dailyFields, setDailyFields] = useState({
    smoking: false,
    exercise: false,
    book: false,
    work: false,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () => REST.addDaily(dailyFields),
    onSuccess: () => {
      queryClient.invalidateQueries(['daily-list']);
      showSnackbar(t('common.addedSuccessfully'), 'success');
      setDailyFields({ smoking: false, exercise: false, book: false, work: false });
    },
    onError: () => {
      showSnackbar(t('common.addFailed'), 'error');
    },
    retry: false,
  });

  const handleFormChange = (event) => {
    setDailyFields((prev) => ({
      ...prev,
      [event.target.name]: !prev[event.target.name],
    }));
  };

  return (
    <Box sx={{ py: 2 }}>
      <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            background: theme.palette.card.header,
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <ChecklistRtl sx={{ fontSize: 22 }} />
          <Typography variant="subtitle1" fontWeight="600">
            {t('daily.title')}
          </Typography>
        </Box>

        {/* Form body */}
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <FormControlLabel
                control={<Checkbox checked={dailyFields.smoking} />}
                name="smoking"
                onChange={handleFormChange}
                label={t('daily.smoking')}
              />
              <FormControlLabel
                control={<Checkbox checked={dailyFields.exercise} />}
                name="exercise"
                onChange={handleFormChange}
                label={t('daily.exercise')}
              />
              <FormControlLabel
                control={<Checkbox checked={dailyFields.book} />}
                name="book"
                onChange={handleFormChange}
                label={t('daily.book')}
              />
              <FormControlLabel
                control={<Checkbox checked={dailyFields.work} />}
                name="work"
                onChange={handleFormChange}
                label={t('daily.cloud')}
              />
            </Grid>

            <Grid size={12}>
              <Button
                variant="contained"
                onClick={() => mutate()}
                disabled={isPending}
                sx={{ minWidth: 120 }}
              >
                {isPending ? t('common.saving') : t('messages.submit')}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
