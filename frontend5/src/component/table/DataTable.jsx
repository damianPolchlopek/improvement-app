import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import ErrorAlert from '../error/ErrorAlert';
import { useTranslation } from 'react-i18next';

export default function DataTable({
  data,
  isLoading,
  isError,
  error,
  columns,
  onCellClick,
  loadingMessage,
  emptyMessage,
  containerProps = {},
  tableProps = {},
}) {
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          {loadingMessage || t('messages.loading')}
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return <ErrorAlert error={error} />;
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {emptyMessage || t('common.noData')}
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} {...containerProps}>
      <Table aria-label="data table" {...tableProps}>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell
                key={column.key || index}
                align={column.align || 'left'}
                sx={column.headerSx}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={row.id || rowIndex}>
              {columns.map((column, colIndex) => {
                const cellValue = column.accessor
                  ? typeof column.accessor === 'function'
                    ? column.accessor(row)
                    : row[column.accessor]
                  : row[column.key];

                return (
                  <TableCell
                    key={column.key || colIndex}
                    align={column.align || 'left'}
                    sx={column.cellSx}
                    onClick={onCellClick ? () => onCellClick(row, column, cellValue) : undefined}
                    style={{ cursor: onCellClick ? 'pointer' : 'default' }}
                  >
                    {column.render ? column.render(cellValue, row) : cellValue}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
