/// <reference lib="dom" />
import {
   setHasVisiblePopup,
   windowCFG,
   ctx,
   events,
   ElementDescriptor,
   Location,
   View
} from '../deps.ts'

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
   size: { height: number, width: number }
   color = "black"
   text: string[] = [""]
   title = ""
   textAlign = "center"
   visible = true
   buffer: ImageData | null = null
   fontSize = 28

   /** ctor that instantiates a new vitual Popup view */
   constructor(el: ElementDescriptor) {
      this.tabOrder = el.tabOrder || 0
      this.enabled = true
      this.color = 'white'
      this.location = el.location
      this.hiddenPath = new Path2D()
      this.hiddenPath.rect(1, 1, 1, 1)
      this.size = el.size || { width: 300, height: 300 }
      this.shownPath = this.buildPath(el.radius || 30)
      this.path = this.hiddenPath
      this.fontSize = el.fontSize || 8
      //================================================
      //                bind events
      //================================================

      // Our game controller broadcasts this ShowPopup event at the end of a game
      events.on('ShowPopup', "", (data: { title: string, msg: string[] }) => {
         this.show(data)
      })

      events.on('HidePopup', "", () => this.hide())
   }
   /** build a Path2D */
   buildPath(radius: number) {
      const path = new Path2D
      path.roundRect(this.location.left, this.location.top, this.size.width, this.size.height, radius)
      return path
   }
   /** show the virtual Popup view */
   show(data: { title: string, msg: string[] }) {
      events.fire('FocusPopup', " ", this)
      this.title = data.title
      this.text = data.msg
      left = this.location.left
      top = this.location.top
      this.path = this.shownPath
      this.visible = true
      this.saveScreenToBuffer()
      setHasVisiblePopup(true)
      this.render()
   }

   /** hide the virtual Popup view */
   hide() {
      if (this.visible) {
         left = 1
         top = 1
         this.path = this.hiddenPath
         this.restoreScreenFromBuffer()
         this.visible = false
         setHasVisiblePopup(false)
      }
   }

   /** takes a snapshot of our current canvas bitmap */
   saveScreenToBuffer() {
      const { left, top } = this.location
      const { width, height } = this.size
      console.log(`Buffer = left:${left}, top:${top}, width:${width}, height:${height}`)
      this.buffer = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
   }

   /** paint the canvas with our current snapshot */
   restoreScreenFromBuffer() {
      if (this.buffer) {
         return ctx.putImageData(this.buffer, 0, 0)
      }
   }

   /** called from Surface/canvasEvents when this element has been touched */
   touched() {
      this.hide()
      events.fire('PopupReset', '', null)
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
      ctx.font = `${this.fontSize}px Tahoma, Verdana, sans-serif`;
      ctx.textAlign = this.textAlign as "center" | "left" | "right" | "start" | "end"
      ctx.strokeText(this.title + ' ', left + 175, top + 100)
      let txtTop = top + 100
      // stroke each string in the array
      this.text.forEach(str => {
         ctx.strokeText(str + ' ', left + 175, txtTop+=50)
      });
      ctx.restore()
      this.visible = true
   }

}
