import * as React from "react"
import {Collapse, IconButton, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function DietStatisticTableRow(props) {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow onClick={() => { setOpen(!open);}}>

        <TableCell sx={{width: '50px'}} >
          <IconButton
            aria-label="expand row"
            size="small"
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell >

        <TableCell>{props.dietSummary.date}</TableCell>
        <TableCell>{props.dietSummary.kcal}</TableCell>
        <TableCell>{props.dietSummary.protein}</TableCell>
        <TableCell>{props.dietSummary.carbohydrates}</TableCell>
        <TableCell>{props.dietSummary.fat}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Kcal</TableCell>
                  <TableCell>Protein</TableCell>
                  <TableCell>Carbs</TableCell>
                  <TableCell>Fat</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.mealsFromDay.map((meal) => {

                  return (
                    <TableRow
                      key={meal.name}
                    >
                      <TableCell>{meal.name}</TableCell>
                      <TableCell>{meal.kcal}</TableCell>
                      <TableCell>{meal.protein}</TableCell>
                      <TableCell>{meal.carbohydrates}</TableCell>
                      <TableCell>{meal.fat}</TableCell>
                    </TableRow>
                  )})}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}