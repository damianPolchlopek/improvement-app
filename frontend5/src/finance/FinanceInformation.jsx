import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Stack,
  Divider,
  useTheme,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

import Grid from '@mui/material/Grid';
import { Info, TrendingUp, CalendarToday } from '@mui/icons-material';

import StyledTableCell from '../component/table/StyledTableCell';
import StyledTableRow from '../component/table/StyledTableRow';

export default function FinanceInformation() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box sx={{ py: 4 }}>
      <Grid container spacing={3} sx={{ maxWidth: 1400, mx: 'auto', px: 2 }}>
        {/* Header Section */}
        <Grid size={12}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 3,
              background: theme.palette.card.header,
              color: 'white',
              mb: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Info sx={{ fontSize: 32 }} />
                <Typography variant="h4" fontWeight="600">
                  {t('finance.marketInfo')}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {t('finance.marketInfoDesc')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Historical Cycles Table */}
        <Grid size={12}>
          <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box
              sx={{
                p: 2,
                background: theme.palette.card.header,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <TrendingUp sx={{ fontSize: 22 }} />
              <Typography variant="subtitle1" fontWeight="600">
                {t('finance.btcCycles')}
              </Typography>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
              <Table>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell sx={{ fontWeight: 'bold' }}>-</StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 'bold' }}>2013</StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 'bold' }}>2017</StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 'bold' }}>2021</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  <StyledTableRow>
                    <StyledTableCell sx={{ fontWeight: '600' }}>
                      {t('finance.btcDrops')}
                    </StyledTableCell>
                    <StyledTableCell>86%</StyledTableCell>
                    <StyledTableCell>84%</StyledTableCell>
                    <StyledTableCell>78%</StyledTableCell>
                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledTableCell sx={{ fontWeight: '600' }}>
                      {t('finance.bullCycles')}
                    </StyledTableCell>
                    <StyledTableCell>142</StyledTableCell>
                    <StyledTableCell>152</StyledTableCell>
                    <StyledTableCell>151</StyledTableCell>
                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledTableCell sx={{ fontWeight: '600' }}>
                      {t('finance.bearCycles')}
                    </StyledTableCell>
                    <StyledTableCell>59</StyledTableCell>
                    <StyledTableCell>50</StyledTableCell>
                    <StyledTableCell>52</StyledTableCell>
                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledTableCell sx={{ fontWeight: '600' }}>
                      {t('finance.fullCycles')}
                    </StyledTableCell>
                    <StyledTableCell>201</StyledTableCell>
                    <StyledTableCell>202</StyledTableCell>
                    <StyledTableCell>203</StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Notes */}
        <Grid size={12}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack divider={<Divider />} spacing={2}>
                <Typography variant="body1">{t('finance.note1')}</Typography>
                <Typography variant="body1">{t('finance.note2')}</Typography>
                <Typography variant="body1">{t('finance.note3')}</Typography>
                <Typography variant="body1">{t('finance.note4')}</Typography>
                <Box>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {t('finance.note5')}
                  </Typography>
                  <List dense disablePadding>
                    <ListItem disableGutters>
                      <ListItemText primary={t('finance.note5item1')} />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemText primary={t('finance.note5item2')} />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemText primary={t('finance.note5item3')} />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemText primary={t('finance.note5item4')} />
                    </ListItem>
                  </List>
                </Box>
                <Typography variant="body1">{t('finance.note6')}</Typography>
                <Typography variant="body1">{t('finance.note7')}</Typography>
                <Typography variant="body1">{t('finance.note8')}</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
