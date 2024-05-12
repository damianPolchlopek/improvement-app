import {Typography} from "@mui/material";
import React from "react";
import CenteredContainer from "../../component/CenteredContainer";

export default function FoodStatisticView(props) {
  return (
  <CenteredContainer>
      <Typography style={{minWidth: '400px'}}>
        Kcal: {props.dietSummary.kcal} Protein: {props.dietSummary.protein} Carbs: {props.dietSummary.carbohydrates} Fat: {props.dietSummary.fat}
      </Typography>
  </CenteredContainer>
  );
}