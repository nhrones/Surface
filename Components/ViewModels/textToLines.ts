import { TextLine, ctx } from  '../deps.ts'
import { PLACEHOLDER } from './constants.ts'

/** 
 * splits a string into lines that will fit in a container 
 * Will attempt to split at word boundries.
 */
export function getLines(text: string, width: number) {
   const lines: string[] = []
   const maxWidth = width
   let currentLine = ""
   let finalWidth = 0
   if (text.length <= 1 )  {
      text = PLACEHOLDER;
   }
      
   const parts = text.split(" ")

   for (const part of parts) {
      for (const [i, word] of part.split("\n").entries()) {
         if (i > 0) {
            finalWidth = Math.max(finalWidth, ctx.measureText(currentLine).width)
            lines.push(currentLine)
            currentLine = word

            // if the line is to long.
            if (ctx.measureText(currentLine).width > maxWidth) {
               // shorten it
               currentLine = charLines(lines, currentLine, maxWidth, finalWidth)
            }
            continue
         }

         // don't space beginning of line
         const spacer = (currentLine === "") ? "" : " "

         // measure it
         const width = ctx.measureText(currentLine + spacer + word).width

         // less than max ? add a word
         if (width <= maxWidth) {
            currentLine += spacer + word
         }
         // full
         else {
            if (ctx.measureText(word).width > maxWidth) {
               lines.push(currentLine)
               currentLine = word
               currentLine = charLines(lines, currentLine, maxWidth, finalWidth)
            } else {
               finalWidth = Math.max(finalWidth, ctx.measureText(currentLine).width)
               lines.push(currentLine)
               currentLine = word
            }
         }
      }
   }

   finalWidth = Math.max(finalWidth, ctx.measureText(currentLine).width)
   lines.push(currentLine)
   return buildTextLines(lines)
}

function buildTextLines(lineStrings: string[]): TextLine[] {
   let lastLength = 0
   const lines: TextLine[] = []
   let i = 0 /* index */
   for (const txt of lineStrings) {
      if ( txt.length > 1 ) {
         if (txt.startsWith(PLACEHOLDER)) {
            //todo
         }
      }

      lines.push({
         index: i,
         text: txt,
         start: lastLength,
         end: lastLength + txt.length,
         length: txt.length,
         hasSelection: false
      })
      lastLength += txt.length + 1
      i++
   }
   return lines
}

/** 
 * compute a line 
 * returns a line of characters that fit our width  
 */
function charLines(
   lines: string[],
   currentLine: string,
   maxWidth: number,
   finalWidth: number
) {
   // get individual characters in the current line
   const chars = currentLine.split("")
   let currentPart = ""

   // loop over each character
   for (const char of chars) {
      const charWidth = ctx.measureText(currentPart + char + "-").width
      // if we haven't exceeded our line width
      if (charWidth <= maxWidth) {
         // add this character
         currentPart += char
      } else { // width would be exceeded
         // 
         finalWidth = Math.max(finalWidth, ctx.measureText(currentPart + "-").width)
         lines.push(currentPart + "-")
         currentPart = char
      }
   }
   return currentPart
}
