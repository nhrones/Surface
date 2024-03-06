// import {
//    DwmWindow,
//    createWindow,
//    CreateWindowOptions,
//    WindowClosedEvent,
//    WindowFramebufferSizeEvent,
// } from "../mod.ts"  // dwm 

// import {
//    Canvas,
//    createCanvas,
//    CanvasRenderingContext2D,
// } from "../mod.ts" // skia_canvas 

// /** 
//  * dwmWindow containing a skia-canvas 
//  */
// export class HostWindow {

//    canvas: Canvas;
//    window: DwmWindow;
//    ctx: CanvasRenderingContext2D;
//    #isDirty = true;
//    onContextLoss?: () => void;
//    onDraw?: (ctx: CanvasRenderingContext2D) => unknown;


//    constructor(options: CreateWindowOptions = {}) {
//       this.window = createWindow(Object.assign({ glVersion: [3, 3] }, options));
//       const { width, height } = this.window.framebufferSize;
//       this.canvas = createCanvas(width, height, true);
//       this.ctx = this.canvas.getContext("2d");

//       const onFramebuffersize = (evt: WindowFramebufferSizeEvent) => {
//          if (!evt.match(this.window)) return;
//          if (evt.width === 0 || evt.height === 0) {
//             this.#isDirty = false;
//             return;
//          }
//          this.#resize(evt.width, evt.height);
//       };

//       const onClosed = (evt: WindowClosedEvent) => {
//          if (!evt.match(this.window)) return;
//          removeEventListener("framebuffersize", onFramebuffersize);
//          removeEventListener("closed", onClosed);
//          this.#isDirty = false;
//       };

//       addEventListener("framebuffersize", onFramebuffersize);
//       addEventListener("closed", onClosed);
//    }

//    #resize(width: number, height: number) {
//       this.canvas.resize(width, height);
//       this.ctx = this.canvas.getContext("2d");
//       this.onContextLoss?.();
//       this.#isDirty = true;
//    }

//    /** gets the dirty flag value (true/false) */
//    isDirty() { return this.#isDirty }

//    /** sets the dirty flag (true) */
//    dirty() { this.#isDirty = true }

//    /** clears the dirty flag (false) */
//    notDirty() { this.#isDirty = false }
   
//    /** Window make ContextCurrent */
//    makeContextCurrent() {
//       this.window.makeContextCurrent();
//   }
  
//   /** flush and swap buffers */
//    flush() {
//       if (this.#isDirty) {
//          this.#isDirty = false;
//          this.canvas.flush();
//          this.window.swapBuffers();
//       }
//    }
// }
