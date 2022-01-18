import React, { Component } from 'react';
import {Table, Tbody, Thead, Tr, Th, Td} from 'react-super-responsive-table'
import axios from 'axios';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import Constants from '../Constants';

const originName = Constants.BASE_URL + 'exercise/';

class TrainingListRow  extends Component  {

    constructor(props) {
        super(props);

        this.state = {
            exercises: [],
            isClicked: false
        };
    }

    getExercisesByTrainingName = (trainingName) => {
        trainingName = trainingName.replace(/ /g,"_");
        console.log(trainingName);

        const printExercisesUrl = originName + 'getExercise/trainingName/' + trainingName;
        axios.get(printExercisesUrl)
            .then(response => {
                // handle success
                this.setState({exercises: response.data.entity});
            })
    }

    removeExercise = (exerciseId) => {
        console.log("Delete exercise: " + exerciseId);

        // const deleteExercisesUrl = originName + 'deleteExercise/' + exerciseId;
        // axios.delete(deleteExercisesUrl)
        //     .then(response => {
        //         var tmp = !this.state.tmpRemoved;
        //         this.setState({tmpRemoved: tmp});

        //         // todo: zmienic sposob przeladowywania strony
        //         this.props.history.push("/")
        //         this.props.history.push("/printout-training")
        //     })

    }

    modifyExercise = (exerciseId) => {
        console.log("Modify exercise: " + exerciseId);
    }

    getExercisesByDate = (date) => {
        const printExercisesUrl = originName + 'getExercise/date/' + date;
        axios.get(printExercisesUrl)
            .then(response => {
                // handle success
                this.setState({exercises: response.data.entity});
            })
    }

    getExercisesByName = (name) => {
        const printExercisesUrl = originName + 'getExercise/name/' + name;
        axios.get(printExercisesUrl)
            .then(response => {
                // handle success
                this.setState({exercises: response.data.entity});
            })
    }

    handleClick = () => {
        var oldState = this.state.isClicked;
        this.setState({isClicked: !oldState})

        this.getExercisesByTrainingName(this.props.trainingName);
    }

    render () {
        return (
            <div>
                <div onClick={()=> this.handleClick()} 
                    style={{display: 'flex', justifyContent: 'center'}}>
                    {this.props.trainingName}
                </div>

                {( this.state.isClicked )
                    &&

                    <Table className="table table-striped">
                        <Thead>
                            <Tr>
                                <Th>Date</Th>
                                <Th>Name</Th>
                                <Th>Repetition</Th>
                                <Th>Weight</Th>
                                <Th>Modify</Th>
                                <Th>Remove</Th>
                            </Tr>
                        </Thead>

                        <Tbody>
                            {this.state.exercises.map(exercise => {
                                return <Tr key={exercise.id}>
                                    <Td onClick={() => this.getExercisesByDate(exercise.date)}>{exercise.date}</Td>
                                    <Td onClick={() => this.getExercisesByName(exercise.name)}>{exercise.name}</Td>
                                    <Td>{exercise.reps}</Td>
                                    <Td>{exercise.weight}</Td>
                                    <Td>
                                        <button 
                                            className="btn btn-success"
                                            onClick={() => this.modifyExercise(exercise.id)}>
                                                Modify
                                        </button>
                                    </Td>
                                    <Td><button 
                                            className="btn btn-danger" 
                                            onClick={() => this.removeExercise(exercise.id)}>
                                                Remove
                                        </button>
                                    </Td>
                                </Tr>
                                
                            })}
                        </Tbody>
                    </Table>
                }       

            </div>
        )
      }
}
  
export default TrainingListRow;
