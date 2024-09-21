import {MenuItem, Select, Toolbar, Typography} from "@mui/material";
import * as React from "react";

export default function MealFilter(props) {

  return (
    <Toolbar>
      <Typography style={{ marginRight: '20px' }}>
        Meal Popularity
      </Typography>

      <Select
        onChange={(e => props.setMealPopularity(e.target.value))}
        defaultValue="HIGH"
      >
        <MenuItem value="ALL">ALL</MenuItem>
        <MenuItem value="HIGH">Popular</MenuItem>
        <MenuItem value="LOW">Rare</MenuItem>
      </Select>
    </Toolbar>
  );
}