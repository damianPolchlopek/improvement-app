import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  Box,
  CircularProgress,
  Typography
} from '@mui/material';
import StyledTableRow  from './StyledTableRow'; 
import StyledTableCell from './StyledTableCell'
import ErrorAlert from '../error/ErrorAlert';

export default function DataTable({
  data,
  isLoading,
  isError,
  error,
  columns,
  onCellClick,
  loadingMessage = 'Ładowanie...',
  emptyMessage = 'Brak danych do wyświetlenia',
  containerProps = {},
  tableProps = {}
}) {

  if (isLoading) {
    return (
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
        {loadingMessage && (
          <Typography variant="body2" sx={{ ml: 2 }}>
            {loadingMessage}
          </Typography>
        )}
      </Box>
    );
  }

  if (isError) {
    return <ErrorAlert error={error} />;
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} {...containerProps}>
      <Table aria-label="data table" {...tableProps}>
        <TableHead>
          <StyledTableRow>
            {columns.map((column, index) => (
              <StyledTableCell
                key={column.key || index}
                align={column.align || 'left'}
                sx={column.headerSx}
              >
                {column.label}
              </StyledTableCell>
            ))}
          </StyledTableRow>
        </TableHead>
        
        <TableBody>
          {data.map((row, rowIndex) => (
            <StyledTableRow
              key={row.id || rowIndex}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {columns.map((column, colIndex) => {
                const cellValue = column.accessor 
                  ? (typeof column.accessor === 'function' 
                      ? column.accessor(row) 
                      : row[column.accessor])
                  : row[column.key];

                return (
                  <StyledTableCell
                    key={column.key || colIndex}
                    align={column.align || 'left'}
                    sx={column.cellSx}
                    onClick={onCellClick ? () => onCellClick(row, column, cellValue) : undefined}
                    style={{ cursor: onCellClick ? 'pointer' : 'default' }}
                  >
                    {column.render ? column.render(cellValue, row) : cellValue}
                  </StyledTableCell>
                );
              })}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}