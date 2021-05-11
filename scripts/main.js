// VARIABLES
let bankBalance = 12000;         // initialized to $12,000 for any player; used in game play
let dogesHeld = 0;               // set in intializeInvestment: dogesHeld = playerInvests/dogeStartingPrice; math for the win logic needs this
let profitGoal = 0;              // set by event handler after player clicks their desired profit goal
let playerInvests = 0;           // set by event handler after player clicks their desired investment
let newPlayer = null;            // set by event handler after player clicks Start
let dogeCurrentPrice = 0;        // will be initialized to dogeStartingPrice when the playNow event handler is fired off; changes as game is played
let numLives = 3;                // initialized to 3; damnRobinhood() takes away 1 life for each card held in the player's deck
const dogeStartingPrice = 0.42;                                        // initialzed to $0.42 for any game
const setGoal = document.querySelectorAll(`.profit-goals`);            // used in event handler to call the function setProfitGoal()
const setInvestment = document.querySelectorAll(`.initial-invest`);    // used in event handler to call initializeInvestment()
const playNow = document.querySelector(`.playNow`);                    // used in event handler to call createPlayer()
const goalDisplay = document.getElementById(`goalSetTo`);              // used in setProfitGoal() to display desired goal
const investmentDisplay = document.getElementById(`playerInvests`);    // used in initializeInvestment() to display desired investment
const drawCard = document.querySelector(`.drawsCard`);                 // used in event handler for card deck and calls Player.pullsCard() method 

const possibleChoices = [{ // All possible cards that can be selected
  type: `memeLord`,
  displayName:'Meme Lord'
  // cardAction: function(){
  // TODO
  // }
},{
  type: `robinhood`,
  displayName: `Robinhood`
},{
  type: `tweet`,
  displayName: `Tweet`
},{
  type: `lifeEvent`,
  displayName: `Life Event`
},{
  type: `dogeMiner`,
  displayName: `Doge Miner`
},{
  type: `decisionCard`,
  displayName: `Decision Card`
}]

// CLASSES / OBJECTS
// the Player class creates a new player when the .playNow button is clicked
class Player {
  constructor(goal, investment){
    this.myGoal = goal,
    this.myInvestment = investment,
    this.numOfGoodBois = dogesHeld,
    this.currentBalance = bankBalance,
    this.cardsPlayed = [];
  }

  // the pullsCard method pushes a card from the Deck object when the player clicks the drawCard event handler
  pullsCard(event){
    this.cardsPlayed.push(event);
  }
}

// the Deck class creates an empty array of the specified size
function findCard(cardType){
  return possibleChoices.find(choice => choice.type === cardType)
}
let dogeDeck = [...Array(12)].map(_ => findCard('dogeMiner'))
let decisionDeck = [...Array(12)].map(_ => findCard('decisionCard'))
let lifeDeck = [...Array(25)].map(_ => findCard('lifeEvent'))
let tweetDeck = [...Array(30)].map(_ => findCard('tweet'))
let robinhoodDeck = [...Array(3)].map(_ => findCard('robinhood'))
let memeDeck = [...Array(2)].map(_ => findCard('memeLord'))
const Deck = [...dogeDeck, ...decisionDeck, ...lifeDeck, ...tweetDeck, ...robinhoodDeck, ...memeDeck];
console.log(Deck)

function shuffle(array) {
  // From Stackoverflow
  // Fisher-Yates Shuffle algoritm
  // https://github.com/Daplie/knuth-shuffle
  let currentIndex = array.length;
  let temporaryValue
  let randomIndex
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Used like so
shuffle(Deck);
shuffle(Deck);
shuffle(Deck);
console.log(Deck);

// console.log(numLives);

// FUNCTIONS
// setProfitGoal() - player must choose between three profit goals to begin game and must reach their goal to win the game
// called by the setGoal event handler and sets the goal to the value of the element clicked
// sets goalDisplay to the player's selection
function setProfitGoal(event) {
  profitGoal = parseInt(event.target.value);
  goalDisplay.innerHTML = `Your profit goal is set to: $${profitGoal}. TO THE MOON!`;
}

// initializeInvestment() - player must choose between three investment choices to begin game
// called by the setInvestment event handler and sets the investment to the value of the element clicked
// sets the investmentDisplay to the player's selection
// handles the math for player's bank balance and dogecoins held
function initializeInvestment(event) {
  playerInvests = parseInt(event.target.value);
  investmentDisplay.innerHTML = `wow big spender! much monies invested: $${playerInvests}`;
  bankBalance = 12000-playerInvests;
  dogesHeld = playerInvests/dogeStartingPrice;
}

// createPlayer() - called by the playNow event handler
// TODO: error handling if player tries to start game without making profit/investment selections
function createPlayer() {
  newPlayer = new Player(profitGoal, playerInvests);
  console.log(`A new player has been created with info: ${newPlayer.myGoal}, ${newPlayer.myInvestment}, ${newPlayer.numOfGoodBois}, ${newPlayer.currentBalance}, ${newPlayer.cardsPlayed}`);
}

// damnRobinhood() - subtracts 1 from numLives for each Robinhood card held by the player
function damnRobinhood() {
  //if(numLives >= 1){  
    return numLives = numLives - 1;
  //} else(numLives === 0){
  //  playerLoses()
  //}
}

// placeholderFunc() - used for testing the Deck class
function placeholderFunc() {
  return `I'm INSIDE the Deck!`;
}

// TODO: 

// shuffleDeck()
// rollDice()
    // need an array for dice; use Math.random to roll
// drawPlayer()
    // need to attach to createPlayer
// bumpPrice()
    // dogeCurrentPrice * profitGoal/2
// elonTweets()
    // dogeCurrentPrice goes up OR down by some dollar amount
// lifeEvent()
    // choose to subtract from bankAccount || numOfGoodBois
// dogeMiner
    // numOfGoodBois goes up by some amount
// makeDecision()
    // 1. pull another card; 2. discard a Robinhood card from your deck; 3. HYPERLOOP to the finish


// EVENT LISTENERS
// Event Handler for setProfitGoal()
setGoal.forEach(function(button) {
  button.addEventListener(`click`, setProfitGoal);
})

// Event Handler for initializeInvestment()
setInvestment.forEach(function(button) {
  button.addEventListener(`click`, initializeInvestment);
})

// Event Handler for createPlayer()
playNow.addEventListener(`click`, createPlayer);

// Event Handler for newPlayer.pullsCard()
drawCard.addEventListener(`click`, function () {
  newPlayer.pullsCard();
  console.log(newPlayer);
})