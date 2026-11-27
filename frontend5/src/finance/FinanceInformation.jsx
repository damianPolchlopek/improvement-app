import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Info } from '@mui/icons-material';

import FoodPageHeader from '../food/component/FoodPageHeader';
import { HAIRLINE, ROW_LINE, surfaceSx } from '../tokens';

const CYCLE_YEARS = ['2013', '2017', '2021'];
const CYCLE_ROWS = [
  { key: 'btcDrops', values: ['86%', '84%', '78%'] },
  { key: 'bullCycles', values: [142, 152, 151] },
  { key: 'bearCycles', values: [59, 50, 52] },
  { key: 'fullCycles', values: [201, 202, 203] },
];
const NOTES = ['note1', 'note2', 'note3', 'note4', 'note5', 'note6', 'note7', 'note8'];
const NOTE5_ITEMS = ['note5item1', 'note5item2', 'note5item3', 'note5item4'];

function SectionTitle({ children }) {
  return (
    <Box sx={{ px: 2, py: 1.5, borderBottom: HAIRLINE }}>
      <Typography component="h2" sx={{ fontWeight: 500 }}>
        {children}
      </Typography>
    </Box>
  );
}

export default function FinanceInformation() {
  const { t } = useTranslation();

  return (
    <Box sx={{ py: 3, px: 2, maxWidth: 1100, mx: 'auto' }}>
      <FoodPageHeader
        icon={<Info />}
        title={t('finance.marketInfo')}
        description={t('finance.marketInfoDesc')}
        statLabel={t('finance.cyclesLabel')}
        statValue={CYCLE_YEARS.length}
      />

      <Box component="section" sx={{ ...surfaceSx, mb: 3 }}>
        <SectionTitle>{t('finance.btcCycles')}</SectionTitle>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell />
                {CYCLE_YEARS.map((year) => (
                  <TableCell key={year} align="right">
                    {year}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {CYCLE_ROWS.map((row) => (
                <TableRow key={row.key}>
                  <TableCell sx={{ fontWeight: 500 }}>{t(`finance.${row.key}`)}</TableCell>
                  {row.values.map((value, index) => (
                    <TableCell key={CYCLE_YEARS[index]} align="right">
                      {value}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box component="section" sx={surfaceSx}>
        <SectionTitle>{t('finance.notesTitle')}</SectionTitle>
        <Box component="ol" sx={{ m: 0, px: 2, py: 0.5, listStyle: 'none' }}>
          {NOTES.map((note, index) => (
            <Box
              component="li"
              key={note}
              sx={{
                display: 'flex',
                gap: 1.5,
                py: 1.25,
                borderTop: index > 0 ? ROW_LINE : 0,
              }}
            >
              <Box
                component="span"
                sx={{
                  flexShrink: 0,
                  width: 22,
                  height: 22,
                  mt: 0.125,
                  borderRadius: '50%',
                  bgcolor: 'primaryTint.strong',
                  color: 'primary.main',
                  fontSize: 11,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {index + 1}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  {t(`finance.${note}`)}
                </Typography>
                {note === 'note5' && (
                  <Box component="ul" sx={{ m: 0, mt: 0.75, pl: 2.5 }}>
                    {NOTE5_ITEMS.map((item) => (
                      <Typography
                        key={item}
                        component="li"
                        variant="body2"
                        sx={{ color: 'text.secondary', py: 0.25 }}
                      >
                        {t(`finance.${item}`)}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
