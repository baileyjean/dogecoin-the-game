// VARIABLES
let bankBalance = 12000;         // initialized to $12,000 for any player; used in game play
let dogesHeld = 0;               // set in intializeInvestment: dogesHeld = playerInvests/dogeStartingPrice; math for the win logic needs this
let profitGoal = 0;              // set by event handler after player clicks their desired profit goal
let playerInvests = 0;           // set by event handler after player clicks their desired investment
let newPlayer = null;            // set by event handler after player clicks Start
let dogeCurrentPrice = 0;        // will be initialized to dogeStartingPrice when the playNow event handler is fired off; changes as game is played
let numLives = 3;                // initialized to 3; damnRobinhood() takes away 1 life for each card held in the player's deck
let gameActive = false;          // initialized to false until createPlayer() is called
const dogeStartingPrice = 0.42;                                                                  // initialzed to $0.42 for any game
const startAndFinish = document.getElementById(`start-end`);                                     // used in event handler to call createPlayer() and in hyperloop decision card
const setGoal = document.querySelectorAll(`.profit-goals`);                                      // used in event handler to call the function setProfitGoal()
const setInvestment = document.querySelectorAll(`.initial-invest`);                              // used in event handler to call initializeInvestment()
const playNow = document.querySelector(`.playNow`);                                              // used in event handler to call createPlayer()
const goalDisplay = document.getElementById(`goalSetTo`);                                        // used in setProfitGoal() to display desired goal
const investmentDisplay = document.getElementById(`playerInvests`);                              // used in initializeInvestment() to display desired investment
const drawCard = document.querySelector(`.drawsCard`);                                           // used in event handler for card deck and calls Player.pullsCard() method 
const diceOnBoard = document.querySelector(`.rollMe`)                                            // used in event handler for rolling the dice; determines how many places the player moves on the board
const diceSet = [1,2,3,4];                                                                       // used in Player.rollDice method
const playerOne = `<img src="./css/images/playerOne.jpg" width="42px" height="50px" />`          // used to draw player on the board
const possibleChoices = [{                                                                       // All possible card types used in the game
  type: `memeLord`,
  displayName:'Meme Lord'
  //cardAction: function(){}
},{
  type: `robinhood`,
  displayName: `Robinhood`,
  cardAction: damnRobinhood()
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

  roll(){
    return Math.floor(Math.random() * diceSet.length) + 1;
  }
}


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
  gameActive = true;
  newPlayer = new Player(profitGoal, playerInvests);
  startAndFinish.innerHTML = `${playerOne}`
  console.log(`A new player has been created with info: ${newPlayer.myGoal}, ${newPlayer.myInvestment}, ${newPlayer.numOfGoodBois}, ${newPlayer.currentBalance}, ${newPlayer.cardsPlayed}`);
}


// findCard(cardType) - used in creating the six types of card decks below; to avoid scoping issues deck arrays are declared below this function
// Lines 82 - 93 should be read as a group
function findCard(cardType){
  return possibleChoices.find(choice => choice.type === cardType);
}
// make six decks, each housing a specfic card type
let dogeMinerDeck = [...Array(12)].map(_ => findCard('dogeMiner'));
let decisionDeck = [...Array(12)].map(_ => findCard('decisionCard'));
let lifeDeck = [...Array(25)].map(_ => findCard('lifeEvent'));
let tweetDeck = [...Array(30)].map(_ => findCard('tweet'));
let robinhoodDeck = [...Array(3)].map(_ => findCard('robinhood'));
let memeLordDeck = [...Array(2)].map(_ => findCard('memeLord'));
// Create a MASTER DECK for game play, containing all the deck arrays just created
const Deck = [...dogeMinerDeck, ...decisionDeck, ...lifeDeck, ...tweetDeck, ...robinhoodDeck, ...memeLordDeck];

// shuffle(array) - Uses the Fisher-Yates Shuffle algorithm, as taken from Stackoverflow; comments from creator preserved in function below
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// https://github.com/Daplie/knuth-shuffle
function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;
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

// Shuffling the deck three times
shuffle(Deck);
shuffle(Deck);
shuffle(Deck);

// damnRobinhood() - subtracts 1 from numLives for each Robinhood card held by the player
function damnRobinhood() {
  //if(numLives >= 1){  
    return numLives = numLives - 1;
  //} else(numLives === 0){
  //  playerLoses()
  //}
}

// TODO: 
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
  let cardIndex = Deck.shift();
  newPlayer.pullsCard(cardIndex);
  console.log(newPlayer);
})

// Event Handler for moving the player around the board - calls the roll() method of the Player object
diceOnBoard.addEventListener(`click`, function () {
  let move = newPlayer.roll();
  console.log(`Dice roll: ${move}`)
})