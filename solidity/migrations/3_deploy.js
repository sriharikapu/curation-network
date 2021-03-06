var Voting = artifacts.require("./Voting.sol");
var SimpleToken = artifacts.require("./examples/SimpleToken.sol");
var Ranking = artifacts.require("./Ranking.sol");

// currentDynamicFeeRate_, dynamicFeePrecision_, fixedFeeMax_, tMin_, unstakeSpeed0_,
// unstakeSpeedCoef_, currentCommitTtl_, currentRevealTtl_, avgStake_
const rankingParams = [ 100, 10000, 5, 300, 5, 2, 180, 180, 20 ];
const approveAmount = 1000000000;


module.exports = async function(deployer, network, accounts) {
    let token, voting, ranking;

    deployer.then(function() {
        return SimpleToken.new();
    }).then(function(instance) {
        token = instance;
        console.log('Token:', token.address);
        return Voting.new();
    }).then(function(instance) {
        voting = instance;
        console.log('Voting:', voting.address);
        return Ranking.new();
    }).then(function(instance) {
        ranking = instance;
        console.log('Ranking:', ranking.address);

        return voting.init(token.address, accounts[1]);
    }).then(function () {
        console.log('Voting init');
        return ranking.init(voting.address, token.address, ...rankingParams);
    }).then(async function () {
        console.log('Ranking init');

        for (let i = 0; i < accounts.length; ++i) {
            await token.approve(voting.address, approveAmount, { from: accounts[i] });
            await token.approve(ranking.address, approveAmount, { from: accounts[i] });
            await token.transfer(accounts[i], approveAmount);
        }
    }).catch(e => console.log(e));

};
