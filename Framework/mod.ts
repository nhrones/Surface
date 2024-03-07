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
} from './src/render/uiContainer.ts'

//======================================
//      render 
//======================================

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

export { events, buildEventBus } from './src/coms/eventBus.ts'
export { initHostEvents } from './src/coms/systemEvents.ts'
export type { CoreEvents } from './src/coms/coreEventTypes.ts'
export * from './src/types.ts'
