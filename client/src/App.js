import './App.css';
import AvgMembersPerYear from './visualizations/AvgMembersPerYear'
import QuarterlyMembersPerLast5Years from './visualizations/QuarterlyMembersPerLast5Years'
import AgeRatingCompOfBLGenre from './visualizations/AgeRatingCompOfBLGenre';
import CollaboratingProducers from './visualizations/CollaboratingProducers';
import DailyModeBroadcastTimesPerAge from './visualizations/DailyModeBroadcastTimesPerAgeRating';
import DemographicsOfBLandGLTitles from './visualizations/DemographicsOfBLandGLTitles';
import CollaboratingLicensorsAndStudios from './visualizations/CollaboratingLicensorsAndStudios';
import LongestRunningTVAnimeSeries from './visualizations/LongestRunningTVAnimeSeries';

function App() {
  return (
    <div className="App">
      <div className='graph-container'>
        <AvgMembersPerYear />
      </div>
      <div className='graph-container two-graph' style={{ minHeight: 750 }}>
        <QuarterlyMembersPerLast5Years />
        <AgeRatingCompOfBLGenre />
      </div>
      <div className='graph-container'>
        <CollaboratingProducers />
      </div>
      <div className='graph-container two-graph' style={{ minHeight: 1030 }}>
        <DailyModeBroadcastTimesPerAge />
        <DemographicsOfBLandGLTitles />
      </div>
      <div className='graph-container'>
        <CollaboratingLicensorsAndStudios />
      </div>
      <div className='graph-container'>
        <LongestRunningTVAnimeSeries />
      </div>
    </div >
  );
}

export default App;