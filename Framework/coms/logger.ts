
import { events } from "../mod.ts"
let logTxt = ""
/**
 *  log msg to 'logger' static text element
 */
export const logThis = (thisMsg: string, from?: string, clear = false) => {

   if (clear) {
      logTxt = ""
   }

   const newTxt = ( from ) 
      ? from + " -- " + thisMsg
      : thisMsg

   logTxt = newTxt + `
${logTxt}` 
   const maxChars = 600
   if (logTxt.length > maxChars) logTxt = logTxt.substring(0, maxChars)

   events.fire("UpdateText", "logger",
      {
         border: true,
         fill: true,
         fillColor: 'white',
         fontColor: "black",
         text: logTxt
      })
}
