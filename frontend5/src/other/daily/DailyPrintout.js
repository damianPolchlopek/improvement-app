import React from "react";
import { useQuery } from "@tanstack/react-query";
import REST from "../../utils/REST";
import { useTranslation } from "react-i18next";

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableFooter,
  TablePagination,
  Paper,
  Card,
  Box,
  Typography,
  Chip,
  useTheme,
} from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import { useState } from "react";

import StyledTableCell from "../../component/table/StyledTableCell";
import StyledTableRow from "../../component/table/StyledTableRow";
import PageLoader from "../../component/loader/PageLoader";
import ErrorAlert from "../../component/error/ErrorAlert";

export default function DailyPrintout() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const { t } = useTranslation();
  const theme = useTheme();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["daily-list", page, size],
    queryFn: () => REST.getDaily(page, size),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setSize(+event.target.value);
    setPage(0);
  };

  if (isLoading) {
    return <PageLoader text={t("messages.loading")} />;
  }

  if (isError) {
    return <ErrorAlert error={error} />;
  }

  return (
    <Box sx={{ py: 2 }}>
      <Card elevation={8} sx={{ borderRadius: 4, overflow: "hidden" }}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            background: theme.palette.card.header,
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <TrendingUp sx={{ fontSize: 28 }} />
          <Typography variant="h5" fontWeight="600">
            Daily History
          </Typography>
        </Box>

        {/* Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Smoking</StyledTableCell>
                <StyledTableCell>Exercise</StyledTableCell>
                <StyledTableCell>Book</StyledTableCell>
                <StyledTableCell>Work</StyledTableCell>
              </StyledTableRow>
            </TableHead>

            <TableBody>
              {data?.content?.map((daily, index) => (
                <StyledTableRow
                  key={daily.id || index}
                  sx={{
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <StyledTableCell>
                    <Typography variant="body2" fontWeight="600">
                      {daily.date}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Chip
                      label={daily.smoking ? "Yes" : "No"}
                      color={daily.smoking ? "success" : "error"}
                      variant="outlined"
                      size="small"
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Chip
                      label={daily.exercise ? "Yes" : "No"}
                      color={daily.exercise ? "success" : "error"}
                      variant="outlined"
                      size="small"
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Chip
                      label={daily.book ? "Yes" : "No"}
                      color={daily.book ? "success" : "error"}
                      variant="outlined"
                      size="small"
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Chip
                      label={daily.work ? "Yes" : "No"}
                      color={daily.work ? "success" : "error"}
                      variant="outlined"
                      size="small"
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>

            <TableFooter>
              <StyledTableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={5}
                  count={data?.totalElements || 0}
                  rowsPerPage={size}
                  page={page}
                  SelectProps={{
                    inputProps: { "aria-label": "rows per page" },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </StyledTableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}