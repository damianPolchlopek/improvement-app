import React, { Component } from 'react';
import {Table, Tbody, Thead, Tr, Th, Td} from 'react-super-responsive-table'
import axios from 'axios';

class PrintoutTraining  extends Component  {

    constructor(props) {
        super(props);

        this.state = {
            exercises: [],
            tmpRemoved: false
        };
    }

    componentDidMount(){
        const printExercisesUrl = 'http://localhost:8080/getExercises';
        axios.get(printExercisesUrl)
            .then(response => {
                // handle success
                this.setState({exercises: response.data});
            })
    }

    getExercisesByDate = (date) => {
        const printExercisesUrl = 'http://localhost:8080/getExercise/date/' + date;
        axios.get(printExercisesUrl)
            .then(response => {
                // handle success
                this.setState({exercises: response.data});
            })
    }

    getExercisesByName = (name) => {
        const printExercisesUrl = 'http://localhost:8080/getExercise/name/' + name;
        axios.get(printExercisesUrl)
            .then(response => {
                // handle success
                this.setState({exercises: response.data});
            })
    }

    removeExercise = (exerciseId) => {
        const deleteExercisesUrl = 'http://localhost:8080/deleteExercise/' + exerciseId;
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
        // {console.log(this.state.exercises)}
        return (
            <div>
                {( this.state.exercises[0] != null )
                    &&
                    <div className="container">
                
                        <h1>Printout Trening: {this.state.exercises[0].id}</h1>
                        
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