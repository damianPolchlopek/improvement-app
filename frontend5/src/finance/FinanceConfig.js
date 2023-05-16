import React from 'react';

import Grid from '@mui/material/Unstable_Grid2';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function FinanceConfig() {

  return (
    <Grid container>

      <TableContainer container spacing={2}>
          <Table>
            <TableHead>
              <TableRow>
                  <TableCell>-</TableCell>
                  <TableCell>2013</TableCell>
                  <TableCell>2017</TableCell>
                  <TableCell>2021</TableCell>
              </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell>Spadki % BTC</TableCell>
                  <TableCell>86%</TableCell>
                  <TableCell>84%</TableCell>
                  <TableCell>78%</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Cykle wzrostowe [tygodnie]</TableCell>
                  <TableCell>142</TableCell>
                  <TableCell>152</TableCell>
                  <TableCell>151</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Cykle spadkowe [tygodnie]</TableCell>
                  <TableCell>59</TableCell>
                  <TableCell>50</TableCell>
                  <TableCell>52</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Wzrosty i spadki [tygodnie]</TableCell>
                  <TableCell>201</TableCell>
                  <TableCell>202</TableCell>
                  <TableCell>203</TableCell>
                </TableRow>

              </TableBody>
            
      </Table>
      </TableContainer>


    </Grid>
  );
}