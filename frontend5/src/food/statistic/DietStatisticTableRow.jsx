import React from "react"
import { useState } from "react";
import { Collapse, IconButton, Table, TableBody, TableCell, TableHead } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useTranslation } from 'react-i18next';

import StyledTableCell  from '../../component/table/StyledTableCell'
import StyledTableRow  from '../../component/table/StyledTableRow'

export default function DietStatisticTableRow({ dietSummary }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <StyledTableRow onClick={() => setOpen(prev => !prev)}>
        <StyledTableCell sx={{width: '50px'}} >
          <IconButton aria-label="expand row" size="small">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>

        <StyledTableCell>{dietSummary.date}</StyledTableCell>
        <StyledTableCell>{dietSummary.kcal}</StyledTableCell>
        <StyledTableCell>{dietSummary.protein}</StyledTableCell>
        <StyledTableCell>{dietSummary.carbohydrates}</StyledTableCell>
        <StyledTableCell>{dietSummary.fat}</StyledTableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
          >
            <Table size="small">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>{t('food.name')}</StyledTableCell>
                  <StyledTableCell>{t('food.kcal')}</StyledTableCell>
                  <StyledTableCell>{t('food.protein')}</StyledTableCell>
                  <StyledTableCell>{t('food.carbs')}</StyledTableCell>
                  <StyledTableCell>{t('food.fat')}</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {dietSummary.meals.map((meal) => {
                  return (
                    <StyledTableRow
                      key={meal.id}
                    >
                      <StyledTableCell>{meal.name}</StyledTableCell>
                      <StyledTableCell>{meal.kcal}</StyledTableCell>
                      <StyledTableCell>{meal.protein}</StyledTableCell>
                      <StyledTableCell>{meal.carbohydrates}</StyledTableCell>
                      <StyledTableCell>{meal.fat}</StyledTableCell>
                    </StyledTableRow>
                  )})}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </StyledTableRow>
    </>
  );
}