import type {ElementDescriptor} from './deps.ts'

/** This is the configuration object  */
export const cfg = {
   winCFG: {
      title: "DWM-GUI TextArea Example",
      size: { width: 1000, height: 900 },
      location: { x: 500, y: 100 },
      radius: 30,
      containerColor: "snow",
      textColor: "black",
      resizable: false,
      removeDecorations: false,
      transparent: false
   },
   nodes: [
      {
         kind: "TextArea",
         id: "TextArea1",
         idx: 0,
         tabOrder: 1,
         location: { left: 10, top: 20 },
         size: { width: 360, height: 350 },
         text: "testing123",
         color: "snow",
         bind: true,
         multiLine: true
      },      
      {
         kind: "Button",
         id: "closebutton",
         idx: 0,
         tabOrder: 2,
         location: { left: 100, top: 400 },
         size: { width: 200, height: 50 },
         enabled: true,
         text: "Close",
         color: "brown"
      }
   ] as ElementDescriptor[]
}