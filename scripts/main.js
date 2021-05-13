// *********** VARIABLES ***********
// Game Concept, Game Rules, and Code Created and Written by Bailey Leavitt (May 2021) - General Assembly Student at the time of creation (Go Team Taco!!)
const dogeStartingPrice = 0.42;                                                               // initialzed to $0.42 for any game
const startAndFinish = document.getElementById(`00start-end`);                                // used in event handler to call createPlayer() and in hyperloop decision card
const setGoal = document.querySelectorAll(`.profit-goals`);                                   // used in event handler to call the function setProfitGoal()
const setInvestment = document.querySelectorAll(`.initial-invest`);                           // used in event handler to call initializeInvestment()
const playNow = document.querySelector(`.playNow`);                                           // used in event handler to call createPlayer()
const goalDisplay = document.getElementById(`goalSetTo`);                                     // used in setProfitGoal() to display desired goal
const investmentDisplay = document.getElementById(`playerInvests`);                           // used in initializeInvestment() to display desired investment
const drawCard = document.querySelector(`.drawsCard`);                                        // used in event handler for card deck and calls Player.pullsCard() method 
const diceOnBoard = document.querySelector(`.rollMe`)                                         // used in event handler for rolling the dice; determines how many places the player moves on the board
const diceSet = [1,2,3,4];                                                                    // used in Player.rollDice method
const playerOne = `<img src="./css/images/playerOne.jpg" width="42px" height="50px" />`       // used to draw player on the board
// All possible card types used in the game
const possibleChoices = [{                                                                    
  type: `memeLord`,
  displayName:'Meme Lord',
  goalBoost: function() {
    if(dogeCurrentPrice < profitGoal/2) {
      dogeCurrentPrice = profitGoal/2;
    } else {
      dogeCurrentPrice = profitGoal;
      console.log(`All Hail the Meme Lord - Hope You Make It To The Finish Before Robinhood Catches On`);
    } 
  }
},{
  type: `robinhood`,
  displayName: `Robinhood`,
  damnRobinhood: function() {
    if(numLives >= 1){  
      numLives = numLives - 1;
      console.log(`you have ${numLives} left`);
    } else if(numLives === 0){
      console.log(`you lose`);
    }
  }
},{
  type: `goodTweet`,
  displayName: `Good Tweet`,
  yayTweets: function() {
    dogeCurrentPrice = dogeCurrentPrice + (Math.floor(Math.random() * 50));
    console.log(`omg Elon Tweeted and your doge went up and now it's $${dogeCurrentPrice}!`)
  }
},{
  type: `lifeEvent`,
  displayName: `Life Event`,
  lifeEvent: function() {
    console.log(`life happens... ope`)
  }
},{
  type: `dogeMiner`,
  displayName: `Doge Miner`
},{
  type: `badTweet`,
  displayName: `Bad Tweet`,
  sadTweets: function() {
    if(Math.floor(Math.random() * 10) < dogeCurrentPrice){
      dogeCurrentPrice = dogeCurrentPrice - (Math.floor(Math.random() * 10));
    console.log(`nooooooo this tweet made your doge drop to $${dogeCurrentPrice}!`)
    } else {
      dogeCurrentPrice = dogeCurrentPrice/2;
    }
  }
}]
let bankBalance = 12000;                                    // initialized to $12,000 for any player; used in game play
let dogesHeld = 0;                                          // set in intializeInvestment: dogesHeld = playerInvests/dogeStartingPrice; math for the win logic needs this
let profitGoal = 0;                                         // set by event handler after player clicks their desired profit goal
let playerInvests = 0;                                      // set by event handler after player clicks their desired investment
let newPlayer = null;                                       // set by event handler after player clicks Start
let dogeCurrentPrice = dogeStartingPrice;                   // will be initialized to dogeStartingPrice when the playNow event handler is fired off; changes as game is played
let numLives = 3;                                           // initialized to 3; damnRobinhood() takes away 1 life for each card held in the player's deck
let gameActive = false;                                     // initialized to false until createPlayer() is called
let boardPositions = [];                                    // set by fillBoard() function
let boardSpace = document.querySelectorAll(`.playable`);    // used in fillBoard()

// *********** CLASSES ***********
// the Player class creates a new player when the .playNow button is clicked
class Player {
  constructor(goal, investment){
    this.myGoal = goal,
    this.myInvestment = investment,
    this.numOfGoodBois = dogesHeld,
    this.currentBalance = bankBalance,
    this.cardsPlayed = [],
    this.location = startAndFinish;
  }
  
  // the pullsCard method pushes a card from the Deck object when the player clicks the drawCard event handler
  pullsCard(event){
    this.cardsPlayed.push(event);
  }

  // the roll method is called when the diceOnBoard event listener is called, and it determines how far around the board the player moves
  roll(){
    return Math.floor(Math.random() * diceSet.length) + 1;
  }
}

// *********** FUNCTIONS ***********
// fillBoard() - grabs all the playable elements of the game board and puts them in the boardPositions array
// sorts the array so the player can move around the board in the correct order
// id.slice grabs the id text from the HTML element and uses that to sort the array
function fillBoard() {
  for(let i = 0; i < boardSpace.length; i++) {
    boardPositions.push(boardSpace[i]);
  }
  boardPositions.sort((a,b) =>a.id.slice(0,2) - b.id.slice(0,2));
}
fillBoard();

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
  newPlayer.location.innerHTML = `${playerOne}`;
}

// findCard(cardType) - used in creating the six types of card decks below; to avoid scoping issues deck arrays are declared below this function
// code block between "function findCard" and "const Deck" should be read as a group
function findCard(cardType){
  return possibleChoices.find(choice => choice.type === cardType);
}
// make six decks, each housing a specfic card type
let dogeMinerDeck = [...Array(12)].map(_ => findCard('dogeMiner'));
let badTweetDeck = [...Array(21)].map(_ => findCard('badTweet'));
let lifeDeck = [...Array(25)].map(_ => findCard('lifeEvent'));
let goodTweetDeck = [...Array(21)].map(_ => findCard('goodTweet'));
let robinhoodDeck = [...Array(3)].map(_ => findCard('robinhood'));
let memeLordDeck = [...Array(2)].map(_ => findCard('memeLord'));
// Create a MASTER DECK for game play, containing all the deck arrays just created
const Deck = [...dogeMinerDeck, ...badTweetDeck, ...lifeDeck, ...goodTweetDeck, ...robinhoodDeck, ...memeLordDeck];

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

// fluctuatePrice


// *********** EVENT LISTENERS ***********
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
  // --- cardIndex draws a card from the top of the deck (by pulling the first item of the array)
  let cardIndex = Deck.shift();
  // --- pushes that card onto the player's hand
  newPlayer.pullsCard(cardIndex);
  // --- matches the "type" of each card and calls its function when the card is found
  switch(cardIndex.type){
    case `goodTweet`:
      return cardIndex.yayTweets();
    case `badTweet`:
      return cardIndex.sadTweets();
    case `lifeEvent`:
      return cardIndex.lifeEvent();
    case `dogeMiner`:
      return cardIndex.mineDoges();
    case `robinhood`:
      return cardIndex.damnRobinhood();
    case `memeLord`:
      return cardIndex.goalBoost();        
  }

  console.log(cardIndex);
  console.log(newPlayer.cardsPlayed);
  console.log(numLives);

})

// Event Handler for moving the player around the board - calls the roll() method of the Player object and sets player.location
diceOnBoard.addEventListener(`click`, function () {
  let move = newPlayer.roll();
  // --- Take dice roll, target boardPositions by roll number, update player location to target element
  let currentIndex = boardPositions.indexOf(newPlayer.location);
  let targetElement = boardPositions[move + currentIndex];
  // --- Reset player's location
  newPlayer.location.innerHTML = ``;
  let remainingPos = boardPositions.length - currentIndex;
  // --- Check if player is at end position and place player on start-end if yes
  if(remainingPos <= move){
    let resetLocation= boardPositions[0];
    newPlayer.location = resetLocation;
    resetLocation.innerHTML = playerOne;
    return;
  }
  newPlayer.location = targetElement;
  targetElement.innerHTML = playerOne;
})