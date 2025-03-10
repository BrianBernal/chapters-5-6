const songList = {
  difficulties: ["easy", "medium", "hard"],
  songs: [],
  addSong: function (name, chords, difficulty) {
    this.songs.push({
      name: name,
      chords: chords,
      difficulty: this.difficulties[difficulty],
    });
  },
};

const classifier = {
  songs: [],
  allChords: new Set(),
  labelCounts: new Map(),
  labelProbabilities: new Map(),
  chordCountsInLabels: new Map(),
  probabilityOfChordsInLabels: new Map(),
};

function fileName() {
  const theError = new Error("here I am");
  return /\/(\w+\.test\.js)\:/.exec(theError.stack)[1];
}

function welcomeMessage() {
  return `Welcome to ${fileName()}!`;
}

/**
 * Set labelCounts array
 * @param {string[]} chords Array of chords
 * @param {string} label difficulty level
 */
function train(chords, label) {
  classifier.songs.push({ label, chords });
  chords.forEach((chord) => classifier.allChords.add(chord));
  if (Array.from(classifier.labelCounts.keys()).includes(label)) {
    classifier.labelCounts.set(label, classifier.labelCounts.get(label) + 1);
  } else {
    classifier.labelCounts.set(label, 1);
  }
}

/**
 * set labelProbabilities
 */
function setLabelProbabilities() {
  classifier.labelCounts.forEach(function (_count, label) {
    classifier.labelProbabilities.set(
      label,
      classifier.labelCounts.get(label) / classifier.songs.length
    );
  });
}

/**
 * set chordCountsInLabels m * n matrix
 */
function setChordCountsInLabels() {
  classifier.songs.forEach(function (song) {
    if (classifier.chordCountsInLabels.get(song.label) === undefined) {
      classifier.chordCountsInLabels.set(song.label, {});
    }
    song.chords.forEach(function (chord) {
      if (classifier.chordCountsInLabels.get(song.label)[chord] > 0) {
        classifier.chordCountsInLabels.get(song.label)[chord] += 1;
      } else {
        classifier.chordCountsInLabels.get(song.label)[chord] = 1;
      }
    });
  });
}

/**
 * set probabilityOfChordsInLabels m * n matrix
 */
function setProbabilityOfChordsInLabels() {
  classifier.probabilityOfChordsInLabels = classifier.chordCountsInLabels;
  classifier.probabilityOfChordsInLabels.forEach(function (
    _chords,
    difficulty
  ) {
    Object.keys(classifier.probabilityOfChordsInLabels.get(difficulty)).forEach(
      function (chord) {
        classifier.probabilityOfChordsInLabels.get(difficulty)[chord] /=
          classifier.songs.length;
      }
    );
  });
}

function trainAll() {
  songList.songs.forEach(function (song) {
    train(song.chords, song.difficulty);
  });
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
  const classified = new Map();
  classifier.labelProbabilities.forEach(function (_probabilities, difficulty) {
    const likelihoods = [
      classifier.labelProbabilities.get(difficulty) + smoothing,
    ];
    chords.forEach(function (chord) {
      const probabilityOfChordInLabel =
        classifier.probabilityOfChordsInLabels.get(difficulty)[chord];
      if (probabilityOfChordInLabel) {
        likelihoods.push(probabilityOfChordInLabel + smoothing);
      }
    });
    const totalLikelihood = likelihoods.reduce(function (total, index) {
      return total * index;
    });
    classified.set(difficulty, totalLikelihood);
  });
  return classified;
}

// TESTS

describe("Characterization tests. The file:", function () {
  songList.addSong("imagine", ["c", "cmaj7", "f", "am", "dm", "g", "e7"], 0);
  songList.addSong("somewhereOverTheRainbow", ["c", "em", "f", "g", "am"], 0);
  songList.addSong("tooManyCooks", ["c", "g", "f"], 0);
  songList.addSong(
    "iWillFollowYouIntoTheDark",
    ["f", "dm", "bb", "c", "a", "bbm"],
    1
  );
  songList.addSong("babyOneMoreTime", ["cm", "g", "bb", "eb", "fm", "ab"], 1);
  songList.addSong(
    "creep",
    ["g", "gsus4", "b", "bsus4", "c", "cmsus4", "cm6"],
    1
  );
  songList.addSong(
    "paperBag",
    [
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
    ],
    2
  );
  songList.addSong(
    "toxic",
    ["cm", "eb", "g", "cdim", "eb7", "d7", "db7", "ab", "gmaj7", "g7"],
    2
  );
  songList.addSong("bulletproof", ["d#m", "g#", "b", "f#", "g#m", "c#"], 2);
  trainAll();
  it("classifies", function () {
    const classified = classify([
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
    const classified = classify(["d", "g", "e", "dm"]);
    expect(classified.get("easy")).toBe(2.023094827160494);
    expect(classified.get("medium")).toBe(1.855758613168724);
    expect(classified.get("hard")).toBe(1.855758613168724);
  });

  it("sets welcome message", function () {
    expect(welcomeMessage()).toBe("Welcome to nb.test.js!");
  });

  it("label probabilities", function () {
    expect(classifier.labelProbabilities.get("easy")).toBe(0.3333333333333333);
    expect(classifier.labelProbabilities.get("medium")).toBe(
      0.3333333333333333
    );
    expect(classifier.labelProbabilities.get("hard")).toBe(0.3333333333333333);
  });
});
