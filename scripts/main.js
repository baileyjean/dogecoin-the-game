// VARIABLES
let profitGoal = 0
let playerInvests = 0
let bankBalance = 12000-playerInvests
console.log(`profitGoal: ` + profitGoal)
console.log(`playerInvests: ` + playerInvests)
console.log(`bankBalance: ` + bankBalance)

const setGoal = document.querySelectorAll(`.profit-goals`)
const setInvestment = document.querySelectorAll(`.initial-invest`)
const playNow = document.querySelector(`.playNow`)
const dogeStartingPrice = 0.42
const dogesHeld = playerInvests/dogeStartingPrice
const goalDisplay = document.getElementById(`goalSetTo`)
console.log(`setGoal: ` + setGoal)
console.log(`setInvestment: ` + setInvestment)
console.log(`playNow: ` + playNow)
console.log(`dogeStartingPrice: ` + dogeStartingPrice)
console.log(`dogesHeld: ` + dogesHeld)

// CLASSES / OBJECTS

// the Player class creates a new player after the profit-goal and investment event listeners are fired off, once the play button is clicked
// the Player is initialized with a bank balance of $12,000 and an empty cardsPlayed array
class Player {
  constructor(goal, investment){
    this.myGoal = goal;
    this.myInvestment = investment;
    this.numOfGoodBois = dogesHeld;
    this.currentBalance = bankBalance;
    this.cardsPlayed = [];
  }

  /*
class Card {
  constructor(){
  }
}
*/

  /*
  pullCard(){
    this.cardsPlayed.push(randomCard)
  }
  */
  
}

// FUNCTIONS
function setProfitGoal(event) {
  event.preventDefault()
  profitGoal = parseInt(event.target.value)
  goalDisplay.innerHTML = `Your profit goal is set to: $${profitGoal}. TO THE MOON!`
}

function initializeInvestment(event) {
  event.preventDefault()
  playerInvests = parseInt(event.target.value)
  document.getElementById(`playerInvests`).innerHTML = `wow big spender! much monies invested: $${playerInvests}`
}

function createPlayer() {
  const newPlayer = new Player(profitGoal, playerInvests)
  console.log(`A new player has been created with info: ${newPlayer.keys}`)
}

// EVENT LISTENERS

setGoal.forEach(function(button) {
  button.addEventListener(`click`, (event) => setProfitGoal(event))
})

setInvestment.forEach(function(button) {
  button.addEventListener(`click`, (event) => initializeInvestment(event))
})

playNow.addEventListener(`click`, createPlayer)
