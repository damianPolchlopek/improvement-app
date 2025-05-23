import React, { useState, useEffect } from 'react';
import REST from '../../utils/REST';

import { 
  Table, 
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

export default function DailyPrintout() {
  const [dailyList, setDailyList] = useState([]);
    
  useEffect(() => {
    REST.getDaily().then(response => {
      console.log(response.entity)
      setDailyList(response.entity);
    });
  }, []);

  return (
    <React.Fragment>

        {dailyList ?
        <TableContainer container spacing={2}>
          <Table>
            <TableHead>
              <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Smoking</TableCell>
                  <TableCell>Exercise</TableCell>
                  <TableCell>Book</TableCell>
                  <TableCell>Work</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {dailyList.map(daily => {
                return <TableRow>
                <TableCell>{daily.date}</TableCell>
                <TableCell style={{ backgroundColor: daily.smoking === true ? 'green' : 'red' }}>{daily.smoking}</TableCell>
                <TableCell style={{ padding: '16px', backgroundColor: daily.exercise === true ? 'green' : 'red' }}>{daily.exercise}</TableCell>
                <TableCell style={{ backgroundColor: daily.book === true ? 'green' : 'red' }}>{daily.book}</TableCell>
                <TableCell style={{ backgroundColor: daily.work === true ? 'green' : 'red' }}>{daily.work}</TableCell>
              </TableRow>
              })}
              
            </TableBody>
          </Table>
          </TableContainer>
          
        : null}

    </React.Fragment>
  );
  
}