// deno-lint-ignore-file no-explicit-any
import baseManifest from "../../base_manifest.ts"
import { signals } from '../signals/signals.ts'

import type {
   Configuration,
   ElementDescriptor,
   Manifest,
} from '../types.ts'

/** 
 * Give access to the current window configuration 
 */
export let windowCFG = {
   containerColor: "snow",
   textColor: "black",
};

/** 
 * Expose the element descriptor collection 
 */
export let elementDescriptors: ElementDescriptor[];

/** 
 * To hold our application View-Manifest 
 */
let appManifest: Manifest

/** 
 * Initialize our configuration 
 */
export const initCFG = (
   theCanvas: HTMLCanvasElement,
   cfg: Configuration
   ) => {
   canvas = theCanvas
   windowCFG = cfg.winCFG
   elementDescriptors = cfg.nodes
   //appManifest = { Views: {}, baseUrl: import.meta.url }
}

export const fontColor = 'white'

/** 
 * Build a set of View factories from the `baseManifest`.
 * `
 * This will add each View_constructor function to 
 * a Map to be used later to construct View instances.
 */
export const getFactories = () => {

   // Get the view_Manifest' base URL.
   //const baseUrl = new URL("./", appManifest.baseUrl).href;
   const baseUrl = new URL("./", import.meta.url).href;
   const factories: Map<string, any> = new Map()

   //add base frameWork component constructors first
   for (const [self, module] of Object.entries(baseManifest.Views)) {
      const url = new URL(self, baseUrl).href;
      const path = url.substring(baseUrl.length).substring("Components/Views".length);
      const baseRoute = path.substring(1, path.length - 3);
      const name = sanitizeName(baseRoute);
      const id = name.toLowerCase();
      const newView = { id, name, url, component: module.default }
      factories.set(id, newView)
   }
   return factories
}

/** 
 * Popup is being shown flag 
 */
export let hasVisiblePopup = false
export const setHasVisiblePopup = (val: boolean) => hasVisiblePopup = val

/** 
 * A counter used to blink the caret (cursor) 
 */
export let tickCount = 0
export let solid = true
/**  
 *  we use this tickcounter (0-60) to drive a blinking caret 
 */
export const incrementTickCount = () => {
   tickCount++;
   if (tickCount > 60) {
      tickCount = 0 
      solid = !solid
      //TODO fire 'blink' event
      signals.fire('Blink', "", solid)
   }
}

/** 
 *  Expose our canvas
 */
export let canvas: HTMLCanvasElement

/** 
 *  Expose our context2D from canvas
 */
export let ctx: CanvasRenderingContext2D

export const setupRenderContext = (canvas: HTMLCanvasElement) => {
   ctx = canvas.getContext("2d") as CanvasRenderingContext2D
   refreshCanvasContext()
}


export const refreshCanvasContext = () => {
   ctx.lineWidth = 1
   ctx.strokeStyle = windowCFG.containerColor
   ctx.fillStyle = windowCFG.containerColor
   ctx.font = "28px Tahoma, Verdana, sans-serif";
   ctx.textAlign = 'center'
}

/**
 *  Converts a string to pascal casing
 */
function toPascalCase(text: string): string {
   return text.replace(
      /(^\w|-\w)/g,
      (substring) => substring.replace(/-/, "").toUpperCase(),
   );
}

/**
 *  sanitize a file-name string
 */
function sanitizeName(name: string): string {
   const fileName = name.replace("/", "");
   return toPascalCase(fileName);
}
