import './App.css';
import AvgMembersPerYear from './visualizations/AvgMembersPerYear'
import QuarterlyMembersPerLast5Years from './visualizations/QuarterlyMembersPerLast5Years'

function App() {
  return (
    <div className="App">
      <AvgMembersPerYear />
      <div className='graph-container'>
        <QuarterlyMembersPerLast5Years />
      </div>
    </div>
  );
}

export default App;
