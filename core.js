(function () {
  angular.module("core", ["stvCounter"])
  .controller("mainController", function (stvCounter) {
    var ctrl = this;

    ctrl.candidates = [];
    ctrl.ballots = [];
    ctrl.rounds = [];
    ctrl.elected = [];

    ctrl.submit = function () {

      ctrl.candidates = ctrl.candidatesText.split(/\r?\n/);
      ctrl.ballots = [];

      for (var i = 0; i < ctrl.votes; i++) {
        ctrl.ballots.push(shuffle(ctrl.candidates).slice(0));
      }
    }

    ctrl.example = function () {
      ctrl.ballots = getSnacksExample();
      ctrl.elected = stvCounter.count(3, ctrl.ballots);
      ctrl.rounds = stvCounter.rounds;
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