import React, { useState, useEffect } from 'react';
import Canvas3 from './components/Canvas3';
import Dashboard from './components/Dashboard';
import ObjectList from './components/ObjectList';
import ThrusterChart from './components/ThrusterChart';
import DirectionChart from './components/DirectionChart';
import ColumnChart from './components/ColumnChart';
import OnOffChart from './components/OnOffChart';
import Switch from './components/Switch';
import TaskBoard from './components/TaskBoard';
import BoatPositionChart from './components/BoatPositionChart';
import VelocityChart from './components/VelocityChart';
import Boat from './components/images/boat.png';
import {Text} from 'react-konva';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  flexitem: {
    marginRight: "100px",
    marginLeft: "100px",
    marginTop: "40px"
  },
  container2: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  normal_container: {
    display: 'flex',
  }
};

const localwidth = 500;
const localheight = 500;
const globalwidth = 500;
const globalheight = 500;
const size_scale = 100; // So the distances display well in our UI
const l_g_scale = 0.2; // For converting local to global scales

const buffer = 0.2 // Buffer to check if two objects are the same, change as needed

// Const for graphs, change as needed
const Velocity_Min = 0;
const Velocity_Max = 1000;
const Temperature_Min = 0;
const Temperature_Max = 1000;
const AngVelocity_Min = 0;
const AngVelocity_Max = 1000;

var globalbuoys = [];
var globaldisplaybuoys = [];

function check_same_point(buoy_dict_1, buoy_dict_2){
  var temp = 0;
  temp+=Math.pow((buoy_dict_1.x - buoy_dict_2.x), 2);
  temp+=Math.pow((buoy_dict_1.y - buoy_dict_2.y), 2);
  temp = Math.sqrt(temp);
  return (temp<buffer);
}


function processInputDict(inputdict) {
  const localbuoys = inputdict.obstacles || [];
  const aibuoys = inputdict.Aiobstacles || [];
  let globalboat = inputdict.boat || [];

  // Dashboard display
  const localdashboardbuoys = [];

  // Global Boat Display Location
  const globaldisplayboat = {};
  globaldisplayboat["x"] = globalwidth / 2 + globalboat.x * size_scale;
  globaldisplayboat["y"] = globalheight - globalboat.y * size_scale;

  // Correct Angle (Radians)
  let theta = globalboat.theta;
  if (theta < -Math.PI) {
    theta += 2 * Math.PI;
  }

  // Conversion to Degrees
  globaldisplayboat["theta"] = theta * 180 / Math.PI;
  let orientation = theta * 180 / Math.PI;
  if (orientation !== undefined) {
    orientation = orientation.toFixed(1);
  }

  // Velocity
  let v = globalboat.v;
  if (v !== undefined) {
    v = v.toFixed(1);
  }

  // Angular Velocity
  let w = globalboat.w;
  if (w !== undefined) {
    w = w.toFixed(1);
  }

  let localdisplaybuoys = [];

  for (var buoy of localbuoys) {
    // Get rid of long decimals
    let dashboardbouy = {
      classname: buoy.classname,
      x: buoy.x.toFixed(1),
      y: buoy.y.toFixed(1),
      z: buoy.z.toFixed(1),
    };
    localdashboardbuoys.push(dashboardbouy);


    // For each buoy, calculate its local/global position and local/global display location
    let globaldict = {};
    let localdisplaydict = {};
    let globaldisplaydict = {};

    // Local to Global Conversion
    let theta2 = orientation * Math.PI / 180 - Math.PI / 2;
    let newx = (buoy.x * Math.cos(theta2) - buoy.y * Math.sin(theta2)) * l_g_scale + globalboat.x;
    let newy = (buoy.y * Math.cos(theta2) + buoy.x * Math.sin(theta2)) * l_g_scale + globalboat.y;

    // // Rounded x, y
    // globaldict["x"] = newx.toFixed(1);
    // globaldict["y"] = newy.toFixed(1);
    // globaldict["z"] = buoy.z.toFixed(1);
    // globaldict["classname"] = buoy.classname;
    // globalbuoys.push(globaldict);

    // Local display location
    localdisplaydict["x"] = localwidth / 2 + buoy.x * size_scale;
    localdisplaydict["y"] = localheight - buoy.y * size_scale;
    localdisplaydict["z"] = buoy.z;
    localdisplaydict["classname"] = buoy.classname;
    localdisplaybuoys.push(localdisplaydict);

    // // Global display location
    // globaldisplaydict["x"] = globalwidth / 2 + newx * size_scale;
    // globaldisplaydict["y"] = globalheight - newy * size_scale;
    // globaldisplaydict["z"] = buoy.z;
    // globaldisplaydict["classname"] = buoy.classname;
    // globaldisplaybuoys.push(globaldisplaydict);

    // Rounded x, y
    globaldict["x"] = newx.toFixed(1);
    globaldict["y"] = newy.toFixed(1);
    globaldict["z"] = buoy.z.toFixed(1);
    globaldict["classname"] = buoy.classname;

    var valid = true;
    for (var g_buoy of globalbuoys){
      if (check_same_point(globaldict, g_buoy)){
        valid = false;
        break;
      }
    }
    if (valid){
      globalbuoys.push(globaldict);
      // Global display location
      globaldisplaydict["x"] = globalwidth / 2 + newx * size_scale;
      globaldisplaydict["y"] = globalheight - newy * size_scale;
      globaldisplaydict["z"] = buoy.z;
      globaldisplaydict["classname"] = buoy.classname;
      globaldisplaybuoys.push(globaldisplaydict);

    } 
  }
  let aidisplaybuoys = []
  let aidashboardbuoys = [];
  for (var buoy of aibuoys) {
    // Get rid of long decimals
    let aibuoy = {
      classname: buoy.classname,
      x: buoy.x.toFixed(1),
      y: buoy.y.toFixed(1),
      z: buoy.z.toFixed(1),
    };
    aidashboardbuoys.push(aibuoy);

    let aidisplaydict = {};
  
    aidisplaydict["x"] = localwidth / 2 + buoy.x * size_scale;
    aidisplaydict["y"] = localheight - buoy.y * size_scale;
    aidisplaydict["z"] = buoy.z;
    aidisplaydict["classname"] = buoy.classname;
    aidisplaybuoys.push(aidisplaydict);
  }

  // Waypoint conversion
  const waypoints = inputdict.waypoints || [];
  const displaywaypoints = [];
  for (const point of waypoints) {
    let pointdict = {};
    pointdict["x"] = globalwidth / 2 + point.x * size_scale;
    pointdict["y"] = globalheight - point.y * size_scale;
    displaywaypoints.push(pointdict);
  }

  const temp = inputdict.temperature;
  const task = inputdict.task;

  // Convert leak, autonomous, alive to strings
  var leak = inputdict.leak;
  if (leak !== undefined) {
    leak = leak.toString();
  }
  var autonomous = inputdict.autonomous;
  if (autonomous !== undefined) {
    autonomous = autonomous.toString();
  }
  var alive = inputdict.alive;
  if (alive !== undefined) {
    alive = alive.toString();
  }
  const sL = inputdict.sL;
  const sR = inputdict.sR;

  // Sets them as copys so they are separate objects
  const g_displaybuoys = globaldisplaybuoys.slice();
  const g_buoys = globalbuoys.slice()
  
  const purpose = inputdict.purpose;

  return {
    localdashboardbuoys,
    localdisplaybuoys,
    globaldisplayboat,
    g_displaybuoys,
    g_buoys,
    displaywaypoints,
    temp,
    task,
    leak,
    autonomous,
    alive,
    sL,
    sR,
    v,
    w,
    orientation,
    globalboat,
    aidashboardbuoys,
    aidisplaybuoys,
    purpose
  };
}



function renderLocal(processedData) {
  return (
    <div key="local" className="App">
      <div className="Canvas-container" style={styles.normal_container}>
        <Canvas3
          boatPosition={{ x: localwidth / 2, y: localheight }}
          buoys={processedData.localdisplaybuoys}
          waypoints={[]}
          width={localwidth}
          height={localheight}
          style={styles.flexitem}
          local={true}
          boatImageSrc={Boat}
        />
        <ObjectList title="Local Objects" object={processedData.localdashboardbuoys} />
      </div>
    </div>
  );
}

function renderAI(ai_display_buoys, ai_dashboard_buoys, message) {
  return (
    <div key="local" className="App">
      <div className="Canvas-container" style={styles.normal_container}>
        <Canvas3
          boatPosition={{ x: localwidth / 2, y: localheight }}
          buoys={ai_display_buoys}
          waypoints={[]}
          width={localwidth}
          height={localheight}
          style={styles.flexitem}
          local={true}
          boatImageSrc={Boat}
        />
        <ObjectList title="Local Objects" object={ai_dashboard_buoys} />
        <Text text = {message}/>
      </div>
    </div>
  );
}

function renderGlobal(processedData) {
  return (
    <div key="global" className="App">
      <div className="Canvas-container" style={styles.normal_container}>
        <Canvas3
          boatPosition={processedData.globaldisplayboat}
          buoys={processedData.g_displaybuoys}
          waypoints={processedData.displaywaypoints}
          width={globalwidth}
          height={globalheight}
          style={styles.flexitem}
          local={false}
          boatImageSrc={Boat}
        />
        <ObjectList title="Global Objects" object={processedData.g_buoys} />
      </div>
    </div>
  );
}

function renderDashboardWithCharts(processedData) {
  return (
    <div key="dashboard" className="App" style={styles.container2}>
      <div key="firstrow" className="First" style={styles.container}>
        <ThrusterChart sL={processedData.sL} sR={processedData.sR} />
        <ColumnChart key="Velocity" min={Velocity_Min} max={Velocity_Max} val={processedData.v} title={"Velocity"} />
        <ColumnChart key="Angular Velocity" min={AngVelocity_Min} max={AngVelocity_Max} val={processedData.w} title={"Angular Velocity"} />
        <ColumnChart key="Temperature" min={Temperature_Min} max={Temperature_Max} val={processedData.temp} title={"Temperature"} />
      </div>
      <div key="secondrow" className="second" style={styles.container}>
        <DirectionChart orientation={processedData.orientation} />
        {/* On/Off Charts Section */}
        <OnOffChart
          sectionLabel={processedData.autonomous === 'true' ? 'Autonomous Mode' : 'NonAutonomous Mode'}
          sectionColor={processedData.autonomous === 'true' ? '#00FF00' : '#FF0000'}
        />
        <OnOffChart
          sectionLabel={processedData.alive === 'true' ? 'Alive' : 'Dead'}
          sectionColor={processedData.alive === 'true' ? '#00FF00' : '#FF0000'}
        />
        <OnOffChart
          sectionLabel={processedData.leak === 'true' ? 'Leak' : 'No Leak'}
          sectionColor={processedData.leak === 'true' ? '#FF0000' : '#00FF00'}
        />
        <div className="Task">
          <TaskBoard task={processedData.task} />
        </div>
      </div>
    </div>
  );
}

function renderGraphs(velocityData, timeData, xpositionData, ypositionData, curr, v_back, pos_back) {
  velocityData = velocityData.slice(Math.max(0, curr - v_back), curr);
  timeData = timeData.slice(Math.max(0, curr - v_back), curr);
  xpositionData = xpositionData.slice(Math.max(0, curr - pos_back), curr);
  ypositionData = ypositionData.slice(Math.max(0, curr - pos_back), curr);
  return (
    <div key="graphs" className="App">
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px', marginTop: '70px' }}>
        <VelocityChart velocityData={velocityData} timeData={timeData} />
        <BoatPositionChart xpositionData={xpositionData} ypositionData={ypositionData} />
      </div>
    </div>
  );
}

// Function used in the past, not current used
function Helper(inputdict) {
  const localbuoys = inputdict.obstacles || [];
  let globalboat = inputdict.boat || [];

  // Dashboard display
  const localdashboardbuoys = [];

  // Global Boat Display Location
  const globaldisplayboat = {};
  globaldisplayboat["x"] = globalwidth / 2 + globalboat.x * size_scale;
  globaldisplayboat["y"] = globalheight - globalboat.y * size_scale;

  // Correct Angle (Radians)
  let theta = globalboat.theta;
  if (theta < -Math.PI) {
    theta += 2 * Math.PI;
  }

  // Conversion to Degrees
  globaldisplayboat["theta"] = theta * 180 / Math.PI;
  let orientation = theta * 180 / Math.PI;
  if (orientation !== undefined) {
    orientation = orientation.toFixed(1);
  }

  // Velocity
  let v = globalboat.v;
  if (v !== undefined) {
    v = v.toFixed(1);
  }

  // Angular Velocity
  let w = globalboat.w;
  if (w !== undefined) {
    w = w.toFixed(1);
  }

  let localdisplaybuoys = [];

  for (const buoy of localbuoys) {
    // Get rid of long decimals
    let dashboardbouy = {
      classname: buoy.classname,
      x: buoy.x.toFixed(1),
      y: buoy.y.toFixed(1),
      z: buoy.z.toFixed(1),
    };
    localdashboardbuoys.push(dashboardbouy);

    // For each buoy, calculate its local/global position and local/global display location
    let globaldict = {};
    let localdisplaydict = {};
    let globaldisplaydict = {};

    // Local to Global Conversion
    let theta2 = orientation * Math.PI / 180 - Math.PI / 2;
    let newx = (buoy.x * Math.cos(theta2) - buoy.y * Math.sin(theta2)) * l_g_scale + globalboat.x;
    let newy = (buoy.y * Math.cos(theta2) + buoy.x * Math.sin(theta2)) * l_g_scale + globalboat.y;

    // Rounded x, y
    globaldict["x"] = newx.toFixed(1);
    globaldict["y"] = newy.toFixed(1);
    globaldict["z"] = buoy.z.toFixed(1);
    globaldict["classname"] = buoy.classname;
    globalbuoys.push(globaldict);

    // Local display location
    localdisplaydict["x"] = localwidth / 2 + buoy.x * size_scale;
    localdisplaydict["y"] = localheight - buoy.y * size_scale;
    localdisplaydict["z"] = buoy.z;
    localdisplaydict["classname"] = buoy.classname;
    localdisplaybuoys.push(localdisplaydict);

    // Global display location
    globaldisplaydict["x"] = globalwidth / 2 + newx * size_scale;
    globaldisplaydict["y"] = globalheight - newy * size_scale;
    globaldisplaydict["z"] = buoy.z;
    globaldisplaydict["classname"] = buoy.classname;
    globaldisplaybuoys.push(globaldisplaydict);
  }

  //Waypoint conversions
  const waypoints = inputdict.waypoints || [];
  const displaywaypoints = [];
  for (const point of waypoints) {
    let pointdict = {};
    pointdict["x"] = globalwidth / 2 + point.x * size_scale;
    pointdict["y"] = globalheight - point.y * size_scale;
    displaywaypoints.push(pointdict);
  }

  const temp = inputdict.temperature;
  const task = inputdict.task;

  // Convert leak, autonomous, and alive to strings
  var leak = inputdict.leak;
  if (leak !== undefined) {
    leak = leak.toString();
  }
  var autonomous = inputdict.autonomous;
  if (autonomous !== undefined) {
    autonomous = autonomous.toString();
  }
  var alive = inputdict.alive;
  if (alive !== undefined) {
    alive = alive.toString();
  }
  const sL = inputdict.sL;
  const sR = inputdict.sR;
  const localboat = { x: localwidth / 2, y: localheight };

  const g_displaybuoys = globaldisplaybuoys.slice();
  const g_buoys = globalbuoys.slice();

  return (
    <div className="App" style={styles.container}>
      <div className="Canvas-container" style={styles.container}>
        <Canvas3
          boatPosition={localboat}
          buoys={localdisplaybuoys}
          waypoints={[]}
          width={localwidth}
          height={localheight}
          style={styles.flexitem}
          local={true}
          boatImageSrc={Boat}
        />
        <ObjectList title="Local Objects" object={localdashboardbuoys} />
        <Canvas3
          boatPosition={globaldisplayboat}
          buoys={g_displaybuoys}
          waypoints={displaywaypoints}
          width={globalwidth}
          height={globalheight}
          style={styles.flexitem}
          local={false}
          boatImageSrc={Boat}
        />
        <ObjectList title="Global Objects" object={g_buoys} />
        <Dashboard
          temperature={temp}
          task={task}
          autonomous={autonomous}
          alive={alive}
          leak={leak}
          sL={sL}
          sR={sR}
          velocity={v}
          angvelocity={w}
          orientation={orientation}
          x={globalboat.x}
          y={globalboat.y}
        />
      </div>
    </div>
  );
}



export { Helper, processInputDict, renderLocal, renderGlobal, renderDashboardWithCharts, renderGraphs, renderAI };