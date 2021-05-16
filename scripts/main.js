// *********** VARIABLES ***********
// Game Concept, Game Rules, and Code Created and Written by Bailey Leavitt (May 2021) - General Assembly Student at the time of creation (Go Team Taco!!)
const dogeStartingPrice = 0.42;                                                               // initialzed to $0.42 for any game
const startAndFinish = document.getElementById(`00start-end`);                                // used in event handler to call createPlayer() and in hyperloop decision card
const setGoal = document.querySelectorAll(`.profit-goals`);                                   // used in event handler to call the function setProfitGoal()
const setInvestment = document.querySelectorAll(`.initial-invest`);                           // used in event handler to call initializeInvestment()
const playNow = document.querySelector(`.playNow`);                                           // used in event handler to call createPlayer()
const goalDisplay = document.getElementById(`goalSetTo`);                                     // used in setProfitGoal() to display desired goal
const investmentDisplay = document.getElementById(`playerInvests`);                           // used in initializeInvestment() to display desired investment
const drawCard = document.querySelector(`.drawMe`);                                        // used in event handler for card deck and calls Player.pullsCard() method 
const diceOnBoard = document.querySelector(`.rollMe`);                                        // used in event handler for rolling the dice; determines how many places the player moves on the board
const gameMessage = document.querySelector(`.game-messages`);                                 // used in possibleChoices functions to write messages to the screen
const diceSet = [1,2,3,4];                                                                    // used in Player.rollDice method
const playerOne = `<img src="./css/images/playerOne.jpg" width="60vw" height="75vh" />`       // used to draw player on the board
let bankBalance = 12000;                                    // initialized to $12,000 for any player; used in game play
let playerInvests = 0;                                      // set by event handler after player clicks their desired investment
let profitGoal = 0;                                         // set by event handler after player clicks their desired profit goal
let dogesHeld = 0;                                          // set in createPlayer; math for the win logic needs this
let newPlayer = null;                                       // set by event handler after player clicks Start
let dogeCurrentPrice = dogeStartingPrice;                   // will be initialized to dogeStartingPrice when the playNow event handler is fired off; changes as game is played
let numLives = 3;                                           // initialized to 3; damnRobinhood() takes away 1 life for each card held in the player's deck
let gameActive = false;                                     // initialized to false until createPlayer() is called
let earningTotal = 0;                                       // initialized to 0; used to calculate how much player's investment is worth
let boardPositions = [];                                    // set by fillBoard() function
let boardSpace = document.querySelectorAll(`.playable`);    // used in fillBoard()
// All possible card types used in the game
const possibleChoices = [{                                                                    
  type: `memeLord`,
  displayName:'Meme Lord',
  goalBoost: function() {
    if(newPlayer.earningTotal < (newPlayer.myGoal)/2) {
      newPlayer.earningTotal = (newPlayer.myGoal)/2;
      window.alert(`You're halfway to your profit goal!`);
    } else if(newPlayer.earningTotal < newPlayer.myGoal){
      newPlayer.earningTotal = newPlayer.myGoal;
      window.alert(`You've achieved your profit goal!`);
    } else if(newPlayer.earningTotal > newPlayer.myGoal){
      window.alert(`Your profit goal has already been met!`);
    }
  }
},{
  type: `robinhood`,
  displayName: `Robinhood`,
  damnRobinhood: function() {
    if(newPlayer.numLives > 1){  
      newPlayer.numLives -= 1;
      window.alert(`Player pulled Robinhood card. Number of Lives: ${newPlayer.numLives}`);
    } else if(newPlayer.numLives <= 1){
      gameActive = false;
      window.alert(`GAME OVER. REFRESH PAGE TO PLAY AGAIN`);
    }
  }
},{
  type: `goodTweet`,
  displayName: `Good Tweet`,
  yayTweets: function() {
    dogeCurrentPrice = dogeCurrentPrice + (Math.floor(Math.random() * 20));
    newPlayer.earningTotal = dogeCurrentPrice * newPlayer.dogesHeld - newPlayer.myInvestment;
    //gameMessage.innerHTML = `Player pulled Good Tweet`;
  }
},{
  type: `lifeHappens`,
  displayName: `Life Happens`,
  lifeHappens: function() {
    //gameMessage.innerHTML = `Player pulled Life Happens`;
    let shitHappens = [`car`, `debt collectors`, `drinking problems`, `your niece`];
      switch(shitHappens[Math.floor(Math.random() * shitHappens.length)]){
        case(`car`):{
          newPlayer.bankBalance -= 500
          //gameMessage.innerHTML = `Once you have enough money you can afford a Tesla (which I hear will be accepting Doge as payment soon)... until then, you have this broken ass car that needs fixing. -$500`;
          break;
        }
        case(`debt collectors`):{
          newPlayer.bankBalance -= 100
          //gameMessage.innerHTML = `Hopefully you can be better with your money when you're a Meme Millionaire... -$100.`;
          break;
        }
        case(`drinking problems`):{
          newPlayer.bankBalance -= 300
          //gameMessage.innerHTML = `You need new coping mechanisms... that night of drinking cost you $300.`;
          break;
        }
        case(`your niece`):{
          newPlayer.dogesHeld -= (newPlayer.dogesHeld * .5)
          //gameMessage.innerHTML = `Your niece Cecilia Jo is your favorite person... so of course you gave her half of your doges.`;
          break;
        }
    }
  }
},{
  type: `dogeMiner`,
  displayName: `Doge Miner`,
  mineDoges: function() {
    newPlayer.dogesHeld += newPlayer.dogesHeld * (Math.floor(Math.random() * 5));
    newPlayer.earningTotal = (dogeCurrentPrice * newPlayer.dogesHeld) - newPlayer.myInvestment;
    //let dogeMinerText = `Player pulled dogeMiner`;
    //gameMessage.appendChild(dogeMinerText);
  }
},{
  type: `badTweet`,
  displayName: `Bad Tweet`,
  sadTweets: function() {
    dogeCurrentPrice = dogeCurrentPrice * 0.2;
    newPlayer.earningTotal = dogeCurrentPrice * newPlayer.dogesHeld - newPlayer.myInvestment;
    //gameMessage.innerHTML = `Player pulled Bad Tweet`;
  }
}]

// *********** CLASSES ***********
// the Player class creates a new player when the .playNow button is clicked
class Player {
  constructor(goal, investment){
    this.myGoal = goal,
    this.myInvestment = investment,
    this.cardsPlayed = [],
    this.numLives = numLives,
    this.dogesHeld = dogesHeld,
    this.location = startAndFinish,
    this.earningTotal = 0,
    this.bankBalance = 0;
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
// --- sorts the array so the player can move around the board in the correct order
// --- id.slice grabs the id text from the HTML element and uses that to sort the array
function fillBoard() {
  for(let i = 0; i < boardSpace.length; i++) {
    boardPositions.push(boardSpace[i]);
  }
  boardPositions.sort((a,b) =>a.id.slice(0,2) - b.id.slice(0,2));
}
fillBoard();

// setProfitGoal() - player must choose between three profit goals to begin game and must reach their goal to win the game
// --- called by the setGoal event handler and sets the goal to the value of the element clicked
// --- sets goalDisplay to the player's selection
function setProfitGoal(event) {
  profitGoal = parseInt(event.target.value);
  switch(profitGoal){
    case(50000):
      goalDisplay.innerHTML = `You selected $50,000. #weak`;
      break;
    case(100000):
      goalDisplay.innerHTML = `You selected $100,000. #doOnlyGoodEveryday`;
      break;
    case(1000000):
      goalDisplay.innerHTML = `You selected $1,000,000! #ToTheMoon`;
      break;  
  }
}

// initializeInvestment() - player must choose between three investment choices to begin game
// --- called by the setInvestment event handler and sets the investment to the value of the element clicked
// --- sets the investmentDisplay to the player's selection
// --- handles the math for player's bank balance and dogecoins held
function initializeInvestment(event) {
  playerInvests = parseInt(event.target.value);
  switch(playerInvests){
    case(1000): {
      investmentDisplay.innerHTML = `You invested $1000! #stonks`;
      break;
    }
    case(5000): {
      investmentDisplay.innerHTML = `You invested $5000. #hedgingBets`;
      break;
    }
    case(10000):{
      investmentDisplay.innerHTML = `You invested $10,000! #URTheOnePercent`;
      break;
    }
  }
}

// createPlayer() - called by the playNow event handler
// TODO: error handling if player tries to start game without making profit/investment selections
function createPlayer() {
  newPlayer = new Player(profitGoal, playerInvests);
  newPlayer.location.innerHTML = `${playerOne}`;
  gameActive = true;
  newPlayer.bankBalance = bankBalance - playerInvests;
  newPlayer.dogesHeld = playerInvests/dogeStartingPrice; 
  newPlayer.earningTotal = dogeCurrentPrice * newPlayer.dogesHeld;
  console.log(`New Player has these attributes--> GOAL: ${newPlayer.myGoal} || INVESTMENT: ${newPlayer.myInvestment} || BANK BALANCE: ${newPlayer.bankBalance} || DOGES HELD: ${newPlayer.dogesHeld} || EARNING TOTAL: ${newPlayer.earningTotal} || NumLives: ${newPlayer.numLives}`)
}

// findCard(cardType) - used in creating the six types of card decks below; to avoid scoping issues deck arrays are declared below this function
// --- code block between "function findCard" and "const Deck" should be read as a group
function findCard(cardType){
  return possibleChoices.find(choice => choice.type === cardType);
}
// --- make six decks, each housing a specfic card type
let dogeMinerDeck = [...Array(19)].map(_ => findCard('dogeMiner'));
let badTweetDeck = [...Array(21)].map(_ => findCard('badTweet'));
let lifeHappensDeck = [...Array(18)].map(_ => findCard('lifeHappens'));
let goodTweetDeck = [...Array(21)].map(_ => findCard('goodTweet'));
let robinhoodDeck = [...Array(3)].map(_ => findCard('robinhood'));
let memeLordDeck = [...Array(2)].map(_ => findCard('memeLord'));
// --- Create a MASTER DECK for game play, containing all the deck arrays just created
const Deck = [...dogeMinerDeck, ...badTweetDeck, ...lifeHappensDeck, ...goodTweetDeck, ...robinhoodDeck, ...memeLordDeck];

// shuffle(array) - Uses the Fisher-Yates Shuffle algorithm, as taken from Stackoverflow; comments from creator preserved in function below
// --- https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// --- https://github.com/Daplie/knuth-shuffle
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

// checkWin - First attempt at making a function to check for a win
function winOrLose() {
  let printToContainer = document.querySelector(`.winOrLoseMessage`);
  if((newPlayer.myGoal = newPlayer.earningTotal) && (newPlayer.numLives != 0) && (newPlayer.bankBalance >= 0)){
    window.alert(`omg wow you win!`);
    printToContainer.innerHTML = `<img src="./css/images/successDogeSmol.png"/>`;
  } else{
    window.alert(`so sad you lose`);
    printToContainer.innerHTML = `<img src="./css/images/noDoge.jpg" />`;
  }
}

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
  // --- update game message board with status
  let newCardP = document.createElement("P");
  let cardText = document.createTextNode(`You pulled a ${cardIndex.displayName}`);
  newCardP.appendChild(cardText);
  gameMessage.prepend(newCardP);
  // --- matches the "type" of each card and calls its function when the card is found
  switch(cardIndex.type){
    case `goodTweet`: 
      return cardIndex.yayTweets();
    case `badTweet`:
      return cardIndex.sadTweets();
    case `lifeHappens`:
      return cardIndex.lifeHappens();
    case `dogeMiner`:
      return cardIndex.mineDoges();
    case `robinhood`:
      return cardIndex.damnRobinhood();
    case `memeLord`:
      return cardIndex.goalBoost();
  }
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
    winOrLose();
    return;
  }
  let newRollP = document.createElement("P");
  let rollText = document.createTextNode(`You rolled a ${move}`);
  newRollP.appendChild(rollText);
  gameMessage.prepend(newRollP);
  newPlayer.location = targetElement;
  targetElement.innerHTML = playerOne;
  
  console.log(`New Player has these attributes--> GOAL: ${newPlayer.myGoal} || INVESTMENT: ${newPlayer.myInvestment} || BANK BALANCE: ${newPlayer.bankBalance} || DOGES HELD: ${newPlayer.dogesHeld} || EARNING TOTAL: ${newPlayer.earningTotal} || NumLives: ${newPlayer.numLives}`)
  //gameMessage.innerHTML = `PLAYER'S PROGRESS REPORT: Bank Account - $${newPlayer.getBalance()} --- Total Earnings - $${earningTotal} --- Doges Held - ${dogesHeld} doges`;
  //gameMessage.innerHTML = `GAME PROGRESS REPORT: Current Price of Doge - $${dogeCurrentPrice}`
})