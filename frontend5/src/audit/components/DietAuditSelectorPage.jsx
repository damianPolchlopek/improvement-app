// features/diet-audit/components/DietAuditSelectorPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { ChevronRight, History as HistoryIcon } from '@mui/icons-material';

import { useDietSummaries } from '../hooks/useDietSummaries';
import PageLoader from '../../component/loader/PageLoader';
import ErrorAlert from '../../component/error/ErrorAlert';
import FoodPageHeader from '../../food/component/FoodPageHeader';
import SearchField from '../../food/component/SearchField';
import { MACRO_COLORS, formatMacro } from '../../food/foodView/macroColors';
import { HAIRLINE, calmTableSx, surfaceSx } from '../../tokens';

const numberCell = { fontVariantNumeric: 'tabular-nums' };

const DietAuditSelectorPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, isError, error } = useDietSummaries(page, size);

  if (isLoading) {
    return <PageLoader text={t('audit.loadingSummaries')} />;
  }

  if (isError) {
    return <ErrorAlert error={error} />;
  }

  const filteredData = data?.content?.filter((item) =>
    item.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAudit = (dietSummaryId) => navigate(`/app/audit/${dietSummaryId}`);

  return (
    <Box sx={{ py: 3, px: 2, maxWidth: 1100, mx: 'auto' }}>
      <FoodPageHeader
        icon={<HistoryIcon />}
        title={t('audit.title')}
        description={t('audit.titleDesc')}
        statLabel={t('audit.summariesList')}
        statValue={data?.totalElements ?? 0}
        actions={
          <SearchField
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t('audit.searchByDate')}
          />
        }
      />

      <Box sx={surfaceSx}>
        <TableContainer>
          <Table size="small" sx={calmTableSx}>
            <TableHead>
              <TableRow>
                <TableCell>{t('audit.date')}</TableCell>
                <TableCell align="right">{t('audit.calories')}</TableCell>
                <TableCell align="right">{t('food.protein')}</TableCell>
                <TableCell align="right">{t('food.carbs')}</TableCell>
                <TableCell align="right">{t('food.fat')}</TableCell>
                <TableCell align="right">{t('audit.meals')}</TableCell>
                <TableCell padding="checkbox" />
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData && filteredData.length > 0 ? (
                filteredData.map((dietSummary) => (
                  <TableRow
                    key={dietSummary.id}
                    hover
                    onClick={() => openAudit(dietSummary.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {dietSummary.date}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        #{dietSummary.id}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ ...numberCell, color: MACRO_COLORS.kcal.text, fontWeight: 500 }}
                    >
                      {Math.round(dietSummary.kcal)}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ ...numberCell, color: MACRO_COLORS.protein.text }}
                    >
                      {formatMacro(dietSummary.protein)} g
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ ...numberCell, color: MACRO_COLORS.carbohydrates.text }}
                    >
                      {formatMacro(dietSummary.carbohydrates)} g
                    </TableCell>
                    <TableCell align="right" sx={{ ...numberCell, color: MACRO_COLORS.fat.text }}>
                      {formatMacro(dietSummary.fat)} g
                    </TableCell>
                    <TableCell align="right" sx={numberCell}>
                      {dietSummary.meals.length}
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Tooltip title={t('audit.viewHistory')}>
                        <IconButton
                          size="small"
                          aria-label={t('audit.viewHistory')}
                          onClick={(event) => {
                            event.stopPropagation();
                            openAudit(dietSummary.id);
                          }}
                        >
                          <ChevronRight fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    {t('audit.noResults')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={data?.totalElements || 0}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={size}
          onRowsPerPageChange={(event) => {
            setSize(parseInt(event.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{ borderTop: HAIRLINE }}
        />
      </Box>
    </Box>
  );
};

export default DietAuditSelectorPage;
