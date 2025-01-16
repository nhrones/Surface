## RichTextKit
https://www.toptensoftware.com/richtextkit

SelectionKind Enum:
   none: 0
   Char: 1
   Word: 2 
   Line: 3
   Paragrah: 4
   Documemt: 5





FontRun TextLineruns readonly collection Irun
   Gets the set of text runs comprising this line.
   Font runs are order logically (ie: in code point index order)
      Represents a read-only collection of IRun elements that can be accessed by index.
   IRun { 
      length: number,  /* Length of this run (int) */
      offset: number   /* Offset of the start of this run (int) */
   }

Lines
After a text block has been laid out it results in a set of lines each consisting of one or more font runs.
Lines are represented by the TextLine class.

TextLine Class
   Represents a laid out line of text.
   BaseLine - Gets the base line of this line (relative to YCoord)
   End - The code point index of the first character after this line
   Height - Gets the height of this line
   Length - The length of this line in codepoints
   MaxAscent - Gets the maximum magnitude ascent of all font runs in this line.
   MaxDescent - Gets the maximum descent of all font runs in this line.
   NextLine - Gets the next line in this text block, or null if this is the last line.
   PreviousLine	- Gets the previous line in this text block, or null if this is the first line.
   Runs - Gets the set of text runs comprising this line.
   Start - Code point index of start of this line
   TextBlock - Gets the text block that owns this line
   TextHeight - Gets the text height of this line.
   Width - The width of the content on this line, excluding trailing whitespace and overhang.
   YCoord - Gets the y-coordinate of the top of this line, relative to the top of the text block.
Methods
   HitTest(float) - Hit test this line, working out the cluster the x position is over and closest to.


class TextBlock
   Represents a block of formatted, laid out and measurable text
   Alignment - Sets the left, right or center alignment of the text block.
   CaretIndicies - Retrieves a list of all valid caret positions
   FontMapper - Gets or sets the font mapper to be used by this TextBlock instance
   FontRuns - Get all font runs for this text block
   LineCount The number of lines in the text
   LineIndicies- Retrieves a list of the indicies of the first code point in each line
   Lines - Get all the lines for this text block
   MaxHeight - The maximum height of the TextBlock after which lines will be truncated 
      and the final line will be appended with an ellipsis (...) character.
   MaxLines - The maximum number of lines after which lines will be truncated and the 
      final line will be appended with an ellipsis (...) character.
   MaxWidth - The max width property sets the maximum width of a line, after which the line will be wrapped onto the next line.
   MeasuredHeight - The total height of all lines.
   WordBoundaryIndicies - Retrieves a list of all valid caret positions

class TextDocument
   Represents the document part of a Document/View editor
   DefaultStyle - Specifies the style to be used in plain text mode
   Length - Gets the total length of the document in code points
   LineWrap - Indicates if text should be wrapped
   Margin top/bottom/left/right - The document margins
   MeasuredHeight / Width - The total height / width of the document
   SingleLineMode - Specifies if the document is in single line mode
   Text - Get/set the entire document text
   UndoManager - Get the undo manager for this document
Methods
   GetCaretInfo - Calculates useful information for displaying a caret
   GetSelectionRange - Given a caret position, find an enclosing selection range for the current word, line, paragraph or document
   GetText - Get the text for a part of the document
   HitTest(float, float) - Hit test this string
   Navigate - Handles keyboard navigation events
   Paint - Paint this text block


Style
IStyle interface
   BackgroundColor - The background color of this run.
ReplacementCharacter





BackgroundColor	
The background color of this run.

FontFamily	
The font family for text this text run.

FontItalic	
True if the text in this run should be displayed in an italic font; otherwise False.

FontSize	
The font size for text in this run.

FontVariant	
The font variant (ie: super/sub-script) for text in this run.

FontWeight	
The font weight for text in this run.

LetterSpacing	
Extra spacing between each character

LineHeight	
The line height for text in this run as a multiplier (defaults to 1)	
Specifies a replacement character to be displayed (password mode)

ReplacementCharacter	
Specifies a replacement character to be displayed (password mode)

StrikeThrough	
The strike through style for the text in this run

TextColor	
The text color for text in this run.

TextDirection	
Text direction override for this span

Underline	
The underline style for text in this run.