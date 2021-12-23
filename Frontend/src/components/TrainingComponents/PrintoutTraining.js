import React, { Component } from 'react';
import {Table, Tbody, Thead, Tr, Th, Td} from 'react-super-responsive-table'
import axios from 'axios';

const originName = 'http://localhost:8080/exercise/';

class PrintoutTraining  extends Component  {

    constructor(props) {
        super(props);

        this.state = {
            exercises: [],
            tmpRemoved: false
        };
    }

    componentDidMount(){
        const printExercisesUrl = originName + 'getExercises';
        axios.get(printExercisesUrl)
            .then(response => {
                // handle success
                this.setState({exercises: response.data.entity});
            })
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

    removeExercise = (exerciseId) => {
        const deleteExercisesUrl = originName + 'deleteExercise/' + exerciseId;
        axios.delete(deleteExercisesUrl)
            .then(response => {
                var tmp = !this.state.tmpRemoved;
                this.setState({tmpRemoved: tmp});

                // todo: zmienic sposob przeladowywania strony
                this.props.history.push("/")
                this.props.history.push("/printout-training")
            })

    }

    modifyExercise = (exerciseId) => {
        console.log(exerciseId);
    }

    render () {
        return (
            <div>
                {( this.state.exercises[0] != null )
                    &&
                    <div className="container">
                
                        <br />
                        <h1>Trainings: </h1>
                        <br />
                        
                        <Table className="table table-striped">
                            {/* <Thead className="thead-dark"> */}
                                <Tr>
                                    <Th>Date</Th>
                                    <Th>Name</Th>
                                    <Th>Repetition</Th>
                                    <Th>Weight</Th>
                                    <Th>Modify</Th>
                                    <Th>Remove</Th>
                                </Tr>
                            {/* </Thead> */}
                        
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
                        
                    </div>}
            </div>
        )
      }
}
  
export default PrintoutTraining;