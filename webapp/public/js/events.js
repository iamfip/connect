document.addEventListener('DOMContentLoaded', showRobotNav);
document.addEventListener('DOMContentLoaded', showWaypointNav);
document.addEventListener('keydown', keyboardEvent);

document.querySelector('#robot-nav').addEventListener('click', selectRobot);
document.querySelector('#waypoint-nav').addEventListener('click', selectWaypoint);
// document.querySelector('#video-conference').addEventListener('mousemove', mouseEvent);


// DOCUMENT EVENT HANDLERS
function showRobotNav() {
  const elems = document.querySelector('#robot-nav');
  const instances = M.Sidenav.init(elems, {
    edge: 'left',
    onOpenStart: updateRobotNav,
    onCloseStart: showRobotNavBtn
  });
}

function showRobotNavBtn() {
  document.getElementById('robot-nav-btn').style = "display:block";
}

function updateRobotNav(e) {
  let robotNav = document.getElementById('robot-nav');

  // clear list
  robotNav.textContent = '';

  // populate list
  for (robot of robotList) {
    let li = document.createElement('li');
    let a = document.createElement('a');
    a.id = robot.id;
    a.className = "sidenav-close white-text waves-effect";

    let i = document.createElement('i');
    i.className = "material-icons white-text";
    let iconName = document.createTextNode("link");

    let text = document.createTextNode(robot.id);

    i.append(iconName);
    a.appendChild(i);
    a.appendChild(text);
    li.appendChild(a);

    robotNav.insertBefore(li, robotNav.firstChild);
  }

  // hide robot-nav-btn
  document.getElementById('robot-nav-btn').style = "display:none";
}

function showWaypointNav() {
  const elems = document.querySelector('#waypoint-nav');
  const instances = M.Sidenav.init(elems, {
    edge: 'right',
    onOpenStart: updateWaypointNav,
    onCloseStart: showWaypointNavBtn
  });
}

function showWaypointNavBtn() {
  document.getElementById('robot-menu').style = "display:block";
}

function updateWaypointNav(e) {
  let waypointNav = document.getElementById('waypoint-nav');

  // clear list
  waypointNav.textContent = '';

  if (selectedRobot == undefined) {
    console.warn("Robot not selected");
  } else {
    // console.log(selectedRobot.id);
    for (waypoint of selectedRobot.waypointList) {
      // console.log(waypoint);
      let li = document.createElement('li');
      let a = document.createElement('a');
      a.id = waypoint;
      a.className = "sidenav-close white-text waves-effect";

      let text = document.createTextNode(waypoint);

      a.appendChild(text);
      li.appendChild(a);

      waypointNav.insertBefore(li, waypointNav.firstChild);
    }

    // hide robot-nav-btn
    document.getElementById('robot-menu').style = "display:none";
  }
}

// https://keycode.info/
function keyboardEvent(e) {
  if (selectedRobot == undefined) {
    console.warn("No robot selected");
  } else {
    switch (e.keyCode) {
      case 37: // ArrowLeft
      case 65: // a
        console.log('[Keycode] ArrowLeft / a');
        selectedRobot.cmdTurnLeft();
        break;

      case 39: // ArrowRight
      case 68: // d
        console.log('[Keycode] ArrowRight / d');
        selectedRobot.cmdTurnRight();
        break;

      case 38: // ArrowUp
      case 87: // w
        console.log('[Keycode] ArrowUp / w');
        selectedRobot.cmdMoveFwd();
        break;

      case 40: // ArrowDown
      case 83: // s
        console.log('[Keycode] ArrowDown / s');
        selectedRobot.cmdMoveBwd();
        break;

      case 85: // u
        console.log('[Keycode] u');
        selectedRobot.cmdTiltUp();
        break;

      case 74: // j
        console.log('[Keycode] j');
        selectedRobot.cmdTiltDown();
        break;
    }

    if (e.ctrlKey) {
      switch (e.keyCode) {
        case 70: // CTRL + f
          console.log('[Keycode] CTRL + f');
          selectedRobot.cmdFollow();
          break;
      }
    } 
  }
}


// CLICK EVENT HANDLERS

function selectRobot(e) {
  // console.log(`Selected Robot: ${e.target.id}`);
  selection = robotList.find(r => r.id == e.target.id);

  // check that the selection is valid
  if (selection != undefined) {
    if (selectedRobot == undefined) { // no robot in use
      // start new video conference
      vidCon.open(selection.id);
    } else { // robot is currently in use
      if (e.target.id != selectedRobot.id) {
        // close video conference
        vidCon.close();
      }

      // start new video conference
      vidCon.open(selection.id);
    }

    // assign robot selection
    selectedRobot = selection;

    // update battery state
    updateBatteryState(selectedRobot.batteryPercentage);

    // hide robot-nav-btn
    document.getElementById('robot-nav-btn').style = "display:none";

    // show robot menu
    document.getElementById('robot-menu').style = "display:block";
  }
}

function selectWaypoint(e) {
  selectedRobot.cmdGoto(e.target.id);
  console.log(`Selected Destination: ${selectedRobot.destination}`);
}

function mouseEvent(e) {
  console.log(`x: ${e.offsetX} | y: ${e.offsetY}`);
}


// HELPER FUNCTIONS

function updateBatteryState(value) {
  let batteryState = document.getElementById('battery-state');

  // @TODO "far fa-battery-bolt"

  if (value >= 87.5) {
    batteryState.className = "fas fa-battery-full";
  } else if (value >= 62.5 && value < 87.5) {
    batteryState.className = "fas fa-battery-three-quarters";
  } else if (value >= 37.5 && value < 62.5) {
    batteryState.className = "fas fa-battery-half";
  } else if (value >= 12.5 && value < 37.5) {
    batteryState.className = "fas fa-battery-quarter";
  } else if (value >= 0 && value < 12.5) {
    batteryState.className = "fas fa-battery-empty";
    batteryState.style = "color:red";
  } else {
    console.warn(`Battery value: ${value}`);
  }
}