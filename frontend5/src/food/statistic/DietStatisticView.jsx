import React, { useEffect, useState } from 'react';
import REST from '../../utils/REST';
import CenteredContainer from '../../component/CenteredContainer';
import { useTranslation } from 'react-i18next';

import StyledTableCell  from '../../component/table/StyledTableCell';
import StyledTableRow  from '../../component/table/StyledTableRow';

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dietSummaryLength, setDietSummaryLength] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    REST.getDietSummaries(page, rowsPerPage).then(response => {
      setDietSummaryList(response.content);
      setDietSummaryLength(response.totalElements)
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
                <StyledTableCell>{t('food.date')}</StyledTableCell>
                <StyledTableCell>{t('food.kcal')}</StyledTableCell>
                <StyledTableCell>{t('food.protein')}</StyledTableCell>
                <StyledTableCell>{t('food.carbs')}</StyledTableCell>
                <StyledTableCell>{t('food.fat')}</StyledTableCell>
              </StyledTableRow>
            </TableHead>

            <TableBody>
              {dietSummaryList
                .map((dietSummary, index) => {
                  return <DietStatisticTableRow
                    key={index}
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
                    count={dietSummaryLength}
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