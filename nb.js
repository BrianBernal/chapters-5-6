fs = require("fs");

// songs
imagine = ["c", "cmaj7", "f", "am", "dm", "g", "e7"];
somewhere_over_the_rainbow = ["c", "em", "f", "g", "am"];
tooManyCooks = ["c", "g", "f"];
iWillFollowYouIntoTheDark = ["f", "dm", "bb", "c", "a", "bbm"];
babyOneMoreTime = ["cm", "g", "bb", "eb", "fm", "ab"];
creep = ["g", "gsus4", "b", "bsus4", "c", "cmsus4", "cm6"];
army = ["ab", "ebm7", "dbadd9", "fm7", "bbm", "abmaj7", "ebm"];
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
song_11 = [];

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
  for (var i = 0; i < chords.length; i++) {
    if (!allChords.includes(chords[i])) {
      allChords.push(chords[i]);
    }
  }
  if (!!Object.keys(labelCounts).includes(label)) {
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
  songs.forEach(function (i) {
    if (chordCountsInLabels[i[0]] === undefined) {
      chordCountsInLabels[i[0]] = {};
    }
    i[1].forEach(function (j) {
      if (chordCountsInLabels[i[0]][j] > 0) {
        chordCountsInLabels[i[0]][j] = chordCountsInLabels[i[0]][j] + 1;
      } else {
        chordCountsInLabels[i[0]][j] = 1;
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
train(somewhere_over_the_rainbow, "easy");
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
  var ttal = labelProbabilities;
  console.log(ttal);
  var classified = {};
  Object.keys(ttal).forEach(function (obj) {
    var first = labelProbabilities[obj] + 1.01;
    chords.forEach(function (chord) {
      var probabilityOfChordInLabel = probabilityOfChordsInLabels[obj][chord];
      if (probabilityOfChordInLabel === undefined) {
        first + 1.01;
      } else {
        first = first * (probabilityOfChordInLabel + 1.01);
      }
    });
    classified[obj] = first;
  });
  console.log(classified);
}

function bootstrap() {
  classify(["d", "g", "e", "dm"]);
  classify(["f#m7", "a", "dadd9", "dmaj7", "bm", "bm7", "d", "f#m"]);
}

module.exports = bootstrap;
