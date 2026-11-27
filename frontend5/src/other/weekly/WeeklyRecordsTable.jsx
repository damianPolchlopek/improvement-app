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
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { DeleteOutlined, PlaylistRemove } from '@mui/icons-material';

import REST, { queryClient } from '../../utils/REST';
import { useSnackbar } from '../../component/snackbar/SnackbarProvider';
import { surfaceSx, HAIRLINE } from '../../food/component/foodStyles';
import ConfirmDeleteDialog from '../component/ConfirmDeleteDialog';
import { otherTableSx } from '../component/otherStyles';

// Rekordy wybranej kategorii – rekord po rekordzie, usuwanie z potwierdzeniem.
export default function WeeklyRecordsTable({ records, category, isLoading }) {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [toDelete, setToDelete] = useState(null);

  const { mutate, isPending } = useMutation({
    mutationFn: (record) => REST.deleteProductFromWeeklyList(record.id),
    onSuccess: (_, record) => {
      queryClient.invalidateQueries({ queryKey: ['weekly-records'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      showSnackbar(t('weekly.deleteSuccess', { name: record.name }), 'success');
    },
    onError: (_, record) => {
      showSnackbar(t('weekly.deleteError', { name: record.name }), 'error');
    },
    onSettled: () => setToDelete(null),
    retry: false,
  });

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
          {category || t('weekly.recordsList')}
        </Typography>
        {!isLoading && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            · {t('weekly.recordsCount', { count: records.length })}
          </Typography>
        )}
      </Box>

      {isLoading ? (
        <Box sx={{ px: 2, py: 1 }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} height={44} />
          ))}
        </Box>
      ) : records.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <PlaylistRemove sx={{ fontSize: 40, mb: 1, opacity: 0.6 }} />
          <Typography>{t('weekly.noRecords')}</Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table size="small" sx={otherTableSx}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 32 }}>#</TableCell>
                <TableCell>{t('weekly.name')}</TableCell>
                <TableCell>{t('weekly.date')}</TableCell>
                <TableCell align="right" sx={{ width: 56 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record, index) => (
                <TableRow key={record.id || index}>
                  <TableCell sx={{ color: 'text.secondary' }}>{index + 1}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{record.name}</TableCell>
                  <TableCell
                    sx={{
                      color: 'text.secondary',
                      whiteSpace: 'nowrap',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {record.date}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('weekly.delete')}>
                      <IconButton
                        aria-label={t('weekly.delete')}
                        size="small"
                        onClick={() => setToDelete(record)}
                        disabled={isPending}
                        sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                      >
                        <DeleteOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ConfirmDeleteDialog
        open={toDelete !== null}
        title={t('weekly.confirmTitle')}
        text={t('weekly.confirmDeleteRecord')}
        pending={isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => mutate(toDelete)}
        details={
          toDelete && (
            <>
              <Typography variant="body2">
                {t('weekly.name')}: <strong>{toDelete.name}</strong>
              </Typography>
              <Typography variant="body2">
                {t('weekly.category')}: <strong>{toDelete.category}</strong>
              </Typography>
              <Typography variant="body2">
                {t('weekly.date')}: <strong>{toDelete.date}</strong>
              </Typography>
            </>
          )
        }
      />
    </Box>
  );
}
