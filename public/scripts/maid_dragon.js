// https://shapecatcher.com/
// https://qaz.wtf/u/convert.cgi?text=name.
// https://gist.github.com/endolith/157796
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

function rollSymbols(animation=true) {
  reroll = true;
  while (reroll) {
    let str = "// ";
    let randIndex = Math.floor(randomint(0, messages.length));
    str += messages[randIndex];

    if (str != $("#bottom-symbols").text()) {
      // TODO: Add animations
      $("#bottom-symbols").text(str);
      reroll = false;
    }
  }
}

$(document).ready(function() {
  rollSymbols(animation=false);
});
