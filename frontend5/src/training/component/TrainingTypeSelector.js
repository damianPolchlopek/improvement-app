import React from "react";

import {
    MenuItem,
    Select
  } from '@mui/material';

export default function TrainingTypeSelector(props) {
    return <Select
      onChange={e => props.setTrainingType(e.target.value)}
      defaultValue="A"
      displayEmpty
    >
      <MenuItem value="A">Siłowy A</MenuItem>
      <MenuItem value="B">Siłowy B</MenuItem>
      <MenuItem value="C">Hipertroficzny C</MenuItem>
      <MenuItem value="D">Hipertroficzny D</MenuItem>
      <MenuItem value="E">Basen</MenuItem>
      <MenuItem value="A1">Siłowy A1</MenuItem>
      <MenuItem value="B1">Siłowy B1</MenuItem>
      <MenuItem value="C1">Hipertroficzny C1</MenuItem>
      <MenuItem value="D1">Hipertroficzny D1</MenuItem>
    </Select>;
  }