(function () {
  angular.module("core", ["stvCounter"])
  .controller("mainController", function (stvCounter) {
    var ctrl = this;

    ctrl.countVotes = function () {
      ctrl.ballots = parseBallotsText(ctrl.ballotForm.text);
      ctrl.seats = ctrl.ballotForm.seats;

      ctrl.elected = stvCounter.count(ctrl.seats, ctrl.ballots);
      ctrl.rounds = stvCounter.rounds;
      ctrl.quota = stvCounter.quota;
      ctrl.tie = ctrl.elected.length < ctrl.seats;
    }

    ctrl.toggleBallotFormHelp = function () {
      ctrl.ballotForm.showHelp = !ctrl.ballotForm.showHelp;
    }

    ctrl.toggleGeneratedExampleForm = function () {
      ctrl.generatedExampleForm.show = !ctrl.generatedExampleForm.show;
    }

    ctrl.fillAndreaExample = function () {
      var ballots = getAndreaExample();
      fillForm(ballots, 2);
    }

    ctrl.fillSnacksExample = function () {
      var ballots = getSnacksExample();
      fillForm(ballots, 3);
    }

    ctrl.fillGeneratedExample = function () {
      var candidates = ctrl.generatedExampleForm.candidatesText.split(/\r?\n/);
      var ballots = [];

      for (var i = 0; i < ctrl.generatedExampleForm.votes; i++) {
        ballots.push(shuffle(candidates).slice(0));
      }

      fillForm(ballots, ctrl.generatedExampleForm.seats)
    }

    function fillForm(ballots, seats) {
      ctrl.ballotForm.text = convertBallotsToText(ballots);
      ctrl.ballotForm.seats = seats;
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
      var text = "";
      ballots.forEach(function (ballot) {
        ballot.forEach(function (candidate) {
          text += candidate + "\n";
        });
        text += "\n"
      });
      return text.trim();
    }

    function parseBallotsText(text) {
      var ballots = [];
      var ballotTexts = text.split(/\r?\n\r?\n/);
      ballotTexts.forEach(function (ballotText) {
        var ballot = ballotText.split(/\r?\n/);
        ballot = ballot.map(function (candidate) { return getCandidateName(candidate); })
        ballots.push(ballot);
      });
      return ballots;
    }

    function getCandidateName(candidate) {
      return candidate.trim().replace(/\w\S*/g, function (name) {
        return name.charAt(0).toUpperCase() + name.substr(1).toLowerCase();
      })
    }

    function getAndreaExample() {
      var ballots = [];
      for (var i = 0; i < 16; i++) {
        ballots.push(["Andrea", "Brad", "Carter", "Delilah"]);
      }
      for (var i = 0; i < 24; i++) {
        ballots.push(["Andrea", "Carter", "Brad", "Delilah"]);
      }
      for (var i = 0; i < 17; i++) {
        ballots.push(["Delilah", "Andrea", "Brad", "Carter"]);
      }
      return ballots;
    }

    function getSnacksExample() {
      var ballots = [];
      for (var i = 0; i < 4; i++) {
        ballots.push(["Oranges"]);
      }
      for (var i = 0; i < 2; i++) {
        ballots.push(["Pears", "Oranges"]);
      }
      for (var i = 0; i < 8; i++) {
        ballots.push(["Chocolate", "Strawberries"]);
      }
      for (var i = 0; i < 4; i++) {
        ballots.push(["Chocolate", "Sweets"]);
      }
      for (var i = 0; i < 1; i++) {
        ballots.push(["Strawberries"]);
      }
      for (var i = 0; i < 1; i++) {
        ballots.push(["Sweets"]);
      }
      return ballots;
    }
  })
})()