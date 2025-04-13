import React from "react";

import {
  MenuItem,
  Select
} from '@mui/material';

export default function TrainingTypeSelector({setTrainingType}) {
    return <Select
      onChange={e => setTrainingType(e.target.value)}
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
      <MenuItem value="B2">Siłowy B2</MenuItem>
      <MenuItem value="A2">Siłowy A2</MenuItem>
      <MenuItem value="C2">Hipertroficzny C2</MenuItem>
      <MenuItem value="D2">Hipertroficzny D2</MenuItem>
      <MenuItem value="K1">Kettle K1</MenuItem>
      <MenuItem value="K2">Kettle K2</MenuItem>
      <MenuItem value="K3">Kettle K3</MenuItem>
    </Select>;
  }