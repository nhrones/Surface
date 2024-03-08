
import {
   containerInit, 
   hydrateUI,
   initCloseButton,
   TextEditor,
   signals
} from "./deps.ts";

// Unpack Configuration Files
import { cfg } from "./cfg.ts";
import manifest from './view_manifest.ts'

const can = document.getElementById('surface') as HTMLCanvasElement

// Initialize the UI
containerInit(
   can,  
   cfg,
   manifest,
)

/** initialize the close button */
initCloseButton('closebutton')

const _textEditor = new TextEditor( 'TextArea1', `First line.
Second line.` )

// Build and Display the Apps GUI
hydrateUI() // REQUIRED - after the App is initialized

// kickstart our editor session
signals.fire('Focused', "TextArea1", false)
