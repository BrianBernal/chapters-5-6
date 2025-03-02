imagine = ["c", "cmaj7", "f", "am", "dm", "g", "e7"];
somehereOverTheRainbow = ["c", "em", "f", "g", "am"];
tooManyCooks = ["c", "g", "f"];
iWillFollowYouIntoTheDark = ["f", "dm", "bb", "c", "a", "bbm"];
babyOneMoreTime = ["cm", "g", "bb", "eb", "fm", "ab"];
creep = ["g", "gsus4", "b", "bsus4", "c", "cmsus4", "cm6"];
paperBag = [
  "bm7",
  "e",
  "c",
  "g",
  "b7",
  "f",
  "em",
  "a",
  "cmaj7",
  "em7",
  "a7",
  "f7",
  "b",
];
toxic = ["cm", "eb", "g", "cdim", "eb7", "d7", "db7", "ab", "gmaj7", "g7"];
bulletproof = ["d#m", "g#", "b", "f#", "g#m", "c#"];

var songs = [];
var labels = [];
var allChords = [];
var labelCounts = [];
var labelProbabilities = [];
var chordCountsInLabels = {};
var probabilityOfChordsInLabels = {};

/**
 * Set labelCounts array
 * @param {string[]} chords Array of chords
 * @param {string} label difficulty level
 */
function train(chords, label) {
  songs.push([label, chords]);
  labels.push(label);
  for (var index = 0; index < chords.length; index++) {
    if (!allChords.includes(chords[index])) {
      allChords.push(chords[index]);
    }
  }
  if (Object.keys(labelCounts).includes(label)) {
    labelCounts[label] = labelCounts[label] + 1;
  } else {
    labelCounts[label] = 1;
  }
}

/**
 * stupid function
 * @returns songs.length
 */
function getNumberOfSongs() {
  return songs.length;
}

/**
 * set labelProbabilities
 */
function setLabelProbabilities() {
  Object.keys(labelCounts).forEach(function (label) {
    var numberOfSongs = getNumberOfSongs();
    labelProbabilities[label] = labelCounts[label] / numberOfSongs;
  });
}

/**
 * set chordCountsInLabels m * n matrix
 */
function setChordCountsInLabels() {
  songs.forEach(function (difficulty) {
    if (chordCountsInLabels[difficulty[0]] === undefined) {
      chordCountsInLabels[difficulty[0]] = {};
    }
    difficulty[1].forEach(function (chord) {
      if (chordCountsInLabels[difficulty[0]][chord] > 0) {
        chordCountsInLabels[difficulty[0]][chord] =
          chordCountsInLabels[difficulty[0]][chord] + 1;
      } else {
        chordCountsInLabels[difficulty[0]][chord] = 1;
      }
    });
  });
}

/**
 * set probabilityOfChordsInLabels m * n matrix
 */
function setProbabilityOfChordsInLabels() {
  probabilityOfChordsInLabels = chordCountsInLabels;
  Object.keys(probabilityOfChordsInLabels).forEach(function (i) {
    Object.keys(probabilityOfChordsInLabels[i]).forEach(function (j) {
      probabilityOfChordsInLabels[i][j] =
        (probabilityOfChordsInLabels[i][j] * 1.0) / songs.length;
    });
  });
}

train(imagine, "easy");
train(somehereOverTheRainbow, "easy");
train(tooManyCooks, "easy");
train(iWillFollowYouIntoTheDark, "medium");
train(babyOneMoreTime, "medium");
train(creep, "medium");
train(paperBag, "hard");
train(toxic, "hard");
train(bulletproof, "hard");

setLabelProbabilities();
setChordCountsInLabels();
setProbabilityOfChordsInLabels();

/**
 * logs classified stuff
 * @param {string[]} chords array of chords
 */
function classify(chords) {
  var total = labelProbabilities;
  console.log(total);
  var classified = {};
  Object.keys(total).forEach(function (difficultyKey) {
    var first = labelProbabilities[difficultyKey] + 1.01;
    chords.forEach(function (chord) {
      var probabilityOfChordInLabel =
        probabilityOfChordsInLabels[difficultyKey][chord];
      if (probabilityOfChordInLabel === undefined) {
        first + 1.01;
      } else {
        first = first * (probabilityOfChordInLabel + 1.01);
      }
    });
    classified[difficultyKey] = first;
  });
  console.log(classified);
}

function bootstrap() {
  classify(["d", "g", "e", "dm"]);
  classify(["f#m7", "a", "dadd9", "dmaj7", "bm", "bm7", "d", "f#m"]);
}

module.exports = bootstrap;
