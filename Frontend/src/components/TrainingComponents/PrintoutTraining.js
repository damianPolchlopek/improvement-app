import React, { Component } from 'react';
import {Table, Tbody, Thead, Tr, Th, Td} from 'react-super-responsive-table'
import axios from 'axios';
import TrainingListRow from './TrainingListRow';

const originName = 'http://localhost:8080/exercise/';

class PrintoutTraining  extends Component  {

    constructor(props) {
        super(props);

        this.state = {
            trainingNames: []
        };
    }

    componentDidMount(){        
        const printTrainingUrl = originName + 'getTrainingNames';
        axios.get(printTrainingUrl)
            .then(response => {
                // handle success
                this.setState({trainingNames: response.data.entity});
                // console.log(response.data.entity);
            })
    }

    render () {
        return (
            <div>
                {( this.state.trainingNames[0] != null )
                    &&
                    <div className="container">
                
                        <br />
                        <h1 className="text-center">Trainings: </h1>
                        <br />

                        <Table className="table table-striped">
                            <Tbody>
                                {this.state.trainingNames.map(trainingName => {
                                    return <Tr key={trainingName + '1'}>
                                        <Td key={trainingName + '2'}>
                                            <TrainingListRow 
                                                key={trainingName}
                                                trainingName={trainingName} />
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