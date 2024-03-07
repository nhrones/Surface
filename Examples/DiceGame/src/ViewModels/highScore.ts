import { events } from '../deps.ts'


export let HighScore = 0

export function setupHighScore() {
   HighScore = parseInt(localStorage.getItem("highScore") as string) ?? 0
   if (!HighScore ) localStorage.setItem("highScore", "10");
 
   events.fire('UpdateText', 'highScoreValue',
      {
         border: false,
         fill: true,
         fillColor: 'snow',
         fontColor: 'black',
         text: HighScore + ""
      }
   )
}