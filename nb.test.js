function fileName() {
  var theError = new Error("here I am");
  return /\/(\w+\.test\.js)\:/.exec(theError.stack)[1];
}

function welcomeMessage() {
  return `Welcome to ${fileName()}!`;
}

function setDifficulties() {
  easy = "easy";
  medium = "medium";
  hard = "hard";
}
setDifficulties();

function setSongs() {
  imagine = ["c", "cmaj7", "f", "am", "dm", "g", "e7"];
  somewhereOverTheRainbow = ["c", "em", "f", "g", "am"];
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
}

var songs = [];
var allChords = new Set();
var labelCounts = new Map();
var labelProbabilities = new Map();
var chordCountsInLabels = new Map();
var probabilityOfChordsInLabels = new Map();

/**
 * Set labelCounts array
 * @param {string[]} chords Array of chords
 * @param {string} label difficulty level
 */
function train(chords, label) {
  songs.push({ label, chords });
  chords.forEach((chord) => allChords.add(chord));
  if (Array.from(labelCounts.keys()).includes(label)) {
    labelCounts.set(label, labelCounts.get(label) + 1);
  } else {
    labelCounts.set(label, 1);
  }
}

/**
 * set labelProbabilities
 */
function setLabelProbabilities() {
  labelCounts.forEach(function (_count, label) {
    labelProbabilities.set(label, labelCounts.get(label) / songs.length);
  });
}

/**
 * set chordCountsInLabels m * n matrix
 */
function setChordCountsInLabels() {
  songs.forEach(function (song) {
    if (chordCountsInLabels.get(song.label) === undefined) {
      chordCountsInLabels.set(song.label, {});
    }
    song.chords.forEach(function (chord) {
      if (chordCountsInLabels.get(song.label)[chord] > 0) {
        chordCountsInLabels.get(song.label)[chord] += 1;
      } else {
        chordCountsInLabels.get(song.label)[chord] = 1;
      }
    });
  });
}

/**
 * set probabilityOfChordsInLabels m * n matrix
 */
function setProbabilityOfChordsInLabels() {
  probabilityOfChordsInLabels = chordCountsInLabels;
  probabilityOfChordsInLabels.forEach(function (_chords, difficulty) {
    Object.keys(probabilityOfChordsInLabels.get(difficulty)).forEach(function (
      chord
    ) {
      probabilityOfChordsInLabels.get(difficulty)[chord] /= songs.length;
    });
  });
}

function trainAll() {
  setSongs();
  train(imagine, easy);
  train(somewhereOverTheRainbow, easy);
  train(tooManyCooks, easy);
  train(iWillFollowYouIntoTheDark, medium);
  train(babyOneMoreTime, medium);
  train(creep, medium);
  train(paperBag, hard);
  train(toxic, hard);
  train(bulletproof, hard);
  setLabelsAndProbabilities();
}

function setLabelsAndProbabilities() {
  setLabelProbabilities();
  setChordCountsInLabels();
  setProbabilityOfChordsInLabels();
}

/**
 * logs classified stuff
 * @param {string[]} chords array of chords
 */
function classify(chords) {
  const smoothing = 1.01;
  var classified = new Map();
  labelProbabilities.forEach(function (_probabilities, difficulty) {
    var first = labelProbabilities.get(difficulty) + smoothing;
    chords.forEach(function (chord) {
      var probabilityOfChordInLabel =
        probabilityOfChordsInLabels.get(difficulty)[chord];
      if (probabilityOfChordInLabel) {
        first = first * (probabilityOfChordInLabel + smoothing);
      }
    });
    classified.set(difficulty, first);
  });
  return classified;
}

// TESTS

describe("Characterization tests. The file:", function () {
  trainAll();
  it("classifies", function () {
    var classified = classify([
      "f#m7",
      "a",
      "dadd9",
      "dmaj7",
      "bm",
      "bm7",
      "d",
      "f#m",
    ]);
    expect(classified.get("easy")).toBe(1.3433333333333333);
    expect(classified.get("medium")).toBe(1.5060259259259259);
    expect(classified.get("hard")).toBe(1.6884223991769547);
  });

  it("classifies again", function () {
    var classified = classify(["d", "g", "e", "dm"]);
    expect(classified.get("easy")).toBe(2.023094827160494);
    expect(classified.get("medium")).toBe(1.855758613168724);
    expect(classified.get("hard")).toBe(1.855758613168724);
  });

  it("sets welcome message", function () {
    expect(welcomeMessage()).toBe("Welcome to nb.test.js!");
  });

  it("label probabilities", function () {
    expect(labelProbabilities.get("easy")).toBe(0.3333333333333333);
    expect(labelProbabilities.get("medium")).toBe(0.3333333333333333);
    expect(labelProbabilities.get("hard")).toBe(0.3333333333333333);
  });
});
