import './HomeView.css';
import REST from '../utils/REST';


function HomeView() {
  return (
    <div>
      
      <button onClick={() => REST.initTrainingModule()}>Init Training Module</button>

      Home View
    </div>
  );
}

export default HomeView;
