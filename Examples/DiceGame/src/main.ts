/// <reference lib="dom" />
import { buildEventBus } from "./deps.ts"

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

import type { DiceEvents } from "./diceGameTypes.ts";

// Unpack configuration files
import { cfg } from "./cfg.ts";
import manifest from './view_manifest.ts'
console.info('manifest', manifest)
/** 
 * Use a factory function to create a new EventBus service 
 * using an intersection type from `Base` and `Local` types. 
 */
export const eventBus = buildEventBus<DiceEvents>()

/** initialize the button */
initCloseButton('closebutton')

const AudioContext = globalThis.AudioContext
const context = new AudioContext();
// initialize or sounds
PlaySound.init(context)

const can = document.getElementById('surface') as HTMLCanvasElement

// Initialize the Host Container 
containerInit(
   can,
   cfg,
   manifest
)

// Initialize our App (main viewmodel) 
App.init();

// Load hydrate, and display the Apps GUI
hydrateUI()

export const thisPlayer: Player = {
    id: "0",
    idx: 0,
    playerName: 'Nick',
    color: 'brown',
    score: 0,
    lastScore: ''
}

// Add our single player 
const id = '1'
const name = "Score:"
thisPlayer.id = id
thisPlayer.playerName = name

// Reset for a fresh start 
appInstance.resetTurn()
render()