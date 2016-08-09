(function () {
  angular.module("stvCounter", [])
  .service("stvCounter", function () {
    let srvc = this;

    srvc.ballots = [];
    srvc.rounds = [];

    srvc.count = function (seats, ballots = srvc.ballots) {
      srvc.ballots = ballots;

      // Construct work ballots, which are ballots array with more properties
      let workBallots = [];
      ballots.forEach(function (ballot) {
        let workBallot = {
          ballot: ballot,
          topCandidate: ballot[0],
          topCandidateIndex: 0,
          voteValue: 1
        };
        workBallots.push(workBallot);
      });

      // Hare method
      let quota = Math.floor(ballots.length / (seats + 1) + 1);

      let candidates = getCandidates(ballots);
      let elected = [];

      // Quick checks before counting
      if (seats <= 0 || seats > candidates.length) {
        throw new Error("Insufficient number of seats (" + seats + ") for number of voted candidates (" + candidates.length + ")");
      }
      
      // Loop through ballots' first choice
      let firstRound = genBlankRound(candidates);
      ballots.forEach(function (ballot) {
        // Tally up first choice votes
        firstRound[ballot[0]].votes++;
      });
      srvc.rounds.push(firstRound);

      // Determine elected from first round
      candidates.some(function (candidate) {
        // If at or above quota, add to elected.
        if (firstRound[candidate] >= quota) {
          elected.push(candidate);
          firstRound[candidate].elected = true;
        }
        // If all seats are filled, break.
        if (elected.length >= seats)
          return true;
      });

      // Quick check before going into the real meat
      if (elected.length >= seats)
        return elected;

      // Continue looping until we fill all seats.
      while (elected.length < seats) {
        let round = cloneLastRound();

        // Check for surplus
        let hasSurplus = false;
        Object.keys(round).some(function (candidate) {
          if (round[candidate].votes >= quota) {
            round[candidate].elected = true;
            if (round[candidate].votes > quota) {
              hasSurplus = true;
            }
          }
          return hasSurplus;
        });

        console.log("Surplus: " + hasSurplus);
        // Reassign votes, based on surplus or elimination.
        if (hasSurplus) {
          reassignSurplusVotes(round, workBallots, quota);
        }
        else { // Elimination
          eliminateCandidates(round);
          reassignEliminatedVotes(round, workBallots);
        }

        // And another check to see if anybody made it
        Object.keys(round).some(function (candidate) {
          if (round[candidate].elected || round[candidate].votes >= quota) {
            round[candidate].elected = true;
            if (elected.indexOf(candidate) < 0) elected.push(candidate)
          }
          if (elected.length >= seats)
            return true;
        })

        // Check for duplicate round
        if (JSON.stringify(round) === JSON.stringify(cloneLastRound())) {
          console.log("Found Duplicate");
          break;
        }

        // Finally, record round
        srvc.rounds.push(round);
      }

      return elected;
    }

    function getCandidates() {
      let candidates = [];
      srvc.ballots.forEach(function (ballot) {
        ballot.forEach(function (candidate) {
          if (candidates.indexOf(candidate) < 0) {
            candidates.push(candidate);
          }
        })
      })
      return candidates;
    }

    function genBlankRound(candidates) {
      let round = {};
      candidates.forEach(function (candidate) {
        round[candidate] = { votes: 0, elected: false, eliminated: false };
      })
      return round;
    }

    function cloneLastRound() {
      if (srvc.rounds.length == 0) return {};
      return JSON.parse(JSON.stringify(srvc.rounds[srvc.rounds.length - 1]));
    }

    function getLeastNumberOfVotes(round) {
      let least = 0;
      let foundStartingValue = false;
      Object.keys(round).forEach(function (candidate) {
        if (!foundStartingValue && !round[candidate].eliminated) {
          foundStartingValue = true;
          least = round[candidate].votes;
        }
        if (!round[candidate].eliminated && round[candidate].votes < least && foundStartingValue) {
          least = round[candidate].votes;
        }
      });
      return least;
    }

    function eliminateCandidates(round) {
      let leastNumberOfVotes = getLeastNumberOfVotes(round);
      console.log(leastNumberOfVotes);
      Object.keys(round).forEach(function (candidate) {
        if (round[candidate].votes == leastNumberOfVotes) {
          round[candidate].eliminated = true;
        }
      });
    }

    function reassignEliminatedVotes(round, workBallots) {
      Object.keys(round).forEach(function (candidate) {
        if (round[candidate].eliminated) {
          round[candidate].votes = 0;
          workBallots.forEach(function (workBallot) {
            if (candidate === workBallot.topCandidate) {
              reassignVote(candidate, workBallot, round);
            }
          });
        }
      });
    }

    function reassignSurplusVotes(round, workBallots, quota) {
      Object.keys(round).forEach(function (candidate) {
        if (round[candidate].elected && round[candidate].votes >= quota) {
          let voteValue = (round[candidate].votes - quota) / round[candidate].votes;
          round[candidate].votes = quota;
          workBallots.forEach(function (workBallot) {
            if (candidate === workBallot.topCandidate) {
              workBallot.voteValue = voteValue * workBallot.voteValue;
              reassignVote(candidate, workBallot, round);
            }
          })
        }
      });
    }

    function reassignVote(candidate, workBallot, round) {
      if (workBallot.topCandidateIndex + 1 == workBallot.ballot.length) return;

      for (; workBallot.topCandidateIndex < workBallot.ballot.length; workBallot.topCandidateIndex++) {
        workBallot.topCandidate = workBallot.ballot[workBallot.topCandidateIndex];
        if (!round[workBallot.topCandidate].eliminated &&
            !round[workBallot.topCandidate].elected) {
          round[workBallot.topCandidate].votes += workBallot.voteValue;
          break;
        }
      }
    }

    function isTopCandidate(candidate, ballot, round) {
      for (let i = 0; i < ballot.length; i++) {
        if (!round[ballot[i]].eliminated &&
            candidate === ballot[i]) {
          return true;
        }
      }
      return false;
    }

  })
})()