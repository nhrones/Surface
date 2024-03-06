// deno-lint-ignore-file no-explicit-any

import type { Configuration, ElementDescriptor } from '../types.ts'
//HACK import { renderNodes, addNode } from '../render/activeNodes.ts'
import { addNode, renderNodes, } from '../render/activeNodes.ts' // NEW
import {
   elementDescriptors,
   getFactories,
   initCFG,
   setupRenderContext,
   //windowCFG
} from '../render/renderContext.ts'
//HACK import { Host } from '../render/renderContext.ts'
//HACK import { HostWindow, } from "./hostWindow.ts";
import { initHostEvents } from '../coms/systemEvents.ts'

// our view factories
let factories: Map<string, any>

/**  
 * create our app (window) 
 */
export function containerInit(
   canvas: HTMLCanvasElement,
   cfg: Configuration,
   manifest: any
) {
   // initialize our execution context  
   //HACK initCFG(cfg, manifest)
   initCFG(canvas, cfg, manifest)

   // sets shared host member references 
   setupRenderContext(canvas) //TODO USE CANVAS

   // initialize the canvas UI event handlers
   initHostEvents()
}

/** 
 * central render function 
 */
export const render = () => {
   // refresh the view - render views
   renderNodes()
}

/* 
  Build all virtual UI elements from ElementDescriptors    
  contained in cfg.json.  
     
  Once we have elementDescriptors parsed as 'nodes', we proceed    
  to hydrate each as an active viewElement object. We place each    
  in an 'activeNodes' collection.
     
  Each viewElement contains a Path2D object. This path is used to     
  render and 'hit-test' the vitual UI View in mouseEvents.     
  mouseEvents (SEE: ./coms/systemEvents.ts). 
*/
export const hydrateUI = () => {

   // get our view factories from our auto-generated `/views_manifest.ts`
   factories = getFactories()
   // loop over each elementDescriptor  
   for (const el of elementDescriptors) {
      addElement(el)
   }
}

export function addElement(el: ElementDescriptor) {
   // get the `kind` of the view being requested
   const thisKind = el.kind.toLowerCase()

   // test if we have a registered factory for this kind
   if (factories.has(thisKind)) {
      // to hydrate the View-element,
      // we get the registered constructor
      const View = factories.get(thisKind).component

      // instantiate an instance, and add it to our activeNodes collection
      addNode(new View(el))

   } // sorry, that kind was not found
   else {
      const errMsg = `No view named ${el.kind} was found! 
Make sure your view_manifest is up to date!`
      console.error(errMsg)
      throw new Error(errMsg);
   }
}