// VARIABLES
let profitGoal = 0
let playerInvests = 0
let bankBalance = 12000-playerInvests
console.log(profitGoal)
console.log(playerInvests)
console.log(bankBalance)

const setGoal = document.querySelector(`.profit-goals`)
const setInvestment = document.querySelector(`.initial-invest`)
const playNow = document.querySelector(`.playNow`)
const dogeStartingPrice = 0.42
const dogesHeld = playerInvests/dogeStartingPrice
console.log(setGoal)
console.log(setInvestment)
console.log(playNow)
console.log(dogeStartingPrice)
console.log(dogesHeld)

// CLASSES / OBJECTS

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
  console.log(`Hello`)
  console.log(`A profit goal was clicked`)
  console.log(`Printing the value of setGoal: ${setGoal.value}`)
  /*
  profitGoal = parseInt(setGoal.value)
  document.getElementById(`goalSetTo`).innerHTML = `Your profit goal is set to: $${profitGoal}. TO THE MOON!`
*/
}

function initializeInvestment(event) {
  console.log(`An initial investment was selected`)
  console.log(`The value of setInvestment is: ${setInvestment}`)
  /*
  playerInvests = parseInt(setInvestment.value)
  document.getElementById(`playerInvests`).innerHTML = `wow big spender! much monies invested: $${playerInvests}`
*/
}

function createPlayer(event) {
  console.log(`Play button was clicked`)
  /*
  const newPlayer = new Player(profitGoal, playerInvests)
  console.log(`A new player has been created with info: ${newPlayer}`)
  */
}

// EVENT LISTENERS
setGoal.addEventListener(`click`, (event) => setProfitGoal(event))
setInvestment.addEventListener(`click`, initializeInvestment)
playNow.addEventListener(`click`, createPlayer)
