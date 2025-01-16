
const currentLine = 'currentLine'
const lines  = ["one", "two", "three"]
const chars = currentLine.split("")
//console.log('length:', chars.length)

let cp = charLines(lines, currentLine, 90, 0)
console.log('cp', cp)

function measureText(txt: string) {
   return txt.length + 4
}

function charLines(lines:string[], currentLine: string, maxWidth: number, finalWidth: number) {
   const chars = currentLine.split("")
   let currentPart = ""
   for (const char of chars) {
      const charWidth = measureText(currentPart + char + "-")
      if (charWidth <= maxWidth) {
         currentPart += char
      } else {
         finalWidth = Math.max(finalWidth, measureText(currentPart + "-"))
         lines.push(currentPart + "-")
         currentPart = char
      }
   }
   console.log('finalWidth:',finalWidth)
   return currentPart
}
