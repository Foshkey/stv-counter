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
      ctrl.ballots = getExample();
      ctrl.elected = stvCounter.count(2, ctrl.ballots);
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

    function getExample() {
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
  })
})()