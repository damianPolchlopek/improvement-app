import React, { useEffect, useState } from 'react';
import REST from '../utils/REST';

import { Box, CircularProgress, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { AttachMoney as MoneyIcon, TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from '@mui/icons-material';


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const CryptoPrices = () => {
  const [cryptoData, setCryptoData] = useState(null);
  const [cryptoDescription, setCryptoDescription] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    REST.getFinanceCryptoPrice().then(response => {
      setCryptoData(response.data);
      setLoading(false)
    });

    REST.getFinanceCryptoDescription().then(response => {
      console.log('Description')
      console.log(response)
      setCryptoDescription(response);
      setLoading(false)
    });
  }, []);


  if (loading) {
    return <CircularProgress />;
  }


  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        Crypto Prices
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Change 24h</TableCell>
            <TableCell>Change 7d</TableCell>
            <TableCell>Change 30d</TableCell>
            <TableCell>Change 90d</TableCell>
            <TableCell>ATH Date</TableCell>
            <TableCell>ATH</TableCell>
          </TableRow>
        </TableHead>
      
      
      <TableBody>

        {cryptoData !== null && cryptoDescription !== null && Object.keys(cryptoDescription).map((symbol, index) => {
          // const price = cryptoData[symbol].quote.USD.price.toFixed(2);
          // const percentChange24h = cryptoData[symbol].quote.USD.percent_change_24h.toFixed(2);
          // const isPositive = percentChange24h >= 0;
        const coinPosition = cryptoData[symbol].quote.USD.price.toFixed(2);
        const price = cryptoData[symbol].quote.USD.price.toFixed(2);
        const percentChange24h = cryptoData[symbol].quote.USD.percent_change_24h.toFixed(2);
        const isPositive24h = percentChange24h >= 0;

        const percentChange7d = cryptoData[symbol].quote.USD.percent_change_7d.toFixed(2);
        const isPositive7d = percentChange7d >= 0;

        const percentChange30d = cryptoData[symbol].quote.USD.percent_change_30d.toFixed(2);
        const isPositive30d= percentChange30d >= 0;

        const percentChange90d = cryptoData[symbol].quote.USD.percent_change_90d.toFixed(2);
        const isPositive90d= percentChange90d >= 0;

        {console.log('Crypto description')}
        {console.log(cryptoDescription)}
        {console.log(cryptoData)}
        {console.log('---------')}
        {console.log(cryptoDescription[symbol])}
        const coinATH = cryptoDescription[symbol];

        // const high24h = cryptoData[symbol].quote.USD.high_24h.toFixed(2);

        // const percentDownFromAth = ((1 - (price / ath)) * 100).toFixed(2);

          return (
            <TableRow>
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
            </TableRow>
          );
        })}

      </TableBody>
      </Table>
    </Box>
  );
};

export default CryptoPrices;