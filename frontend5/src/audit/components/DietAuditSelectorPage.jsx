// features/diet-audit/components/DietAuditSelectorPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDietSummaries } from '../hooks/useDietSummaries';

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  useTheme,
  InputAdornment,
  IconButton,
  Tooltip
} from '@mui/material';

import {
  History as HistoryIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarIcon,
  Restaurant as RestaurantIcon
} from '@mui/icons-material';

import Grid from '@mui/material/Unstable_Grid2';

import PageLoader from '../../component/loader/PageLoader';
import ErrorAlert from '../../component/error/ErrorAlert';

const DietAuditSelectorPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, isError, error } = useDietSummaries(page, size);

  const handleViewAudit = (dietSummaryId) => {
    navigate(`/app/food/diet/audit/${dietSummaryId}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeSize = (event) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return <PageLoader text="Ładowanie podsumowań diet..." />;
  }
  
  if (isError) {
    return <ErrorAlert error={error} />;
  }

  const filteredData = data?.content?.filter(item => 
    item.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ py: 4, minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ width: '70%' }}>
        
        {/* Header Section */}
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Card elevation={8} sx={{ 
              borderRadius: 4,
              background: theme.palette.card.header,
              color: 'white',
              mb: 4,
              overflow: 'hidden',
              border: theme.palette.card.border,
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <HistoryIcon sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h3" fontWeight="700" sx={{ mb: 1 }}>
                      Audyt Podsumowań Diet
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      Wybierz podsumowanie diety, aby przejrzeć historię zmian
                    </Typography>
                  </Box>
                </Box>
                
                <Box display="flex" gap={3} sx={{ mt: 3 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <RestaurantIcon sx={{ fontSize: 20 }} />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {data?.totalElements || 0} podsumowań
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <VisibilityIcon sx={{ fontSize: 20 }} />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Historia zmian dostępna dla każdego wpisu
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Search Bar */}
          <Grid xs={12}>
            <Card elevation={6} sx={{
              borderRadius: 3,
              background: 'linear-gradient(145deg, #1a2e3d 0%, #243441 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <CardContent sx={{ p: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Szukaj po dacie (np. 2024-01-27)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#4caf50',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4caf50',
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Table */}
          <Grid xs={12}>
            <Card elevation={8} sx={{ 
              borderRadius: 4, 
              overflow: 'hidden',
              background: 'linear-gradient(145deg, #1a2e3d 0%, #243441 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              {/* Table Header */}
              <Box sx={{ 
                p: 3,
                background: theme.palette.card.header,
                borderBottom: theme.palette.card.border,
              }}>
                <Typography variant="h5" fontWeight="600" color="white">
                  Lista Podsumowań Diet
                </Typography>
              </Box>

              {/* Table Content */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{
                      '& th': {
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 600,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      }
                    }}>
                      <TableCell>ID</TableCell>
                      <TableCell>Data</TableCell>
                      <TableCell align="right">Kalorie</TableCell>
                      <TableCell align="right">Białko</TableCell>
                      <TableCell align="right">Węgle</TableCell>
                      <TableCell align="right">Tłuszcze</TableCell>
                      <TableCell align="center">Posiłki</TableCell>
                      <TableCell align="center">Akcje</TableCell>
                    </TableRow>
                  </TableHead>
                  
                  <TableBody>
                    {filteredData && filteredData.length > 0 ? (
                      filteredData.map((dietSummary) => (
                        <TableRow 
                          key={dietSummary.id}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(76, 175, 80, 0.05)',
                            },
                            '& td': {
                              color: 'rgba(255, 255, 255, 0.9)',
                              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            }
                          }}
                        >
                          <TableCell>
                            <Chip 
                              label={`#${dietSummary.id}`}
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(33, 150, 243, 0.2)',
                                color: '#2196f3',
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <CalendarIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.5)' }} />
                              {dietSummary.date}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="600" color="#ff9800">
                              {dietSummary.kcal.toFixed(0)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" color="#2196f3">
                              {dietSummary.protein.toFixed(1)}g
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" color="#4caf50">
                              {dietSummary.carbohydrates.toFixed(1)}g
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" color="#fdd835">
                              {dietSummary.fat.toFixed(1)}g
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={dietSummary.meals.length}
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                                color: '#4caf50',
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Zobacz historię zmian">
                              <IconButton
                                onClick={() => handleViewAudit(dietSummary.id)}
                                sx={{
                                  color: '#4caf50',
                                  '&:hover': {
                                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                  }
                                }}
                              >
                                <HistoryIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                          <Typography variant="h6" color="rgba(255, 255, 255, 0.5)">
                            Brak wyników
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <Box sx={{
                background: theme.palette.card.header,
                borderTop: theme.palette.card.border,
              }}>
                <TablePagination
                  component="div"
                  count={data?.totalElements || 0}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={size}
                  onRowsPerPageChange={handleChangeSize}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  sx={{
                    color: 'white',
                    '& .MuiTablePagination-selectIcon': {
                      color: 'white',
                    },
                    '& .MuiTablePagination-actions button': {
                      color: 'white',
                    },
                  }}
                />
              </Box>
            </Card>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
};

export default DietAuditSelectorPage;