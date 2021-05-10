// Variables
let profitGoal = 0
let playerInvests = 0
let bankBalance = 12000-playerInvests

const setGoal = document.querySelector(`make50K`)
const setInvestment = document.querySelector(`invest1K`)
const playNow = document.querySelector(`goToBoard`)
const dogeStartingPrice = 0.42
const dogesHeld = playerInvests/dogeStartingPrice

// Classes & Objects

// the Player class creates a new player after the profit-goal and investment event listeners are fired off, once the play button is clicked
// the Player is initialized with a bank balance of $12,000 and an empty cardsPlayed array
class Player {
  constructor(goal, investment){
    this.myGoal = goal;
    this.myInvestment = investment;
    this.numOfDoges = dogesHeld;
    this.currentBalance = bankBalance;
    this.cardsPlayed = [];
  }

  /*
  pullCard(){
    this.cardsPlayed.push(randomCard)
  }
  */
  
}

// Functions
function setProfitGoal(event) {
  console.log(`A profit goal was clicked`)
  console.log(`Printing the value of setGoal: ${setGoal.value}`)
  profitGoal = parseInt(setGoal.value)
  document.getElementById(`toTheMoon`).innerHTML = `You've Defined TO THE MOON! Your profit goal is set to: $${profitGoal}`
}

function initializeInvestment(event) {
  console.log(`An initial investment was selected`)
  console.log(`The value of setInvestment is: ${setInvestment}`)
  playerInvests = parseInt(setInvestment.value)
  document.getElementById(`bigSpender`).innerHTML = `wow big spender! much monies invested: $${playerInvests}`
}

function createPlayer(event) {
  console.log(`Play button was clicked`)
  const newPlayer = new Player(profitGoal, playerInvests)
  console.log(`A new player has been created with info: ${newPlayer}`)
}

// Event Listeners
setGoal.addEventListener(`click`, setProfitGoal)
setInvestment.addEventListener(`click`, initializeInvestment)
playNow.addEventListener(`click`, createPlayer)
