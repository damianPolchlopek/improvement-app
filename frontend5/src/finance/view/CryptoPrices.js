import React, { useEffect, useState } from 'react';
import REST from '../../utils/REST';

import { Box, CircularProgress, Typography } from '@mui/material';
import { TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from '@mui/icons-material';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2/Grid2';


function datediff(first, second) {        
  return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

function calculateDays(prevDate) {
  let newDate = new Date();
  var mdy = prevDate.split('-');
  var firstDate = new Date(mdy[0], mdy[1], mdy[2]);
  var result = datediff(firstDate, newDate)

  return result
}

const CryptoPrices = () => {
  const [cryptoData, setCryptoData] = useState(null);
  const [cryptoDescription, setCryptoDescription] = useState(null);
  const [loading, setLoading] = useState(true);

  var coinList = ["BTC", "ETH", "BNB", "ADA", "SOL", "MATIC", "DOT", "AVAX", "ATOM", "ARB", "SYN"]

  useEffect(() => {
    REST.getFinanceCryptoPrice(coinList.join(","), "USD").then(response => {
      console.log(response.data)
      setCryptoData(response.data);
      setLoading(false)
    });

    REST.getFinanceCryptoDescription().then(response => {
      setCryptoDescription(response);
      setLoading(false)
    });
  }, []);


  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box p={3}>
      <Typography variant="h3" mb={3}>
        Crypto Prices
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Change 24h</TableCell>
            <TableCell>Change 7d</TableCell>
            <TableCell>Change 30d</TableCell>
            <TableCell>Change 90d</TableCell>
            <TableCell>ATH Date</TableCell>
            <TableCell>ATH</TableCell>
            <TableCell>Grown From ATH</TableCell>
          </TableRow>
        </TableHead>

      <TableBody>
        {cryptoData !== null && cryptoDescription !== null && coinList.map((symbol, index) => {

        const coinMarketCapIndex = cryptoData[symbol.toString()].cmc_rank;

        const coinPrice = cryptoData[symbol].quote.USD;

        const price = coinPrice.price.toFixed(2);
        const percentChange24h = coinPrice.percent_change_24h.toFixed(2);
        const isPositive24h = percentChange24h >= 0;

        const percentChange7d = coinPrice.percent_change_7d.toFixed(2);
        const isPositive7d = percentChange7d >= 0;

        const percentChange30d = coinPrice.percent_change_30d.toFixed(2);
        const isPositive30d = percentChange30d >= 0;

        const percentChange90d = coinPrice.percent_change_90d.toFixed(2);
        const isPositive90d = percentChange90d >= 0;

        const coinATH = cryptoDescription[symbol];
        const percentATH = ((price - coinATH.ath) / coinATH.ath * 100).toFixed(2)
        const isPositiveATH = percentATH >= 0;

          return (
            <TableRow>
              <TableCell>{coinMarketCapIndex}</TableCell>
              <TableCell>{symbol}</TableCell>
              <TableCell>
                <Typography component="span" variant="subtitle1">
                  ${price}
                </Typography> 
              </TableCell>
              <TableCell>
                <Typography component="span" variant="body2" sx={{ color: isPositive24h ? 'green' : 'red' }}>
                  {isPositive24h ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  {percentChange24h}%
                </Typography>
              </TableCell>
              <TableCell>
                <Typography component="span" variant="body2" sx={{ color: isPositive7d ? 'green' : 'red' }}>
                  {isPositive7d ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  {percentChange7d}%
                </Typography>
              </TableCell>
              <TableCell>
                <Typography component="span" variant="body2" sx={{ color: isPositive30d ? 'green' : 'red' }}>
                  {isPositive30d ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  {percentChange30d}%
                </Typography>
              </TableCell>
              <TableCell>
                <Typography component="span" variant="body2" sx={{ color: isPositive90d ? 'green' : 'red' }}>
                  {isPositive90d ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  {percentChange90d}%
                </Typography>
              </TableCell>
              <TableCell>
                <Typography component="span" variant="subtitle1">
                  {coinATH.athDate}
                </Typography> 
              </TableCell>
              <TableCell>
                <Typography component="span" variant="subtitle1">
                  {coinATH.ath}$
                </Typography> 
              </TableCell>
              <TableCell>
                <Typography component="span" variant="body2" sx={{ color: isPositiveATH ? 'green' : 'red' }}>
                  {isPositiveATH ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  {percentATH}%
                </Typography>
              </TableCell>
            </TableRow>
          );
        })}

      </TableBody>
      </Table>

      {cryptoData !== null && cryptoDescription !== null &&
        <div>
          <br/> <br/> <br/>
          <Typography variant="h3" mb={3}>
            Bitcoin statistic
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>
                Weeks from ATH: {(calculateDays(cryptoDescription["BTC"].athDate)/7).toFixed(1)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                Weeks from Bottom: {(calculateDays("2022-11-21")/7).toFixed(1)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                Week to halving: {( (calculateDays("2024-04-26")/7) * -1 ).toFixed(1)}
              </Typography>
            </Grid>
          </Grid>

        </div>
      }
      
    </Box>
  );
};

export default CryptoPrices;