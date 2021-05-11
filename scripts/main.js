// VARIABLES
let bankBalance = 12000   // initialized to $12,000 for any player
let dogesHeld = 0         // set in intializeInvestment: dogesHeld = playerInvests/dogeStartingPrice
let profitGoal = 0        // set by event handler after player clicks their desired profit goal
let playerInvests = 0     // set by event handler after player clicks their desired investment
const dogeStartingPrice = 0.42                                        // initialzed to $0.42 for any game
const setGoal = document.querySelectorAll(`.profit-goals`)            // used in event handler to call the function setProfitGoal()
const setInvestment = document.querySelectorAll(`.initial-invest`)    // used in event handler to call initializeInvestment()
const playNow = document.querySelector(`.playNow`)                    // used in event handler to call createPlayer()
const goalDisplay = document.getElementById(`goalSetTo`)              // used in setProfitGoal() to display desired goal
const investmentDisplay = document.getElementById(`playerInvests`)    // used in initializeInvestment() to display desired investment

// FOR TESTING - WILL DELETE LATER
const drawCard = document.querySelector(`.drawsCard`)   // used in event handler for card deck and calls Player.pullsCard() method 
let randomCard = `Robinhood Card`                       // force-pushing this in pullsCard() for testing only!!

// CLASSES / OBJECTS
// the Player class creates a new player when the .playNow button is clicked
class Player {
  constructor(goal, investment){
    this.myGoal = goal;
    this.myInvestment = investment;
    this.numOfGoodBois = dogesHeld;
    this.currentBalance = bankBalance;
    this.cardsPlayed = [];
  }

  pullsCard(){
    this.cardsPlayed.push(randomCard)   // pushing randomCard for TESTING only
  }
}

// FUNCTIONS
// setProfitGoal() - player must choose between three profit goals to begin game and must reach their goal to win the game
// called by the setGoal event handler and sets the goal to the value of the element clicked
// sets goalDisplay to the player's selection
function setProfitGoal(event) {
  event.preventDefault()
  profitGoal = parseInt(event.target.value)
  goalDisplay.innerHTML = `Your profit goal is set to: $${profitGoal}. TO THE MOON!`
}

// initializeInvestment() - player must choose between three investment choices to begin game
// called by the setInvestment event handler and sets the investment to the value of the element clicked
// sets the investmentDisplay to the player's selection
// handles the math for player's bank balance and dogecoin's held
function initializeInvestment(event) {
  event.preventDefault()
  playerInvests = parseInt(event.target.value)
  investmentDisplay.innerHTML = `wow big spender! much monies invested: $${playerInvests}`
  bankBalance = 12000-playerInvests
  dogesHeld = playerInvests/dogeStartingPrice
}

// createPlayer() - called by the playNow event handler
// TODO: error handling if player tries to start game without making profit/investment selections
function createPlayer() {
  const newPlayer = new Player(profitGoal, playerInvests)
  console.log(`A new player has been created with info: ${newPlayer.myGoal}, ${newPlayer.myInvestment}, ${newPlayer.numOfGoodBois}, ${newPlayer.currentBalance}, ${newPlayer.cardsPlayed}`)
}

// TODO: 
// shuffleCards()
// rollDice()
// drawPlayer()


// EVENT LISTENERS
// Event Handler for setProfitGoal()
setGoal.forEach(function(button) {
  button.addEventListener(`click`, (event) => setProfitGoal(event))
})

// Event Handler for initializeInvestment()
setInvestment.forEach(function(button) {
  button.addEventListener(`click`, (event) => initializeInvestment(event))
})

// Event Handler for createPlayer()
playNow.addEventListener(`click`, createPlayer)

// Event Handler for newPlayer.pullsCard() - NOT WORKING 10 May 2021
drawCard.addEventListener(`click`, function () {
  newPlayer.pullsCard();
})