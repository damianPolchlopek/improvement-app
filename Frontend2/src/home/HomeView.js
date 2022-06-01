import React from 'react';
import './HomeView.css';
import REST from '../utils/REST';


function HomeView() {
  return (
    <div>
      
      <button onClick={() => REST.initTrainingModule()}>Init Training Module</button>

    </div>
  );
}

export default HomeView;
