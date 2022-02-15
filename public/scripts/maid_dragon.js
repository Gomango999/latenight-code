// https://shapecatcher.com/
// https://qaz.wtf/u/convert.cgi?text=name.
// https://gist.github.com/endolith/157796
blank = "• • • • •"
messages = [
  "♪ ⌒ ヮ ⌒ ♪",
  "# - _ - )",
  "( ⌾ д ⌾ )",
  "( ° 𝞺 ° )",
  "⚂ → $ → ⚃",
  "⚄ → ⚅ → G",
  "Ⓑ 𝐞 𝐚 𝐫 !",
  "𝐧 𝐚 𝐦 𝐞 .",
  "🔥 ( ⏝ ω ⏝",
  "☆ ( - ന -",
  "- ◎ - ◎ -",
  "🐍 ☞ ! ☞ ?",
  "( Ф ω Ф )",
  "🀆 🀙 🀑 🀙 🀆",
]

function randomint(a, b) {
  return Math.random() * (b-a) + a;
}

function setSymbols(target, stage) {
  target = target.split(" ");
  for (let i = stage+2; i < target.length; i++) {
    target[i] = "•";
  }
  newStr = target.join(" ");
  $("#bottom-symbols").text(newStr);
}

let timeouts = []

function rollSymbols(animation=true) {
  let reroll = true;
  let str = "// ";
  while (reroll) {
    str = "// ";
    let randIndex = Math.floor(randomint(0, messages.length));
    str += messages[randIndex];

    reroll = true;
    if (str != $("#bottom-symbols").text()) {
      reroll = false;
    }
  }

  if (animation) {
    // stop previous timeouts
    while (timeouts.length != 0) {
      clearTimeout(timeouts.pop());
    }

    // set new timeout
    $("#bottom-symbols").text("// " + blank);
    for (let i = 0; i < 5; i++) {
      timeout = setTimeout(function(){setSymbols(str, i)}, (i+1)*1000);
      timeouts.push(timeout);
    }
  } else {
    $("#bottom-symbols").text(str);
  }
}

$(document).ready(function() {
  rollSymbols(animation=false);
});
