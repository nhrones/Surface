/// <reference lib="dom" />
import {DIE_CFG} from '../cfg.ts'

// import {
//    //dieCFG,
//    CanvasRenderingContext2D, 
//    createCanvas, 
//    ImageData 
// } from '../deps.ts'   //'../../../Framework/mod.ts'

let size = 90
let r = 0

/** A die-face builder that renders and persists dice face images   */
export function buildDieFaces(){
    console.log("buildDieFaces")
    const { size: dieSize, radius, color } = DIE_CFG
    r = radius
    //color
    
    const start = performance.now()
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    canvas.width = dieSize.width
    canvas.height = dieSize.height

    const faces = [
        new ImageData(1,1),
        new ImageData(1,1),
        new ImageData(1,1),
        new ImageData(1,1),
        new ImageData(1,1),
    ]
    
    const frozenFaces = [
        new ImageData(1,1),
        new ImageData(1,1),
        new ImageData(1,1),
        new ImageData(1,1),
        new ImageData(1,1),
    ]
    
    size = dieSize.width

    ctx.fillStyle = color
    ctx.fillRect(0, 0, size, size)
    
    for (let i = 0; i < 7; i++) {
        faces[i] = drawDie(ctx, false, i)
        frozenFaces[i] = drawDie(ctx, true, i)
    }
    
    // report build time (typically ~ 9ms - 15ms)
    console.log(`Building 12 die face images took ${(performance.now() - start).toFixed()}ms!`);
    
    return {faces, frozenFaces}
}

function drawDie(ctx: CanvasRenderingContext2D , frozen: boolean, value: number):ImageData {

    ctx.save()
    if (frozen) {
        ctx.strokeStyle = 'silver'
        ctx.fillStyle = 'WhiteSmoke'
    }
    else {
        ctx.strokeStyle = 'black'
        ctx.fillStyle = 'white'
    }
    drawDieFace(ctx)
    drawGlare(ctx)
    ctx.fillStyle = (frozen) ? 'silver' : 'black'
    drawDots(ctx, value)
    ctx.restore()
    return ctx.getImageData(0, 0, size, size)
}

function drawDieFace(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.roundRect(0, 0, size, size, r)
    ctx.closePath()

    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = 'black'
    ctx.stroke()
    ctx.lineWidth = 1
}

function drawGlare(ctx: CanvasRenderingContext2D,) {
    let offset = 5
    let bottomLeftX = offset
    let bottomLeftY = size - offset
    let bottomRightX = size - offset
    let bottomRightY = size - offset
    let quarter = size * 0.25
    let threeQuarter = quarter * 3
    ctx.fillStyle = 'rgba(200, 200, 200, 0.4)'
    ctx.beginPath()
    ctx.moveTo(bottomLeftX, bottomLeftY)
    ctx.lineTo(bottomRightX, bottomRightY)
    ctx.bezierCurveTo(quarter, threeQuarter, quarter, threeQuarter, offset, offset)
    ctx.closePath()
    ctx.fill()
    ctx.save()
}

function drawDots(ctx: CanvasRenderingContext2D, dieValue: number) {
    let quarter = size / 4
    let center = quarter * 2
    let middle = quarter * 2
    let left = quarter
    let top = quarter
    let right = quarter * 3
    let bottom = quarter * 3
    let dotSize = size / 12
    let doDot = drawDot
    if (dieValue === 1) {
        doDot(ctx, middle, center, dotSize)
    }
    else if (dieValue === 2) {
        doDot(ctx, top, left, dotSize)
        doDot(ctx, bottom, right, dotSize)
    }
    else if (dieValue === 3) {
        drawDot(ctx, top, left, dotSize)
        drawDot(ctx, middle, center, dotSize)
        drawDot(ctx, bottom, right, dotSize)
    }
    else if (dieValue === 4) {
        drawDot(ctx, top, left, dotSize)
        drawDot(ctx, top, right, dotSize)
        drawDot(ctx, bottom, left, dotSize)
        drawDot(ctx, bottom, right, dotSize)
    }
    else if (dieValue === 5) {
        drawDot(ctx, top, left, dotSize)
        drawDot(ctx, top, right, dotSize)
        drawDot(ctx, middle, center, dotSize)
        drawDot(ctx, bottom, left, dotSize)
        drawDot(ctx, bottom, right, dotSize)
    }
    else if (dieValue === 6) {
        drawDot(ctx, top, left, dotSize)
        drawDot(ctx, top, right, dotSize)
        drawDot(ctx, middle, left, dotSize)
        drawDot(ctx, middle, right, dotSize)
        drawDot(ctx, bottom, left, dotSize)
        drawDot(ctx, bottom, right, dotSize)
    }
}

function drawDot(ctx: CanvasRenderingContext2D, y: number, x: number, dotSize: number) {
    ctx.beginPath()
    ctx.arc(x, y, dotSize, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.fill()
}
