import { signals } from '../deps.ts'

export const serverURL = document.location.origin

export let highScore = 0

/** Post a message */
export function setHighScore(value: number) {
   highScore = value
   fetch(serverURL + "/", {
      method: "POST",
      mode: 'cors',
      body: JSON.stringify(value)
   });
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
export async function getHighScore() {
   return await fetch(serverURL + "/highscore", {
      method: "GET",
      mode: 'cors',
   });
};

export async function setupHighScore() {
   if (highScore === 0) {
      const response = await getHighScore()
      const result = await response.json()
      console.info('setupHighScore ', result.value)
      highScore = result.value
      setHighScore(highScore)
   }
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