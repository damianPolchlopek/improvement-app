import React from 'react';
import { Box, TableCell, TableRow, Typography } from '@mui/material';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';

import { DOWN_COLOR, UP_COLOR } from '../financeStyles';

const usd = (value) =>
  Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: value < 1 ? 4 : 2,
  });

// Zmiana procentowa: ▲ 2,15% na zielono / ▼ 3,40% na czerwono.
function ChangeCell({ percent }) {
  const positive = percent >= 0;
  const Icon = positive ? ArrowDropUp : ArrowDropDown;
  return (
    <TableCell align="right">
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          color: positive ? UP_COLOR : DOWN_COLOR,
          whiteSpace: 'nowrap',
          fontSize: 14,
        }}
      >
        <Icon fontSize="small" sx={{ mr: -0.25 }} aria-label={positive ? '▲' : '▼'} />
        {Math.abs(percent).toFixed(2)}%
      </Box>
    </TableCell>
  );
}

export default function CryptoPricesTableRow({ symbol, coinData, coinDescription }) {
  const coinPrice = coinData.quote.USD;
  const price = coinPrice.price;
  const percentATH = ((price - coinDescription.ath) / coinDescription.ath) * 100;

  return (
    <TableRow>
      <TableCell sx={{ color: 'text.secondary', width: 40 }}>{coinData.cmc_rank}</TableCell>
      <TableCell sx={{ fontWeight: 500 }}>{symbol}</TableCell>
      <TableCell align="right">
        <Typography component="span" variant="body2" sx={{ fontWeight: 500 }}>
          ${usd(price)}
        </Typography>
      </TableCell>
      <ChangeCell percent={coinPrice.percent_change_24h} />
      <ChangeCell percent={coinPrice.percent_change_7d} />
      <ChangeCell percent={coinPrice.percent_change_30d} />
      <ChangeCell percent={coinPrice.percent_change_90d} />
      <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
        {coinDescription.athDate}
      </TableCell>
      <TableCell align="right" sx={{ color: 'text.secondary' }}>
        ${usd(coinDescription.ath)}
      </TableCell>
      <ChangeCell percent={percentATH} />
    </TableRow>
  );
}
