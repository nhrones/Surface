
import {
   logThis,
   mainloop, 
   containerInit, 
   hydrateUI,
   initCloseButton,
   render,
   TextEditor,
   events
} from "./deps.ts";


import * as DeleteButton from './deleteButton.ts'

// Unpack Configuration Files
import { cfg } from "./cfg.ts";
import manifest from './view_manifest.ts'

// Initialize the Host Container 
containerInit( // REQUIRED - must be first call
   //'DWM-GUI TextArea Example', // sets window title   
   cfg,
   manifest,
)

/** initialize the close button */
initCloseButton('closebutton')

const textEditor = new TextEditor( 'TextArea1', `First line.
Second line.` )

// Build and Display the Apps GUI
hydrateUI() // REQUIRED - after the App is initialized

// kickstart our editor session
events.fire('Focused', "TextArea1", false)
// clear the log
logThis("", "", true) 

// Main Render Loop
await mainloop(render) // MUST be the LAST call in main.ts
