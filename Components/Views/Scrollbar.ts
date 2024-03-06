
/// <reference lib="dom" />
import { ctx, logThis } from '../deps.ts'
import ScrollableContainer from './Container.ts'

/** 
 * A ScrollBar class
 */
export default class Scrollbar {

   container: ScrollableContainer
   mousePos = 0
   dragging = false
   hovered = false
   visible = true
   left = 0
   top = 0
   width = 0
   height = 0
   fill: string

   cursor: {
      index: number,
      top: number,
      bottom: number,
      left: number,
      width: number,
      length: number,
      fill: string
   };

   path: Path2D

   /**
    *  Scrollbar ctor
    */
   constructor(host: ScrollableContainer) {
      this.container = host
      this.left = (host.left + host.width) - host.scrollBarWidth,
         this.top = host.top
      this.height = host.height,
         this.width = host.scrollBarWidth
      this.fill = '#dedede';

      this.cursor = {
         index: 0,
         top: 0,
         bottom: host.height - host.scrollBarWidth,
         left: this.left + this.width - host.scrollBarWidth,
         width: host.scrollBarWidth,
         length: host.scrollBarWidth,
         fill: '#bababa'
      };

      this.path = new Path2D()  //this.buildPath()
      this.path.rect(
         this.left, this.top,
         this.width - 2, this.height
      )

      /** last known mouse location */
      this.mousePos = 0;

   }

   /**
    *  called from - container.ts - 97
    */
   render(ItemsLength: number, capacity: number) {

      const ratio = capacity / ItemsLength
      this.cursor.length = 100 //hack this.height * ratio

      const B = true
      if (B) logThis(`capacity ${toInt(capacity)}, cursor.height ${toInt(ItemsLength)}`
         , 'Scrollbar-Render')


      ctx.save()

      //fill the scrollbar
      ctx.fillStyle = this.fill;
      ctx.fill(this.path)

      //fill cursor
      ctx.fillStyle = 'red'; //hack this.cursor.fill;
      ctx.fillRect(
         this.cursor.left,
         this.container.top + this.cursor.top,
         this.cursor.width,
         this.cursor.length
      );

      // scrollbar outline
      ctx.lineWidth = 2
      ctx.strokeStyle = (this.hovered) ? 'orange' : '#bababa';
      ctx.stroke(this.path)

      ctx.restore()
   }

   /** 
    * called by the scroll event - container.ts - 63 
    */
   scroll(delta: number) {

      const { height, lineHeight, rowCapacity, top } = this.container

      this.cursor.index -= delta
      if (this.cursor.index < 0) this.cursor.index = 0
      //if ((this.cursor.index + 20) > rowCapacity) this.cursor.index = rowCapacity - 20

      // 180px / 30-lines remaining = 6px per index
      // remember cursor.top is zero based
      const newTop = (this.cursor.index * lineHeight);
      if (newTop + this.cursor.length >= height + top) {
         //this.cursor.top = (height - this.cursor.length)
         logThis('clamped Top')
      } else {
         logThis(`set new Top ${newTop}`)
         this.cursor.top = newTop
      }

      if (this.cursor.top < 0) this.cursor.top = 0;

      //const ratio = this.cursor.length / height;
      //this.cursor.top = (this.cursor.top * ratio);
      const A = true
      if (A) logThis(`cursor - index ${this.cursor.index}, 
         top ${this.cursor.top}, 
         length ${this.cursor.length}`,
         "Scrollbar-Scroll"
      )

      this.container.render()
   }

} // class end


function toInt(num: number): number {
   return num | 0;
}