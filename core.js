(function () {
  angular.module("core", ["stvCounter"])
  .controller("mainController", function (stvCounter) {
    var ctrl = this;

    ctrl.toggleGeneratedExampleForm = function() {
      ctrl.generatedExampleForm.show = !ctrl.generatedExampleForm.show;
    }

    ctrl.fillAndreaExample = function () {
      let ballots = getAndreaExample();
      fillForm(ballots, 2);
    }

    ctrl.fillSnacksExample = function () {
      let ballots = getSnacksExample();
      fillForm(ballots, 3);
    }

    ctrl.fillGeneratedExample = function () {
      let candidates = ctrl.generatedExampleForm.candidatesText.split(/\r?\n/);
      let ballots = [];

      for (var i = 0; i < ctrl.generatedExampleForm.votes; i++) {
        ballots.push(shuffle(candidates).slice(0));
      }

      fillForm(ballots, ctrl.generatedExampleForm.seats)
    }

    function fillForm(ballots, seats) {
      ctrl.ballotsText = convertBallotsToText(ballots);
      ctrl.seats = seats;
    }

    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    }

    function convertBallotsToText(ballots) {
      let text = "";
      ballots.forEach(function (ballot) {
        ballot.forEach(function (candidate) {
          text += candidate + "\n";
        });
        text += "\n"
      });
      return text.trim();
    }

    function getAndreaExample() {
      let ballots = [];
      for (let i = 0; i < 16; i++) {
        ballots.push(["Andrea", "Brad", "Carter", "Delilah"]);
      }
      for (let i = 0; i < 24; i++) {
        ballots.push(["Andrea", "Carter", "Brad", "Delilah"]);
      }
      for (let i = 0; i < 17; i++) {
        ballots.push(["Delilah", "Andrea", "Brad", "Carter"]);
      }
      return ballots;
    }

    function getSnacksExample() {
      let ballots = [];
      for (let i = 0; i < 4; i++) {
        ballots.push(["Oranges"]);
      }
      for (let i = 0; i < 2; i++) {
        ballots.push(["Pears", "Oranges"]);
      }
      for (let i = 0; i < 8; i++) {
        ballots.push(["Chocolate", "Strawberries"]);
      }
      for (let i = 0; i < 4; i++) {
        ballots.push(["Chocolate", "Sweets"]);
      }
      for (let i = 0; i < 1; i++) {
        ballots.push(["Strawberries"]);
      }
      for (let i = 0; i < 1; i++) {
        ballots.push(["Sweets"]);
      }
      return ballots;
    }
  })
})()