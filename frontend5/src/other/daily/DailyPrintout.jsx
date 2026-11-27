import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Box,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { Check, DeleteOutlined, EventBusy } from '@mui/icons-material';

import REST, { queryClient } from '../../utils/REST';
import ErrorAlert from '../../component/error/ErrorAlert';
import { useSnackbar } from '../../component/snackbar/SnackbarProvider';
import { HAIRLINE, surfaceSx } from '../../tokens';
import ConfirmDeleteDialog from '../component/ConfirmDeleteDialog';
import { DAILY_HABITS, otherTableSx, parseApiDate } from '../component/otherStyles';

function HabitCell({ done, habit }) {
  return (
    <TableCell align="center">
      {done ? (
        <Box
          component="span"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 24,
            height: 24,
            borderRadius: '50%',
            bgcolor: habit.bg,
            color: habit.text,
          }}
        >
          <Check sx={{ fontSize: 16 }} aria-label="✓" />
        </Box>
      ) : (
        <Box component="span" sx={{ color: 'text.disabled' }} aria-label="—">
          —
        </Box>
      )}
    </TableCell>
  );
}

// Historia dziennika: data, nawyki (✓ / —), wynik dnia i usuwanie z potwierdzeniem.
export default function DailyPrintout({ query, page, size, onPageChange, onSizeChange }) {
  const { t, i18n } = useTranslation();
  const { showSnackbar } = useSnackbar();
  // Wpis czekający na potwierdzenie usunięcia (historii nie da się odtworzyć, więc pytamy)
  const [toDelete, setToDelete] = useState(null);
  const { data, isLoading, isError, error } = query;
  const locale = i18n.language === 'en' ? 'en-GB' : 'pl-PL';

  const { mutate: deleteDaily, isPending: isDeleting } = useMutation({
    mutationFn: (daily) => REST.deleteDaily(daily.id),
    onSuccess: (_, daily) => {
      queryClient.invalidateQueries({ queryKey: ['daily-list'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      showSnackbar(t('daily.deleteSuccess', { date: daily.date }), 'success');
    },
    onError: (_, daily) => {
      showSnackbar(t('daily.deleteError', { date: daily.date }), 'error');
    },
    onSettled: () => setToDelete(null),
    retry: false,
  });

  if (isError) {
    return <ErrorAlert error={error} />;
  }

  const entries = data?.content ?? [];

  return (
    <Box component="section" sx={surfaceSx}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 1,
          px: 2,
          py: 1.5,
          borderBottom: HAIRLINE,
        }}
      >
        <Typography component="h2" sx={{ fontWeight: 500 }}>
          {t('daily.history')}
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ px: 2, py: 1 }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} height={44} />
          ))}
        </Box>
      ) : entries.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <EventBusy sx={{ fontSize: 40, mb: 1, opacity: 0.6 }} />
          <Typography>{t('daily.noEntries')}</Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table size="small" sx={otherTableSx}>
            <TableHead>
              <TableRow>
                <TableCell>{t('daily.date')}</TableCell>
                {DAILY_HABITS.map((habit) => (
                  <TableCell key={habit.key} align="center">
                    {t(`daily.${habit.key}`)}
                  </TableCell>
                ))}
                <TableCell align="right">{t('daily.score')}</TableCell>
                <TableCell align="right" sx={{ width: 56 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((daily, index) => {
                const date = parseApiDate(daily.date);
                const score = DAILY_HABITS.filter((habit) => daily[habit.key]).length;
                return (
                  <TableRow key={daily.id || index}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                        {daily.date}
                      </Typography>
                      {date && (
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {date.toLocaleDateString(locale, { weekday: 'long' })}
                        </Typography>
                      )}
                    </TableCell>
                    {DAILY_HABITS.map((habit) => (
                      <HabitCell key={habit.key} habit={habit} done={Boolean(daily[habit.key])} />
                    ))}
                    <TableCell
                      align="right"
                      sx={{
                        fontVariantNumeric: 'tabular-nums',
                        color: score === DAILY_HABITS.length ? 'status.done' : 'text.secondary',
                        fontWeight: score === DAILY_HABITS.length ? 500 : 400,
                      }}
                    >
                      {score}/{DAILY_HABITS.length}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={t('common.delete')}>
                        <IconButton
                          aria-label={t('common.delete')}
                          size="small"
                          onClick={() => setToDelete(daily)}
                          disabled={isDeleting}
                          sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                        >
                          <DeleteOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!isLoading && (
        <TablePagination
          component="div"
          size="small"
          rowsPerPageOptions={[5, 10, 25]}
          count={data?.totalElements || 0}
          rowsPerPage={size}
          page={page}
          onPageChange={(event, newPage) => onPageChange(newPage)}
          onRowsPerPageChange={(event) => onSizeChange(+event.target.value)}
          sx={{ borderTop: HAIRLINE }}
        />
      )}

      <ConfirmDeleteDialog
        open={toDelete !== null}
        title={t('daily.deleteConfirmTitle')}
        text={t('daily.deleteConfirmText', { date: toDelete?.date })}
        pending={isDeleting}
        onCancel={() => setToDelete(null)}
        onConfirm={() => deleteDaily(toDelete)}
      />
    </Box>
  );
}
