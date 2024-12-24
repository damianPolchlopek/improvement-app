import React, { useEffect, useState } from 'react';
import REST from '../../utils/REST';
import CenteredContainer from '../../component/CenteredContainer';

import StyledTableCell  from '../../component/table/StyledTableCell'
import StyledTableRow  from '../../component/table/StyledTableRow'

import {
  Table,
  TablePagination,
  TableFooter,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
} from '@mui/material';
import DietStatisticTableRow from "./DietStatisticTableRow";

export default function DietStatisticView() {
  const [dietSummaryList, setDietSummaryList] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  useEffect(() => {
    REST.getDietSummaries(page, rowsPerPage).then(response => {
      setDietSummaryList(response.content);
    });
  }, [page, rowsPerPage]);

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
              <StyledTableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Kcal</StyledTableCell>
                <StyledTableCell>Protein</StyledTableCell>
                <StyledTableCell>Carbs</StyledTableCell>
                <StyledTableCell>Fat</StyledTableCell>
              </StyledTableRow>
            </TableHead>

            <TableBody>
              {dietSummaryList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((dietSummary, index) => {
                  return <DietStatisticTableRow
                    key={dietSummary.id}
                    mealsFromDay={dietSummary.meals}
                    dietSummary={dietSummary}
                  />
              })}
            </TableBody>

            <TableFooter>
              <StyledTableRow>
                <StyledTableCell colSpan={7}>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={dietSummaryList.length}
                    rowsPerPage={rowsPerPage}
                    component="div"
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </StyledTableCell>
              </StyledTableRow>
            </TableFooter>
          </Table>
        </TableContainer>

      </Paper>
    </CenteredContainer>
  );
}