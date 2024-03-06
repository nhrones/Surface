import { Host, events } from '../deps.ts'

// used to recognize events from a (decoupled) view
let thisID: string;

/**  
 * To be called by a main viewmodel
 * @ param {string} id - a unique identifier name
 */
export const initCloseButton = (id: string) => {    
    thisID = id   
    // listens for a touch event from this buttom 
    events.on('ButtonTouched', thisID, () => {
        //TODO Host.window.close()
    })
}