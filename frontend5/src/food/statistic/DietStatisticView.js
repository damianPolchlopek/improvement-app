import React, { useEffect, useState } from 'react';
import REST from '../../utils/REST';
import CenteredContainer from '../../component/CenteredContainer';

import {
  Table,
  TablePagination,
  TableFooter,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, Paper,
} from '@mui/material';
import DietStatisticTableRow from "./DietStatisticTableRow";

export default function DietStatisticView() {
  const [dietSummaryList, setDietSummaryList] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  useEffect(() => {
    REST.getDietSummaries(page, rowsPerPage).then(response => {
      setDietSummaryList(response.content);
      console.log('Diet Summary List: ')
      console.log(response.content[0].meals)
      console.log(response.content)
    });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (

    <CenteredContainer>
      <Paper sx={{width: '65%'}}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Kcal</TableCell>
                  <TableCell>Protein</TableCell>
                  <TableCell>Carbs</TableCell>
                  <TableCell>Fat</TableCell>
                </TableRow>
              </TableHead>

              { dietSummaryList ?

                <TableBody>
                  {dietSummaryList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((dietSummary, index) => {
                    return <DietStatisticTableRow
                      mealsFromDay={dietSummary.meals}
                      dietSummary={dietSummary}
                    />

                  })}
                </TableBody>

              : null }

            </Table>
          </TableContainer>

          <TableFooter >
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              count={dietSummaryList.length}
              rowsPerPage={rowsPerPage}
              component="div"
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableFooter>

      </Paper>


    </CenteredContainer>
  );
}