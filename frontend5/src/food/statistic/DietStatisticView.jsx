import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import REST from '../../utils/REST';
import CenteredContainer from '../../component/CenteredContainer';
import { useTranslation } from 'react-i18next';

import StyledTableCell from '../../component/table/StyledTableCell';
import StyledTableRow from '../../component/table/StyledTableRow';

import {
  Table,
  TablePagination,
  TableFooter,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  CircularProgress,
  Typography
} from '@mui/material';

import DietStatisticTableRow from "./DietStatisticTableRow";

export default function DietStatisticView() {
  const [ page, setPage ] = useState(0);
  const [ size, setSize ] = useState(10);
  const { t } = useTranslation();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['diet-summaries', page, size],
    queryFn: () => REST.getDietSummaries(page, size),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // opcjonalnie
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setSize(+event.target.value);
    setPage(0);
  };

  if (isLoading) {
    return (
      <CenteredContainer>
        <CircularProgress />
      </CenteredContainer>
    );
  }

  if (isError) {
    return (
      <CenteredContainer>
        <Typography color="error">
          Error: {error?.message || 'Unknown error'}
        </Typography>
      </CenteredContainer>
    );
  }

  return (
    <CenteredContainer>
      <Paper sx={{ width: '65%' }}>
      
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
                <StyledTableCell>{t('food.actions')}</StyledTableCell>
              </StyledTableRow>
            </TableHead>

            <TableBody>
              {data.content.map((dietSummary, index) => (
                <DietStatisticTableRow
                  key={index}
                  dietSummary={dietSummary}
                />
              ))}
            </TableBody>

            <TableFooter>
              <StyledTableRow>
                <StyledTableCell colSpan={7}>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={data.totalElements}
                    rowsPerPage={size}
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
