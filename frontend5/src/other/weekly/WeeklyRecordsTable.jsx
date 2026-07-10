import React from 'react';
import {
  Card,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import StyledTableCell from '../../component/table/StyledTableCell';
import StyledTableRow from '../../component/table/StyledTableRow';
import WeeklyRecordTableRow from './WeeklyRecordTableRow';
import { useTranslation } from 'react-i18next';

export default function WeeklyRecordsTable({ records }) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
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
        <TrendingUp sx={{ fontSize: 22 }} />
        <Typography variant="subtitle1" fontWeight="600">
          {t('weekly.recordsList')}
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>{t('weekly.name')}</StyledTableCell>
              <StyledTableCell>{t('weekly.date')}</StyledTableCell>
              <StyledTableCell>{t('weekly.actions')}</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {records.length > 0 ? (
              records.map((record, index) => (
                <WeeklyRecordTableRow key={record.id || index} record={record} />
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={4} align="center">
                  <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                    {t('weekly.noRecords')}
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
