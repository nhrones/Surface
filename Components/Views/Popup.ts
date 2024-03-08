/// <reference lib="dom" />
import {  
   ElementDescriptor, 
   Location, 
   View,
   ctx, 
   setHasVisiblePopup, 
   signals,
   windowCFG 
} from '../deps.ts'

import Text from './Text.ts'

let left = 1
let top = 1

/** A virtual Popup view class */
export default class Popup implements View {

   id = 0 // assigned by activeViews.add() 
   index = -1
   activeView = true
   zOrder = 0
   tabOrder = 0
   name = ""
   enabled = true
   hovered = false
   focused = false
   path: Path2D
   shownPath: Path2D
   hiddenPath: Path2D
   location: Location
   size: { height:number, width: number }
   color = "black"
   textNode: Text
   text = ""
   fontColor = "red"
   fontSize = 28
   visible = true

   /** ctor that instantiates a new vitual Popup view */
   constructor(el: ElementDescriptor) {
      this.tabOrder = el.tabOrder  || 0
      this.enabled = true
      this.color = 'white'
      this.location = el.location
      this.hiddenPath = new Path2D()
      this.hiddenPath.rect(1, 1, 1, 1)
      this.size = el.size || { width: 300, height: 300 }
      this.shownPath = this.buildPath(el.radius || 30)
      this.path = this.hiddenPath
      this.fontSize = el.fontSize || 24
      this.textNode = new Text (
         {
            kind: 'Text',
            idx: -1,
            tabOrder: 0,
            id: this.name + 'Label',
            text: el.text || "",
            location: this.location,
            size: this.size,
            bind: true
         }
      )

      //================================================
      //                bind signals
      //================================================

      // Our game controller broadcasts this ShowPopup event at the end of a game
      signals.on('ShowPopup',"", (data: { title: string, msg: string }) => {
         this.show(data.msg)
      })

      signals.on('HidePopup', "", () => this.hide())
   }
   /** build a Path2D */
   buildPath(radius: number) {
      const path = new Path2D
      path.roundRect(this.location.left, this.location.top, this.size.width, this.size.height, radius)
      return path
   }
   /** show the virtual Popup view */
   show(msg: string) {
      signals.fire('FocusPopup'," ", this)
      this.text = msg
      left = this.location.left
      top = this.location.top
      this.path = this.shownPath
      this.visible = true
      setHasVisiblePopup(true)
      this.render()
   }

   /** hide the virtual Popup view */
   hide() {
      if (this.visible) {
         left = 1
         top = 1
         this.path = this.hiddenPath
         this.visible = false
         setHasVisiblePopup(false)
      }
   }

   /** called from Surface/canvasEvents when this element has been touched */
   touched() {
      this.hide()
      signals.fire('PopupReset','', null)
   }

   /** update this virtual Popups view (render it) */
   update() {
      if (this.visible) this.render()
   }

   /** render this virtual Popup view */
   render() {
      ctx.save()
      ctx.shadowColor = '#404040'
      ctx.shadowBlur = 45
      ctx.shadowOffsetX = 5
      ctx.shadowOffsetY = 5
      ctx.fillStyle = windowCFG.containerColor
      ctx.fill(this.path)
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      ctx.lineWidth = 1
      ctx.strokeStyle = windowCFG.textColor
      ctx.stroke(this.path)
      this.textNode.fontSize = this.fontSize
      this.textNode.fillColor = this.color
      this.textNode.fontColor = this.fontColor
      this.textNode.text = this.text
      this.textNode.update()
      ctx.restore()
      this.visible = true
   }

}
