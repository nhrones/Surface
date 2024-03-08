import { signals } from  '../deps.ts'

// used to recognize signals from a (decoupled) view
let thisID: string;

// an exported checkbox state flag
let checked = false

let txt = "  "
const checkmark = " ✅" //" ✔"
const empty =  "  "

/**  
 * To be called by a main viewmodel
 * @ param {string} id - a unique identifier name
 */
export const initCheckbox = (id: string) => {
   thisID = id

   // listens for a touch event from this checkbox 
   signals.on('CheckBoxTouched', thisID, () => {
      checked = !checked
      txt = (checked) ? checkmark : empty
      signals.fire('UpdateButton', thisID,
         { text: txt, color: "green", enabled: true }
      )
   })

}