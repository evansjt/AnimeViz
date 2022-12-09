import './App.css';
import AvgMembersPerYear from './visualizations/AvgMembersPerYear'
import QuarterlyMembersPerLast5Years from './visualizations/QuarterlyMembersPerLast5Years'
import AgeRatingCompOfBLGenre from './visualizations/AgeRatingCompOfBLGenre';
import CollaboratingProducers from './visualizations/CollaboratingProducers';
import DailyModeBroadcastTimesPerAge from './visualizations/DailyModeBroadcastTimesPerAgeRating';
import DemographicsOfBLandGLTitles from './visualizations/DemographicsOfBLandGLTitles';

function App() {
  return (
    <div className="App">
      <div className='graph-container'>
        <AvgMembersPerYear />
      </div>
      <div className='graph-container'>
        <QuarterlyMembersPerLast5Years />
        <AgeRatingCompOfBLGenre />
      </div>
      <div className='graph-container'>
        <CollaboratingProducers />
      </div>
      <div className='graph-container'>
        <DailyModeBroadcastTimesPerAge />
        <div style={{ width: window.innerWidth / 2 }}>
          <DemographicsOfBLandGLTitles style={{ height: '50%' }} />
          <div style={{ height: '50%', backgroundColor: 'black' }}></div>
        </div>
      </div>
    </div>
  );
}

export default App;
