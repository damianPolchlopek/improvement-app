import React, {useEffect, useState} from 'react';
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
  const [trainingNames, setTrainingNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(25);
  const [listLength, setListLength] = useState(0);

  useEffect(() => {
    REST.getAllTrainingNames(page, size)
      .then(response => {
        setTrainingNames(response.content);
        setListLength(response.totalElements)
        console.log(response)
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch training names', error);
        setLoading(false);
      });
  }, [page, size]);

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

      {loading ? <CircularProgress /> :
        <Table sx={{ mt: 2 }}>
          <TableBody>
            <StyledTableRow>
              {trainingNames.map((training, index) => (
                <SingleTraining key={index} trainingName={training} />
              ))}
            </StyledTableRow>
          </TableBody>

          <TableFooter>
            <StyledTableRow>
              <StyledTableCell colSpan={7}>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  count={listLength}
                  rowsPerPage={size}
                  component="div"
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeSize}
                />
              </StyledTableCell>
            </StyledTableRow>
          </TableFooter>
        </Table>}

    </Container>

  );
}