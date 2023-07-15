import React from 'react';

import Grid from '@mui/material/Unstable_Grid2';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { List, ListItem } from '@mui/material';
import Typography from '@mui/material/Typography';

import Item from '../component/Item';
import CenteredContainer from '../component/CenteredContainer';

export default function FinanceConfig() {

  return (
    <CenteredContainer>
      <All />
    </CenteredContainer>
  );
}


const All = () => {
  return(
    <Grid container sx={{ width: '70%'}} spacing={2}>
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
          <Typography variant="body1">
            Dołek zazwyczaj jest 365 dni po górce
          </Typography>
        </Item>
      </Grid>

      <Grid xs={6}>
        <Item>
          <Typography variant="body1">
            Wzrosty zaczynają się:
            - 1 - 1.5 rok przed halvingiem
            - wzrosty trwaja do około roku po halvingu
          </Typography>
        </Item>
      </Grid>

      <Grid xs={6}>
        <Item>
          <Typography variant="body1">
            Następny halving około Kwiecien 2024
          </Typography>
        </Item>
      </Grid>

      <Grid xs={6}>
        <Item>
          <Typography variant="body1">
            Decyzja o wprowadzeniu ETF na BTC przez BlackRock około luty 2024
          </Typography>
        </Item>
      </Grid>

      <Grid xs={6}>
        <Item>
          <Typography variant="body1">
            Istotne katalizatory zmian sentymentu w ciągu kolejnych 12 miesięcy, które zbiegną się w czasie z halvingiem to m.in.: 
            <List>
              <ListItem>- rozprawa sądowa między SEC a Grayscale w sierpniu 2023,</ListItem>
              <ListItem>- decyzje dotyczące ETF spot ArkInvest we wrześniu 2023,</ListItem>
              <ListItem>- rozwiązanie sprawy Ripple również we wrześniu 2023,</ListItem>
              <ListItem>- decyzje dotyczące wniosków BlackRock i Fidelity w marcu 2024</ListItem>
            </List>
          </Typography>
        </Item>
      </Grid>

      <Grid xs={6}>
        <Item>
          <Typography variant="body1">
            Krypto rozważane przez SEC za security: BNB, XRP, ADA, SOL, MATIC, ATOM, NEAR, SAND, ALGO, MANA
          </Typography>
        </Item>
      </Grid>

      <Grid xs={6}>
        <Item>
          <Typography variant="body1">
            PlanB: BTC najlepiej kupić 6 miesięcy przed Halvingiem, a najlepiej sprzedać 18 miesięcy po halvingu.
          </Typography>
        </Item>
      </Grid>

    </Grid>
  )
}