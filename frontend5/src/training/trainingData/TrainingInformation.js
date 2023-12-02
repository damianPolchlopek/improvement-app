import React from 'react';

import Item from '../../component/Item';
import CenteredContainer from '../../component/CenteredContainer';

import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';



export default function TrainingInformation() {

  return (
    <CenteredContainer>
      <All/>
    </CenteredContainer>
  );
}


const All = () => {
  return (
    <Grid container sx={{width: '70%'}} spacing={2}>
      <Grid xs={12}>
        <Item>
          <TableContainer>
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
        </Item>
      </Grid>


      <Grid xs={6}>
        <Item>
          <Typography>
            Obczić metode 3/7
          </Typography>
        </Item>
      </Grid>

      <Grid xs={6}>
        <Item>
          <Typography>
            Następnie trening z przerwami
          </Typography>
        </Item>
      </Grid>

    </Grid>
  )
}