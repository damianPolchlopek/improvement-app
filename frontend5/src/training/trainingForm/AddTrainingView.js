import React, { useState } from "react";
import REST from '../../utils/REST';
import TrainingForm from "./TrainingForm";

import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import Grid from '@mui/material/Unstable_Grid2';


export default function AddTrainingView(props) {
  const [exercises, setExercises] = useState([]);
  const [isSimpleForm, setIsSimpleForm] = useState(true);
  const [trainingType, setTrainingType] = useState('A');

  function loadLastTraining() {
    setExercises([]);

    REST.getTrainingTemplateByType(trainingType)
    .then(response => {
      setExercises(response.content);
    })
    .catch(error => console.error("Error loading training:", error));
  }

  function addTraining() {
    REST.addTraining(exercises)
    .then(response => {
      props.history.push('/add-training')
      window.location.reload(false)
    })
    .catch(error => console.error("Error adding training:", error));
  }

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Typography
            variant="h5"
            component="div"
          >
            Choose training type to add
          </Typography>
        </Grid>
        <Grid xs={12}>
          <FormControl sx={{m: 1, minWidth: 120}}>
            <Select
              onChange={(e => setTrainingType(e.target.value))}
              defaultValue="A"
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
            </Select>
          </FormControl>
        </Grid>

        <Grid xs={12}>
          <Button
            variant="contained"
            onClick={() => loadLastTraining()}
          >
            Load last training
          </Button>
        </Grid>

        <Grid xs={12}>
          <FormControlLabel
            control={<Checkbox/>}
            label="Enable a more accurate form"
            onClick={() => {
              setIsSimpleForm(!isSimpleForm)
            }}
          />
        </Grid>

        <Grid xs={12}>
          <TrainingForm
            isSimpleForm={isSimpleForm}
            exercises={exercises}
            submitFunction={addTraining}/>
        </Grid>

      </Grid>
    </React.Fragment>

  );
}
