# Single Transferable Vote Counter

A webapp meant to demonstrate AngularJS service module [stvCounter.js](https://github.com/Foshkey/stv-counter/blob/master/stvCounter.js), and the [STV counting method](https://en.wikipedia.org/wiki/Single_transferable_vote) in general.

STV Methods Used
* [Droop Method](https://en.wikipedia.org/wiki/Droop_quota) for calculating the quota.
* [Wright Method](https://en.wikipedia.org/wiki/Counting_single_transferable_votes#Wright) for determining the distribution of surplus votes.

Built With
* [AngularJS](https://angularjs.org/)
* [Foundation 6](http://foundation.zurb.com/)

## Live Version

http://foshkey.github.io/stv-counter

## Process of Counting Votes

1. Quota is calculated via the Droop method.
1. First round of votes are counted by first picks of all ballots.
1. If any candidates meet quota, then those candidates are elected.
1. If all seats are filled, then vote counting ends.
1. Repeat the following until all seats are filled (Each loop is a round).
    1. If there are not enough votes to meet the next quota, then vote counting ends and top [#seats] candidates are elected, based on votes.
    1. If there are surplus votes (a candidate has more votes than quota), then surplus votes are reassigned for each candidate with surplus votes.
        1. Candidate's votes are set at quota.
        1. Surplus vote value is determined by [#surplusVotes] / [#totalVotes]. (This is the Wright method.)
        1. For each ballot with the candidate as the top candidate, vote value will be added to the next valid top candidate.
            * Skips eliminated and elected candidates.
            * Vote Value is [ballotVoteValue] * [surplusVoteValue].
                * Each ballot's vote value starts at 1
                * If votes are reassigned, then vote value will be this new vote value.
                * Total vote value for each ballot will still be 1, just distributed throughout the ballot. E.g. CandidateA and CandidateB are elected. After surplus redistributation, a ballot's vote value would be distributed as CandidateA: 0.5, CandidateB: 0.25, and CandidateC: 0.25. This ballot would have a vote value of 0.25, since CandidateC has not been elected yet, and CandidateA and CandidateB are at quota.
    1. If there are no surplus votes, then the candidates with the lowest votes will be eliminated.
        1. Lowest number of votes of all non-eliminated candidates is determined
        1. If a candidate's votes matches lowest votes, then that candidate is eliminated
        1. Once all candidates with lowest number of votes are eliminated, then all votes are redistributed based on ballot vote value.
        * Note that if candidates are eliminated in such a way that there are not enough of the remaining candidates to fill all of the seats, then a tie-breaking vote needs to be done.
            * E.G. Two seats available, one candidate at 20 votes, two candidates at 15 votes. Both candidates at 15 votes will be eliminated at the same time, but there are not enough remaining candidates to fill the seats.
    1. If there are enough candidates at or above quota to fill all seats, then vote counting ends.
    1. If at this point, this round is a duplicate of the last round, then the loop breaks.
1. All candidates at or above quota are elected.