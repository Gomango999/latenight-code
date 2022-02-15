
function getOptions() {
  // grab input
  let lines = $('textarea').val().split('\n');
  let options = [];

  for(let i = 0; i < lines.length; i++){

    lines[i] = lines[i].trim();
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
  }

  return options;
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
  let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()+"."+today.getMilliseconds();
  let dateTime = date+' '+time;
  return dateTime;
}

function spinWheel() {
  let options = getOptions();

  let seed = $("#seedtext").val();
  if (seed == '') seed = getCurrentTime();
  let winner = getWinner(seed, options);
  console.log("Winner: ", winner, options[winner])
}

$(document).ready(function() {
  $("#spinbutton").on("click", spinWheel);
})