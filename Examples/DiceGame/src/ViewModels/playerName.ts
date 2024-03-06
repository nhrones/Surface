
import { eventBus } from '../main.ts'
import { events } from '../deps.ts'

const id = 'player1'

export const state = {
   border: false, 
   fill: true,  
   fillColor: "snow", 
   fontColor: "Brown",
   text: "Score:"
}

/** PlayerName ViewModel initialization
 *  Called from DiceGame Controller ctor */
export const init = () => {
   //hack: 
   eventBus.on("UpdatePlayer", "0", (data: { index: number, color: string, text: string }) => {
      //state.color = data.color
      state.text = data.text
      update()
   })
   
   update()
}

/** fires an update event with the current state */
export const update = () => {
   events.fire('UpdateText', id, state)
}