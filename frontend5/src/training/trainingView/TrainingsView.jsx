import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import REST from '../../utils/REST';
import SingleTraining from './SingleTraining';
import { useTranslation } from 'react-i18next';

import {
  CircularProgress,
  Container,
  Table,
  Typography,
  TableBody,
  TablePagination,
  TableFooter
} from '@mui/material';

import StyledTableRow from '../../component/table/StyledTableRow';
import StyledTableCell from '../../component/table/StyledTableCell';

export default function TrainingsView() {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(25);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['training-names', page, size],
    queryFn: () => REST.getAllTrainingNames(page, size),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minut - zmień na ile chcesz
    cacheTime: 1000 * 60 * 10 // trzymanie danych w cache przez 10 minut
  });

  const handleChangeSize = (event) => {
    setSize(+event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Container maxWidth="xl" sx={{ width: '70%' }}>
      <Typography variant="h4" component="div" style={{ color: 'white' }}>
        {t('messages.trainingView')}
      </Typography>

      {isLoading ? (
        <CircularProgress />
      ) : isError ? (
        <Typography color="error">{error.message}</Typography>
      ) : (
        <Table sx={{ mt: 2 }}>
          <TableBody>
            <StyledTableRow>
              <StyledTableCell colSpan={7} align="center">
                {data.content.map((training, index) => (
                  <SingleTraining key={index} trainingName={training} />
                ))}
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>

          <TableFooter>
            <StyledTableRow>
              <StyledTableCell colSpan={7}>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  count={data.totalElements}
                  rowsPerPage={size}
                  component="div"
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeSize}
                />
              </StyledTableCell>
            </StyledTableRow>
          </TableFooter>
        </Table>
      )}
    </Container>
  );
}
