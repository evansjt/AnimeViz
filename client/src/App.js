import './App.css';
import AvgMembersPerYear from './visualizations/AvgMembersPerYear'
import QuarterlyMembersPerLast5Years from './visualizations/QuarterlyMembersPerLast5Years'
import AgeRatingCompOfBLGenre from './visualizations/AgeRatingCompOfBLGenre';
import CollaboratingProducers from './visualizations/CollaboratingProducers';
import DailyModeBroadcastTimesPerAge from './visualizations/DailyModeBroadcastTimesPerAgeRating';
import DemographicsOfBLandGLTitles from './visualizations/DemographicsOfBLandGLTitles';
import CollaboratingLicensorsAndStudios from './visualizations/CollaboratingLicensorsAndStudios';

function App() {
  return (
    <div className="App">
      <div className='graph-container'>
        <AvgMembersPerYear />
      </div>
      <div className='graph-container'>
        <AgeRatingCompOfBLGenre />
        <QuarterlyMembersPerLast5Years />
      </div>
      <div className='graph-container'>
        <CollaboratingProducers />
      </div>
      <div className='graph-container'>
        <DailyModeBroadcastTimesPerAge />
        <DemographicsOfBLandGLTitles />
      </div>
      <div className='graph-container'>
        <CollaboratingLicensorsAndStudios />
      </div>
    </div >
  );
}

export default App;
