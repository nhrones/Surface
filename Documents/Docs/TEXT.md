# TextEdit vs TextRender
Removing complexity is the right short-term play, even if it doesn't seem so!

## TextEdit
Input Methods are a Thing
The software that translates keypresses into input is called an "input method" 

# TextRender
Layout:
You have to assume that your text fits on a single line and shape it until you run out of space. At that point you can perform layout operations and figure out where to break the text and start the next line. Repeat until everything is shaped and laid out.

# skia-canvas
## offers rich typographic control including:

  - multi-line, word-wrapped text
  - line-by-line text metrics
  - small-caps, ligatures, and other opentype features accessible using standard font-variant syntax
  - proportional letter-spacing (a.k.a. ‘tracking’) and leading
  - support for variable fonts and transparent mapping of weight values
  - use of non-system fonts loaded from local files



```js
   .Home => {
         self.clearSelection();
         self.cursor_position = 0;
   },
   .End => {
         self.clearSelection();
         self.cursor_position = text_len;
   },
```