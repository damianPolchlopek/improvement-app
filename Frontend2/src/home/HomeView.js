import React from 'react';
import './HomeView.css';
import REST from '../utils/REST';


function HomeView() {
  return (
    <React.Fragment>
      <button onClick={() => REST.initTrainingModule()}>Init Training Module</button>
      <button onClick={() => REST.initFoodModule()}>Init Food Module</button>
    </React.Fragment>
  );
}

export default HomeView;
