## host folder

### hostWindow.ts -- Host Window Class
  * class HostWindow -- Window with a canvas
     - #resize() -- handle window resize event
     - isDirty() -- returns the dirty flag value (true or false)
     - dirty() -- sets the dirty flag to (true)
     - notDirty() -- clears the dirty flag to (false)
     - makeContextCurrent() -- calls this.window.makeContextCurrent()
     - flush() -- if (dirty), canvas.flush, window.swapBuffers

### uiContainer.ts -- Container for UI instantiation, hydration, rendering	
  * containerInit() -- create our app (window)
  * render() -- central render function
  * hydrateUI() -- hydrate all UI views from the configuration (cfg.json)


## ipc folder

### hostEvents.ts -- Window, Mouse, Keyboard event management
  * initHostEvents () -- Registers event handlers
  * handleMouseMove() -- Handles canvas mouse-move event
  * handleClickOrTouch() -- Handles canvas-mouse-Click and canvas-Touch events
  * clearFocused() -- clears last focused object
  * clearHovered() -- clear last hovered object

### typedEmitter.ts -- our simple eventBus
  * on(event) -- register event handlers to be executed when an event is fired
  * fire(event -- execute all registered handlers for a names event

### types.ts -- our eventBus event types
  * TypedEvent(Type) -- eventBus event types

## render folder 

### nodes.ts -- our nodes collection
  * addNode(view) -- adds new UI nodes to the activeNodes collections
  * renderNodes() -- main render function
   
### renderContext.ts -- a framework rendering context
  * initCFG() -- initialize the context configuration
  * getViews() -- build a set of View factories
  * incrementTickCount() -- we use this tickcounter (0-60) to drive a blinking caret 
  * setupRenderContext() -- sets the rendering context Host, window and canvas members
  * refreshCanvasContext() -- initialize the rendering contexts canvas context2D member 
