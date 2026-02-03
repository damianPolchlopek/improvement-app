import React, { useState } from 'react';
import {
  Card,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  Box,
  Typography,
  useTheme
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
    <Card elevation={8} sx={{ borderRadius: 4, overflow: 'hidden' }}>
      <Box sx={{
        p: 3,
        background: theme.palette.card.header,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <TrendingUp sx={{ fontSize: 28 }} />
        <Typography variant="h5" fontWeight="600">
          Lista Rekordów
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Nazwa</StyledTableCell>
              <StyledTableCell>Data</StyledTableCell>
              <StyledTableCell>Akcje</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {records.length > 0 ? (
              records.map((record, index) => (
                <WeeklyRecordTableRow
                  key={record.id || index}
                  record={record}
                />
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={4} align="center">
                  <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                    Brak rekordów tygodniowych
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