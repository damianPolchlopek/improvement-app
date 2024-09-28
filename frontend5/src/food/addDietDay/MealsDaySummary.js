import { Typography } from "@mui/material";
import React from "react";
import CenteredContainer from "../../component/CenteredContainer";
import PropTypes from "prop-types";

export default function FoodStatisticView({ dietSummary }) {
  if (!dietSummary) return null;

  const { kcal, protein, carbohydrates, fat } = dietSummary;

  return (
    <CenteredContainer>
      <Typography
        sx={{
          minWidth: { xs: '100%', sm: '400px' },
        }}
      >
        Kcal: {kcal} Protein: {protein} Carbs: {carbohydrates} Fat: {fat}
      </Typography>
    </CenteredContainer>
  );
}

FoodStatisticView.propTypes = {
  dietSummary: PropTypes.shape({
    kcal: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
    carbohydrates: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
  }).isRequired,
};
