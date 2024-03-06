/// <reference lib="dom" />
import { buildEventBus } from "./deps.ts"

import { initCloseButton, containerInit, hydrateUI, render } from "./deps.ts";

import * as PlaySound from './ViewModels/sounds.ts'

import { App, appInstance } from './ViewModels/diceGame.ts';

import { 
   addPlayer,
   setThisPlayer, 
   setCurrentPlayer, 
   thisPlayer 
} from './ViewModels/players.ts';

import type { DiceEvents } from "./diceGameTypes.ts";

// Unpack configuration files
import { cfg } from "./cfg.ts";
import manifest from './view_manifest.ts'

/** 
 * Use a factory function to create a new EventBus service 
 * using an intersection type from `Base` and `Local` types. 
 */
export const eventBus = buildEventBus<DiceEvents>()

/** initialize the button */
initCloseButton('closebutton')

const AudioContext = window.AudioContext
const context = new AudioContext();
// initialize or sounds
PlaySound.init(context)

const can = document.getElementById('surface') as HTMLCanvasElement
// REQUIRED - must be first call
// Initialize the Host Container 
containerInit( // REQUIRED - must be first call in main.ts
   can,
   cfg,
   manifest
)

// Initialize our App (main viewmodel) 
App.init();

// Load hydrate, and display the Apps GUI
hydrateUI() // REQUIRED - after the App is initialized

// Add our single player 
const id = '1'
const name = "Player1"
thisPlayer.id = id
thisPlayer.playerName = name
setThisPlayer(thisPlayer)
setCurrentPlayer(thisPlayer)
addPlayer(id, name)

// Reset for a fresh start 
appInstance.resetTurn()
render()