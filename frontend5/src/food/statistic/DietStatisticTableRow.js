import * as React from "react"
import {Collapse, IconButton, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import StyledTableCell  from '../../component/table/StyledTableCell'
import StyledTableRow  from '../../component/table/StyledTableRow'

export default function DietStatisticTableRow(props) {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <StyledTableRow onClick={() => setOpen(prev => !prev)}>
        <StyledTableCell sx={{width: '50px'}} >
          <IconButton aria-label="expand row" size="small">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>

        <StyledTableCell>{props.dietSummary.date}</StyledTableCell>
        <StyledTableCell>{props.dietSummary.kcal}</StyledTableCell>
        <StyledTableCell>{props.dietSummary.protein}</StyledTableCell>
        <StyledTableCell>{props.dietSummary.carbohydrates}</StyledTableCell>
        <StyledTableCell>{props.dietSummary.fat}</StyledTableCell>
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
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Kcal</StyledTableCell>
                  <StyledTableCell>Protein</StyledTableCell>
                  <StyledTableCell>Carbs</StyledTableCell>
                  <StyledTableCell>Fat</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {props.mealsFromDay.map((meal) => {
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
    </React.Fragment>
  );
}