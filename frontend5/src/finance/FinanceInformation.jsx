import React from 'react';

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
  useTheme,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';
import { Info, TrendingUp, CalendarToday } from '@mui/icons-material';

import StyledTableCell from '../component/table/StyledTableCell';
import StyledTableRow from '../component/table/StyledTableRow';

export default function FinanceInformation() {
  const theme = useTheme();

  return (
    <Box sx={{ py: 4 }}>
      <Grid container spacing={3} sx={{ maxWidth: 1400, mx: 'auto', px: 2 }}>

        {/* Header Section */}
        <Grid xs={12}>
          <Card elevation={6} sx={{
            borderRadius: 3,
            background: theme.palette.card.header,
            color: 'white',
            mb: 2
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Info sx={{ fontSize: 32 }} />
                <Typography variant="h4" fontWeight="600">
                  Informacje o Rynku Krypto
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Historyczne dane i kluczowe informacje o cyklach bitcoina
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Historical Cycles Table */}
        <Grid xs={12}>
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
                Historyczne Cykle BTC
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
                    <StyledTableCell sx={{ fontWeight: '600' }}>Spadki % BTC</StyledTableCell>
                    <StyledTableCell>86%</StyledTableCell>
                    <StyledTableCell>84%</StyledTableCell>
                    <StyledTableCell>78%</StyledTableCell>
                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledTableCell sx={{ fontWeight: '600' }}>Cykle wzrostowe [tygodnie]</StyledTableCell>
                    <StyledTableCell>142</StyledTableCell>
                    <StyledTableCell>152</StyledTableCell>
                    <StyledTableCell>151</StyledTableCell>
                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledTableCell sx={{ fontWeight: '600' }}>Cykle spadkowe [tygodnie]</StyledTableCell>
                    <StyledTableCell>59</StyledTableCell>
                    <StyledTableCell>50</StyledTableCell>
                    <StyledTableCell>52</StyledTableCell>
                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledTableCell sx={{ fontWeight: '600' }}>Wzrosty i spadki [tygodnie]</StyledTableCell>
                    <StyledTableCell>201</StyledTableCell>
                    <StyledTableCell>202</StyledTableCell>
                    <StyledTableCell>203</StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Info Cards */}
        <Grid xs={12} md={6}>
          <Card elevation={6} sx={{
            height: '100%',
            borderRadius: 3,
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body1">
                Dołek zazwyczaj jest 365 dni po górce
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card elevation={6} sx={{
            height: '100%',
            borderRadius: 3,
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body1">
                Wzrosty zaczynają się: - 1 - 1.5 rok przed halvingiem - wzrosty trwają do około roku po halvingu
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card elevation={6} sx={{
            height: '100%',
            borderRadius: 3,
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body1">
                Następny halving około Kwiecień 2024
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card elevation={6} sx={{
            height: '100%',
            borderRadius: 3,
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body1">
                Decyzja o wprowadzeniu ETF na BTC przez BlackRock około luty 2024
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card elevation={6} sx={{
            height: '100%',
            borderRadius: 3,
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Istotne katalizatory zmian sentymentu w ciągu kolejnych 12 miesięcy, które zbiegną się w czasie z halvingiem to m.in.:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="rozprawa sądowa między SEC a Grayscale w sierpniu 2023" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="decyzje dotyczące ETF spot ArkInvest we wrześniu 2023" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="rozwiązanie sprawy Ripple również we wrześniu 2023" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="decyzje dotyczące wniosków BlackRock i Fidelity w marcu 2024" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card elevation={6} sx={{
            height: '100%',
            borderRadius: 3,
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body1">
                Krypto rozważane przez SEC za security: BNB, XRP, ADA, SOL, MATIC, ATOM, NEAR, SAND, ALGO, MANA
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card elevation={6} sx={{
            height: '100%',
            borderRadius: 3,
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body1">
                PlanB: BTC najlepiej kupić 6 miesięcy przed Halvingiem, a najlepiej sprzedać 18 miesięcy po halvingu.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card elevation={6} sx={{
            height: '100%',
            borderRadius: 3,
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body1">
                Jarzombek: TENET - token z Re-Staking. Pokazuje to jak silna może stać się narracja na projekty oferujące Re-Staking, które z czasem mogą doświadczyć znacznych wzrostów.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
}