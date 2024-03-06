import { events } from '../deps.ts'
import * as PlaySound from './sounds.ts'

import {eventBus, Player,  thisPlayer } from '../main.ts'

//import type { Player } from './players.ts'
//import { currentPlayer, thisPlayer } from './players.ts'
import * as dice from './dice.ts'
import * as Possible from './possible.ts'

const LabelState = {
   Normal: 0,
   Hovered: 1,
   HoveredOwned: 2,
   Reset: 3
}

const SmallStraight = 8
const LargeStraight = 9
const FullHouse = 10

//================================================
//     local constants for faster resolution
//================================================

const emptyString = ''
const black = 'black'
//const snow = 'snow'

/** ScoreElement Controller */
export default class ScoreElement {

   available: boolean
   owned: boolean
   index: number
   name: string
   owner: Player | null = null
   finalValue: number
   possibleValue: number
   scoringDieset: number[]
   scoringDiesetSum = 0
   hasFiveOfaKind = false

   /** constructor ... called from DiceGame.buildScoreItems()
    * @param dice {Dice} Dice dependency injection
    * @param index {number} index of this instance
    * @param name {string} the name of this instance
    */
   constructor(index: number, name: string) {

      this.available = false
      this.owned = false
      this.index = index
      this.name = name
      this.finalValue = 0
      this.possibleValue = 0
      this.scoringDieset = [0, 0, 0, 0, 0]

      //================================================
      //                bind events
      //================================================

      eventBus.on('ScoreButtonTouched', this.index.toString(), (_index: number) => {
         if (this.clicked()) {
            eventBus.fire(`ScoreElementResetTurn`, "", null)
         }
      })

      eventBus.on(`UpdateTooltip`, this.index.toString(), (data: { index: number, hovered: boolean }) => {
         let msg = ''
         let thisState = LabelState.Normal

         /* state
             0 = 'normal'
             1 = 'hovered' (not owned)
             2 = 'hovered' (has owner)
             3 = 'reset' from hovered 
         */

         if (data.hovered) {
            if (this.owned) {
               thisState = LabelState.HoveredOwned  // hovered (has owner)
               msg = `${thisPlayer.playerName} owns ${this.name} with ${this.scoringDieset.toString()}`
            } else { // hovered not owned
               thisState = LabelState.Hovered // hovered (not owned)
               msg = `${this.name}`
            }
         } else { // not hovered
            thisState = LabelState.Reset // reset (not hovered)
            msg = ''
         }

         events.fire(`UpdateText`, 'infolabel',
            {
               border: false,
               fill: true,
               fillColor: "snow",
               fontColor: 'black',
               text: msg
            }
         );
      })
   }

   /** broadcasts a message used to update the bottom infolabel element */
   updateInfo(text: string) {
      events.fire(`UpdateText`, 'infolabel',
         {
            border: false,
            fill: true,
            fillColor: "snow",
            fontColor: 'black',
            text: text
         }
      )
   }

   /** sets a flag to indicate this score is owned by the current player */
   setOwned(value: boolean) {
      this.owned = value
      if (this.owned) {
         this.owner = thisPlayer
         this.updateScoreElement(this.owner.color, this.possibleValue.toString())
      }
      else {
         this.owner = null
         this.updateScoreElement(black, emptyString)
      }
   }

   /** fires event used to update the score value */
   renderValue(value: string) {
      eventBus.fire(`UpdateScoreElement`, this.index.toString(),
         {
            index: this.index,
            renderAll: false,
            fillColor: (this.owner) ? this.owner.color : 'black',
            value: value,
            available: this.available
         }
      )
   }

   /**  broadcasts a message used to update the score view element */
   updateScoreElement(color: string | null, value: string) {
      eventBus.fire(`UpdateScoreElement`, this.index.toString(),
         {
            index: this.index,
            renderAll: true,
            fillColor: color || 'black',
            value: value,
            available: this.available
         }
      )
   }

   /** sets a flag that determins if this scoreElement is available   
    * to be selected by the current player */
   setAvailable(value: boolean) {
      this.available = value
      if (this.available) {
         if (this.possibleValue > 0) {
            this.renderValue(this.possibleValue.toString())
         }
      }
      else {
         if (this.owned) {
            this.renderValue(this.possibleValue.toString())
         }
         this.renderValue(this.possibleValue.toString())
      }
   }

   /** the clicked event handler for this scoreElement.    
    * returns true if the click caused this score to be    
    * taken by the current player  */
   clicked() {

      // if game has not started ... just return
      if (dice.toString() === '[0,0,0,0,0]') return false

      // if it's available
      let scoreTaken = false

      // and it's not taken yet
      if (!this.owned) {
         if (this.possibleValue === 0) {
            thisPlayer.lastScore = `sacrificed ${this.name} ${dice.toString()}`
            this.updateInfo(`${thisPlayer.playerName} ${thisPlayer.lastScore}`)
         } else {
            const wasItYou = thisPlayer.id === thisPlayer.id
            const wasTaken = (wasItYou) ? 'choose' : 'took'
            thisPlayer.lastScore = `${wasTaken} ${this.name} ${dice.toString()}`
            this.updateInfo(`${(wasItYou) ? 'You' : thisPlayer.playerName} ${thisPlayer.lastScore}`)
         }
         if (this.index === Possible.FiveOfaKindIndex) {
            if (dice.isFiveOfaKind) {
               dice.setfiveOfaKindBonusAllowed(true)
               PlaySound.Heehee()
            }
            else {
               dice.setfiveOfaKindWasSacrificed(true)
               PlaySound.Dohh()
            }
         }
         this.setValue()
         scoreTaken = true

      } // it's been taken
      else if (this.available) {
         thisPlayer.lastScore = `stole ${this.name} ${dice.toString()} was: ${this.scoringDieset.toString()}`;
         this.updateInfo(`${thisPlayer.playerName} ${thisPlayer.lastScore}`)
         this.setOwned(false)
         PlaySound.Heehee()
         this.setValue()
         scoreTaken = true
      }
      return scoreTaken
   }

   /** sets the value of this scoreElement after taken by a player */
   setValue() {
      this.setOwned(true)
      const thisValue = this.possibleValue
      this.finalValue = thisValue
      this.scoringDiesetSum = 0
      // DO NOT use for/of here! needs index
      this.scoringDieset.forEach((_die: number, index: number) => {
         this.scoringDieset[index] = dice.die[index].value
         this.scoringDiesetSum += dice.die[index].value
      })
      if (dice.isFiveOfaKind) {
         if (dice.fiveOfaKindBonusAllowed) {
            dice.setfiveOfaKindCount(dice.fiveOfaKindCount + 1)
            if (this.index !== Possible.FiveOfaKindIndex) {
               this.finalValue += 100
            }
            this.hasFiveOfaKind = true
            PlaySound.Heehee()
         }
         else {
            this.hasFiveOfaKind = false
            PlaySound.Cluck()
         }
      }
      else {
         this.hasFiveOfaKind = false;
         if (thisValue === 0) {
            PlaySound.Dohh()
         }
         else {
            PlaySound.Cluck()
         }
      }
   }

   // evaluates and displays a possible value for this scoreElement
   setPossible() {
      this.possibleValue = Possible.evaluate(this.index)
      if (!this.owned) {
         if (this.possibleValue === 0) {
            this.renderValue(emptyString)
         }
         else {
            this.renderValue(this.possibleValue.toString())
         }
         this.setAvailable(true)
      }
      else if (thisPlayer !== this.owner) {
         if (this.possibleValue > this.finalValue) {
            if (!this.hasFiveOfaKind) {
               this.setAvailable(true)
               this.renderValue(this.possibleValue.toString())
            }
         } else if ( // less than current value
            (this.index === SmallStraight || this.index === LargeStraight) &&
            (this.possibleValue === this.finalValue) &&
            (this.possibleValue > 0) &&
            (this.scoringDiesetSum < dice.sum)) {
            this.setAvailable(true)
            this.renderValue(this.possibleValue.toString())
         } else if (
            (this.index === FullHouse) &&
            (this.possibleValue === this.finalValue) &&
            (this.scoringDiesetSum < dice.sum)
         ) {
            this.setAvailable(true)
            this.renderValue(this.possibleValue.toString())
         }
      }
   }


   /** resets this scoreElement */
   reset() {
      this.setOwned(false)
      this.finalValue = 0
      this.possibleValue = 0
      this.updateScoreElement(black, emptyString)
      this.hasFiveOfaKind = false
   }

   /** clears the possible value for this scoreElement */
   clearPossible() {
      this.possibleValue = 0
      this.setAvailable(false)
      if (!this.owned) {
         this.finalValue = 0
         this.renderValue(emptyString)
      }
      else {
         this.renderValue(this.finalValue.toString())
      }
   }
}
