// deno-lint-ignore-file no-explicit-any
import type { Configuration, ElementDescriptor } from '../types.ts'
import { addNode, renderNodes, } from './activeNodes.ts'
import {
   elementDescriptors,
   getFactories,
   initCFG,
   setupRenderContext
} from './renderContext.ts'
import { initHostEvents } from '../events/systemEvents.ts'

/** 
 * our view factories 
 */
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
   initCFG(canvas, cfg, manifest)

   // sets shared host member references 
   setupRenderContext(canvas) 

   // initialize the canvas UI eventhandlers
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