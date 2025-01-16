## Unpack Configuration Files
```ts
// main.ts
import cfg from "./cfg.json" assert { type: "json" };
import manifest from './view_manifest.ts'
```
## Initialize the Host Container 
```ts
// uiContainer.ts
containerInit(cfg, manifest, title) {
   
   // initialize our execution context  
   initCFG(cfg, manifest)
   
   // our main Window with a canvas
   const host = new HostWindow(...)
   
   // sets shared host member references 	
   setupRenderContext(host)
   
   // initialize the canvas UI event handlers
   initHostEvents()
   
   // thats our app!
   return host
}
```

## Initialize our App - our main viewmodel
```ts
// app.ts
App.init() {
   // creates a singleton instance of the main viewmodel
   appInstance = App._instance = new App() {
      showIt.init('textbox1')
      sendButton.init('sendbutton')   // our send button
      textBox.init('textbox1')        // our textBox viewmodel
   }
}
```
## Load and Display the Apps UI
```ts
// uiContainer.ts
hydrateUI() {
   // get our view factories from our auto-generated `/views_manifest.ts`
   const views: Map<string, any> = getViews()

   // loop over each elementDescriptor     
   for (const el of elementDescriptors) {
      // get the registered constructor - from views_manifest.js
      // instantiate an instance, and add it to our activeNodes collection
   }
}
```
