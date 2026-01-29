// features/diet-audit/components/AuditFilters.jsx

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  useTheme,
  InputAdornment,
  Collapse,
  IconButton,
  Tooltip
} from '@mui/material';

import {
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

import Grid from '@mui/material/Unstable_Grid2';

const AuditFilters = ({ filters, setFilters }) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = React.useState(true);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: null,
      dateTo: null,
      revisionType: 'ALL',
      searchTerm: '',
    });
  };

  const hasActiveFilters = 
    filters.dateFrom || 
    filters.dateTo || 
    filters.revisionType !== 'ALL' || 
    filters.searchTerm;

  const activeFiltersCount = [
    filters.dateFrom,
    filters.dateTo,
    filters.revisionType !== 'ALL',
    filters.searchTerm
  ].filter(Boolean).length;

  return (
    <Card elevation={6} sx={{
      borderRadius: 3,
      background: 'linear-gradient(145deg, #1a2e3d 0%, #243441 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2,
        background: theme.palette.card.header,
        borderBottom: isExpanded ? theme.palette.card.border : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        }
      }}
      onClick={() => setIsExpanded(!isExpanded)}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <FilterListIcon sx={{ color: 'white', fontSize: 24 }} />
          <Typography variant="h6" fontWeight="600" color="white">
            Filtry
          </Typography>
          {hasActiveFilters && (
            <Chip 
              label={`${activeFiltersCount} ${activeFiltersCount === 1 ? 'aktywny' : 'aktywne'}`}
              size="small"
              sx={{
                backgroundColor: 'rgba(76, 175, 80, 0.3)',
                color: '#4caf50',
                fontWeight: 600,
                fontSize: '0.75rem',
                height: '24px'
              }}
            />
          )}
        </Box>
        
        <Box display="flex" alignItems="center" gap={1}>
          {hasActiveFilters && (
            <Tooltip title="Wyczyść wszystkie filtry">
              <Button
                variant="outlined"
                size="small"
                startIcon={<ClearIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  clearFilters();
                }}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontSize: '0.75rem',
                  py: 0.5,
                  px: 2,
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              >
                Wyczyść
              </Button>
            </Tooltip>
          )}
          
          <IconButton
            size="small"
            sx={{ 
              color: 'white',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Filters Content */}
      <Collapse in={isExpanded} timeout="auto">
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            
            {/* Data od */}
            <Grid xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Data od"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: filters.dateFrom && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => handleFilterChange('dateFrom', null)}
                        sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
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
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#4caf50',
                    },
                  },
                  '& input[type="date"]::-webkit-calendar-picker-indicator': {
                    filter: 'invert(1)',
                  },
                }}
              />
            </Grid>

            {/* Data do */}
            <Grid xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Data do"
                value={filters.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: filters.dateTo && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => handleFilterChange('dateTo', null)}
                        sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
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
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#4caf50',
                    },
                  },
                  '& input[type="date"]::-webkit-calendar-picker-indicator': {
                    filter: 'invert(1)',
                  },
                }}
              />
            </Grid>

            {/* Typ rewizji */}
            <Grid xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#4caf50',
                    },
                  }}
                >
                  Typ zmiany
                </InputLabel>
                <Select
                  value={filters.revisionType}
                  onChange={(e) => handleFilterChange('revisionType', e.target.value)}
                  label="Typ zmiany"
                  startAdornment={
                    <InputAdornment position="start">
                      <CategoryIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 20 }} />
                    </InputAdornment>
                  }
                  sx={{
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4caf50',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4caf50',
                      borderWidth: 2,
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'white',
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: '#243441',
                        color: 'white',
                        borderRadius: 2,
                        mt: 1,
                        '& .MuiMenuItem-root': {
                          '&:hover': {
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                          },
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(76, 175, 80, 0.2)',
                            '&:hover': {
                              backgroundColor: 'rgba(76, 175, 80, 0.3)',
                            },
                          },
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="ALL">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography>Wszystkie</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="ADD">
                    <Box display="flex" alignItems="center" gap={1}>
                      <span style={{ fontSize: '1.2rem' }}>➕</span>
                      <Typography>Dodano</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="MOD">
                    <Box display="flex" alignItems="center" gap={1}>
                      <span style={{ fontSize: '1.2rem' }}>✏️</span>
                      <Typography>Zmodyfikowano</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="DEL">
                    <Box display="flex" alignItems="center" gap={1}>
                      <span style={{ fontSize: '1.2rem' }}>🗑️</span>
                      <Typography>Usunięto</Typography>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Wyszukiwanie */}
            <Grid xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Szukaj posiłku"
                placeholder="Nazwa posiłku..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: filters.searchTerm && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => handleFilterChange('searchTerm', '')}
                        sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
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
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#4caf50',
                    },
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <Box sx={{ 
              mt: 3, 
              pt: 3, 
              borderTop: '1px solid rgba(255, 255, 255, 0.1)' 
            }}>
              <Typography 
                variant="caption" 
                color="rgba(255, 255, 255, 0.6)"
                sx={{ 
                  mb: 1.5, 
                  display: 'block',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  fontWeight: 600
                }}
              >
                Aktywne filtry:
              </Typography>
              
              <Box display="flex" flexWrap="wrap" gap={1}>
                {filters.dateFrom && (
                  <Chip
                    label={`Od: ${filters.dateFrom}`}
                    onDelete={() => handleFilterChange('dateFrom', null)}
                    size="small"
                    icon={<CalendarIcon />}
                    sx={{
                      backgroundColor: 'rgba(33, 150, 243, 0.2)',
                      color: '#2196f3',
                      border: '1px solid rgba(33, 150, 243, 0.3)',
                      '& .MuiChip-deleteIcon': {
                        color: '#2196f3',
                        '&:hover': {
                          color: '#1976d2',
                        },
                      },
                    }}
                  />
                )}
                
                {filters.dateTo && (
                  <Chip
                    label={`Do: ${filters.dateTo}`}
                    onDelete={() => handleFilterChange('dateTo', null)}
                    size="small"
                    icon={<CalendarIcon />}
                    sx={{
                      backgroundColor: 'rgba(33, 150, 243, 0.2)',
                      color: '#2196f3',
                      border: '1px solid rgba(33, 150, 243, 0.3)',
                      '& .MuiChip-deleteIcon': {
                        color: '#2196f3',
                        '&:hover': {
                          color: '#1976d2',
                        },
                      },
                    }}
                  />
                )}
                
                {filters.revisionType !== 'ALL' && (
                  <Chip
                    label={`Typ: ${filters.revisionType === 'ADD' ? 'Dodano' : filters.revisionType === 'MOD' ? 'Zmodyfikowano' : 'Usunięto'}`}
                    onDelete={() => handleFilterChange('revisionType', 'ALL')}
                    size="small"
                    icon={<CategoryIcon />}
                    sx={{
                      backgroundColor: 'rgba(255, 152, 0, 0.2)',
                      color: '#ff9800',
                      border: '1px solid rgba(255, 152, 0, 0.3)',
                      '& .MuiChip-deleteIcon': {
                        color: '#ff9800',
                        '&:hover': {
                          color: '#f57c00',
                        },
                      },
                    }}
                  />
                )}
                
                {filters.searchTerm && (
                  <Chip
                    label={`Szukaj: "${filters.searchTerm}"`}
                    onDelete={() => handleFilterChange('searchTerm', '')}
                    size="small"
                    icon={<SearchIcon />}
                    sx={{
                      backgroundColor: 'rgba(76, 175, 80, 0.2)',
                      color: '#4caf50',
                      border: '1px solid rgba(76, 175, 80, 0.3)',
                      '& .MuiChip-deleteIcon': {
                        color: '#4caf50',
                        '&:hover': {
                          color: '#388e3c',
                        },
                      },
                    }}
                  />
                )}
              </Box>
            </Box>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default AuditFilters;