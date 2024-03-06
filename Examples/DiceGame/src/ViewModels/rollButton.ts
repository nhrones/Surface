
import { events } from '../deps.ts'

import * as dice from './dice.ts'

const thisID = 'rollbutton'


export const state = { text: '', color: '', enabled: true }

/**  Called from DiceGame Controller ctor */ 
export const init = () => {
    // when this instance rolls dice
    events.on('ButtonTouched', thisID, () => {
        dice.roll(null)
        updateRollState()
    })
}

/** state management for the roll button */
const updateRollState = () => {
    switch (dice.rollCount) {
        case 1:
            state.text = 'Roll Again'
            break
        case 2:
            state.text = 'Last Roll'
            break
        case 3:
            state.enabled = false
            state.text = 'Select Score'
            break
        default:
            state.text = 'Roll Dice'
            dice.setRollCount(0)
    }
    update()
}

/** fires an update event with the current state */
export const update = () => {
   events.fire('UpdateButton', thisID, state)
}

