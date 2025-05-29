import React, { useState, useEffect } from 'react';
import Canvas3 from './components/Canvas3';
import Dashboard from './components/Dashboard';
import ObjectList from './components/ObjectList';
import { Helper, processInputDict, renderLocal, renderGlobal, renderDashboard, renderOnOffCharts, renderDashboardWithCharts, renderGraphs , renderAI} from './Helper.js';
//import Switch from './components/Switch.js';

const styles = {
  // Existing Styles
  container: {
    display: 'flex',
  },
  flexitem: {
    marginRight: "40px",
    marginLeft: "40px",
    marginTop: "40px",
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: '10px 20px',
    color: '#fff',
  },
  navButtons: {
    display: 'flex',
    gap: '10px',
  },
  navButton: {
    backgroundColor: '#444',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    textTransform: 'uppercase',
  },
  activeButton: {
    backgroundColor: '#007BFF',
  },
  content: {
    margin: '20px',
  },
  slider: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 20px',
    backgroundColor: 'yellow', // Semi-transparent background
    borderRadius: '10px', // Optional: rounded edges
    width: '350px', // Set a fixed width for the slider
    marginTop: '5px',
    marginLeft: '10px', // Push it away from the left edge slightly
    border: '2px solid #ccc',
    fontWeight: 'bold',
  },

  // New Styles
  switchContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '90px',
    right: '20px',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    cursor: 'pointer',
    backgroundColor: '#ddd',
    padding: '10px', // Optional: To add some space around the button
    boxSizing: 'border-box', // Ensure padding is included in width and height
  },
  switchButton: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    position: 'absolute',
    top: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
    textTransform: 'uppercase',
    transition: 'background-color 0.3s ease',
    border: '2px solid #ccc',
  },
  switchLabel: {
    position: 'absolute',
    top: '-25px',
    left: '40%',
    transform: 'translateX(-50%)',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#333',
  },
};


var displaytimestampdict = {}; // Stores relative "timestamps"
var displaycount = 0; // Initial Timestamp
var initialframecaptureinterval = 1; // Initial Frame Capture Interval
var input_dict_list = [];

var x_data = []; // Tracking x data for live graphs
var y_data = []; // Tracking y data for live graphs
var time_data = []; // Tracking time data for live graphs
var v_data = []; // Tracking velocity data for live graphs

var direction = {
  'left': 1500,
  'right': 1500,
  'on': false
};

function App({ inputdict, ws}) {
  const [activeTab, setActiveTab] = useState('live');
  const [secondaryTab, setSecondaryTab] = useState('local'); // local, global, or dashboard
  const [currentStateIndex, setCurrentStateIndex] = useState(0); // Use state for the slider
  const [sliderMax, setSliderMax] = useState(0); // Manage sliderMax with state
  const [frameCaptureInterval, setFrameCaptureInterval] = useState(initialframecaptureinterval); // Slider to control frame capture interval (default every frame)
  const [frameCount, setFrameCount] = useState(0); // Tracks the current frame number
  const [isLiveDataOn, setIsLiveDataOn] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => { 
      const key = event.key.toLowerCase();
      if (key === 'w') {
        direction.left = Math.min(1900, direction.left + 50);
        direction.right = Math.min(1900, direction.right + 50);
        console.log("w")
      } else if (key === 's') {
        direction.left = Math.max(1100, direction.left - 50);
        direction.right = Math.max(1100, direction.right - 50);
        console.log("s")
      } else if (key === 'a') {
        direction.left = Math.max(1100, direction.left - 50);
        direction.right = Math.min(1900, direction.right + 50);
        console.log("a")
      } else if (key === 'd') {
        direction.left = Math.min(1900, direction.left + 50);
        direction.right = Math.max(1100, direction.right - 50);
        console.log("d")
      };
      console.log(ws)
      ws.send(JSON.stringify(direction));
      console.log(JSON.stringify(direction))
    };

    window.addEventListener('keypress', handleKeyPress);

    return () => {
      console.log("key is valid")
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [ws]);

  // Update displaydict and sliderMax when new inputdict arrives, based on the frameCaptureInterval
  useEffect(() => {
    if (inputdict) {
      setFrameCount((prevFrameCount) => {
        const nextFrameCount = prevFrameCount + 1;

        if (nextFrameCount % frameCaptureInterval === 0) {
          displaycount += frameCaptureInterval;
          displaytimestampdict[input_dict_list.length - 1] = displaycount - 2 * initialframecaptureinterval;

          // Process the data and add the dictionary of data, and specific data (x, y, time, velocity) to respective lists
          const curr_processed = processInputDict(inputdict);
          input_dict_list.push(curr_processed);
          x_data.push(curr_processed.globalboat.x);
          y_data.push(curr_processed.globalboat.y);
          time_data.push(nextFrameCount);
          v_data.push(curr_processed.v);

          // Update sliderMax based on new data
          setSliderMax(input_dict_list.length - 1);
        }
        return nextFrameCount;
      });
    }
  }, [inputdict]);

  const handleSliderChange = (e) => {
    setCurrentStateIndex(Number(e.target.value)); // Update current state
  };

  const handleCaptureIntervalChange = (e) => {
    setFrameCaptureInterval(Number(e.target.value)); // Update frame capture frequency
  };

  const renderTabContent = () => {
    if (input_dict_list.length === 0) {
      return <div>Loading...</div>; // Before anything has been processed
    } else {
      let processedData;
      let curr;
      if (activeTab === 'live') {
        processedData = input_dict_list[sliderMax];
        curr = sliderMax;
      } else if (activeTab === 'historical') {
        processedData = input_dict_list[currentStateIndex];
        curr = currentStateIndex;
      }
      if (secondaryTab === 'local') {
        return renderLocal(processedData);
      } else if (secondaryTab === 'global') {
        return renderGlobal(processedData);
      } else if (secondaryTab === 'dashboard') {
        return renderDashboardWithCharts(processedData);
      } else if (secondaryTab === 'graphs') {
        return renderGraphs(v_data, time_data, x_data, y_data, curr, 25, 25);
      } else if (secondaryTab == 'ai') {
        return renderAI(processedData.aidisplaybuoys, processedData.aidashboardbuoys, processedData.purpose);
      }
    }
  };

  return (
    <div className="App">
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navButtons}>
          <button
            style={{
              ...styles.navButton,
              ...(activeTab === 'live' ? styles.activeButton : {}),
            }}
            onClick={() => setActiveTab('live')}
          >
            Live Data
          </button>
          <button
            style={{
              ...styles.navButton,
              ...(activeTab === 'historical' ? styles.activeButton : {}),
            }}
            onClick={() => setActiveTab('historical')}
          >
            Historical Data
          </button>
        </div>
        <div style={styles.navButtons}>
          <button
            style={{
              ...styles.navButton,
              ...(secondaryTab === 'local' ? styles.activeButton : {}),
            }}
            onClick={() => setSecondaryTab('local')}
          >
            Local
          </button>

          <button
            style={{
              ...styles.navButton,
              ...(secondaryTab === 'Ai' ? styles.activeButton : {}),
            }}
            onClick={() => setSecondaryTab('Ai')}
          >
            Ai
          </button>

          <button
            style={{
              ...styles.navButton,
              ...(secondaryTab === 'global' ? styles.activeButton : {}),
            }}
            onClick={() => setSecondaryTab('global')}
          >
            Global
          </button>

    
          <button
            style={{
              ...styles.navButton,
              ...(secondaryTab === 'dashboard' ? styles.activeButton : {}),
            }}
            onClick={() => setSecondaryTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            style={{
              ...styles.navButton,
              ...(secondaryTab === 'graphs' ? styles.activeButton : {}),
            }}
            onClick={() => setSecondaryTab('graphs')}
          >
            Graphs
          </button>
        
        </div>
      </nav>

      {/* Slider for controlling frame capture interval */}
      <div style={{...styles.slider}}>
        <label>Capture Interval: {frameCaptureInterval} frames</label>
        <input
          type="range"
          min="1"
          max="100"
          value={frameCaptureInterval}
          onChange={handleCaptureIntervalChange}
          style={{width: '90%' }}
        />
      </div>

      <div style={{ margin: '20px' }}>
          <Switch ws={ws}/>
        </div>      

      {/* Slider control for historical data */}
      {activeTab === 'historical' && (
        <div style={{...styles.slider}}>
          <label>
            Relative Timestamp: {displaytimestampdict[Math.min(currentStateIndex, sliderMax - 1)]}
          </label>
          <input
            type="range"
            min="0"
            max={sliderMax}
            value={currentStateIndex}
            onChange={handleSliderChange}
            style={{width: '90%' }}
          />
        </div>
      )}

      {/* Render dynamic content */}
      <div style={styles.content}>{renderTabContent()}</div>
    </div>
  );
}

const Switch = () => {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    setIsOn(prevState => !prevState);
    direction.on = !direction.on;
  };

  return (
    <div style={styles.switchContainer} onClick={toggleSwitch}>
      <div style={styles.switchLabel}>
        UI_RC Mode
      </div>
      <div
        style={{
          ...styles.switchButton,
          backgroundColor: isOn ? '#4CAF50' : '#f44336',
        }}
      >
        {isOn ? 'On' : 'Off'}
      </div>
    </div>
  );
};

export default App;
