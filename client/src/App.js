import './App.css';
import AvgMembersPerYear from './visualizations/AvgMembersPerYear'
import QuarterlyMembersPerLast5Years from './visualizations/QuarterlyMembersPerLast5Years'
import AgeRatingDistOfBLGenre from './visualizations/AgeRatingDistOfBLGenre';

function App() {
  return (
    <div className="App">
      <div className='graph-container'>
        <AvgMembersPerYear />
      </div>
      <div className='graph-container'>
        <QuarterlyMembersPerLast5Years />
        <AgeRatingDistOfBLGenre />
      </div>
    </div>
  );
}

export default App;
