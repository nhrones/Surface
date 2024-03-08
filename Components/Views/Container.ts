/// <reference lib="dom" />
import {
   ElementDescriptor,
   ctx,
   signals
} from '../deps.ts'

import Scrollbar from './Scrollbar.ts'

/**
 * Scrollable Container class
 */
export default class Container {

   id = 0
   activeView = true
   index = 1
   zOrder = 0
   tabOrder = 0
   name = ''
   enabled = true
   hovered = false
   focused = false
   path: Path2D
   height: number
   width: number 
   padding: number = 10
   left = 0
   top = 0
   color: string
   lineHeight = 0
   showPlaceholder = true
   scrollBarWidth = 25
   /** the number of characters that will fit in this width */
   textCapacity = 0
   
   /** number of rows that will fit container height */
   rowCapacity = 0
   scrollBar: Scrollbar
   
   /** 
    * Container ctor 
    */
   constructor( el: ElementDescriptor ) {
      this.name = el.id
      this.tabOrder = el.tabOrder || 0

      this.left = el.location.left
      this.top = el.location.top
      this.width = el.size?.width?? 100
      this.height = el.size?.height?? 40
      this.color = el.color || 'white'
      this.path = new Path2D
      this.path.rect(
         this.left,
         this.top,
         this.width,
         this.height
      )
      this.scrollBar = new Scrollbar(this)
      
      signals.on("Scroll", "", (evt) => {
        this.scrollBar.scroll(evt.deltaY)
      })
      
      // a View or a VM will report its TextMetrics on initialization
      signals.on('TextMetrics', this.name, (data: any) => {
         this.textCapacity = data.capacity.columns - 1;
         this.rowCapacity = data.capacity.rows;
      })
   }

   touched() {
   }

   update() {
      this.render()
   }

   render() {
      ctx.save()
      ctx.lineWidth = 2
      if (this.focused === false) {
         ctx.strokeStyle = (this.hovered) ? 'orange' : 'black'
         ctx.fillStyle = this.color
      } else {
         ctx.strokeStyle = 'blue'
         ctx.fillStyle = "white"
      }
      ctx.stroke(this.path)
      ctx.fill(this.path)
      ctx.restore()

      if (this.focused === true) {
        this.scrollBar.render(50, 27)
      }
   }
}
