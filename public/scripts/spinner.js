
function removeWinner() {
  if (options.length == 0) {
    console.log("Nothing to remove");
    return;
  }
  if (winner < 0 || winner > options.length) {
    console.log("Invalid winner");
    return;
  }
  if (wheelState != -1) {
    console.log("Can't click when spinning");
    return;
  }
  if ($("#remove-button").hasClass("disabled")) {
    console.log("Button disabled")
    return;
  }

  // update text area with one person missing
  winnerName = options[winner][0];

  options = getRawOptions();
  winnerIndex = -1;
  for (let i = 0; i < options.length; i++) {
    if (options[i][0] == winnerName) {
      winnerIndex = i;
      break;
    }
  }
  if (winnerIndex == -1) {
    console.log("Winner already not there");
    return;
  }
  options.splice(winnerIndex, 1);

  newText = "";
  for(let i = 0; i < options.length; i++) {
    newText += options[i][0] + " " + options[i][1] + "\n";
  }
  $('textarea').val(newText);

  initWheel();
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function restitch(options) {
  let n = options.length
  let options1 = []
  let options2 = []
  for (let i = 0; i < Math.floor(n/2); i++) options1.push(options[i]);
  for (let i = Math.floor(n/2); i < n; i++) options2.push(options[i]);
  let newOptions = []
  for (let i = 0; i < Math.floor((n+1)/2); i++) {
    if (i < options1.length) newOptions.push(options1[i]);
    if (i < options2.length) newOptions.push(options2[i]);
  }
  return newOptions;
}

function getRawOptions() {
  // grab input
  let lines = $('textarea').val().split('\n');
  let options = [];

  totalScore = 0.0;
  for (let i = 0; i < lines.length; i++) {
    lines[i] = lines[i].trim();
    // ignore empty lines
    if (lines[i] == "") continue;

    let data = lines[i].split(" ");

    // remove invalid data and give a warning
    if (data.length != 2) {
      console.log("Invalid Data");
      console.log(data);
      continue;
    }
    username = data[0];
    score = parseFloat(data[1]);

    // ignore people with 0 chance of winning
    if (score == 0.0) continue;

    options.push([data[0], score]);
    totalScore += score;
  }
  return options;
}

// gets options from inputs
function getOptions() {
  options = getRawOptions();
  options = restitch(options);
  return options;
}

// calculate angles for options
function getOptionAngles(options) {
  let optionAngles = []

  let sumScore = 0.0;
  for (let i = 0; i < options.length; i++) {
    let angle1 = 360 * (sumScore / totalScore);
    let angle2 = 360 * ((sumScore + options[i][1]) / totalScore);
    optionAngles.push([angle1, angle2])

    sumScore += options[i][1];
  }
  return optionAngles
}

// randomly find a winner
function getWinner(seed, options) {
  console.log("Seed:", seed);
  Math.seedrandom(seed);

  let totalScore = 0.0;
  for (let i = 0; i < options.length; i++) totalScore += options[i][1];

  randomScore = Math.random() * totalScore;

  scoreSum = 0.0;
  for (let i = 0; i < options.length; i++) {
    if (scoreSum <= randomScore && randomScore < scoreSum + options[i][1]) {
      return i;
    }
    scoreSum += options[i][1];
  }
  // just in case it somehow missed everything
  return options.length-1;
}

// used in seeding
function getCurrentTime() {
  let today = new Date();
  let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  let time = today.getHours() + ":" + today.getMinutes() + ":"
             + today.getSeconds()+"."+today.getMilliseconds();
  let dateTime = date+' '+time;
  return dateTime;
}

// creates a wheel given some options
function createWheel(options) {
  $(".wheel-option").remove();
  $(".wheel-tick").remove();
  $("#wheel-ticker").remove();

  $("#spinner-box").append("<span id=\"wheel-ticker\">◀</span>");

  let totalScore = 0.0;
  for (let i = 0; i < options.length; i++) totalScore += options[i][1];

  let sumScore = 0.0;
  for (let i = 0; i < options.length; i++) {
    idStr = `wheel-option-${i}`;
    $("#spinner-box").append(
      `<span id="${idStr}" class="wheel-option">${options[i][0]}</span>`
    );

    // find boundaries, and take average
    let angle1 = optionAngles[i][0];
    let angle2 = optionAngles[i][1];
    let angle = (angle1 + angle2) / 2;
    $("#"+idStr).css('transform', 'rotate('+ angle +'deg)');

    // add tick marks
    $("#spinner-box").append(
      `<span id="wheel-tick-${i}" class="wheel-tick">-</span>`
    );
    $(`#wheel-tick-${i}`).css('transform', 'rotate('+ angle1 +'deg)');

    sumScore += options[i][1];
  }
}

function rescale(x, in_min, in_max, out_min, out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function displayWheel(wheelAngle) {
  for (let i = 0; i < options.length; i++) {
    // find boundaries, and take average
    let angle1 = wheelAngle + optionAngles[i][0];
    let angle2 = wheelAngle + optionAngles[i][1];
    let angle = (angle1 + angle2) / 2;
    $(`#wheel-option-${i}`).css('transform', 'rotate('+ angle +'deg)');
    $(`#wheel-tick-${i}`).css('transform', 'rotate('+ angle1 +'deg)');

    // change font size as it goes around the wheel
    while (angle < 0) angle += 360;
    while (angle >= 360) angle -= 360;
    let angleFromStart = 180-Math.min(360-angle, angle);
    let fontSize = rescale(angleFromStart, 0, 180, 0.0, 1.0)
    fontSize = rescale(fontSize * fontSize, 0.0, 1.0, 0.3, 1.0);
    $(`#wheel-option-${i}`).css('font-size', fontSize+'em');

    // change color when you are under the pointer
    while (angle2 < 0) angle1 += 360, angle2 += 360;
    while (angle2 >= 360) angle1 -= 360, angle2 -= 360;
    if (angle1 < 0.0 && angle2 > 0.0) {
      // $(`#wheel-option-${i}`).css('color', '#ffc107');
      $("#spinner-display").text(options[i][0]);
    } else {
      // $(`#wheel-option-${i}`).css('color', 'white');
    }
  }
  if (options.length == 0) {
    $("#spinner-display").text("");
  }
}

// work out the exact angle the winner needs to be at when we start settling
// for the pointed to land on that person
function calcSettleAngle() {
  _angle = 0.0;
  _speed = INITIAL_WHEEL_SPEED;
  while (_speed >= 0.1) {
    _angle += _speed;
    _speed *= WHEEL_DRAG;
    while (_angle > 720) _angle -= 720;
    while (_angle > 360) _angle -= 360;
  }

  return _angle;
}

var INITIAL_WHEEL_SPEED = 10.0;
var WHEEL_DRAG = 0.985;
var REVS_BEFORE_SETTLE = 0;
var SETTLE_ANGLE;

var interval;
var options;
var optionAngles = [];

var winner;
var wheelRevs
var wheelAngle = 0.0;
var wheelSpeed;
var totalScore = 0.0;
var wheelState = -1;
var angleToSettle;

function spinUpdate() {
  if (wheelState == 0) {
    wheelAngle += wheelSpeed;
    while (wheelAngle > 360) {
      wheelAngle -= 360;
      wheelRevs += 1;
    }

    // if at correct angle, then we start settling
    if (wheelRevs >= REVS_BEFORE_SETTLE) {
      let stop = false;
      if (wheelAngle <= angleToSettle && wheelAngle + wheelSpeed > angleToSettle) stop = true;
      if (wheelAngle <= 360+angleToSettle && wheelAngle + wheelSpeed > 360+angleToSettle) stop = true;

      if (stop) {
        console.log("Slowing down...")
        wheelAngle = angleToSettle;
        wheelSpeed = INITIAL_WHEEL_SPEED;
        wheelState = 1;
      }
    }

    displayWheel(wheelAngle);

  } else {
    if (wheelSpeed < 0.1) {
      console.log("Stopped spinning");
      console.log("Final Angle:", wheelAngle);
      clearInterval(interval);

      wheelState = -1;

      // enable remove button
      $("#update-button").removeClass("disabled")
      $("#remove-button").removeClass("disabled")

    } else {
      wheelAngle += wheelSpeed;
      wheelSpeed *= WHEEL_DRAG;

      while (wheelAngle > 360) wheelAngle -= 360;

      displayWheel(wheelAngle);
    }
  }
}

function spinWheel() {
  if (options.length == 0) {
    console.log("Nothing to spin");
    return;
  }

  console.log("=== NEW SPIN! ===")

  // calculate winner
  let seed = $("#seedtext").val();
  if (seed == '') seed = getCurrentTime();
  winner = getWinner(seed, options);
  console.log("Winner: ", winner, options[winner])

  // calculate the angle at which the spinner must end in order for winner to win
  let t = Math.random() * 0.6 + 0.2;
  let winnerAngle = - (t * optionAngles[winner][0] + (1-t) * optionAngles[winner][1]);
  while (winnerAngle < 0) winnerAngle += 360;
  while (winnerAngle >= 360) winnerAngle -= 360;
  console.log("winnerAngle", winnerAngle);

  // calculate the angle at which we need to settle in
  angleToSettle = winnerAngle - SETTLE_ANGLE;
  while (angleToSettle < 0) angleToSettle += 360;
  while (angleToSettle >= 360) angleToSettle -= 360;
  console.log("angleToSettle", angleToSettle);

  // start the spin
  clearInterval(interval);
  wheelRevs = 0;
  wheelState = 0;
  wheelSpeed = INITIAL_WHEEL_SPEED;
  interval = setInterval(spinUpdate, 33);

  // disable buttons
  $("#update-button").addClass("disabled")
  $("#remove-button").addClass("disabled");
}

// initialises the wheel and some variables
function initWheel() {
  if (wheelState != -1) {
    console.log("Can't click when spinning");
    return;
  }
  if ($("#update-button").hasClass("disabled")) {
    console.log("Button disabled")
    return;
  }

  options = getOptions();
  optionAngles = getOptionAngles(options);
  createWheel(options);
  if (options.length) displayWheel(-(optionAngles[0][0] + optionAngles[0][1])/2);
  else displayWheel(0.0);

  winner = 0;
  if (options.length) $("#remove-button").removeClass("disabled");
  else $("#remove-button").addClass("disabled");

  SETTLE_ANGLE = calcSettleAngle();
  console.log("SETTLE_ANGLE:", SETTLE_ANGLE);
}

$(document).ready(function() {
  initWheel();

  $("#spin-button").on("click", spinWheel);
  $("#update-button").on("click", initWheel);
  $("#remove-button").on("click", removeWinner);
})