import { events } from '../deps.ts'
import * as PlaySound from './sounds.ts'

import { eventBus } from '../main.ts'

import * as playerOne from './playerName.ts'
//import * as Players from './players.ts'
//import { Player } from './players.ts'
import * as dice from './dice.ts'
import * as Possible from './possible.ts'
import ScoreElement from './scoreElement.ts'
import * as rollButton from './rollButton.ts'
import { thisPlayer } from '../main.ts';

//================================================
//         local const for faster resolution
//================================================

const SHORTCUT_GAMEOVER = false;

//const snowColor = 'snow'
//const grayColor = 'gray'

//================================================
//      exported const for faster resolution
//================================================

export let appInstance: App

/** the main controller for the dice game */
export class App {

   //players: Set<Player>
   scoreItems: ScoreElement[]
   leftBonus: number
   fiveOkindBonus: number
   leftTotal: number
   rightTotal: number

   /** DiceGame private instance, exposed by init() */
   private static _instance: App

   /** singleton initialization */
   static init() {
      if (!App._instance) {
         App._instance = new App()
         appInstance = App._instance
      }
   }

   /** private singleton constructor, called from init() */
   private constructor() {

      //Players.init( snowColor )
      //this.players = Players.players
      this.scoreItems = []
      this.leftBonus = 0
      this.fiveOkindBonus = 0
      this.leftTotal = 0
      this.rightTotal = 0
      dice.init()
      rollButton.init()
      playerOne.init()

      //================================================
      //                 bind events 
      //================================================

      if (!this.isGameComplete()) {
         this.resetTurn()
      }

      events.on(`PopupReset`, "", () => {
         events.fire(`HidePopup`, "", null)
         this.resetGame()
      })

      eventBus.on(`ScoreElementResetTurn`, "", () => {
         if (this.isGameComplete()) {
            this.clearPossibleScores()
            this.setLeftScores()
            this.setRightScores()
            this.showFinalScore()
         } else {
            this.resetTurn()
         }
      })

      events.on('AddedView', "", (view: { type: string, index: number, name: string }) => {
         if (view.type === 'ScoreButton') {
            this.scoreItems.push(new ScoreElement(view.index, view.name))
         }
      })
   }

   /** check score total and determin the winner of this game */
   getWinner() {
      //if (this.players.size === 1) {
      //   return this.getPlayer(0)
      //}
      //let thisWinner = thisPlayer //this.getPlayer(0)
      //let highscore = 0
      //for (const player of this.players) {
      //if (player.score > highscore) {
      //let highscore = thisPlayer.score //player.score
      //thisWinner = thisPlayer //player
      //}
      //}
      return thisPlayer //thisWinner
   }

   /** clear all scoreElements possible score value */
   clearPossibleScores() {
      for (const scoreItem of this.scoreItems) {
         scoreItem.clearPossible()
      }
   }

   /** evaluates the dice and then sets a possible score value for each scoreelements */
   evaluatePossibleScores() {
      for (const scoreItem of this.scoreItems) {
         scoreItem.setPossible()
      }
   }

   /** resets the turn by resetting values and state */
   resetTurn() {
      //Players.setCurrentPlayer(Players.getNextPlayer(Players.currentPlayer))
      PlaySound.enabled(true)//(Players.currentPlayer.id === Players.thisPlayer.id)
      rollButton.state.color = thisPlayer.color //Players.currentPlayer.color
      rollButton.state.enabled = true
      rollButton.state.text = 'Roll Dice'
      rollButton.update()
      dice.resetTurn()
      this.clearPossibleScores()
      this.setLeftScores()
      this.setRightScores()
   }

   /** resets game state to start a new game */
   resetGame() {
      events.fire(`HidePopup`, "", null)
      //Players.setCurrentPlayer(this.getPlayer(0))
      dice.resetGame()
      for (const scoreItem of this.scoreItems) {
         scoreItem.reset()
      }
      // clear the view
      //Players.resetScoreLabels()

      eventBus.fire('UpdatePlayer', "1", {
         index: 0,
         color: "brown",
         text: ""
      }
      )

      this.leftBonus = 0
      this.fiveOkindBonus = 0
      this.leftTotal = 0
      this.rightTotal = 0

      events.fire('UpdateText', 'leftscore',
         {
            border: true,
            fill: true,
            fillColor: 'grey',
            fontColor: 'snow',
            text: '^ total = 0'
         }
      )

      //Players.resetPlayers()
      rollButton.state.color = 'brown'
      rollButton.state.text = 'Roll Dice'
      rollButton.state.enabled = true
      rollButton.update()
   }

   /** show a popup with winner and final score */
   showFinalScore() {
      let winMsg
      //if (winner.id !== Players.thisPlayer.id) {
      //   PlaySound.Nooo()
      winMsg = thisPlayer.playerName + ' wins!'
      //}
      //else {
      PlaySound.Woohoo()
      winMsg = 'You won!'
      //}
      rollButton.state.color = 'black'
      rollButton.state.text = winMsg
      rollButton.update()

      events.fire(`UpdateText`, 'infolabel',
         {
            border: false,
            fill: true,
            fillColor: "snow",
            fontColor: 'black',
            text: winMsg + ' ' + thisPlayer.score
         }
      )
      events.fire('ShowPopup', "", { title: 'Game Over!', msg: 'You Won!' })
   }

   /** check all scoreElements to see if game is complete */
   isGameComplete() {
      if (SHORTCUT_GAMEOVER) {
         return true;
      } else {
         let result = true
         for (const scoreItem of this.scoreItems) {
            if (!scoreItem.owned) {
               result = false
            }
         }
         return result
      }
   }

   /** sum and show left scoreElements total value */
   setLeftScores() {
      this.leftTotal = 0
      //for (const player of this.players) {
      thisPlayer.score = 0
      //}
      let val
      for (let i = 0; i < 6; i++) {
         val = this.scoreItems[i].finalValue
         if (val > 0) {
            this.leftTotal += val
            //const owner = thisPlayer //this.scoreItems[i].owner
            //if (owner) {
            //Players.addScore(owner, val)
            thisPlayer.score += val
            const text = (thisPlayer.score === 0) ? thisPlayer.playerName : `${thisPlayer.playerName} = ${thisPlayer.score}`
            this.updatePlayer(thisPlayer.idx, thisPlayer.color, text)
            if (this.scoreItems[i].hasFiveOfaKind && (dice.fiveOfaKindCount > 1)) {
               this.addScore( 100 )
            }
            //}
         }
      }
      if (this.leftTotal > 62) {
         //let bonusWinner = thisPlayer
         //let highleft = 0
         //for (const player of this.players) {
            //if (thisPlayer.score > highleft) {
               //highleft = thisPlayer.score
               //bonusWinner = thisPlayer
            //}
         //}

         this.addScore(35)
         events.fire('UpdateText', 'leftscore',
            {
               border: true,
               fill: true,
               fillColor: 'grey',
               fontColor: 'snow',
               text: `^ total = ${this.leftTotal.toString()} + 35`
            }
         )
      }
      else {
         events.fire('UpdateText', 'leftscore',
            {
               border: true,
               fill: true,
               fillColor: 'grey',
               fontColor: 'snow',
               text: '^ total = ' + this.leftTotal.toString()
            }
         )
      }
      if (this.leftTotal === 0) {
         events.fire('UpdateText', 'leftscore',
            {
               border: true,
               fill: true,
               fillColor: 'grey',
               fontColor: 'snow',
               text: '^ total = 0'
            }
         )
      }
   }

   /** sum the values of the right scoreElements */
   setRightScores() {
      let val
      const len = this.scoreItems.length
      for (let i = 6; i < len; i++) {
         val = this.scoreItems[i].finalValue
         if (val > 0) {
            const owner = this.scoreItems[i].owner
            if (owner) {
               this.addScore(val)
               if (this.scoreItems[i].hasFiveOfaKind
                  && (dice.fiveOfaKindCount > 1)
                  && (i !== Possible.FiveOfaKindIndex)
               ) {
                  this.addScore(100)
               }
            }
         }
      }
   }

   // getPlayer(index: number) {
   //    for (const player of this.players) {
   //       if (player.idx === index) {
   //          return player
   //       }
   //    }
   //    return [...this.players][index];
   // }

   /** add a score value for this player */
   addScore = (value: number) => {
      thisPlayer.score += value
      const text = (thisPlayer.score === 0) ? thisPlayer.playerName : `${thisPlayer.playerName} = ${thisPlayer.score}`
      this.updatePlayer(thisPlayer.idx, thisPlayer.color, text)
   }

   /** broadcast an update message to the view element */
   updatePlayer = (index: number, color: string, text: string) => {
      eventBus.fire('UpdatePlayer', index.toString(), {
         index: index,
         color: color,
         text: text
      }
      )
   }
}
