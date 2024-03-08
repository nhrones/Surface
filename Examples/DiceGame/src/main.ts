/// <reference lib="dom" />
import { buildSignalBroker } from  "./deps.ts"
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
import type { DiceSignals } from "./diceGameTypes.ts";

// Import configuration files
import { cfg } from "./cfg.ts";
import manifest from './view_manifest.ts'

/** 
 * Use the factory function to create a new SignalBroker service 
 */
const diceSignals = buildSignalBroker<DiceSignals>()
export const { on, fire } = diceSignals
/** initialize the button */
initCloseButton('closebutton')

// initialize all sounds
const AudioContext = globalThis.AudioContext
const context = new AudioContext();
PlaySound.init(context)

/** Our only DOM element -- a single canvas */
const cannvy = document.getElementById('surface') as HTMLCanvasElement

// Initialize the Host Container 
containerInit(
   cannvy,
   cfg,
   manifest
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