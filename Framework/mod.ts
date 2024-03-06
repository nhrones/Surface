//=================================================
//    Component Deps
//=================================================
export * from '../Components/mod.ts'



//======================================
//      host 
//======================================

/* hostWindow.ts */
//HACK export { HostWindow } from './host/hostWindow.ts'

/* uiContainer.ts */
export { 
   addElement,
   containerInit, 
   hydrateUI, 
   render
} from './host/uiContainer.ts'

//======================================
//      render 
//======================================

/* activeNodes.ts */
export { 
   activeNodes, 
   addNode, 
   renderNodes 
} from './render/activeNodes.ts'

/* renderContext.ts */
export { 
   canvas,
   ctx,
   elementDescriptors, 
   fontColor,
   getFactories, 
   hasVisiblePopup,
   hostCanvas as Host,
   incrementTickCount,
   initCFG, 
   refreshCanvasContext,
   setHasVisiblePopup,
   setupRenderContext,
   tickCount,
   windowCFG 
} from './render/renderContext.ts'

//======================================
//      coms 
//======================================

export { events, buildEventBus } from './coms/eventBus.ts'
export { logThis } from './coms/logger.ts'
export { initHostEvents } from './coms/systemEvents.ts'
export type { CoreEvents } from './coms/coreEventTypes.ts'
export * from './types.ts'
