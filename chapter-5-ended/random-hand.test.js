/**
 * Untested Code and Characterization
 */

// PROGRAM

var suits = ['H', 'D', 'S', 'C'];
var values = ['1', '2', '3', '4', '5', '6',
              '7', '8', '9', '10', 'J', 'Q', 'K'];
var randomSuit = function(){
  return suits[Math.floor(Math.random()*(suits.length))];
};
var randomValue = function(){
  return values[Math.floor(Math.random()*(values.length))];
};
var randomCard = function(){
 return randomValue() + '-' + randomSuit();
};

var buildCardArray = function(){ 
  var tempArray = [];
  for(var i=0; i < values.length; i++){
    for(var j=0; j < suits.length; j++){
      tempArray.push(values[i]+'-'+suits[j])
    }
  };
  return tempArray;
 };
 
var spliceCard = function(cardArray){
  var takeAway = cardArray.splice(
                 Math.floor(Math.random()*cardArray.length), 1)[0];
  return [takeAway, cardArray];
};

var randomHand = function(){
  var cards = [];
  var cardArray = buildCardArray();
  [cards[0], cardArray] = spliceCard(cardArray);
  [cards[1], cardArray] = spliceCard(cardArray);
  [cards[2], cardArray] = spliceCard(cardArray);
  [cards[3], cardArray] = spliceCard(cardArray);
  [cards[4], cardArray] = spliceCard(cardArray);
  return cards;
};
console.log(randomHand());

// TESTS

const wish = require("wish");

describe('spliceCard()', function() {
  it('returns two things', function() {
    wish(spliceCard(buildCardArray()).length === 2);
  });
  it('returns the selected card', function() {
    wish(spliceCard(buildCardArray())[0].match(/\w{1,2}-[HDSC]/));
  });
  it('returns an array with one card gone', function() {
    wish(spliceCard(buildCardArray())[1].length ===
      buildCardArray().length - 1);
  });
});

describe('buildCardArray()', function() {
  it('returns a full deck', function() {
    wish(buildCardArray().length === 52);
  });
});

describe("randomCard()", function () {
  it("returns match for card", function () {
    wish(randomCard().match(/\w{1,2}-[HDSC]/));
  });
});
describe("randomValue()", function () {
  it("returns match for card value", function () {
    wish(randomValue().match(/\w{1,2}/));
  });
});
describe("randomSuit()", function () {
  it("returns match for suit", function () {
    wish(randomSuit().match(/[HDSC]/));
  });
});
