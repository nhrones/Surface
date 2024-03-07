/// <reference lib="dom" />
import {
   ElementDescriptor,
   Location,
   View,
   ctx,
   events
} from '../deps.ts'

import Text from './Text.ts'

/** 
 * A virtual Button-View class 
 */
export default class Button implements View {

   id = 0
   activeView = true
   index = -1
   zOrder = 0
   tabOrder = 0
   name = ''
   enabled = true
   hovered = false
   focused = false
   path: Path2D
   size: { height: number, width: number }
   location: Location
   color: string
   fontColor: string
   textNode: Text
   boarderWidth: number
   text = ""

   /**
    * instantiate a new vitual Button-View
    */
   constructor(el: ElementDescriptor) {
      this.name = el.id
      this.zOrder = 0
      this.tabOrder = el.tabOrder || 0
      this.location = el.location
      //const { left, top } = el.location
      this.boarderWidth = el.boarderWidth || 1
      this.size = el.size || { width: 50, height: 30 }
      //const { width, height } = this.size
      this.enabled = true
      this.path = this.buildPath(el.radius || 0)
      this.textNode = new Text(
         {
            kind: 'Text',
            idx: -1,
            tabOrder: 0,
            id: this.name + 'Label',
            text: el.text || "",
            location: this.location,
            size: this.size,
            fontSize: el.fontSize || 18,
            bind: true
         }
      )
      this.color = el.color || 'red'
      this.fontColor = el.fontColor || 'white'
      this.text = el.text || "??"
      this.render()

      //================================================
      //                bind events
      //================================================

      // a VM will emit this event whenever it needs to update the view
      events.on('UpdateButton', this.name,
         (data: { text: string, color: string, enabled: boolean }) => {
            this.enabled = data.enabled
            this.color = data.color
            this.text = data.text
            this.update()
         })
   }

   /** 
    * build the Path2D 
    */
   buildPath(radius: number) {
      const path = new Path2D
      path.roundRect(
         this.location.left, this.location.top,
         this.size.width, this.size.height,
         radius
      )
      return path
   }

   /** 
    * called from core/systemEvents when this element is touched
    * fires an event on the eventBus to inform VMs 
    */
   touched() {
      console.log("Button " + this.name + " touched!")
      if (this.enabled) {
         events.fire('ButtonTouched', this.name, null)
      }
   }

   /** 
    * updates and renders this view 
    * called from /core/systemEvents (hover test) 
    */
   update() {
      this.render()
   }

   /** 
    * render this Button view onto the canvas 
    */
   render() {
      ctx.save()
      ctx.lineWidth = this.boarderWidth
      ctx.strokeStyle = (this.hovered) ? 'orange' : 'black'
      ctx.stroke(this.path)
      ctx.fillStyle = this.color
      ctx.fill(this.path)
      ctx.fillStyle = 'white'
      ctx.restore()
      this.textNode.fillColor = this.color
      this.textNode.fontColor = this.fontColor

      this.textNode.text = this.text
      this.textNode.update()
   }
}