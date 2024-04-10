import { signals } from '../deps.ts'

export const serverURL = document.location.origin

export let highScore = 0

/** Post a message */
export function setHighScore(value: number) {
   highScore = value
   localStorage.setItem("highscore", value+"")
   // fetch(serverURL + "/", {
   //    method: "POST",
   //    mode: 'cors',
   //    body: JSON.stringify(value)
   // });
   signals.fire('UpdateText', 'highScoreValue',
   {
      border: false,
      fill: true,
      fillColor: 'snow',
      fontColor: 'black',
      text: highScore + ""
   }
)
};

/** Post a message */
export function getHighScore() {
   if( highScore === 0 ) {
      highScore = parseInt(localStorage.getItem('highscore') ?? "0")
   }
   // return await fetch(serverURL + "/highscore", {
   //    method: "GET",
   //    mode: 'cors',
   // });
};

export function setupHighScore() {
   if (highScore === 0) getHighScore()
      //const result = await response.json()
      //console.info('setupHighScore ', result.value)
      //highScore = result.value
      setHighScore(highScore)
   //}
   signals.fire('UpdateText', 'highScoreValue',
      {
         border: false,
         fill: true,
         fillColor: 'snow',
         fontColor: 'black',
         text: highScore + ""
      }
   )
}