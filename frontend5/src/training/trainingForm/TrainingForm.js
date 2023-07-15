import React, { useEffect, useState } from "react";
import REST from "../../utils/REST";

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

import TextField from '@mui/material/TextField';

import Grid from '@mui/material/Unstable_Grid2';

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

import Typography from "@mui/material/Typography";

export default function TrainingForm(props) {
  const [exercisesFields, setExercisesFields] = useState([
    {type: '', place: '', name: '', reps: '', weight: '4/4/4/4', progress: 'Zostawić'},
  ])

  const [exerciseNames, setExerciseNames] = useState([]);
  const [exercisePlaces, setExercisePlaces] = useState([]);
  const [exerciseProgresses, setExerciseProgresses] = useState([]);
  const [exerciseTypes, setExerciseTypes] = useState([]);

  useEffect(() => {
    REST.getExerciseNames().then(response => {
      setExerciseNames(response.entity);
    });

    REST.getExercisePlaces().then(response => {
      setExercisePlaces(response.entity);
    });

    REST.getExerciseProgresses().then(response => {
      setExerciseProgresses(response.entity);
    });

    REST.getExerciseTypes().then(response => {
      setExerciseTypes(response.entity);
    });
  }, []);

  useEffect(() => {
    setExercisesFields(props.exercises)
  }, [props.exercises]);


  function addTraining(){
    REST.addTraining(exercisesFields).then(response => {
      // props.props.history.push('/add-training')
      window.location.reload(false)
    });
  }

  const handleFormChange = (index, event) => {
    let data = [...exercisesFields];
    data[index][event.target.name] = event.target.value;
    setExercisesFields(data);
  }

  const addFields = (index) => {
    let data = [...exercisesFields];
    data.splice(index + 1, 0, {type: '', place: '', name: '', reps: '', weight: '', progress: ''})
    console.log(data)
    setExercisesFields(data)
  }

  //debug function
  const submit = (e) => {
    e.preventDefault();
    console.log(exercisesFields)
  }

  const removeFields = (index) => {
    let data = [...exercisesFields];
    data.splice(index, 1)
    setExercisesFields(data)
  }

  // hidden={!props.isSimpleForm}
  // const variantFormControl = 
  const styleFormControl = {
    variant: "standard",
    sx: {
      m: 1,
      // p: 2,
      // width: "175px"
    },
  
  }

  return(
    <React.Fragment>
      <Grid container spacing={2}>

        <Grid xs={12}>
          <Typography 
            variant="h5" 
            component="div" 
          >
            Training Schema
          </Typography>
        </Grid>

        <Grid xs={12}>
          {exercisesFields.map((input, index) => {
            return (
              <div key={index}>
                <FormControl {...styleFormControl}  sx={{width: '50px'}}>
                  <Typography display="inline">{index} </Typography>
                </FormControl>
                {!props.isSimpleForm &&
                <FormControl {...styleFormControl}>
                  <InputLabel id="input-label-type">Type</InputLabel>
                  <Select 
                    name='type'
                    placeholder='Type'
                    value={input.type}
                    onChange={event => handleFormChange(index, event)}
                    size='small'
                  >
                    {exerciseTypes ? exerciseTypes.map((exerciseType, index) => {
                      return(
                        <MenuItem key={index} value={exerciseType.type}>
                          {exerciseType.type}
                        </MenuItem>
                      );
                    }) : null}
                  </Select>
                </FormControl>}
                {!props.isSimpleForm &&
                <FormControl {...styleFormControl}>
                  <InputLabel id="input-label-place">Place</InputLabel>
                  <Select
                    name='place'
                    placeholder='Place'
                    value={input.place}
                    onChange={event => handleFormChange(index, event)}
                    size='small'
                  >
                    {exercisePlaces ? exercisePlaces.map((exercisePlace, index) => {
                      return(
                        <MenuItem key={index} value={exercisePlace.place}>
                          {exercisePlace.place}
                        </MenuItem>
                      );
                    }) : null}
                  </Select>
                </FormControl>}
                <FormControl {...styleFormControl} sx={{width: '500px'}}>
                  <InputLabel id="input-label-name">Name</InputLabel>
                  <Select
                    name='name'
                    placeholder='Name'
                    value={input.name}
                    onChange={event => handleFormChange(index, event)}
                    size='small'
                  >
                    {exerciseNames ? exerciseNames.map((exerciseName, index) => {
                      return(
                        <MenuItem key={index} value={exerciseName.name}>
                          {exerciseName.name}
                        </MenuItem>
                      );
                    }) : null}
                  </Select>
                </FormControl>
                <FormControl {...styleFormControl} >
                  <TextField
                    label="Reps"
                    name='reps'
                    placeholder='Reps'
                    value={input.reps}
                    onChange={event => handleFormChange(index, event)}
                    variant="outlined"
                    size="small"
                  />
                </FormControl>
                <FormControl {...styleFormControl} >
                  <TextField
                    sx={{width: '260px'}}
                    label="Weight"
                    name='weight'
                    placeholder='Weight'
                    value={input.weight}
                    onChange={event => handleFormChange(index, event)}
                    variant="outlined"
                    size="small"
                  />
                </FormControl>
                <FormControl {...styleFormControl} sx={{width: '100px'}}>
                  <InputLabel id="input-label-progress">Progress</InputLabel>
                  <Select
                    name='progress'
                    placeholder='Progress'
                    value={input.progress}
                    onChange={event => handleFormChange(index, event)}
                    size='small'
                  >
                    {exerciseProgresses ? exerciseProgresses.map((exerciseProgress, index) => {
                      return(
                        <MenuItem key={index} value={exerciseProgress.progress}>
                          {exerciseProgress.progress}
                        </MenuItem>
                      );
                    }) : null}
                  </Select>
                </FormControl>
                <FormControl {...styleFormControl}>
                  <Button 
                    variant="contained" 
                    color="success" 
                    onClick={() => addFields(index)}
                  >
                    Add
                  </Button>
                </FormControl>
                <FormControl {...styleFormControl}>
                  <Button 
                    variant="contained" 
                    color="error" 
                    onClick={() => removeFields(index)}
                  >
                    Remove
                  </Button>
                </FormControl>
              </div>
            )
          })} 
        </Grid> 

        <Grid xs={12}>
          <Button variant="contained" onClick={addTraining}>Submit</Button>
        </Grid>
        
      </Grid>
    </React.Fragment>
  )
}