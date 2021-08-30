import React, { Component } from 'react';
import {Table, Tbody, Tr, Th, Td} from 'react-super-responsive-table'
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

    removeExercise = (exerciseId) => {
        console.log('Delete Exercise - ' + exerciseId);
        const deleteExercisesUrl = 'http://localhost:8080/deleteExercise/' + exerciseId;
        axios.delete(deleteExercisesUrl)
            .then(response => {
                console.log('Delete Exercise - ' + exerciseId);
                var tmp = !this.state.tmpRemoved;
                this.setState({tmpRemoved: tmp});
                console.log(this.state.tmpRemoved);

                // todo: zmienic sposob przeladowywania strony
                this.props.history.push("/")
                this.props.history.push("/printout-training")
            })

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
                                    <Th></Th>
                                    <Th>Name</Th>
                                    <Th>Series</Th>
                                    <Th>Repetition</Th>
                                    <Th>Modify</Th>
                                    <Th>Remove</Th>
                                </Tr>
                            {/* </Thead> */}
                        
                            <Tbody>
                                {this.state.exercises.map(exercise => {
                                    
                                    return <Tr key={exercise.id}>
                                            <Td>{exercise.id}</Td>
                                            <Td>{exercise.name}</Td>
                                            <Td>{exercise.series}</Td>
                                            <Td>{exercise.repetition}</Td>
                                            <Td>
                                                <button className="btn btn-primary">
                                                    Modify
                                                </button>
                                            </Td>
                                            <Td><button 
                                                    className="btn btn-warning" 
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