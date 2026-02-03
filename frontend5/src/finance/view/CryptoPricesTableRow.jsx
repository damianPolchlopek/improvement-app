import React from 'react';
import { Typography, Box, Chip } from '@mui/material';
import { TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from '@mui/icons-material';

import StyledTableCell from '../../component/table/StyledTableCell';
import StyledTableRow from '../../component/table/StyledTableRow';

export default function CryptoPricesTableRow({ symbol, coinData, coinDescription }) {
  const coinMarketCapIndex = coinData.cmc_rank;
  const coinPrice = coinData.quote.USD;

  const price = coinPrice.price.toFixed(2);
  const percentChange24h = coinPrice.percent_change_24h.toFixed(2);
  const isPositive24h = percentChange24h >= 0;

  const percentChange7d = coinPrice.percent_change_7d.toFixed(2);
  const isPositive7d = percentChange7d >= 0;

  const percentChange30d = coinPrice.percent_change_30d.toFixed(2);
  const isPositive30d = percentChange30d >= 0;

  const percentChange90d = coinPrice.percent_change_90d.toFixed(2);
  const isPositive90d = percentChange90d >= 0;

  const percentATH = ((price - coinDescription.ath) / coinDescription.ath * 100).toFixed(2);
  const isPositiveATH = percentATH >= 0;

  const renderChangeCell = (percent, isPositive) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {isPositive ? (
        <TrendingUpIcon sx={{ fontSize: 20, color: 'success.main' }} />
      ) : (
        <TrendingDownIcon sx={{ fontSize: 20, color: 'error.main' }} />
      )}
      <Typography 
        variant="body2" 
        fontWeight="600"
        sx={{ color: isPositive ? 'success.main' : 'error.main' }}
      >
        {percent}%
      </Typography>
    </Box>
  );

  return (
    <StyledTableRow sx={{
      '&:hover': {
        backgroundColor: 'action.hover',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      },
      transition: 'all 0.2s ease-in-out'
    }}>
      <StyledTableCell>
        <Chip 
          label={coinMarketCapIndex}
          color="primary"
          size="small"
          sx={{ fontWeight: 'bold' }}
        />
      </StyledTableCell>

      <StyledTableCell>
        <Typography variant="body1" fontWeight="700">
          {symbol}
        </Typography>
      </StyledTableCell>

      <StyledTableCell>
        <Typography variant="body1" fontWeight="600" color="primary">
          ${price}
        </Typography>
      </StyledTableCell>

      <StyledTableCell>
        {renderChangeCell(percentChange24h, isPositive24h)}
      </StyledTableCell>

      <StyledTableCell>
        {renderChangeCell(percentChange7d, isPositive7d)}
      </StyledTableCell>

      <StyledTableCell>
        {renderChangeCell(percentChange30d, isPositive30d)}
      </StyledTableCell>

      <StyledTableCell>
        {renderChangeCell(percentChange90d, isPositive90d)}
      </StyledTableCell>

      <StyledTableCell>
        <Typography variant="body2" color="text.secondary">
          {coinDescription.athDate}
        </Typography>
      </StyledTableCell>

      <StyledTableCell>
        <Typography variant="body2" fontWeight="600">
          ${coinDescription.ath}
        </Typography>
      </StyledTableCell>

      <StyledTableCell>
        {renderChangeCell(percentATH, isPositiveATH)}
      </StyledTableCell>
    </StyledTableRow>
  );
}