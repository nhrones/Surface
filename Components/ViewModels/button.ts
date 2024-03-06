
import { events } from '../deps.ts'

// used to recognize events from a (decoupled) view
let thisID: string;

/**  
 * To be called by a main viewmodel
 * @ param {string} id - a unique identifier name
 */
export const initButton = (id: string) => {
   thisID = id
   // listens for a touch event from a Button view with the same id 
   events.on('ButtonTouched', thisID, () => {
      // fire an event to show a popup
      events.fire('ShowPopup', '', { title: "", msg: "" })
   })
}