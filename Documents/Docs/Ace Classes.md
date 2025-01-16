## Ace Editor Classes

### Ace
  - The main class required to set up an Ace instance

### Anchor
  - Defines a floating pointer in the document. 
  - Whenever text is inserted or deleted before the cursor, 
  the position of the anchor is updated.

### BackgroundTokenizer
  - Tokenizes the current Document in the background.
  - Caches the tokenized rows for future use.   
  - If a certain row is changed, everything below that row is re-tokenized.

### Document
  - Contains the text of the document.
  - Document can be attached to several EditSessions.
  - Document`s are just an array of strings, with each row in the 
  document matching up to the array index.

### EditSession
  - Stores all the data about Editor state providing easy way to change editors state.
  - EditSession can be attached to only one Document. Same Document can be attached to several EditSessions.

### Editor
  - The main entry point into the Ace functionality.
  - The `Editor` manages the EditSession (which manages Documents), as well as the VirtualRenderer, which draws everything to the screen.
  
  - Event sessions dealing with the mouse and keyboard are bubbled up from `Document` to the `Editor`, which decides what to do with them.

### Range
  - This object is used in various places to indicate a region within the editor. 
  - To better visualize how this works, imagine a rectangle. Each quadrant 
  of the rectangle is analogous to a range, as ranges contain a starting 
  row and starting column, and an ending row, and ending column.

### Range_List
  - Range collection

### RenderLoop
  - Batches changes (that force something to be redrawn) in the background.

### ScrollBar
  - An abstract class representing a native scrollbar control.

### Selection
 -  Contains the cursor position and the text selection of an edit session.
  - The row/columns used in the selection are in document coordinates representing the
  coordinates as they appear in the document before applying soft wrap and folding.

### Split
  - Handles splits and assigns editors to split.

### TokenIterator
  - This class provides an easy way to treat the document as a stream of tokens, and provides methods to iterate over these tokens.

### Tokenizer
  - This class takes a set of highlighting rules, and creates a tokenizer out of them. 
  - For more information, see the wiki on extending highlighters 
  (https://github.com/ajaxorg/ace/wiki/Creating-or-Extending-an-Edit-Mode#wiki-extendingTheHighlighter).

### DevTokenizer extends BaseTokenizer
  - version of Tokenizer with additional logging and infinite loop checks can be used for developing.

### UndoManager
  - This object maintains the undo stack for an EditSession.

### VirtualRenderer
  - The class that is responsible for drawing everything you see on the screen!



