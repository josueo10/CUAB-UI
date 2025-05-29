import React from 'react';
import Navigation from './images/navigation.png';
import Docking from './images/docking.png';
import Follow from './images/follow_path.png';
import NavigateChannel from './images/nav_channel.png';
import ReturnStart from './images/return_home_start.png';
import ReturnEnd from './images/return_home_end.png';
import SpeedChallenge from './images/speed_challenge.png';

const TaskBoard = ({ task }) => {
  let src;
  if (task === "RETURN_HOME_START") {
    src = ReturnStart;
  } else if (task === "RETURN_HOME_END") {
    src = ReturnEnd;
  } else if (task === "NAV_CHANNEL") {
    src = NavigateChannel;
  } else if (task === "FOLLOW_PATH") {
    src = Follow;
  } else if (task === "SPEED_CHALLENGE") {
    src = SpeedChallenge;
  } else if (task === "DOCKING") {
    src = Docking;
  } else {
    src = Follow;
  }
  return (
    <div style={{ width: "200px", height: "200px", border: '2px solid black',
      objectFit: "cover" 
      }}>
      <div> Task: {task}</div>
      <img
      src={src}
      alt="Task Preview"
      style={{ width: "196px", height: "175px", border : '2px solid black', objectFit: "cover" 
        }}
    />
      </div>
    
  )
}

export default TaskBoard;