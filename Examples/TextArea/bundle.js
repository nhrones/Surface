// deno-lint-ignore-file
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// ../../Components/ViewModels/closeButton.ts
var thisID;
var initCloseButton = /* @__PURE__ */ __name((id) => {
  thisID = id;
  signals.on("ButtonTouched", thisID, () => {
    console.log("window.close");
    self.close();
  });
}, "initCloseButton");

// ../../Components/ViewModels/constants.ts
var HAIRSPACE = "\u200A";
var CARETBAR = "|";
var PLACEHOLDER = "\u200B";

// ../../Framework/src/constants.ts
var DEV = true;
var InsertAt = {
  Calc: "Caluculate",
  LineStart: "LineStart",
  LineEnd: "LineEnd",
  TxtStart: "TextStart",
  TxtEnd: "TextEnd"
};

// ../../Components/ViewModels/textUtilities.ts
var clipboard = "";
function setClipboard(txt) {
  clipboard = txt;
}
__name(setClipboard, "setClipboard");
function handleEditEvents(editor, evt) {
  if (evt.code === "KeyA") {
    editor.selectStart = 0;
    editor.selectEnd = editor.fullText.length;
    for (const line of editor.lines) {
      line.hasSelection = true;
    }
    editor.updateText(editor.id, true, "Select-All");
  }
  if (evt.code === "KeyX") {
    if (editor.insertionColumn >= editor.selectEnd) {
      editor.insertionColumn = editor.selectStart;
    }
    const selection = getSelectedText(editor);
    if (selection.length > 0) {
      setClipboard(selection);
      removeSelection(editor);
      editor.refreshLines();
    }
  }
  if (evt.code === "KeyC") {
    let selected = getSelectedText(editor);
    if (selected.length > 0) {
      setClipboard(selected);
      editor.selecting = false;
      editor.selectEnd = 0;
      editor.selectStart = 0;
      editor.refreshLines();
    }
  }
  if (evt.code === "KeyV") {
    insertChars(editor, clipboard);
  }
}
__name(handleEditEvents, "handleEditEvents");
function getSelectedText(editor) {
  if (editor.selectStart === 0 && editor.selectEnd === 0) return "";
  return editor.fullText.substring(editor.selectStart, editor.selectEnd - 1);
}
__name(getSelectedText, "getSelectedText");
function removeSelection(editor) {
  let left3 = editor.fullText.substring(0, editor.selectStart);
  let right = editor.fullText.substring(editor.selectEnd);
  editor.fullText = left3 + right;
  editor.refreshLines();
}
__name(removeSelection, "removeSelection");
function insertChars(editor, chars = clipboard) {
  editor.resetSelectionState();
  if (chars === "\n") {
    chars += PLACEHOLDER;
    editor.insertionColumn = 0;
  } else {
    editor.insertionColumn += 1;
  }
  if (editor.insertionIndex < editor.fullText.length) {
    let left3 = editor.fullText.substring(0, editor.insertionIndex);
    let right = editor.fullText.substring(editor.insertionIndex);
    editor.fullText = left3 + chars + right;
    editor.insertionColumn += chars.length - 1;
  } else {
    editor.fullText += chars;
    editor.insertionColumn += chars.length;
  }
  editor.refreshLines();
}
__name(insertChars, "insertChars");
function isBetween(point, start, end) {
  return point >= start && point <= end;
}
__name(isBetween, "isBetween");

// ../../Components/ViewModels/textToLines.ts
function getLines(text, width) {
  const lines = [];
  const maxWidth = width;
  let currentLine = "";
  let finalWidth = 0;
  if (text.length <= 1) {
    text = PLACEHOLDER;
  }
  const parts = text.split(" ");
  for (const part of parts) {
    for (const [i, word] of part.split("\n").entries()) {
      if (i > 0) {
        finalWidth = Math.max(finalWidth, ctx.measureText(currentLine).width);
        lines.push(currentLine);
        currentLine = word;
        if (ctx.measureText(currentLine).width > maxWidth) {
          currentLine = charLines(lines, currentLine, maxWidth, finalWidth);
        }
        continue;
      }
      const spacer = currentLine === "" ? "" : " ";
      const width2 = ctx.measureText(currentLine + spacer + word).width;
      if (width2 <= maxWidth) {
        currentLine += spacer + word;
      } else {
        if (ctx.measureText(word).width > maxWidth) {
          lines.push(currentLine);
          currentLine = word;
          currentLine = charLines(lines, currentLine, maxWidth, finalWidth);
        } else {
          finalWidth = Math.max(finalWidth, ctx.measureText(currentLine).width);
          lines.push(currentLine);
          currentLine = word;
        }
      }
    }
  }
  finalWidth = Math.max(finalWidth, ctx.measureText(currentLine).width);
  lines.push(currentLine);
  return buildTextLines(lines);
}
__name(getLines, "getLines");
function buildTextLines(lineStrings) {
  let lastLength = 0;
  const lines = [];
  let i = 0;
  for (const txt of lineStrings) {
    if (txt.length > 1) {
      if (txt.startsWith(PLACEHOLDER)) {
      }
    }
    lines.push({
      index: i,
      text: txt,
      start: lastLength,
      end: lastLength + txt.length,
      length: txt.length,
      hasSelection: false
    });
    lastLength += txt.length + 1;
    i++;
  }
  return lines;
}
__name(buildTextLines, "buildTextLines");
function charLines(lines, currentLine, maxWidth, finalWidth) {
  const chars = currentLine.split("");
  let currentPart = "";
  for (const char of chars) {
    const charWidth = ctx.measureText(currentPart + char + "-").width;
    if (charWidth <= maxWidth) {
      currentPart += char;
    } else {
      finalWidth = Math.max(finalWidth, ctx.measureText(currentPart + "-").width);
      lines.push(currentPart + "-");
      currentPart = char;
    }
  }
  return currentPart;
}
__name(charLines, "charLines");

// ../../Components/ViewModels/textEditor.ts
var TextEditor = class {
  static {
    __name(this, "TextEditor");
  }
  /** an identity string shared with a View  */
  id = "";
  //================================
  //       TextArea Metrics
  // passed in via TextMetrics event
  //================================
  /** the number of chars each line can show */
  textCapacity = 0;
  /** the number of rows this view can show */
  rowCapacity = 0;
  /** size of the View container (pixels) */
  containerSize = { width: 0, height: 0 };
  //================================
  //   strings
  //================================
  /** the current full text */
  fullText = "";
  /** fullText as an array of lines that fit the viewport */
  lines = [];
  //================================
  //   flags
  //================================
  /** does the client View have the focus? */
  focused = false;
  /** are we currently selecting text?  */
  selecting = false;
  //================================
  // pointers
  //================================
  insertionColumn = 0;
  insertionRow = 0;
  insertionIndex = 0;
  selectStart = 0;
  selectEnd = 0;
  /** 
   * LiveText constructor
   */
  constructor(id, text = "") {
    this.fullText = text;
    this.id = id;
    signals.on("TextMetrics", this.id, (data) => {
      this.containerSize = data.size;
      this.textCapacity = data.capacity.columns - 1;
      this.rowCapacity = data.capacity.rows;
      this.refreshLines(InsertAt.TxtEnd);
    });
    signals.on("TextViewTouched", this.id, () => {
      this.updateText(this.id, true, "TextViewTouched");
    });
    signals.on("Focused", this.id, (hasFocus) => {
      this.updateText(this.id, hasFocus, "Focused");
    });
    signals.on(`WindowInput`, this.id, (key) => {
      insertChars(this, key);
    });
    signals.on("WindowKeyDown", this.id, (evt) => {
      const { ctrlKey, shiftKey } = evt;
      if (ctrlKey) {
        handleEditEvents(this, evt);
        return;
      }
      this.focused = true;
      switch (evt.code) {
        // remove a character left
        case "Backspace":
          if (this.insertionColumn > 0 && this.insertionIndex > 0) {
            this.selectStart = this.insertionIndex - 1;
            this.selectEnd = this.insertionIndex;
            removeSelection(this);
            this.resetSelectionState();
          } else {
            if (this.insertionRow > 0) {
              this.insertionRow -= 1;
              this.insertionColumn = this.lines[this.insertionRow].length;
              this.refreshLines();
            }
            this.selectStart = this.insertionIndex - 1;
            this.selectEnd = this.insertionIndex;
            removeSelection(this);
            this.resetSelectionState();
          }
          break;
        // if we have a selection delete it
        // else, delete one character to the right of the insertionColumn    
        case "Delete": {
          if (this.hasSelection() && shiftKey) {
            removeSelection(this);
            this.resetSelectionState();
          } else {
            if (this.insertionIndex < this.fullText.length) {
              this.selectStart = this.insertionIndex;
              this.selectEnd = this.insertionIndex + 1;
              removeSelection(this);
              this.resetSelectionState();
            }
          }
          break;
        }
        // move down in view or select up
        case "ArrowDown":
          if (this.hasText() === true) {
            if (this.insertionRow < this.lines.length - 1) {
              this.insertionRow += 1;
            }
            if (shiftKey) {
              if (!this.selecting) {
                this.selectStart = this.insertionIndex;
                this.selecting = true;
              }
              this.insertionColumn = this.lines[this.insertionRow].length;
              this.selectEnd = this.fullText.length;
            } else {
              this.resetSelectionState();
            }
          }
          this.updateInsertionPoint("DwnArrow");
          break;
        case "End":
          if (shiftKey) {
            if (!this.selecting) {
              this.selectStart = this.insertionIndex;
              this.selecting = true;
            }
            this.selectEnd = this.lines[this.insertionRow].end;
          } else {
            this.insertionColumn = this.lines[this.insertionRow].length;
            this.resetSelectionState();
          }
          this.updateInsertionPoint(`Home Shift = ${shiftKey}`);
          break;
        // the enter key will create -> move to a new line 
        case "Enter":
          insertChars(this, "\n");
          break;
        case "Home":
          if (shiftKey) {
            if (!this.selecting) {
              this.selectEnd = this.insertionIndex;
              this.selecting = true;
            }
            this.selectStart = this.lines[this.insertionRow].start;
          } else {
            this.insertionColumn = 0;
            this.resetSelectionState();
          }
          this.updateInsertionPoint(`Home Shift = ${shiftKey}`);
          break;
        // paste from clipboard
        case "Insert":
          if (shiftKey) {
            insertChars(this);
            this.refreshLines();
          }
          break;
        // move left in viewport or select left
        case "ArrowLeft":
          if (this.insertionIndex > 0) {
            this.insertionColumn -= 1;
            if (this.insertionColumn < 0) {
              this.insertionRow -= 1;
              if (this.insertionRow < 0) this.insertionRow = 0;
              this.insertionColumn = this.lines[this.insertionRow].length;
            }
            if (shiftKey) {
              if (!this.selecting) {
                this.selectEnd = this.insertionIndex + 1;
                this.selecting = true;
              }
              this.selectStart = this.insertionIndex - 1;
            } else {
              this.resetSelectionState();
            }
            this.updateInsertionPoint(`LeftArrow Shift = ${shiftKey}`);
          }
          break;
        // move right or select right   
        case "ArrowRight": {
          if (this.insertionIndex < this.fullText.length) {
            this.insertionColumn += 1;
            if (this.insertionColumn > this.lines[this.insertionRow].length) {
              this.insertionRow += 1;
              if (this.insertionRow > this.lines.length) {
                this.insertionRow = this.lines.length;
              } else {
                this.insertionColumn = 0;
              }
            }
            if (shiftKey) {
              if (this.insertionIndex < this.lines[this.insertionRow].end) {
                if (!this.selecting) {
                  this.selectStart = this.insertionIndex;
                  this.selecting = true;
                }
                this.selectEnd = this.insertionIndex + 1;
              }
            } else {
              this.resetSelectionState();
            }
          }
          this.updateInsertionPoint(`RightArrow Shift = ${shiftKey}`);
          break;
        }
        // move up a row or select up
        case "ArrowUp":
          if (this.hasText() === true) {
            if (this.insertionRow > 0) {
              this.insertionRow -= 1;
              if (shiftKey) {
                if (!this.selecting) {
                  this.selectEnd = this.insertionIndex;
                  this.selecting = true;
                }
                this.insertionColumn = 0;
                this.selectStart = 0;
              } else {
                this.resetSelectionState();
              }
            }
          }
          this.updateInsertionPoint("UpArrow");
          break;
        default:
          break;
      }
    });
  }
  /** resets selecting flag and start/end locations */
  resetSelectionState() {
    this.selecting = false;
    this.selectEnd = 0;
    this.selectStart = 0;
    for (const line of this.lines) {
      line.hasSelection = false;
    }
  }
  /**  fullText length > 0  */
  hasText() {
    return this.fullText.length > 0;
  }
  /** 
   * Create a new array of lines after any fullText mutation
   * Adjusts insertion point if line count was changed 
   */
  refreshLines(at = InsertAt.Calc) {
    const originalLineCnt = this.lines.length;
    this.lines = getLines(this.fullText, this.containerSize.width - 5);
    if (this.lines.length > originalLineCnt) {
      this.insertionRow += 1;
    } else if (this.lines.length < originalLineCnt) {
      if (this.insertionRow > this.lines.length - 1) {
        this.insertionRow = this.lines.length - 1;
        if (this.insertionRow < 0) this.insertionRow = 0;
      }
    }
    this.updateInsertionPoint("refreshLines", at);
  }
  /** update the insertion column and row from insertion index */
  updateInsertionPoint(from, insertAt = InsertAt.Calc) {
    switch (insertAt) {
      // calculate and set index from row and column 
      case InsertAt.Calc: {
        for (const line of this.lines) {
          this.testForSelection(line);
          if (this.insertionRow === line.index) {
            if (this.insertionColumn > line.length) {
              this.insertionColumn = line.length;
            }
            this.insertionIndex = line.start + this.insertionColumn;
          }
        }
        break;
      }
      case InsertAt.TxtStart:
        this.insertionRow = 0;
        this.insertionColumn = 0;
        this.insertionIndex = 0;
        break;
      case InsertAt.TxtEnd:
        this.insertionIndex = this.fullText.length;
        this.insertionRow = this.lastLineIndex();
        this.insertionColumn = this.lines[this.insertionRow].length;
        break;
      default:
        break;
    }
    this.updateText(this.id, true, from);
  }
  /** fullText has selection */
  hasSelection() {
    return this.selectEnd - this.selectStart > 0;
  }
  // this line has selection
  testForSelection(line) {
    if (!this.hasSelection()) {
      line.hasSelection = false;
      return;
    }
    const { start, end } = line;
    if (isBetween(this.selectStart, start, end)) {
      line.hasSelection = true;
      return;
    }
    if (isBetween(this.selectEnd, start, end)) {
      line.hasSelection = true;
      return;
    }
  }
  /** get the index of our last line */
  lastLineIndex() {
    return this.lines.length - 1;
  }
  // Fire an event to update the host view
  updateText(id, hasfocus, reason) {
    this.focused = hasfocus;
    signals.fire(
      "UpdateTextArea",
      id,
      {
        reason,
        text: this.fullText,
        lines: this.lines,
        focused: this.focused,
        insertionColumn: this.insertionColumn,
        insertionRow: this.insertionRow,
        selectStart: this.selectStart,
        selectEnd: this.selectEnd
      }
    );
  }
};

// ../../Components/Views/Button.ts
var Button_exports = {};
__export(Button_exports, {
  default: () => Button
});

// ../../Components/Views/Text.ts
var Text_exports = {};
__export(Text_exports, {
  default: () => Text
});
var Text = class {
  static {
    __name(this, "Text");
  }
  id = 0;
  // N/A
  activeView = false;
  enabled = false;
  hovered = false;
  focused = false;
  path = new Path2D();
  index = 0;
  zOrder = 0;
  // assigned by activeViews.add()
  tabOrder = 0;
  // N/A
  name;
  size;
  textSize;
  location;
  textLocation;
  padding = 10;
  strokeColor = "black";
  fillColor;
  fontColor;
  fontSize;
  text;
  lastText;
  hasBorder = false;
  fill = true;
  textAlign;
  textBaseline = "middle";
  TextLocation = "middle";
  boundingBox = { left: 0, top: 0, width: 0, height: 0 };
  /** ctor that instantiates a new virtual Text view */
  constructor(el) {
    this.name = el.id;
    this.index = el.idx;
    this.text = el.text ?? "";
    this.lastText = "";
    this.size = el.size ?? { width: 30, height: 30 };
    this.textSize = { width: this.size.width, height: this.size.height };
    this.location = el.location;
    this.boundingBox = {
      left: this.location.left,
      top: this.location.top,
      width: this.size.width,
      height: this.size.height
    };
    this.fillColor = el.color ?? "transparent";
    this.fontColor = el.fontColor || "black";
    this.fontSize = el.fontSize || 18;
    this.padding = el.padding || 10;
    this.textAlign = el.textAlign || "center";
    this.textBaseline = el.textBaseline ?? "middle";
    this.TextLocation = el.TextLocation ?? "middle";
    this.textLocation = { left: el.location.left, top: el.location.top };
    this.fill = el.fill ?? true;
    this.hasBorder = el.hasBoarder ?? false;
    this.calculateMetrics();
    if (el.bind) {
      signals.on(
        "UpdateText",
        this.name,
        (data) => {
          this.calculateMetrics();
          this.hasBorder = data.border;
          this.fill = data.fill;
          this.fillColor = data.fillColor;
          this.fontColor = data.fontColor;
          this.lastText = data.text;
          this.text = data.text;
          this.update();
        }
      );
    }
  }
  /** 
   * updates and renders this view 
   * called from a host (Button host or main-VM) 
   */
  update() {
    this.calculateMetrics();
  }
  /** 
   * render this Text-View onto the canvas 
   */
  render() {
    ctx.save();
    ctx.font = `${this.fontSize}px Tahoma, Verdana, sans-serif`;
    ctx.textAlign = this.textAlign;
    ctx.textBaseline = this.textBaseline;
    if (this.fill === true) {
      ctx.fillStyle = this.fillColor;
      ctx.fillRect(
        this.location.left,
        this.location.top,
        this.size.width,
        this.size.height
      );
    }
    const bb = this.boundingBox;
    if (this.hasBorder === true) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black";
      ctx.strokeRect(bb.left, bb.top, bb.width, bb.height);
    }
    ctx.fillStyle = this.fontColor;
    ctx.fillText(this.text + " ", this.textLocation.left, this.textLocation.top);
    ctx.restore();
  }
  /** not implemented - Text are not activeElements */
  touched() {
  }
  /** 
   * calculate location based on font
   */
  calculateMetrics() {
    switch (this.TextLocation) {
      case "top":
        this.textLocation.top = this.location.top + this.padding;
        break;
      case "middle":
        this.textLocation.top = this.location.top + this.size.height * 0.5;
        break;
      default:
        this.textLocation.top = this.location.top + this.padding;
        break;
    }
    switch (this.textAlign) {
      case "left":
        this.textLocation.left = this.location.left + this.padding;
        break;
      case "center":
        this.textLocation.left = this.location.left + this.size.width * 0.5;
        break;
      case "right":
        this.textLocation.left = this.location.left + this.padding;
        break;
      default:
        this.textLocation.left = this.location.left + this.padding;
        break;
    }
    this.render();
  }
};

// ../../Components/Views/Button.ts
var Button = class {
  static {
    __name(this, "Button");
  }
  id = 0;
  activeView = true;
  index = -1;
  zOrder = 0;
  tabOrder = 0;
  name = "";
  enabled = true;
  hovered = false;
  focused = false;
  path;
  size;
  location;
  color;
  fontColor;
  textNode;
  boarderWidth;
  text = "";
  /**
   * instantiate a new vitual Button-View
   */
  constructor(el) {
    this.name = el.id;
    this.zOrder = 0;
    this.tabOrder = el.tabOrder || 0;
    this.location = el.location;
    this.boarderWidth = el.boarderWidth || 1;
    this.size = el.size || { width: 50, height: 30 };
    this.enabled = true;
    this.path = this.buildPath(el.radius || 10);
    this.textNode = new Text(
      {
        kind: "Text",
        idx: -1,
        tabOrder: 0,
        id: this.name + "Label",
        text: el.text || "",
        location: { left: this.location.left + 10, top: this.location.top + 10 },
        size: { width: this.size.width - 20, height: this.size.height - 20 },
        //this.size,
        fontSize: el.fontSize || 18,
        bind: true
      }
    );
    this.color = el.color || "red";
    this.fontColor = el.fontColor || "white";
    this.text = el.text || "??";
    this.render();
    signals.on(
      "UpdateButton",
      this.name,
      (data) => {
        this.enabled = data.enabled;
        this.color = data.color;
        this.text = data.text;
        this.update();
      }
    );
  }
  /** 
   * build the Path2D 
   */
  buildPath(radius) {
    const path = new Path2D();
    path.roundRect(
      this.location.left,
      this.location.top,
      this.size.width,
      this.size.height,
      radius
    );
    return path;
  }
  /** 
   * called from core/systemEvents when this element is touched
   * fires an event on the eventBus to inform VMs 
   */
  touched() {
    if (this.enabled) {
      signals.fire("ButtonTouched", this.name, null);
    }
  }
  /** 
   * updates and renders this view 
   * called from /core/systemEvents (hover test) 
   */
  update() {
    this.render();
  }
  /** 
   * render this Button view onto the canvas 
   */
  render() {
    ctx.save();
    ctx.lineWidth = this.boarderWidth;
    ctx.strokeStyle = this.hovered ? "orange" : "black";
    ctx.stroke(this.path);
    ctx.fillStyle = this.color;
    ctx.fill(this.path);
    ctx.fillStyle = "white";
    ctx.restore();
    this.textNode.fillColor = this.color;
    this.textNode.fontColor = this.fontColor;
    this.textNode.text = this.text;
    this.textNode.update();
  }
};

// ../../Components/Views/Container.ts
var Container_exports = {};
__export(Container_exports, {
  default: () => Container
});

// ../../Components/Views/Scrollbar.ts
var Scrollbar = class {
  static {
    __name(this, "Scrollbar");
  }
  container;
  mousePos = 0;
  dragging = false;
  hovered = false;
  visible = true;
  left = 0;
  top = 0;
  width = 0;
  height = 0;
  fill;
  cursor;
  path;
  /**
   *  Scrollbar ctor
   */
  constructor(host) {
    this.container = host;
    this.left = host.left + host.width - host.scrollBarWidth, this.top = host.top;
    this.height = host.height, this.width = host.scrollBarWidth;
    this.fill = "#dedede";
    this.cursor = {
      index: 0,
      top: 0,
      bottom: host.height - host.scrollBarWidth,
      left: this.left + this.width - host.scrollBarWidth,
      width: host.scrollBarWidth,
      length: host.scrollBarWidth,
      fill: "#bababa"
    };
    this.path = new Path2D();
    this.path.rect(
      this.left,
      this.top,
      this.width - 2,
      this.height
    );
    this.mousePos = 0;
  }
  /**
   *  called from - container.ts - 97
   */
  render(ItemsLength, capacity) {
    const ratio = capacity / ItemsLength;
    this.cursor.length = 100;
    ctx.save();
    ctx.fillStyle = this.fill;
    ctx.fill(this.path);
    ctx.fillStyle = "red";
    ctx.fillRect(
      this.cursor.left,
      this.container.top + this.cursor.top,
      this.cursor.width,
      this.cursor.length
    );
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.hovered ? "orange" : "#bababa";
    ctx.stroke(this.path);
    ctx.restore();
  }
  /** 
   * called by the scroll event - container.ts - 63 
   */
  scroll(delta) {
    const { height, lineHeight, rowCapacity, top: top2 } = this.container;
    this.cursor.index -= delta;
    if (this.cursor.index < 0) this.cursor.index = 0;
    const newTop = this.cursor.index * lineHeight;
    if (newTop + this.cursor.length >= height + top2) {
    } else {
      this.cursor.top = newTop;
    }
    if (this.cursor.top < 0) this.cursor.top = 0;
    this.container.render();
  }
};

// ../../Components/Views/Container.ts
var Container = class {
  static {
    __name(this, "Container");
  }
  id = 0;
  activeView = true;
  index = 1;
  zOrder = 0;
  tabOrder = 0;
  name = "";
  enabled = true;
  hovered = false;
  focused = false;
  path;
  height;
  width;
  padding = 10;
  left = 0;
  top = 0;
  color;
  lineHeight = 0;
  showPlaceholder = true;
  scrollBarWidth = 25;
  /** the number of characters that will fit in this width */
  textCapacity = 0;
  /** number of rows that will fit container height */
  rowCapacity = 0;
  scrollBar;
  /** 
   * Container ctor 
   */
  constructor(el) {
    this.name = el.id;
    this.tabOrder = el.tabOrder || 0;
    this.left = el.location.left;
    this.top = el.location.top;
    this.width = el.size?.width ?? 100;
    this.height = el.size?.height ?? 40;
    this.color = el.color || "white";
    this.path = new Path2D();
    this.path.rect(
      this.left,
      this.top,
      this.width,
      this.height
    );
    this.scrollBar = new Scrollbar(this);
    signals.on("Scroll", "", (evt) => {
      this.scrollBar.scroll(evt.deltaY);
    });
    signals.on("TextMetrics", this.name, (data) => {
      this.textCapacity = data.capacity.columns - 1;
      this.rowCapacity = data.capacity.rows;
    });
  }
  touched() {
  }
  update() {
    this.render();
  }
  render() {
    ctx.save();
    ctx.lineWidth = 2;
    if (this.focused === false) {
      ctx.strokeStyle = this.hovered ? "orange" : "black";
      ctx.fillStyle = this.color;
    } else {
      ctx.strokeStyle = "blue";
      ctx.fillStyle = "white";
    }
    ctx.stroke(this.path);
    ctx.fill(this.path);
    ctx.restore();
    if (this.focused === true) {
      this.scrollBar.render(50, 27);
    }
  }
};

// ../../Components/Views/Popup.ts
var Popup_exports = {};
__export(Popup_exports, {
  default: () => Popup
});
var left = 1;
var top = 1;
var Popup = class {
  static {
    __name(this, "Popup");
  }
  id = 0;
  // assigned by activeViews.add() 
  index = -1;
  activeView = true;
  zOrder = 0;
  tabOrder = 0;
  name = "";
  enabled = true;
  hovered = false;
  focused = false;
  path;
  shownPath;
  hiddenPath;
  location;
  size;
  color = "black";
  text = [""];
  title = "";
  textAlign = "center";
  visible = true;
  buffer = null;
  fontSize = 28;
  /** ctor that instantiates a new vitual Popup view */
  constructor(el) {
    this.tabOrder = el.tabOrder || 0;
    this.enabled = true;
    this.color = "white";
    this.location = el.location;
    this.hiddenPath = new Path2D();
    this.hiddenPath.rect(1, 1, 1, 1);
    this.size = el.size || { width: 300, height: 300 };
    this.shownPath = this.buildPath(el.radius || 30);
    this.path = this.hiddenPath;
    this.fontSize = el.fontSize || 8;
    signals.on("ShowPopup", "", (data) => {
      this.show(data);
    });
    signals.on("HidePopup", "", () => this.hide());
  }
  /** build a Path2D */
  buildPath(radius) {
    const path = new Path2D();
    path.roundRect(this.location.left, this.location.top, this.size.width, this.size.height, radius);
    return path;
  }
  /** show the virtual Popup view */
  show(data) {
    signals.fire("FocusPopup", " ", this);
    this.title = data.title;
    this.text = data.msg;
    left = this.location.left;
    top = this.location.top;
    this.path = this.shownPath;
    this.visible = true;
    this.saveScreenToBuffer();
    setHasVisiblePopup(true);
    this.render();
  }
  /** hide the virtual Popup view */
  hide() {
    if (this.visible) {
      left = 1;
      top = 1;
      this.path = this.hiddenPath;
      this.restoreScreenFromBuffer();
      this.visible = false;
      setHasVisiblePopup(false);
    }
  }
  /** takes a snapshot of our current canvas bitmap */
  saveScreenToBuffer() {
    const { left: left3, top: top2 } = this.location;
    const { width, height } = this.size;
    console.log(`Buffer = left:${left3}, top:${top2}, width:${width}, height:${height}`);
    this.buffer = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
  /** paint the canvas with our current snapshot */
  restoreScreenFromBuffer() {
    if (this.buffer) {
      return ctx.putImageData(this.buffer, 0, 0);
    }
  }
  /** called from Surface/canvasEvents when this element has been touched */
  touched() {
    this.hide();
    signals.fire("PopupReset", "", null);
  }
  /** update this virtual Popups view (render it) */
  update() {
    if (this.visible) this.render();
  }
  /** render this virtual Popup view */
  render() {
    ctx.save();
    ctx.shadowColor = "#404040";
    ctx.shadowBlur = 45;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = windowCFG.containerColor;
    ctx.fill(this.path);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.lineWidth = 1;
    ctx.strokeStyle = windowCFG.textColor;
    ctx.stroke(this.path);
    ctx.font = `${this.fontSize}px Tahoma, Verdana, sans-serif`;
    ctx.textAlign = this.textAlign;
    ctx.strokeText(this.title + " ", left + 175, top + 100);
    let txtTop = top + 100;
    this.text.forEach((str) => {
      ctx.strokeText(str + " ", left + 175, txtTop += 50);
    });
    ctx.restore();
    this.visible = true;
  }
};

// ../../Components/Views/TextArea.ts
var TextArea_exports = {};
__export(TextArea_exports, {
  default: () => TextArea
});
var dev = false;
var caretChar = HAIRSPACE;
var placeholder = "text";
var TextArea = class extends Container {
  static {
    __name(this, "TextArea");
  }
  id = 0;
  activeView = true;
  index = 1;
  zOrder = 0;
  tabOrder = 0;
  name = "";
  enabled = true;
  hovered = false;
  focused = false;
  log = false;
  path;
  size;
  padding = 10;
  location;
  color;
  fontColor;
  lineHeight = 0;
  text = "";
  lines = [];
  trimmedLeft = "";
  trimmedRight = "";
  insertionColumn = 0;
  insertionRow = 0;
  selectStart = 0;
  selectEnd = 0;
  widthPerChar = 15;
  /** 
   * the number of characters that will fit in this width  
   */
  textCapacity = 0;
  rowCapacity = 0;
  showPlaceholder = true;
  fontSize;
  constructor(el) {
    super(el);
    this.name = el.id;
    this.tabOrder = el.tabOrder || 0;
    this.location = el.location;
    this.size = el.size || { width: 100, height: 40 };
    this.color = el.color || "white";
    this.fontColor = "black";
    this.fontSize = el.fontSize || 28;
    this.getMetrics();
    this.path = new Path2D();
    this.path.rect(
      this.location.left,
      this.location.top,
      this.size.width,
      this.size.height
    );
    signals.fire(
      "TextMetrics",
      this.name,
      {
        size: this.size,
        capacity: { rows: this.rowCapacity, columns: this.textCapacity }
      }
    );
    signals.on("UpdateTextArea", this.name, (data) => {
      const {
        _reason,
        text,
        lines,
        focused,
        insertionColumn,
        insertionRow,
        selectStart,
        selectEnd
      } = data;
      this.insertionColumn = insertionColumn;
      this.insertionRow = insertionRow;
      this.selectStart = selectStart;
      this.selectEnd = selectEnd;
      this.focused = focused;
      this.lines = lines;
      this.text = text;
      this.showPlaceholder = this.text.length === 0;
      if (this.focused === true) {
        caretChar = CARETBAR;
      }
      let str = "";
      for (const line of this.lines) {
        str += `${JSON.stringify(line)}
            `;
      }
      const A = false;
      if (A) console.log(` 
         focused: ${this.focused} insertionRow: ${this.insertionRow} 
         highlighted text: ${text.substring(this.selectStart, this.selectEnd)}
         selection -- start: ${this.selectStart}, end: ${this.selectEnd} 
         insertion -- row: ${this.insertionRow}, column: ${this.insertionColumn}
         ${str}`, "TextArea.UpdateTextArea");
      this.render();
    });
    this.render();
  }
  getMetrics() {
    ctx.font = `${this.fontSize}px Tahoma, Verdana, sans-serif`;
    const t = "This is a test! A very very long text!";
    const m = ctx.measureText(t);
    this.lineHeight = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;
    this.size.height = this.size.height;
    this.widthPerChar = m.width / t.length;
    this.textCapacity = this.size.width / this.widthPerChar;
  }
  getUnusedSpace() {
    return this.size.width - ctx.measureText(this.text).width;
  }
  touched() {
    signals.fire("TextViewTouched", this.name, null);
  }
  update() {
    this.render();
  }
  /** render the container and text */
  render() {
    super.render();
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.save();
    if (this.focused === true) {
      if (tickCount === 30) caretChar = HAIRSPACE;
      if (tickCount === 0) caretChar = CARETBAR;
    } else {
      caretChar = "";
    }
    let lineNumber = 0;
    for (const line of this.lines) {
      if (line.length <= 0) continue;
      const textTop = this.location.top + this.lineHeight * (lineNumber + 1);
      if (this.showPlaceholder && this.focused === false) {
        ctx.fillStyle = "Gray";
        ctx.fillText(
          placeholder,
          this.location.left + this.padding,
          textTop
        );
      } else {
        let txt = "";
        this.positionCaret(line.text);
        if (line.hasSelection) this.renderHighlight(line);
        txt = this.insertionRow === lineNumber ? this.trimmedLeft + caretChar + this.trimmedRight : line.text;
        ctx.fillStyle = this.fontColor;
        ctx.fillText(
          txt,
          this.location.left + this.padding,
          textTop
        );
      }
      ctx.restore();
      lineNumber++;
    }
  }
  /** locate Caret */
  positionCaret(line) {
    const col = this.insertionColumn;
    this.trimmedLeft = line.substring(0, col);
    this.trimmedRight = line.substring(col);
  }
  /** 
   * Highlight selected text 
   */
  renderHighlight(line) {
    const { lineHeight, padding, location, selectStart, selectEnd, text } = this;
    const rectX = selectStart <= line.start ? 0 : ctx.measureText(text.substring(line.start, selectStart)).width;
    const endFrom = selectStart > line.start ? selectStart : line.start;
    const endTo = selectEnd >= line.end ? line.end : selectEnd;
    const rectWidth = ctx.measureText(text.substring(endFrom, endTo)).width;
    const rectY = location.top + lineHeight * line.index + padding;
    if (dev) {
      console.log(`hiStart ${rectX}, hiEnd ${rectWidth}, hiTop ${rectY}`);
      console.log(`selectStart ${selectStart}, selectEnd ${selectEnd}`);
      console.log(`lineStart ${line.start}, lineEnd ${line.end}`);
    }
    ctx.fillStyle = "lightblue";
    ctx.fillRect(
      location.left + padding + rectX,
      rectY,
      rectWidth,
      lineHeight
    );
  }
};

// ../../Components/Views/CheckBox.ts
var CheckBox_exports = {};
__export(CheckBox_exports, {
  default: () => CheckBox
});
var CheckBox = class {
  static {
    __name(this, "CheckBox");
  }
  id = 0;
  activeView = true;
  index = -1;
  zOrder = 0;
  tabOrder = 0;
  name = "";
  enabled = true;
  hovered = false;
  focused = false;
  path;
  size;
  location;
  color;
  fontColor;
  boarderWidth;
  fontSize;
  text = "";
  checked = false;
  /**
   * instantiate a new vitual CheckBox-View
   */
  constructor(el) {
    this.name = el.id;
    this.zOrder = 0;
    this.tabOrder = el.tabOrder || 0;
    this.location = el.location;
    const { left: left3, top: top2 } = el.location;
    this.boarderWidth = el.boarderWidth || 1;
    this.size = el.size || { width: 50, height: 30 };
    const { width, height } = this.size;
    this.enabled = true;
    this.path = this.buildPath(el.radius || 0);
    this.color = el.color || "red";
    this.fontColor = el.fontColor || "white";
    this.text = el.text || "??";
    this.fontSize = el.fontSize || 24;
    this.render();
    signals.on(
      "UpdateCheckBox",
      this.name,
      (data) => {
        this.checked = data.checked;
        this.color = data.color;
        this.text = data.text;
        this.update();
      }
    );
  }
  /** 
   * build the Path2D 
   */
  buildPath(radius) {
    const path = new Path2D();
    path.roundRect(
      this.location.left,
      this.location.top,
      this.size.width,
      this.size.height,
      radius
    );
    return path;
  }
  /** 
   * called from core/systemEvents when this element is touched
   * fires an event on the eventBus to inform VMs 
   */
  touched() {
    if (this.enabled) {
      signals.fire("CheckBoxTouched", this.name, { checked: this.enabled });
    }
  }
  /** 
   * updates and renders this view 
   * called from /core/systemEvents (hover test) 
   */
  update() {
    this.render();
  }
  /** 
   * render this Button view onto the canvas 
   */
  render() {
    ctx.save();
    ctx.lineWidth = 8;
    ctx.strokeStyle = this.hovered ? "orange" : "black";
    ctx.stroke(this.path);
    ctx.fillStyle = this.color;
    ctx.fill(this.path);
    ctx.fillStyle = "white";
    ctx.restore();
    ctx.save();
    ctx.font = `${this.fontSize}px Tahoma, Verdana, sans-serif`;
    ctx;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "limegreen";
    ctx.fillRect(this.location.left, this.location.top, this.size.width, this.size.height);
    ctx.fillStyle = this.fontColor;
    const top2 = this.location.top + this.size.height * 0.5;
    const left3 = this.location.left + this.size.width * 0.5;
    ctx.fillText(this.text + " ", left3, top2);
    ctx.restore();
  }
};

// ../../Components/Views/Die.ts
var Die_exports = {};
__export(Die_exports, {
  DIE_CFG: () => DIE_CFG2,
  default: () => Die
});

// ../../Components/ViewModels/dieFactory.ts
var DIE_CFG = {
  size: { "width": 70, "height": 70 },
  radius: 10,
  color: "white"
};
var size = 90;
var r = 0;
function buildDieFaces() {
  console.log("buildDieFaces");
  const { size: dieSize, radius, color } = DIE_CFG;
  r = radius;
  const start = performance.now();
  const canvas2 = document.createElement("canvas");
  const ctx2 = canvas2.getContext("2d");
  canvas2.width = dieSize.width;
  canvas2.height = dieSize.height;
  const faces = [
    new ImageData(1, 1),
    new ImageData(1, 1),
    new ImageData(1, 1),
    new ImageData(1, 1),
    new ImageData(1, 1)
  ];
  const frozenFaces = [
    new ImageData(1, 1),
    new ImageData(1, 1),
    new ImageData(1, 1),
    new ImageData(1, 1),
    new ImageData(1, 1)
  ];
  size = dieSize.width;
  ctx2.fillStyle = color;
  ctx2.fillRect(0, 0, size, size);
  for (let i = 0; i < 7; i++) {
    faces[i] = drawDie(ctx2, false, i);
    frozenFaces[i] = drawDie(ctx2, true, i);
  }
  console.log(`Building 12 die face images took ${(performance.now() - start).toFixed()}ms!`);
  return { faces, frozenFaces };
}
__name(buildDieFaces, "buildDieFaces");
function drawDie(ctx2, frozen, value) {
  ctx2.save();
  if (frozen) {
    ctx2.strokeStyle = "silver";
    ctx2.fillStyle = "WhiteSmoke";
  } else {
    ctx2.strokeStyle = "black";
    ctx2.fillStyle = "white";
  }
  drawDieFace(ctx2);
  drawGlare(ctx2);
  ctx2.fillStyle = frozen ? "silver" : "black";
  drawDots(ctx2, value);
  ctx2.restore();
  return ctx2.getImageData(0, 0, size, size);
}
__name(drawDie, "drawDie");
function drawDieFace(ctx2) {
  ctx2.beginPath();
  ctx2.roundRect(0, 0, size, size, r);
  ctx2.closePath();
  ctx2.fill();
  ctx2.lineWidth = 2;
  ctx2.strokeStyle = "black";
  ctx2.stroke();
  ctx2.lineWidth = 1;
}
__name(drawDieFace, "drawDieFace");
function drawGlare(ctx2) {
  const offset = 5;
  const bottomLeftX = offset;
  const bottomLeftY = size - offset;
  const bottomRightX = size - offset;
  const bottomRightY = size - offset;
  const quarter = size * 0.25;
  const threeQuarter = quarter * 3;
  ctx2.fillStyle = "rgba(200, 200, 200, 0.4)";
  ctx2.beginPath();
  ctx2.moveTo(bottomLeftX, bottomLeftY);
  ctx2.lineTo(bottomRightX, bottomRightY);
  ctx2.bezierCurveTo(quarter, threeQuarter, quarter, threeQuarter, offset, offset);
  ctx2.closePath();
  ctx2.fill();
  ctx2.save();
}
__name(drawGlare, "drawGlare");
function drawDots(ctx2, dieValue) {
  const quarter = size / 4;
  const center = quarter * 2;
  const middle = quarter * 2;
  const left3 = quarter;
  const top2 = quarter;
  const right = quarter * 3;
  const bottom = quarter * 3;
  const dotSize = size / 12;
  const doDot = drawDot;
  if (dieValue === 1) {
    doDot(ctx2, middle, center, dotSize);
  } else if (dieValue === 2) {
    doDot(ctx2, top2, left3, dotSize);
    doDot(ctx2, bottom, right, dotSize);
  } else if (dieValue === 3) {
    drawDot(ctx2, top2, left3, dotSize);
    drawDot(ctx2, middle, center, dotSize);
    drawDot(ctx2, bottom, right, dotSize);
  } else if (dieValue === 4) {
    drawDot(ctx2, top2, left3, dotSize);
    drawDot(ctx2, top2, right, dotSize);
    drawDot(ctx2, bottom, left3, dotSize);
    drawDot(ctx2, bottom, right, dotSize);
  } else if (dieValue === 5) {
    drawDot(ctx2, top2, left3, dotSize);
    drawDot(ctx2, top2, right, dotSize);
    drawDot(ctx2, middle, center, dotSize);
    drawDot(ctx2, bottom, left3, dotSize);
    drawDot(ctx2, bottom, right, dotSize);
  } else if (dieValue === 6) {
    drawDot(ctx2, top2, left3, dotSize);
    drawDot(ctx2, top2, right, dotSize);
    drawDot(ctx2, middle, left3, dotSize);
    drawDot(ctx2, middle, right, dotSize);
    drawDot(ctx2, bottom, left3, dotSize);
    drawDot(ctx2, bottom, right, dotSize);
  }
}
__name(drawDots, "drawDots");
function drawDot(ctx2, y2, x2, dotSize) {
  ctx2.beginPath();
  ctx2.arc(x2, y2, dotSize, 0, Math.PI * 2, true);
  ctx2.closePath();
  ctx2.fill();
}
__name(drawDot, "drawDot");

// ../../Components/Views/Die.ts
var DIE_CFG2 = {
  size: { "width": 70, "height": 70 },
  radius: 10,
  color: "white"
};
var needToBuild = true;
var Die = class _Die {
  static {
    __name(this, "Die");
  }
  id = 0;
  // assigned by activeViews.add()    
  index = 0;
  activeView = true;
  zOrder = 0;
  tabOrder = 0;
  name;
  enabled = true;
  hovered = false;
  focused = false;
  path;
  location;
  size;
  left;
  top;
  width;
  height;
  color;
  frozen = false;
  value = 0;
  static frozenFaces;
  static faces;
  /** ctor that instantiates a new vitual Die view  and faces*/
  constructor(el) {
    if (needToBuild) {
      const { faces, frozenFaces } = buildDieFaces();
      _Die.faces = faces;
      _Die.frozenFaces = frozenFaces;
      needToBuild = false;
    }
    this.index = el.idx;
    this.tabOrder = el.tabOrder || 0;
    this.name = el.id;
    this.enabled = true;
    this.size = DIE_CFG2.size;
    this.width = this.size.width;
    this.height = this.size.height;
    this.location = el.location;
    this.top = el.location.top;
    this.left = el.location.left;
    this.color = "transparent";
    this.path = this.buildPath(DIE_CFG2.radius);
    this.render();
    signals.on("UpdateDie", this.index.toString(), (data) => {
      this.frozen = data.frozen;
      this.value = data.value;
      this.render();
    });
  }
  buildPath(radius) {
    const path = new Path2D();
    path.roundRect(this.left, this.top, this.width, this.height, radius);
    return path;
  }
  /** called from Surface/canvasEvents when this element has been touched */
  touched() {
    signals.fire(`DieTouched`, "", { index: this.index });
  }
  update() {
    this.render();
  }
  render() {
    ctx.save();
    const image = this.frozen ? _Die.frozenFaces[this.value] : _Die.faces[this.value];
    ctx.putImageData(image, this.left, this.top);
    ctx.lineWidth = 2;
    if (this.hovered) {
      ctx.strokeStyle = "orange";
      ctx.lineWidth = 2;
    } else {
      ctx.strokeStyle = "silver";
      ctx.lineWidth = 2;
    }
    ctx.stroke(this.path);
    ctx.restore();
  }
};
Die.faces = [
  new ImageData(1, 1),
  new ImageData(1, 1),
  new ImageData(1, 1),
  new ImageData(1, 1),
  new ImageData(1, 1),
  new ImageData(1, 1)
];
Die.frozenFaces = [
  new ImageData(1, 1),
  new ImageData(1, 1),
  new ImageData(1, 1),
  new ImageData(1, 1),
  new ImageData(1, 1),
  new ImageData(1, 1)
];

// ../../Components/Views/ScoreButton.ts
var ScoreButton_exports = {};
__export(ScoreButton_exports, {
  PossibleColor: () => PossibleColor,
  SCORE_CFG: () => SCORE_CFG,
  default: () => ScoreButton
});

// ../../Components/ViewModels/pathFactory.ts
function buildRightScore(location, size2) {
  const { left: left3, right, top: top2, bottom, width, height, radius } = getPathGeometry(location, size2);
  const halfWidth = left3 + width * 0.3;
  const halfHeight = top2 + height * 0.5 + 5;
  const p = new Path2D();
  p.moveTo(halfWidth + radius, top2);
  p.arcTo(right, top2, right, top2 + radius, radius);
  p.arcTo(right, bottom, right - radius, bottom, radius);
  p.arcTo(left3, bottom, left3, bottom - radius, radius);
  p.arcTo(left3, halfHeight, left3 + radius, halfHeight, radius);
  p.arcTo(halfWidth, halfHeight, halfWidth, halfHeight - radius, radius);
  p.arcTo(halfWidth, top2, halfWidth + radius, top2, radius);
  return p;
}
__name(buildRightScore, "buildRightScore");
function buildLeftScore(location, size2) {
  const { left: left3, right, top: top2, bottom, width, height, radius } = getPathGeometry(location, size2);
  const halfWidth = left3 + width * 0.7;
  const halfHeight = top2 + height * 0.5 - 5;
  const p = new Path2D();
  p.moveTo(left3 + radius, top2);
  p.arcTo(right, top2, right, top2 + radius, radius);
  p.arcTo(right, halfHeight, right - radius, halfHeight, radius);
  p.arcTo(halfWidth, halfHeight, halfWidth, halfHeight + radius, radius);
  p.arcTo(halfWidth, bottom, halfWidth - radius, bottom, radius);
  p.arcTo(left3, bottom, left3, bottom - radius, radius);
  p.arcTo(left3, top2, left3 + radius, top2, radius);
  return p;
}
__name(buildLeftScore, "buildLeftScore");
var getPathGeometry = /* @__PURE__ */ __name((location, size2, radius = 10) => {
  const { left: left3, top: top2 } = location;
  const { width, height } = size2;
  return {
    left: left3,
    right: left3 + width,
    top: top2,
    bottom: top2 + height,
    width,
    height,
    radius
  };
}, "getPathGeometry");

// ../../Components/Views/ScoreButton.ts
var SCORE_CFG = {
  size: {
    "width": 95,
    "height": 75
  }
};
var PossibleColor = "cyan";
var ScoreButton = class {
  static {
    __name(this, "ScoreButton");
  }
  id = 0;
  // assigned by activeViews.add()   
  zOrder = 0;
  tabOrder = 0;
  name;
  index;
  activeView = true;
  enabled = true;
  hovered = false;
  focused = false;
  path = new Path2D();
  size;
  location;
  text;
  color = "black";
  isLeftHanded;
  scoreText = "";
  available = false;
  tooltip = "";
  upperText = "";
  lowerText = "";
  upperName = null;
  lowerName = null;
  scoreBox = null;
  /** Creates an instance of a virtual ScoreButton. */
  constructor(el) {
    this.index = el.idx;
    this.tabOrder = el.tabOrder || 0;
    this.name = el.id;
    this.text = el.text || "";
    this.tooltip = `${this.name} available`;
    this.enabled = true;
    this.hovered = false;
    this.focused = false;
    this.size = SCORE_CFG.size;
    this.location = el.location;
    this.upperText = this.text.split(" ")[0];
    this.lowerText = this.text.split(" ")[1] || "";
    this.isLeftHanded = el.idx % 2 === 1;
    this.buildPath();
    signals.on(
      "UpdateScoreElement",
      this.index.toString(),
      (data) => {
        if (data.renderAll) {
          this.color = data.fillColor;
          this.render();
        }
        this.available = data.available;
        this.scoreText = data.value;
        this.renderScore(data.value, data.available);
      }
    );
  }
  /** build the correct (left/right) path and Txt locations */
  buildPath() {
    const s = this;
    const { left: left3, top: top2 } = s.location;
    if (this.isLeftHanded) {
      s.path = buildRightScore(s.location, s.size);
      s.upperName = new Text({
        kind: "text",
        idx: -1,
        tabOrder: 0,
        id: s.name + "-upperText",
        text: s.upperText,
        location: { left: left3 + 40, top: top2 + 10 },
        size: { width: 55, height: 30 },
        color: s.color,
        bind: false
      });
      s.lowerName = new Text({
        kind: "text",
        idx: -1,
        tabOrder: 0,
        id: s.name + "-lowerText",
        text: s.lowerText,
        location: { left: left3 + 40, top: top2 + 40 },
        size: { width: 55, height: 30 },
        color: s.color,
        bind: false
      });
      s.scoreBox = new Text({
        kind: "text",
        idx: -1,
        tabOrder: 0,
        id: s.name + "-score",
        text: "",
        location: { left: left3 + 5, top: top2 + 50 },
        size: { width: 24, height: 24 },
        color: s.color,
        padding: 10,
        bind: false
      });
    } else {
      s.path = buildLeftScore(s.location, s.size);
      s.upperName = new Text({
        kind: "text",
        idx: -1,
        tabOrder: 0,
        id: s.name + "-upperText",
        text: s.upperText,
        location: { left: left3 + 10, top: top2 + 10 },
        size: { width: 55, height: 30 },
        color: s.color,
        bind: false
      });
      s.lowerName = new Text({
        kind: "text",
        idx: -1,
        tabOrder: 0,
        id: s.name + "-lowerText",
        text: s.lowerText,
        location: { left: left3 + 10, top: top2 + 40 },
        size: { width: 55, height: 30 },
        color: s.color,
        bind: false
      });
      s.scoreBox = new Text({
        kind: "text",
        idx: -1,
        tabOrder: 0,
        id: s.name + "-score",
        text: "",
        location: { left: left3 + 70, top: top2 + 3 },
        size: { width: 24, height: 24 },
        color: s.color,
        padding: 10,
        bind: false
      });
    }
  }
  /** called from Surface/canvasEvents when this element has been touched */
  touched() {
    signals.fire("ScoreButtonTouched", this.index.toString(), this.index);
  }
  /** 
   * updates and renders the virtual ScoreButton view 
   * Caution: called 60fps - keep it clean
  */
  update() {
    this.render();
    this.renderScore(this.scoreText, this.available);
  }
  /** render this vitual ScoreButtons shape (path) onto the canvas */
  render() {
    ctx.save();
    ctx.lineWidth = 5;
    ctx.strokeStyle = this.hovered === true ? "orange" : this.color;
    ctx.stroke(this.path);
    ctx.restore();
    ctx.fillStyle = this.color;
    ctx.fill(this.path);
    if (this.upperName) {
      this.upperName.fillColor = this.color;
      this.upperName.fontColor = windowCFG.containerColor;
      this.upperName.text = this.upperText;
      this.upperName.update();
    }
    if (this.lowerName) {
      this.lowerName.fillColor = this.color;
      this.lowerName.fontColor = windowCFG.containerColor;
      this.lowerName.text = this.lowerText;
      this.lowerName.update();
    }
  }
  /** renders the score value inside the vitual ScoreButton view */
  renderScore(scoretext, available) {
    let scoreColor = available ? PossibleColor : windowCFG.containerColor;
    if (scoretext === "") {
      scoreColor = this.color;
    }
    if (this.scoreBox !== null) {
      this.scoreBox.fontColor = scoreColor;
      this.scoreBox.fillColor = this.color;
      this.scoreBox.text = scoretext;
      this.scoreBox.update();
    }
  }
};

// ../../Framework/base_manifest.ts
var baseManifest = {
  Views: {
    "../Components/Views/Button.ts": Button_exports,
    "../Components/Views/CheckBox.ts": CheckBox_exports,
    "../Components/Views/Container.ts": Container_exports,
    "../Components/Views/Popup.ts": Popup_exports,
    "../Components/Views/Text.ts": Text_exports,
    "../Components/Views/TextArea.ts": TextArea_exports,
    "../Components/Views/Die.ts": Die_exports,
    "../Components/Views/ScoreButton.ts": ScoreButton_exports
  },
  baseUrl: import.meta.url
};
var base_manifest_default = baseManifest;

// ../../Framework/src/signals/signals.ts
var signals = buildSignalAggregator();
function buildSignalAggregator() {
  const eventHandlers = /* @__PURE__ */ new Map();
  const newSignalAggregator = {
    /** 
     * on - registers a handler function to be executed when a signal is sent
     *  
     * @param {T} signalName - signal name (one of `TypedEvents` only)!
     * @param {string} id - id of a target element (may be an empty string)
     * @param {Handler} handler - eventhandler callback function
     */
    on(signalName, id, handler) {
      const keyName = signalName + "-" + id;
      if (eventHandlers.has(keyName)) {
        const handlers = eventHandlers.get(keyName);
        handlers.push(handler);
      } else {
        eventHandlers.set(keyName, [handler]);
      }
    },
    /** 
     * Execute all registered handlers for a strongly-typed signal (signalName)
     * @param {key} signalName - signal name - one of `TypedEvents` only!
     * @param {string} id - id of a target element (may be an empty string)
     * @param {T[key]} data - data payload, typed for this category of signal
     */
    fire(signalName, id, data) {
      const keyName = signalName + "-" + id;
      const handlers = eventHandlers.get(keyName);
      if (handlers) {
        for (const handler of handlers) {
          handler(data);
        }
      }
    }
  };
  return newSignalAggregator;
}
__name(buildSignalAggregator, "buildSignalAggregator");

// ../../Framework/src/render/renderContext.ts
var windowCFG = {
  containerColor: "snow",
  textColor: "black"
};
var elementDescriptors;
var initCFG = /* @__PURE__ */ __name((theCanvas, cfg2) => {
  canvas = theCanvas;
  windowCFG = cfg2.winCFG;
  elementDescriptors = cfg2.nodes;
}, "initCFG");
var getFactories = /* @__PURE__ */ __name(() => {
  const baseUrl = new URL("./", import.meta.url).href;
  const factories2 = /* @__PURE__ */ new Map();
  for (const [self2, module] of Object.entries(base_manifest_default.Views)) {
    const url = new URL(self2, baseUrl).href;
    const path = url.substring(baseUrl.length).substring("Components/Views".length);
    const baseRoute = path.substring(1, path.length - 3);
    const name = sanitizeName(baseRoute);
    const id = name.toLowerCase();
    const newView = { id, name, url, component: module.default };
    factories2.set(id, newView);
  }
  return factories2;
}, "getFactories");
var hasVisiblePopup = false;
var setHasVisiblePopup = /* @__PURE__ */ __name((val) => hasVisiblePopup = val, "setHasVisiblePopup");
var tickCount = 0;
var canvas;
var ctx;
var setupRenderContext = /* @__PURE__ */ __name((canvas2) => {
  ctx = canvas2.getContext("2d");
  refreshCanvasContext();
}, "setupRenderContext");
var refreshCanvasContext = /* @__PURE__ */ __name(() => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = windowCFG.containerColor;
  ctx.fillStyle = windowCFG.containerColor;
  ctx.font = "28px Tahoma, Verdana, sans-serif";
  ctx.textAlign = "center";
}, "refreshCanvasContext");
function toPascalCase(text) {
  return text.replace(
    /(^\w|-\w)/g,
    (substring) => substring.replace(/-/, "").toUpperCase()
  );
}
__name(toPascalCase, "toPascalCase");
function sanitizeName(name) {
  const fileName = name.replace("/", "");
  return toPascalCase(fileName);
}
__name(sanitizeName, "sanitizeName");

// ../../Framework/src/render/activeNodes.ts
var activeNodes = /* @__PURE__ */ new Set();
var addNode = /* @__PURE__ */ __name((view) => {
  activeNodes.add(view);
  signals.fire(
    "AddedView",
    "",
    {
      type: view.constructor.name,
      index: view.index,
      name: view.name
    }
  );
}, "addNode");

// ../../Framework/src/signals/systemEvents.ts
var left2 = 0;
var x = 0;
var y = 0;
var boundingRect = null;
var hit = false;
var node = null;
var hoveredNode = null;
var focusedNode = null;
function initHostEvents() {
  addEventListener("keydown", (evt) => {
    if (DEV) console.info("keydown", evt);
    let focusNum = 0;
    if (focusedNode !== null) {
      if (evt.key.length < 2) {
        signals.fire("WindowInput", focusedNode.name, evt.key);
      }
    }
    if (evt.code === "Tab") {
      if (focusedNode !== null) {
        const direction = evt.shiftKey ? -1 : 1;
        focusNum = focusNext(focusedNode.tabOrder + direction, evt.shiftKey);
      } else {
        focusNum = focusNext(1, evt.shiftKey);
      }
      if (focusNum === 0) {
        const last = evt.shiftKey ? 20 : 1;
        focusNext(last, evt.shiftKey);
      }
      return;
    }
    if (evt.code === "Enter") {
      if (hasVisiblePopup === true) {
        signals.fire(`PopupReset`, "", null);
      } else if (focusedNode !== null) {
        focusedNode.touched();
      }
    }
    if (focusedNode !== null) {
      signals.fire("WindowKeyDown", focusedNode.name, evt);
    }
  });
  addEventListener("mousedown", (evt) => {
    if (DEV) console.info("mousedown", evt);
    evt.preventDefault();
    if (evt.button === left2) {
      if (hasVisiblePopup === false) {
        handleClickOrTouch(evt.pageX, evt.pageY);
      } else {
        signals.fire(`PopupReset`, "", null);
      }
    }
  }, false);
  addEventListener("mousemove", (evt) => {
    evt.preventDefault();
    if (hasVisiblePopup === false) {
      handleMouseMove(evt);
    }
  });
  addEventListener("scroll", (evt) => {
    evt.preventDefault();
    const y2 = Math.sign(evt.scrollY);
    signals.fire("Scroll", "", { deltaY: y2 });
  });
}
__name(initHostEvents, "initHostEvents");
function handleMouseMove(evt) {
  boundingRect = canvas.getBoundingClientRect();
  x = evt.clientX - boundingRect.x;
  y = evt.clientY - boundingRect.y;
  node = null;
  for (const n of activeNodes) {
    if (ctx.isPointInPath(n.path, x, y)) {
      node = n;
    }
  }
  if (node !== null) {
    if (node !== hoveredNode) {
      clearHovered();
      node.hovered = true;
      node.update();
      hoveredNode = node;
      document.documentElement.style.cursor = "hand";
    }
  } else {
    if (hoveredNode !== null) {
      clearHovered();
      hoveredNode = null;
    }
  }
}
__name(handleMouseMove, "handleMouseMove");
function handleClickOrTouch(mX, mY) {
  x = mX - canvas.offsetLeft;
  y = mY - canvas.offsetTop;
  hit = false;
  for (const node2 of activeNodes) {
    if (!hit) {
      if (ctx.isPointInPath(node2.path, x, y)) {
        node2.touched();
        clearFocused();
        focusedNode = node2;
        if (focusedNode)
          signals.fire("Focused", focusedNode.name, true);
        hit = true;
      }
    }
  }
  if (!hit) clearFocused();
}
__name(handleClickOrTouch, "handleClickOrTouch");
function clearFocused() {
  if (focusedNode !== null) {
    focusedNode.focused = false;
    focusedNode.hovered = false;
    signals.fire("Focused", focusedNode.name, focusedNode.focused);
    focusedNode.update();
  }
}
__name(clearFocused, "clearFocused");
function clearHovered() {
  document.documentElement.style.cursor = "arrow";
  if (hoveredNode !== null) {
    hoveredNode.hovered = false;
    hoveredNode.update();
  }
}
__name(clearHovered, "clearHovered");
function focusNext(target, _shift) {
  hit = false;
  for (const node2 of activeNodes) {
    if (hit === false) {
      if (node2.tabOrder === target) {
        clearFocused();
        clearHovered();
        focusedNode = node2;
        if (focusedNode) {
          focusedNode.focused = true;
          focusedNode.hovered = true;
          focusedNode.update();
          signals.fire("Focused", focusedNode.name, true);
        }
        hit = true;
      }
    }
  }
  return hit === false ? 0 : target;
}
__name(focusNext, "focusNext");

// ../../Framework/src/render/uiContainer.ts
var factories;
function containerInit(canvas2, cfg2) {
  initCFG(canvas2, cfg2);
  setupRenderContext(canvas2);
  initHostEvents();
}
__name(containerInit, "containerInit");
var hydrateUI = /* @__PURE__ */ __name(() => {
  factories = getFactories();
  for (const el of elementDescriptors) {
    addElement(el);
  }
}, "hydrateUI");
function addElement(el) {
  const thisKind = el.kind.toLowerCase();
  if (factories.has(thisKind)) {
    const View8 = factories.get(thisKind).component;
    addNode(new View8(el));
  } else {
    const errMsg = `No view named ${el.kind} was found! 
Make sure your view_manifest is up to date!`;
    console.error(errMsg);
    throw new Error(errMsg);
  }
}
__name(addElement, "addElement");

// src/cfg.ts
var cfg = {
  winCFG: {
    title: "DWM-GUI TextArea Example",
    size: { width: 1e3, height: 900 },
    location: { x: 500, y: 100 },
    radius: 30,
    containerColor: "snow",
    textColor: "black",
    resizable: false,
    removeDecorations: false,
    transparent: false
  },
  nodes: [
    {
      kind: "TextArea",
      id: "TextArea1",
      idx: 0,
      tabOrder: 1,
      location: { left: 10, top: 20 },
      size: { width: 360, height: 350 },
      text: "testing123",
      color: "snow",
      bind: true,
      multiLine: true
    },
    {
      kind: "Button",
      id: "closebutton",
      idx: 0,
      tabOrder: 2,
      location: { left: 100, top: 400 },
      size: { width: 200, height: 50 },
      enabled: true,
      text: "Close",
      color: "brown"
    }
  ]
};

// src/main.ts
var can = document.getElementById("surface");
containerInit(
  can,
  cfg
);
initCloseButton("closebutton");
var _textEditor = new TextEditor("TextArea1", `First line.
Second line.`);
hydrateUI();
signals.fire("Focused", "TextArea1", false);
