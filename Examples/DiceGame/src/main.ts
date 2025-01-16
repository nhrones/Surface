/// <reference lib="dom" />
import { initCloseButton, containerInit, hydrateUI, render } from "./deps.ts";
import * as PlaySound from './ViewModels/sounds.ts'
import { App, appInstance } from './ViewModels/diceGame.ts';

/** a type that describes a Player object */
export type Player = {
    id: string
    idx: number
    playerName: string
    color: string
    score: number
    lastScore: string
}

// Import configuration files
import { cfg } from "./cfg.ts";

/** initialize the button */
initCloseButton('closebutton')

// initialize all sounds
const AudioContext = globalThis.AudioContext
const context = new AudioContext();
PlaySound.init(context)

/** Our only DOM element -- a single canvas */
const canvasElem = document.getElementById('surface') as HTMLCanvasElement

// Initialize the Host Container 
containerInit(
   canvasElem,
   cfg
)

// Initialize our App (main viewmodel) 
App.init();

// Load, hydrate, and display the Apps GUI
hydrateUI()

/** Our only player */
export const thisPlayer: Player = {
    id: "1",
    idx: 0,
    playerName: 'Score:',
    color: 'brown',
    score: 0,
    lastScore: ''
}

// Reset for a clean startup 
appInstance.resetTurn()

// Initial rendering of the UI
render()