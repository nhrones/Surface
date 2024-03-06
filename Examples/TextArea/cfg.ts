import type {ElementDescriptor} from '../../Framework/types.ts'

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
         location: { left: 300, top: 20 },
         size: { width: 400, height: 350 },
         text: "testing123",
         color: "snow",
         
         multiLine: true
      },      
      {
         kind: "Button",
         id: "closebutton",
         idx: 0,
         tabOrder: 2,
         location: { left: 400, top: 400 },
         size: { width: 200, height: 50 },
         text: "Close",
         color: "brown"
      }
   ] as ElementDescriptor[]
}