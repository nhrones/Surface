
//=================================================
//    Component Deps
//================================================= 
export * from '../Components/mod.ts'

//======================================
//      render 
//======================================

/* uiContainer.ts */
export { 
   addElement,
   containerInit, 
   hydrateUI, 
   render
} from './src/render/uiContainer.ts'

/* activeNodes.ts */
export { 
   activeNodes, 
   addNode, 
   renderNodes 
} from './src/render/activeNodes.ts'

/* renderContext.ts */
export { 
   canvas,
   ctx,
   elementDescriptors, 
   fontColor,
   getFactories, 
   hasVisiblePopup,
   incrementTickCount,
   initCFG, 
   refreshCanvasContext,
   setHasVisiblePopup,
   setupRenderContext,
   tickCount,
   windowCFG 
} from './src/render/renderContext.ts'

//======================================
//      coms 
//======================================

export { signals, buildSignalAggregator } from './src/signals/signals.ts'
export { initHostEvents } from './src/signals/systemEvents.ts'
export type { CoreEvents } from './src/signals/coreEventTypes.ts'
export * from './src/types.ts'
  