import { MenuItem, Select, Toolbar, Typography } from "@mui/material";
import * as React from "react";
import PropTypes from 'prop-types';

export default function MealFilter(props) {
  return (
    <Toolbar>
      <Typography sx={{ marginRight: '20px' }}>
        Meal Popularity
      </Typography>

      <Select
        value={props.mealPopularity}
        onChange={(e) => props.setMealPopularity(e.target.value)}
      >
        <MenuItem value="ALL">ALL</MenuItem>
        <MenuItem value="HIGH">Popular</MenuItem>
        <MenuItem value="LOW">Rare</MenuItem>
      </Select>
    </Toolbar>
  );
}

MealFilter.propTypes = {
  mealPopularity: PropTypes.string.isRequired,
  setMealPopularity: PropTypes.func.isRequired
};
