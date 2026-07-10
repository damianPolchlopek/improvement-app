import React, { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import REST from '../../utils/REST';
import SingleTraining from './SingleTraining';
import { useTranslation } from 'react-i18next';

import {
  Container,
  Table,
  Typography,
  TableBody,
  TablePagination,
  TableFooter,
  Card,
  CardContent,
  Box,
  Fade,
  useTheme,
} from '@mui/material';

import { FitnessCenter, ViewList, Assessment } from '@mui/icons-material';

import StyledTableRow from '../../component/table/StyledTableRow';
import StyledTableCell from '../../component/table/StyledTableCell';
import InformationComponent from '../../component/InformationComponent';
import ErrorAlert from '../../component/error/ErrorAlert';
import PageLoader from '../../component/loader/PageLoader';

export default function TrainingsView() {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(25);
  const theme = useTheme();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['training-names', page, size],
    queryFn: () => REST.getAllTrainingNames(page, size),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minut
    gcTime: 1000 * 60 * 10, // trzymanie danych w cache przez 10 minut
  });

  const handleChangeSize = (event) => {
    setSize(+event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  if (isLoading) {
    return <PageLoader text={t('training.loadingTrainings')} />;
  }

  if (isError) {
    return <ErrorAlert error={error} />;
  }

  if (data?.content?.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl" sx={{ width: '70%' }}>
          <InformationComponent>{t('training.noTrainings')}</InformationComponent>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ width: '70%' }}>
        {/* Header Section */}
        <Card
          elevation={2}
          sx={{
            borderRadius: 3,
            background: theme.palette.card.header,
            color: 'white',
            mb: 3,
            overflow: 'hidden',
            border: theme.palette.card.border,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <ViewList sx={{ fontSize: 32 }} />
              <Typography variant="h4" fontWeight="600">
                {t('messages.trainingView')}
              </Typography>
            </Box>
            <Box display="flex" gap={3} flexWrap="wrap">
              <Box display="flex" alignItems="center" gap={1}>
                <FitnessCenter sx={{ fontSize: 18 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {t('training.trainingsCount', { count: data?.totalElements || 0 })}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Assessment sx={{ fontSize: 18 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {t('training.detailedStats')}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Fade in={true} timeout={1000}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(145deg, #1a2e3d 0%, #243441 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
            }}
          >
            <Table>
              <TableBody>
                <StyledTableRow>
                  <StyledTableCell colSpan={7} align="center" sx={{ p: 0 }}>
                    <Box
                      sx={{
                        background: 'linear-gradient(145deg, #1a2e3d 0%, #243441 100%)',
                        borderRadius: 2,
                      }}
                    >
                      {data?.content?.map((training, index) => (
                        <SingleTraining key={index} trainingName={training} />
                      ))}
                    </Box>
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>

              <TableFooter>
                <StyledTableRow
                  sx={{
                    '& .MuiTableCell-root': {
                      background: theme.palette.card.header,
                      border: theme.palette.card.border,
                    },
                  }}
                >
                  <StyledTableCell colSpan={7} sx={{ p: 2 }}>
                    <TablePagination
                      size="small"
                      rowsPerPageOptions={[5, 10, 25, 50]}
                      count={data?.totalElements || 0}
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
          </Card>
        </Fade>
      </Container>
    </Box>
  );
}
