var wish = require("wish");
var nbModule = require("./nb");

nbModule();

describe("the file", function () {
  it("works", function () {
    wish(true);
  });
});
