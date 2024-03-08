// deno-lint-ignore-file
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// https://raw.githubusercontent.com/nhrones/Surface/main/Components/ViewModels/closeButton.ts
var thisID;
var initCloseButton = /* @__PURE__ */ __name((id2) => {
  thisID = id2;
  signals.on("ButtonTouched", thisID, () => {
    console.log("window.close");
    self.close();
  });
}, "initCloseButton");

// https://raw.githubusercontent.com/nhrones/Surface/main/Components/ViewModels/constants.ts
var HAIRSPACE = "\u200A";
var CARETBAR = "\u258F";

// https://raw.githubusercontent.com/nhrones/Surface/main/Components/Views/Button.ts
var Button_exports = {};
__export(Button_exports, {
  default: () => Button
});

// https://raw.githubusercontent.com/nhrones/Surface/main/Components/Views/Text.ts
var Text_exports = {};
__export(Text_exports, {
  default: () => Text
});
var Text = class {
  /** ctor that instantiates a new virtual Text view */
  constructor(el) {
    this.id = 0;
    // N/A
    this.activeView = false;
    this.enabled = false;
    this.hovered = false;
    this.focused = false;
    this.path = new Path2D();
    this.index = 0;
    this.zOrder = 0;
    // assigned by activeViews.add()
    this.tabOrder = 0;
    this.padding = 10;
    this.strokeColor = "black";
    this.hasBorder = false;
    this.fill = true;
    this.textBaseline = "middle";
    this.TextLocation = "middle";
    this.boundingBox = { left: 0, top: 0, width: 0, height: 0 };
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
__name(Text, "Text");

// https://raw.githubusercontent.com/nhrones/Surface/main/Components/Views/Button.ts
var Button = class {
  /**
   * instantiate a new vitual Button-View
   */
  constructor(el) {
    this.id = 0;
    this.activeView = true;
    this.index = -1;
    this.zOrder = 0;
    this.tabOrder = 0;
    this.name = "";
    this.enabled = true;
    this.hovered = false;
    this.focused = false;
    this.text = "";
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
__name(Button, "Button");

// https://raw.githubusercontent.com/nhrones/Surface/main/Components/Views/Container.ts
var Container_exports = {};
__export(Container_exports, {
  default: () => Container
});

// https://raw.githubusercontent.com/nhrones/Surface/main/Components/Views/Scrollbar.ts
var Scrollbar = class {
  /**
   *  Scrollbar ctor
   */
  constructor(host) {
    this.mousePos = 0;
    this.dragging = false;
    this.hovered = false;
    this.visible = true;
    this.left = 0;
    this.top = 0;
    this.width = 0;
    this.height = 0;
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
    const { height, lineHeight, rowCapacity, top: top3 } = this.container;
    this.cursor.index -= delta;
    if (this.cursor.index < 0)
      this.cursor.index = 0;
    const newTop = this.cursor.index * lineHeight;
    if (newTop + this.cursor.length >= height + top3) {
    } else {
      this.cursor.top = newTop;
    }
    if (this.cursor.top < 0)
      this.cursor.top = 0;
    this.container.render();
  }
};
__name(Scrollbar, "Scrollbar");

// https://raw.githubusercontent.com/nhrones/Surface/main/Components/Views/Container.ts
var Container = class {
  /** 
   * Container ctor 
   */
  constructor(el) {
    this.id = 0;
    this.activeView = true;
    this.index = 1;
    this.zOrder = 0;
    this.tabOrder = 0;
    this.name = "";
    this.enabled = true;
    this.hovered = false;
    this.focused = false;
    this.padding = 10;
    this.left = 0;
    this.top = 0;
    this.lineHeight = 0;
    this.showPlaceholder = true;
    this.scrollBarWidth = 25;
    /** the number of characters that will fit in this width */
    this.textCapacity = 0;
    /** number of rows that will fit container height */
    this.rowCapacity = 0;
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
__name(Container, "Container");

// https://raw.githubusercontent.com/nhrones/Surface/main/Components/Views/Popup.ts
var Popup_exports = {};
__export(Popup_exports, {
  default: () => Popup
});
var left = 1;
var top = 1;
var Popup = class {
  /** ctor that instantiates a new vitual Popup view */
  constructor(el) {
    this.id = 0;
    // assigned by activeViews.add() 
    this.index = -1;
    this.activeView = true;
    this.zOrder = 0;
    this.tabOrder = 0;
    this.name = "";
    this.enabled = true;
    this.hovered = false;
    this.focused = false;
    this.color = "black";
    this.text = "";
    this.fontColor = "red";
    this.fontSize = 28;
    this.visible = true;
    this.tabOrder = el.tabOrder || 0;
    this.enabled = true;
    this.color = "white";
    this.location = el.location;
    this.hiddenPath = new Path2D();
    this.hiddenPath.rect(1, 1, 1, 1);
    this.size = el.size || { width: 300, height: 300 };
    this.shownPath = this.buildPath(el.radius || 30);
    this.path = this.hiddenPath;
    this.fontSize = el.fontSize || 24;
    this.textNode = new Text(
      {
        kind: "Text",
        idx: -1,
        tabOrder: 0,
        id: this.name + "Label",
        text: el.text || "",
        location: this.location,
        size: this.size,
        bind: true
      }
    );
    signals.on("ShowPopup", "", (data) => {
      this.show(data.msg);
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
  show(msg) {
    signals.fire("FocusPopup", " ", this);
    this.text = msg;
    left = this.location.left;
    top = this.location.top;
    this.path = this.shownPath;
    this.visible = true;
    setHasVisiblePopup(true);
    this.render();
  }
  /** hide the virtual Popup view */
  hide() {
    if (this.visible) {
      left = 1;
      top = 1;
      this.path = this.hiddenPath;
      this.visible = false;
      setHasVisiblePopup(false);
    }
  }
  /** called from Surface/canvasEvents when this element has been touched */
  touched() {
    this.hide();
    signals.fire("PopupReset", "", null);
  }
  /** update this virtual Popups view (render it) */
  update() {
    if (this.visible)
      this.render();
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
    this.textNode.fontSize = this.fontSize;
    this.textNode.fillColor = this.color;
    this.textNode.fontColor = this.fontColor;
    this.textNode.text = this.text;
    this.textNode.update();
    ctx.restore();
    this.visible = true;
  }
};
__name(Popup, "Popup");

// https://raw.githubusercontent.com/nhrones/Surface/main/Components/Views/TextArea.ts
var TextArea_exports = {};
__export(TextArea_exports, {
  default: () => TextArea
});
var dev = false;
var caretChar = HAIRSPACE;
var placeholder = "text";
var TextArea = class extends Container {
  constructor(el) {
    super(el);
    this.id = 0;
    this.activeView = true;
    this.index = 1;
    this.zOrder = 0;
    this.tabOrder = 0;
    this.name = "";
    this.enabled = true;
    this.hovered = false;
    this.focused = false;
    this.log = false;
    this.padding = 10;
    this.lineHeight = 0;
    this.text = "";
    this.lines = [];
    this.trimmedLeft = "";
    this.trimmedRight = "";
    this.insertionColumn = 0;
    this.insertionRow = 0;
    this.selectStart = 0;
    this.selectEnd = 0;
    this.widthPerChar = 15;
    /** 
     * the number of characters that will fit in this width  
     */
    this.textCapacity = 0;
    this.rowCapacity = 0;
    this.showPlaceholder = true;
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
      if (tickCount === 30)
        caretChar = HAIRSPACE;
      if (tickCount === 0)
        caretChar = CARETBAR;
    } else {
      caretChar = "";
    }
    let lineNumber = 0;
    for (const line of this.lines) {
      if (line.length <= 0)
        continue;
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
        if (line.hasSelection)
          this.renderHighlight(line);
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
__name(TextArea, "TextArea");

// https://raw.githubusercontent.com/nhrones/Surface/main/Components/Views/CheckBox.ts
var CheckBox_exports = {};
__export(CheckBox_exports, {
  default: () => CheckBox
});
var CheckBox = class {
  /**
   * instantiate a new vitual CheckBox-View
   */
  constructor(el) {
    this.id = 0;
    this.activeView = true;
    this.index = -1;
    this.zOrder = 0;
    this.tabOrder = 0;
    this.name = "";
    this.enabled = true;
    this.hovered = false;
    this.focused = false;
    this.text = "";
    this.checked = false;
    this.name = el.id;
    this.zOrder = 0;
    this.tabOrder = el.tabOrder || 0;
    this.location = el.location;
    const { left: left4, top: top3 } = el.location;
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
    const top3 = this.location.top + this.size.height * 0.5;
    const left4 = this.location.left + this.size.width * 0.5;
    ctx.fillText(this.text + " ", left4, top3);
    ctx.restore();
  }
};
__name(CheckBox, "CheckBox");

// https://raw.githubusercontent.com/nhrones/Surface/main/Components/base_manifest.ts
var baseManifest = {
  Views: {
    "./Views/Button.ts": Button_exports,
    "./Views/CheckBox.ts": CheckBox_exports,
    "./Views/Container.ts": Container_exports,
    "./Views/Popup.ts": Popup_exports,
    "./Views/Text.ts": Text_exports,
    "./Views/TextArea.ts": TextArea_exports
  },
  baseUrl: import.meta.url
};
var base_manifest_default = baseManifest;

// https://raw.githubusercontent.com/nhrones/Surface/main/Framework/src/render/renderContext.ts
var windowCFG = {
  containerColor: "snow",
  textColor: "black"
};
var elementDescriptors;
var appManifest;
var initCFG = /* @__PURE__ */ __name((theCanvas, cfg2, applicationManifest) => {
  canvas = theCanvas;
  windowCFG = cfg2.winCFG;
  elementDescriptors = cfg2.nodes;
  appManifest = applicationManifest;
}, "initCFG");
var getFactories = /* @__PURE__ */ __name(() => {
  const baseUrl = new URL("./", appManifest.baseUrl).href;
  const factories2 = /* @__PURE__ */ new Map();
  for (const [self2, module] of Object.entries(base_manifest_default.Views)) {
    const url = new URL(self2, baseUrl).href;
    const path = url.substring(baseUrl.length).substring("Views".length);
    const baseRoute = path.substring(1, path.length - 3);
    const name = sanitizeName(baseRoute);
    const id2 = name.toLowerCase();
    const newView = { id: id2, name, url, component: module.default };
    factories2.set(id2, newView);
  }
  if (appManifest.Views) {
    for (const [self2, module] of Object.entries(appManifest.Views)) {
      const url = new URL(self2, baseUrl).href;
      const path = url.substring(baseUrl.length).substring("Views".length);
      const baseRoute = path.substring(1, path.length - 3);
      const name = sanitizeName(baseRoute);
      const id2 = name.toLowerCase();
      const newView = { id: id2, name, url, component: module.default };
      factories2.set(id2, newView);
    }
  }
  return factories2;
}, "getFactories");
var hasVisiblePopup = false;
var setHasVisiblePopup = /* @__PURE__ */ __name((val) => hasVisiblePopup = val, "setHasVisiblePopup");
var tickCount = 0;
var incrementTickCount = /* @__PURE__ */ __name(() => {
  tickCount++;
  if (tickCount > 60)
    tickCount = 0;
}, "incrementTickCount");
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

// https://raw.githubusercontent.com/nhrones/Surface/main/Framework/src/events/signalBroker.ts
var signals = buildSignalAggregator();
function buildSignalAggregator() {
  const eventHandlers = /* @__PURE__ */ new Map();
  const newSignalBroker = {
    /** 
     * on - registers a handler function to be executed when a signal is sent
     *  
     * @param {T} signalName - signal name (one of `TypedEvents` only)!
     * @param {string} id - id of a target element (may be an empty string)
     * @param {Handler} handler - eventhandler callback function
     */
    on(signalName, id2, handler) {
      const keyName = signalName + "-" + id2;
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
    fire(signalName, id2, data) {
      const keyName = signalName + "-" + id2;
      const handlers = eventHandlers.get(keyName);
      if (handlers) {
        for (const handler of handlers) {
          handler(data);
        }
      }
    }
  };
  return newSignalBroker;
}
__name(buildSignalAggregator, "buildSignalAggregator");

// https://raw.githubusercontent.com/nhrones/Surface/main/Framework/src/render/activeNodes.ts
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
var renderNodes = /* @__PURE__ */ __name(() => {
  incrementTickCount();
  if (ctx) {
    const { width, height } = ctx.canvas;
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "snow";
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, width, height);
    ctx.restore();
    for (const el of activeNodes) {
      el.update();
    }
  }
}, "renderNodes");

// https://raw.githubusercontent.com/nhrones/Surface/main/Framework/src/events/systemEvents.ts
var left2 = 0;
var x = 0;
var y = 0;
var boundingRect = null;
var hit = false;
var node = null;
var hoveredNode = null;
var focusedNode = null;
function initHostEvents() {
  addEventListener("input", (evt) => {
    if (focusedNode !== null) {
      signals.fire("WindowInput", focusedNode.name, evt);
    }
  });
  addEventListener("keydown", (evt) => {
    let focusNum = 0;
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
  if (!hit)
    clearFocused();
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

// https://raw.githubusercontent.com/nhrones/Surface/main/Framework/src/render/uiContainer.ts
var factories;
function containerInit(canvas2, cfg2, manifest2) {
  initCFG(canvas2, cfg2, manifest2);
  setupRenderContext(canvas2);
  initHostEvents();
}
__name(containerInit, "containerInit");
var render = /* @__PURE__ */ __name(() => {
  renderNodes();
}, "render");
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

// src/ViewModels/sounds.ts
var context;
var canPlay = true;
var enabled = /* @__PURE__ */ __name((enable) => {
  canPlay = enable;
}, "enabled");
async function makeBuffer(base64) {
  const arrayBuffer = base64ToArrayBuffer(base64);
  return await context.decodeAudioData(arrayBuffer);
}
__name(makeBuffer, "makeBuffer");
function base64ToArrayBuffer(base64) {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}
__name(base64ToArrayBuffer, "base64ToArrayBuffer");
async function init(thisContext) {
  context = thisContext;
  cluckBuf = await makeBuffer(cluck);
  dohhBuf = await makeBuffer(dohh);
  heeheeBuf = await makeBuffer(hehe);
  rollBuf = await makeBuffer(rolldice);
  selectBuf = await makeBuffer(select);
  woohooBuf = await makeBuffer(woohoo);
  noooBuf = await makeBuffer(nooo);
  loaded = true;
}
__name(init, "init");
var Cluck = /* @__PURE__ */ __name(() => {
  if (loaded && cluckBuf)
    playBuffer(cluckBuf);
}, "Cluck");
var Dohh = /* @__PURE__ */ __name(() => {
  if (loaded && dohhBuf)
    playBuffer(dohhBuf);
}, "Dohh");
var Heehee = /* @__PURE__ */ __name(() => {
  if (loaded && heeheeBuf)
    playBuffer(heeheeBuf);
}, "Heehee");
var Roll = /* @__PURE__ */ __name(() => {
  if (loaded && rollBuf)
    playBuffer(rollBuf);
}, "Roll");
var Select = /* @__PURE__ */ __name(() => {
  if (loaded && rollBuf)
    playBuffer(selectBuf);
}, "Select");
var Woohoo = /* @__PURE__ */ __name(() => {
  if (loaded && woohooBuf)
    playBuffer(woohooBuf);
}, "Woohoo");
function playBuffer(buffer) {
  if (canPlay) {
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(context.currentTime);
  }
}
__name(playBuffer, "playBuffer");
var cluck = "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";
var dohh = "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";
var hehe = "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qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7EGToAACnB8smKAAAAAANIMAAAAAAAaQcAAAgAAA0g4AABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpUQUcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/w==";
var nooo = "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4leWvqueKPg9TxOOzXUCQ/Sy+KZRpaj8LtZlA8GuQ/E1OU+9ONDUam88VYlhnrimF+pMQU1FMy45OS41qqqqqqqqqqqqqv/7YMT/ABGMmS+5zIAB25MoPzWAAaqqqqqqqqqPWWuwQsgAAG6F6JqS0kqKLcTpRaYkOZrva+wCAiSjUBO4NPCj5YGRE+d5UN1MQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7YMT1AA2cm0G5p4AB4ZOpfzWAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EMTsg8WUNTG88YAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8=";
var rolldice = "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";
var select = "SUQzAwAAAAAEKFRBTEIAAAABAAAAVENPTgAAAAEAAABUSVQyAAAAAQAAAFRQRTEAAAABAAAAVFJDSwAAAAEAAABUWUVSAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7kMQAAAAAAAAAAAAAAAAAAAAAAFhpbmcAAAAPAAAAAwAABc4Arq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6u2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra////////////////////////////////////////////AAAAMkxBTUUzLjk5cgSqAAAAACxGAAA1ICQDWCEAAcIAAAXOKohaMwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7wMQAAAQoA0u0AAAivCMrdzWCCNSQXZ/JYkwAIHCd4PqBBwOBhYP4P5Q5wx/hjlHcMco7hidhAIGsaqFxi06Tw0ABDsYoQss4MRDiawqoIbs+InBlBAJcH8BgImhW9g1DUaEx7NH3GRg4RzCkfI4MXQrYITSAwjMJ2QTLiSF35xuVSEWnDpGVN3e+w/ktZy1imh2rFmTONafaX15i7Mz9/Hl6wzqDndh6rhO08zQXZNcxpIjTQ1G4xNR2JP9R41oMhMvjdFUrztaxOWpRnKN8rXqtLcw7jUyq8z/Dff///VXgFVrV14khYBMpJv9wIMUClS2Ef01W5F+2QkS1YbMNTxbRPqmyFXHHALNqHqkwwwbSjCiTP8aS3rJtfrtbMsLyK1CzE8zTqKhzdJ1Kru62kNo2q/w7XDNt/1NqrR1tMWxTAEN37s4GJEZOb73ADTQ2ALcR8ccLXIJKWGFpSCQFe/2BLJBgD+y8dXiv/Mnv3/qtebnEfOv25oCDbxjogEzxQq00bLDEL9rdtKJHkaLFZ4NYAKcplnhm+90cAQAAAdEZcsOXsfWkFAjakly5NtrJYwk2FVFZXwBkxUc8gFfiwIIJT4ETwcSw4zQHHWxAcpomCKUN9CGZqUsynct4zTyyqCKHqxXGdR8m3y3NVs6k/lu31nEYfuIQ1Eda7//3//8+5Rq9P0c5L/8HBKDIbd/0ARVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tAxPqAC/0PW/2EACkqj2q+nmAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+zDE9YAQSLlF+YyAAAAAP8OAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUQUcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/w==";
var woohoo = "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ADSAAAAE/Nau/dMF+I4EXpnhkN6W3B0HNZJDYhCGFtMWbkr1L2NwS2lPZrwVP2c5TMuxKUMjT3KOLEs4IBkasXMxmed9AiLmVz+rkdQParSootybOa5WW7OpC5ENL///6l26iSu/76Og2Ab1tnYuwcowVoiWUkSTckUMUXx3kQTQXheUIuTw9y5WUSWjrKnUEKFvwK4pw4xRzXMmaXT+G/PMjM3XrkWgNNnhqebuZv2k+dNiKfnlbLW8uH5z/y///5/wfK//fbcxvqZtsUDgsBDgrg6grBMIxQKAwAAAui9APhVfgaQD//tQZP2A8y5MW3sDFHgAAA0gAAABDAkxZ+wM84AAADSAAAAEcDZJ7+BPgYGhPfjxBWh3FuE/JYlWRVz5JEmOU6ktD0TInmwnuYomvxMSRRJEyNlK/84J6PExMjpZ//sXjOisyTNf+VIngoFSX/////LVTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7UGTwgPLeS9r54xVYAAANIAAAAQxVL2PsDFGAAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+2Bk5wAC40fXfTxgAAAADSCgAAEM4NtR+PaCAAAANIMAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpBwAACAAADSDgAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8=";
var cluckBuf;
var dohhBuf;
var heeheeBuf;
var noooBuf;
var rollBuf;
var selectBuf;
var woohooBuf;
var loaded = false;

// src/ViewModels/highScore.ts
var HighScore = 0;
function setupHighScore() {
  HighScore = parseInt(localStorage.getItem("highScore")) ?? 0;
  if (!HighScore)
    localStorage.setItem("highScore", "10");
  signals.fire(
    "UpdateText",
    "highScoreValue",
    {
      border: false,
      fill: true,
      fillColor: "snow",
      fontColor: "black",
      text: HighScore + ""
    }
  );
}
__name(setupHighScore, "setupHighScore");

// src/ViewModels/playerName.ts
var id = "player1";
var state = {
  border: false,
  fill: true,
  fillColor: "snow",
  fontColor: "Brown",
  text: "Score:"
};
var init2 = /* @__PURE__ */ __name(() => {
  on("UpdatePlayer", "0", (data) => {
    state.text = data.text;
    update();
  });
  update();
}, "init");
var update = /* @__PURE__ */ __name(() => {
  signals.fire("UpdateText", id, state);
}, "update");

// src/ViewModels/diceEvaluator.ts
var smallLow = 15;
var smallMid = 30;
var smallHigh = 60;
var largeLow = 31;
var largeHigh = 62;
var binaryFaceValue = [0, 1, 2, 4, 8, 16, 32];
var countOfDieFaceValue = [0, 0, 0, 0, 0, 0, 0];
var sumOfAllDie = 0;
var straightsMask = 0;
var hasPair = false;
var hasTwoPair = false;
var hasTrips = false;
var hasQuads = false;
var hasFiveOfaKind = false;
var hasTripsOrBetter = false;
var hasFullHouse = false;
var hasSmallStr = false;
var hasLargeStr = false;
var hasFullStr = false;
var evaluateDieValues = /* @__PURE__ */ __name(() => {
  countOfDieFaceValue = [0, 0, 0, 0, 0, 0, 0];
  sumOfAllDie = 0;
  const dieSet = die;
  for (let i = 0; i < 5; i++) {
    const val = dieSet[i].value;
    sumOfAllDie += val;
    if (val > 0) {
      countOfDieFaceValue[val] += 1;
    }
  }
  setTheStraightsMask();
  setScoringFlags();
  setIsFiveOfaKind(testForFiveOfaKind());
}, "evaluateDieValues");
var setScoringFlags = /* @__PURE__ */ __name(() => {
  hasPair = false;
  hasTwoPair = false;
  hasTrips = false;
  hasQuads = false;
  hasFiveOfaKind = false;
  hasTripsOrBetter = false;
  hasFullHouse = false;
  hasSmallStr = false;
  hasLargeStr = false;
  hasFullStr = false;
  for (let i = 0; i < 7; i++) {
    if (countOfDieFaceValue[i] === 5) {
      hasFiveOfaKind = true;
      hasTripsOrBetter = true;
    }
    if (countOfDieFaceValue[i] === 4) {
      hasQuads = true;
      hasTripsOrBetter = true;
    }
    if (countOfDieFaceValue[i] === 3) {
      hasTrips = true;
      hasTripsOrBetter = true;
    }
    if (countOfDieFaceValue[i] === 2) {
      if (hasPair) {
        hasTwoPair = true;
      }
      hasPair = true;
    }
  }
  hasFullHouse = hasTrips && hasPair;
  const mask = straightsMask;
  hasLargeStr = (mask & largeLow) === largeLow || (mask & largeHigh) === largeHigh;
  hasSmallStr = (mask & smallLow) === smallLow || (mask & smallMid) === smallMid || (mask & smallHigh) === smallHigh;
}, "setScoringFlags");
var testForFiveOfaKind = /* @__PURE__ */ __name(() => {
  if (hasFiveOfaKind) {
    if (fiveOfaKindWasSacrificed) {
      Dohh();
    } else {
      Woohoo();
    }
    return true;
  }
  return false;
}, "testForFiveOfaKind");
var setTheStraightsMask = /* @__PURE__ */ __name(() => {
  const die2 = die;
  straightsMask = 0;
  for (let thisValue = 1; thisValue <= 6; thisValue++) {
    if (die2[0].value === thisValue || die2[1].value === thisValue || die2[2].value === thisValue || die2[3].value === thisValue || die2[4].value === thisValue) {
      straightsMask += binaryFaceValue[thisValue];
    }
  }
}, "setTheStraightsMask");

// src/ViewModels/dice.ts
var rollCount = 0;
var isFiveOfaKind = false;
var fiveOfaKindCount = 0;
var fiveOfaKindBonusAllowed = false;
var fiveOfaKindWasSacrificed = false;
var die = [
  { value: 0, frozen: false },
  { value: 0, frozen: false },
  { value: 0, frozen: false },
  { value: 0, frozen: false },
  { value: 0, frozen: false }
];
var sum = 0;
var setRollCount = /* @__PURE__ */ __name((val) => {
  rollCount = val;
}, "setRollCount");
var setIsFiveOfaKind = /* @__PURE__ */ __name((val) => {
  isFiveOfaKind = val;
}, "setIsFiveOfaKind");
var setfiveOfaKindBonusAllowed = /* @__PURE__ */ __name((val) => {
  fiveOfaKindBonusAllowed = val;
}, "setfiveOfaKindBonusAllowed");
var setfiveOfaKindWasSacrificed = /* @__PURE__ */ __name((val) => {
  fiveOfaKindWasSacrificed = val;
}, "setfiveOfaKindWasSacrificed");
var setfiveOfaKindCount = /* @__PURE__ */ __name((val) => {
  fiveOfaKindCount = val;
}, "setfiveOfaKindCount");
var init3 = /* @__PURE__ */ __name(() => {
  on(`DieTouched`, "", (data) => {
    const { index } = data;
    const thisDie = die[index];
    if (thisDie.value > 0) {
      thisDie.frozen = !thisDie.frozen;
      updateView(index, thisDie.value, thisDie.frozen);
      Select();
    }
  });
}, "init");
var resetTurn = /* @__PURE__ */ __name(() => {
  die.forEach((thisDie, index) => {
    thisDie.frozen = false;
    thisDie.value = 0;
    updateView(index, 0, false);
  });
  rollCount = 0;
  sum = 0;
}, "resetTurn");
var resetGame = /* @__PURE__ */ __name(() => {
  resetTurn();
  isFiveOfaKind = false;
  fiveOfaKindCount = 0;
  fiveOfaKindBonusAllowed = false;
  fiveOfaKindWasSacrificed = false;
}, "resetGame");
var roll = /* @__PURE__ */ __name((dieValues) => {
  Roll();
  sum = 0;
  die.forEach((thisDie, index) => {
    if (dieValues === null) {
      if (!thisDie.frozen) {
        thisDie.value = Math.floor(Math.random() * 6) + 1;
        updateView(index, thisDie.value, thisDie.frozen);
      }
    } else {
      if (!thisDie.frozen) {
        thisDie.value = dieValues[index];
        updateView(index, thisDie.value, thisDie.frozen);
      }
    }
    sum += thisDie.value;
  });
  rollCount += 1;
  evaluateDieValues();
  appInstance.evaluatePossibleScores();
}, "roll");
var updateView = /* @__PURE__ */ __name((index, value, frozen) => {
  fire("UpdateDie", index.toString(), { index, value, frozen });
}, "updateView");
var toString = /* @__PURE__ */ __name(() => {
  let str = "[";
  die.forEach((thisDie, index) => {
    str += thisDie.value;
    if (index < 4)
      str += ",";
  });
  return str + "]";
}, "toString");

// src/ViewModels/possible.ts
var ThreeOfaKind = 6;
var FourOfaKind = 7;
var SmallStraight = 8;
var LargeStraight = 9;
var House = 10;
var FiveOfaKind = 11;
var Chance = 12;
var FiveOfaKindIndex = FiveOfaKind;
var evaluate = /* @__PURE__ */ __name((id2) => {
  return id2 < 6 ? evaluateNumbers(id2) : evaluateCommon(id2);
}, "evaluate");
var evaluateCommon = /* @__PURE__ */ __name((id2) => {
  if (id2 === FiveOfaKind) {
    return hasFiveOfaKind ? 50 : 0;
  } else if (id2 === SmallStraight) {
    return hasSmallStr ? 30 : 0;
  } else if (id2 === LargeStraight) {
    return hasLargeStr ? 40 : 0;
  } else if (id2 === House) {
    return hasFullHouse ? 25 : 0;
  } else if (id2 === FourOfaKind) {
    return hasQuads || hasFiveOfaKind ? sumOfAllDie : 0;
  } else if (id2 === ThreeOfaKind) {
    return hasTrips || hasQuads || hasFiveOfaKind ? sumOfAllDie : 0;
  } else if (id2 === Chance) {
    return sumOfAllDie;
  } else {
    return 0;
  }
}, "evaluateCommon");
var evaluateNumbers = /* @__PURE__ */ __name((id2) => {
  let hits = 0;
  const target = id2 + 1;
  for (let i = 0; i < 5; i++) {
    const val = die[i].value;
    if (val === target) {
      hits += 1;
    }
  }
  return target * hits;
}, "evaluateNumbers");

// src/ViewModels/scoreElement.ts
var LabelState = {
  Normal: 0,
  Hovered: 1,
  HoveredOwned: 2,
  Reset: 3
};
var SmallStraight2 = 8;
var LargeStraight2 = 9;
var FullHouse = 10;
var emptyString = "";
var black = "black";
var ScoreElement = class {
  /** constructor ... called from DiceGame.buildScoreItems()
   * @param dice {Dice} Dice dependency injection
   * @param index {number} index of this instance
   * @param name {string} the name of this instance
   */
  constructor(index, name) {
    this.owner = null;
    this.scoringDiesetSum = 0;
    this.hasFiveOfaKind = false;
    this.available = false;
    this.owned = false;
    this.index = index;
    this.name = name;
    this.finalValue = 0;
    this.possibleValue = 0;
    this.scoringDieset = [0, 0, 0, 0, 0];
    on("ScoreButtonTouched", this.index.toString(), (_index) => {
      if (this.clicked()) {
        fire(`ScoreElementResetTurn`, "", null);
      }
    });
    on(`UpdateTooltip`, this.index.toString(), (data) => {
      let msg = "";
      let thisState = LabelState.Normal;
      if (data.hovered) {
        if (this.owned) {
          thisState = LabelState.HoveredOwned;
          msg = `${thisPlayer.playerName} owns ${this.name} with ${this.scoringDieset.toString()}`;
        } else {
          thisState = LabelState.Hovered;
          msg = `${this.name}`;
        }
      } else {
        thisState = LabelState.Reset;
        msg = "";
      }
      signals.fire(
        `UpdateText`,
        "infolabel",
        {
          border: false,
          fill: true,
          fillColor: "snow",
          fontColor: "black",
          text: msg
        }
      );
    });
  }
  /** broadcasts a message used to update the bottom infolabel element */
  updateInfo(text) {
    signals.fire(
      `UpdateText`,
      "infolabel",
      {
        border: false,
        fill: true,
        fillColor: "snow",
        fontColor: "black",
        text
      }
    );
  }
  /** sets a flag to indicate this score is owned by the current player */
  setOwned(value) {
    this.owned = value;
    if (this.owned) {
      this.owner = thisPlayer;
      this.updateScoreElement(this.owner.color, this.possibleValue.toString());
    } else {
      this.owner = null;
      this.updateScoreElement(black, emptyString);
    }
  }
  /** fires signal used to update the score value */
  renderValue(value) {
    fire(
      `UpdateScoreElement`,
      this.index.toString(),
      {
        index: this.index,
        renderAll: false,
        fillColor: this.owner ? this.owner.color : "black",
        value,
        available: this.available
      }
    );
  }
  /**  broadcasts a message used to update the score view element */
  updateScoreElement(color, value) {
    fire(
      `UpdateScoreElement`,
      this.index.toString(),
      {
        index: this.index,
        renderAll: true,
        fillColor: color || "black",
        value,
        available: this.available
      }
    );
  }
  /** sets a flag that determins if this scoreElement is available   
   * to be selected by the current player */
  setAvailable(value) {
    this.available = value;
    if (this.available) {
      if (this.possibleValue > 0) {
        this.renderValue(this.possibleValue.toString());
      }
    } else {
      if (this.owned) {
        this.renderValue(this.possibleValue.toString());
      }
      this.renderValue(this.possibleValue.toString());
    }
  }
  /** the clicked signal handler for this scoreElement.    
   * returns true if the click caused this score to be    
   * taken by the current player  */
  clicked() {
    if (toString() === "[0,0,0,0,0]")
      return false;
    let scoreTaken = false;
    if (!this.owned) {
      if (this.possibleValue === 0) {
        thisPlayer.lastScore = `sacrificed ${this.name} ${toString()}`;
        this.updateInfo(`${thisPlayer.playerName} ${thisPlayer.lastScore}`);
      } else {
        const wasItYou = thisPlayer.id === thisPlayer.id;
        const wasTaken = wasItYou ? "choose" : "took";
        thisPlayer.lastScore = `${wasTaken} ${this.name} ${toString()}`;
        this.updateInfo(`${wasItYou ? "You" : thisPlayer.playerName} ${thisPlayer.lastScore}`);
      }
      if (this.index === FiveOfaKindIndex) {
        if (isFiveOfaKind) {
          setfiveOfaKindBonusAllowed(true);
          Heehee();
        } else {
          setfiveOfaKindWasSacrificed(true);
          Dohh();
        }
      }
      this.setValue();
      scoreTaken = true;
    } else if (this.available) {
      thisPlayer.lastScore = `stole ${this.name} ${toString()} was: ${this.scoringDieset.toString()}`;
      this.updateInfo(`${thisPlayer.playerName} ${thisPlayer.lastScore}`);
      this.setOwned(false);
      Heehee();
      this.setValue();
      scoreTaken = true;
    }
    return scoreTaken;
  }
  /** sets the value of this scoreElement after taken by a player */
  setValue() {
    this.setOwned(true);
    const thisValue = this.possibleValue;
    this.finalValue = thisValue;
    this.scoringDiesetSum = 0;
    this.scoringDieset.forEach((_die, index) => {
      this.scoringDieset[index] = die[index].value;
      this.scoringDiesetSum += die[index].value;
    });
    if (isFiveOfaKind) {
      if (fiveOfaKindBonusAllowed) {
        setfiveOfaKindCount(fiveOfaKindCount + 1);
        if (this.index !== FiveOfaKindIndex) {
          this.finalValue += 100;
        }
        this.hasFiveOfaKind = true;
        Heehee();
      } else {
        this.hasFiveOfaKind = false;
        Cluck();
      }
    } else {
      this.hasFiveOfaKind = false;
      if (thisValue === 0) {
        Dohh();
      } else {
        Cluck();
      }
    }
  }
  // evaluates and displays a possible value for this scoreElement
  setPossible() {
    this.possibleValue = evaluate(this.index);
    if (!this.owned) {
      if (this.possibleValue === 0) {
        this.renderValue(emptyString);
      } else {
        this.renderValue(this.possibleValue.toString());
      }
      this.setAvailable(true);
    } else if (thisPlayer !== this.owner) {
      if (this.possibleValue > this.finalValue) {
        if (!this.hasFiveOfaKind) {
          this.setAvailable(true);
          this.renderValue(this.possibleValue.toString());
        }
      } else if (
        // less than current value
        (this.index === SmallStraight2 || this.index === LargeStraight2) && this.possibleValue === this.finalValue && this.possibleValue > 0 && this.scoringDiesetSum < sum
      ) {
        this.setAvailable(true);
        this.renderValue(this.possibleValue.toString());
      } else if (this.index === FullHouse && this.possibleValue === this.finalValue && this.scoringDiesetSum < sum) {
        this.setAvailable(true);
        this.renderValue(this.possibleValue.toString());
      }
    }
  }
  /** resets this scoreElement */
  reset() {
    this.setOwned(false);
    this.finalValue = 0;
    this.possibleValue = 0;
    this.updateScoreElement(black, emptyString);
    this.hasFiveOfaKind = false;
  }
  /** clears the possible value for this scoreElement */
  clearPossible() {
    this.possibleValue = 0;
    this.setAvailable(false);
    if (!this.owned) {
      this.finalValue = 0;
      this.renderValue(emptyString);
    } else {
      this.renderValue(this.finalValue.toString());
    }
  }
};
__name(ScoreElement, "ScoreElement");

// src/ViewModels/rollButton.ts
var thisID2 = "rollbutton";
var state2 = { text: "", color: "", enabled: true };
var init4 = /* @__PURE__ */ __name(() => {
  signals.on("ButtonTouched", thisID2, () => {
    roll(null);
    updateRollState();
  });
}, "init");
var updateRollState = /* @__PURE__ */ __name(() => {
  switch (rollCount) {
    case 1:
      state2.text = "Roll Again";
      break;
    case 2:
      state2.text = "Last Roll";
      break;
    case 3:
      state2.enabled = false;
      state2.text = "Select Score";
      break;
    default:
      state2.text = "Roll Dice";
      setRollCount(0);
  }
  update2();
}, "updateRollState");
var update2 = /* @__PURE__ */ __name(() => {
  signals.fire("UpdateButton", thisID2, state2);
}, "update");

// src/ViewModels/diceGame.ts
var SHORTCUT_GAMEOVER = false;
var appInstance;
var App = class {
  /** private singleton constructor, called from init() */
  constructor() {
    /** add a score value for this player */
    this.addScore = (value) => {
      thisPlayer.score += value;
      const text = thisPlayer.score + "";
      this.updatePlayer(thisPlayer.idx, thisPlayer.color, text);
    };
    /** broadcast an update message to the view element */
    this.updatePlayer = (index, color, text) => {
      fire("UpdatePlayer", index.toString(), {
        index,
        color,
        text
      });
    };
    this.scoreItems = [];
    this.leftBonus = 0;
    this.fiveOkindBonus = 0;
    this.leftTotal = 0;
    this.rightTotal = 0;
    init3();
    init4();
    init2();
    if (!this.isGameComplete()) {
      this.resetTurn();
    }
    signals.on(`PopupReset`, "", () => {
      this.resetGame();
    });
    on(`ScoreElementResetTurn`, "", () => {
      if (this.isGameComplete()) {
        this.clearPossibleScores();
        this.setLeftScores();
        this.setRightScores();
        this.showFinalScore();
      } else {
        this.resetTurn();
      }
    });
    signals.on("AddedView", "", (view) => {
      if (view.type === "ScoreButton") {
        this.scoreItems.push(new ScoreElement(view.index, view.name));
      }
    });
  }
  /** singleton initialization */
  static init() {
    if (!App._instance) {
      App._instance = new App();
      appInstance = App._instance;
    }
  }
  /** clear all scoreElements possible score value */
  clearPossibleScores() {
    for (const scoreItem of this.scoreItems) {
      scoreItem.clearPossible();
    }
  }
  /** evaluates the dice and then sets a possible score value for each scoreelements */
  evaluatePossibleScores() {
    for (const scoreItem of this.scoreItems) {
      scoreItem.setPossible();
    }
  }
  /** resets the turn by resetting values and state */
  resetTurn() {
    enabled(true);
    state2.color = thisPlayer.color;
    state2.enabled = true;
    state2.text = "Roll Dice";
    update2();
    resetTurn();
    this.clearPossibleScores();
    this.setLeftScores();
    this.setRightScores();
    setupHighScore();
  }
  /** resets game state to start a new game */
  resetGame() {
    signals.fire(`HidePopup`, "", null);
    resetGame();
    for (const scoreItem of this.scoreItems) {
      scoreItem.reset();
    }
    fire("UpdatePlayer", "1", {
      index: 0,
      color: "brown",
      text: ""
    });
    this.leftBonus = 0;
    this.fiveOkindBonus = 0;
    this.leftTotal = 0;
    this.rightTotal = 0;
    signals.fire(
      "UpdateText",
      "leftscore",
      {
        border: true,
        fill: true,
        fillColor: "grey",
        fontColor: "snow",
        text: "^ total = 0"
      }
    );
    setupHighScore();
    state2.color = "brown";
    state2.text = "Roll Dice";
    state2.enabled = true;
    update2();
  }
  /** show a popup with final score */
  showFinalScore() {
    const winMsg = [];
    Woohoo();
    winMsg.push("You won!");
    state2.color = "black";
    state2.text = winMsg[0];
    update2();
    this.updatePlayer(0, "snow", "");
    signals.fire(`UpdateText`, "infolabel", {
      border: false,
      fill: true,
      fillColor: "snow",
      fontColor: "black",
      text: winMsg[0] + " " + thisPlayer.score
    });
    if (thisPlayer.score > HighScore) {
      console.log("setting high score to ", thisPlayer.score);
      localStorage.setItem("highScore", JSON.stringify(thisPlayer.score));
      winMsg.push("You set a new high score!");
    }
    signals.fire("ShowPopup", "", { title: "Game Over!", msg: winMsg });
  }
  /** check all scoreElements to see if game is complete */
  isGameComplete() {
    if (SHORTCUT_GAMEOVER) {
      return true;
    } else {
      let result = true;
      for (const scoreItem of this.scoreItems) {
        if (!scoreItem.owned) {
          result = false;
        }
      }
      return result;
    }
  }
  /** sum and show left scoreElements total value */
  setLeftScores() {
    this.leftTotal = 0;
    thisPlayer.score = 0;
    let val;
    for (let i = 0; i < 6; i++) {
      val = this.scoreItems[i].finalValue;
      if (val > 0) {
        this.leftTotal += val;
        thisPlayer.score += val;
        const text = thisPlayer.score + "";
        this.updatePlayer(thisPlayer.idx, thisPlayer.color, text);
        if (this.scoreItems[i].hasFiveOfaKind && fiveOfaKindCount > 1) {
          this.addScore(100);
        }
      }
    }
    if (this.leftTotal > 62) {
      this.addScore(35);
      signals.fire(
        "UpdateText",
        "leftscore",
        {
          border: true,
          fill: true,
          fillColor: "grey",
          fontColor: "snow",
          text: `^ total = ${this.leftTotal.toString()} + 35`
        }
      );
    } else {
      signals.fire(
        "UpdateText",
        "leftscore",
        {
          border: true,
          fill: true,
          fillColor: "grey",
          fontColor: "snow",
          text: "^ total = " + this.leftTotal.toString()
        }
      );
    }
    if (this.leftTotal === 0) {
      signals.fire(
        "UpdateText",
        "leftscore",
        {
          border: true,
          fill: true,
          fillColor: "grey",
          fontColor: "snow",
          text: "^ total = 0"
        }
      );
    }
  }
  /** sum the values of the right scoreElements */
  setRightScores() {
    let val;
    const len = this.scoreItems.length;
    for (let i = 6; i < len; i++) {
      val = this.scoreItems[i].finalValue;
      if (val > 0) {
        const owner = this.scoreItems[i].owner;
        if (owner) {
          this.addScore(val);
          if (this.scoreItems[i].hasFiveOfaKind && fiveOfaKindCount > 1 && i !== FiveOfaKindIndex) {
            this.addScore(100);
          }
        }
      }
    }
  }
};
__name(App, "App");

// src/cfg.ts
var DIE_CFG = {
  size: { "width": 70, "height": 70 },
  radius: 10,
  color: "white"
};
var SCORE_CFG = {
  size: {
    "width": 95,
    "height": 75
  }
};
var PossibleColor = "cyan";
var row1Top = 160;
var row2Top = 245;
var row3Top = 330;
var row4Top = 415;
var col1Left = 10;
var col2Left = 85;
var col3Left = 200;
var col4Left = 275;
var dieTop = 80;
var cfg = {
  winCFG: {
    size: { width: 380, height: 525 },
    containerColor: "white",
    textColor: "black"
  },
  nodes: [
    {
      kind: "Text",
      id: "ScoreLabel",
      idx: 1,
      tabOrder: 0,
      location: { left: 5, top: 20 },
      size: { width: 100, height: 25 },
      text: "This Score",
      fontColor: "brown",
      hasBoarder: false,
      bind: true
    },
    {
      kind: "Text",
      id: "player1",
      idx: 1,
      tabOrder: 0,
      location: { left: 10, top: 40 },
      size: { width: 100, height: 25 },
      text: "0",
      fontColor: "brown",
      hasBoarder: false,
      bind: true
    },
    {
      kind: "Button",
      id: "rollbutton",
      idx: 0,
      tabOrder: 1,
      location: { left: 120, top: 20 },
      size: { width: 150, height: 50 },
      boarderWidth: 5,
      radius: 10,
      text: "Roll Dice"
    },
    {
      kind: "Text",
      id: "highScore",
      idx: -1,
      tabOrder: 0,
      location: { left: 280, top: 20 },
      size: { width: 100, height: 25 },
      text: "High Score",
      bind: true
    },
    {
      kind: "Text",
      id: "highScoreValue",
      idx: -1,
      tabOrder: 0,
      location: { left: 280, top: 40 },
      size: { width: 80, height: 25 },
      text: "250",
      hasBoarder: false,
      bind: true
    },
    {
      kind: "Die",
      id: "die0",
      idx: 0,
      tabOrder: 2,
      location: { left: 5, top: dieTop }
      //20
    },
    {
      kind: "Die",
      id: "die1",
      idx: 1,
      tabOrder: 3,
      location: { left: 80, top: dieTop }
      //100
    },
    {
      kind: "Die",
      id: "die2",
      idx: 2,
      tabOrder: 4,
      location: { left: 155, top: dieTop }
      //180
    },
    {
      kind: "Die",
      id: "die3",
      idx: 3,
      tabOrder: 5,
      location: { left: 230, top: dieTop }
      //260
    },
    {
      kind: "Die",
      id: "die4",
      idx: 4,
      tabOrder: 6,
      location: { left: 305, top: dieTop }
      //340
    },
    {
      kind: "ScoreButton",
      id: "ones",
      idx: 0,
      tabOrder: 7,
      location: { left: col1Left, top: row1Top },
      text: "Ones"
    },
    {
      kind: "ScoreButton",
      id: "twos",
      idx: 1,
      tabOrder: 8,
      location: { left: col2Left, top: row1Top },
      text: "Twos"
    },
    {
      kind: "ScoreButton",
      id: "threes",
      idx: 2,
      tabOrder: 9,
      location: { left: col1Left, top: row2Top },
      text: "Threes"
    },
    {
      kind: "ScoreButton",
      id: "fours",
      idx: 3,
      tabOrder: 10,
      location: { left: col2Left, top: row2Top },
      text: "Fours"
    },
    {
      kind: "ScoreButton",
      id: "fives",
      idx: 4,
      tabOrder: 11,
      location: { left: col1Left, top: row3Top },
      text: "Fives"
    },
    {
      kind: "ScoreButton",
      id: "sixes",
      idx: 5,
      tabOrder: 12,
      location: { left: col2Left, top: row3Top },
      text: "Sixes"
    },
    {
      kind: "ScoreButton",
      id: "three-o-kind",
      idx: 6,
      tabOrder: 13,
      location: { left: col3Left, top: row1Top },
      text: "Three O-Kind"
    },
    {
      kind: "ScoreButton",
      id: "four-o-kind",
      idx: 7,
      tabOrder: 14,
      location: { left: col4Left, top: row1Top },
      text: "Four O-Kind"
    },
    {
      kind: "ScoreButton",
      id: "small-straight",
      idx: 8,
      tabOrder: 15,
      location: { left: col3Left, top: row2Top },
      text: "Small Straight"
    },
    {
      kind: "ScoreButton",
      id: "large-straight",
      idx: 9,
      tabOrder: 16,
      location: { left: col4Left, top: row2Top },
      text: "Large Straight"
    },
    {
      kind: "ScoreButton",
      id: "full-house",
      idx: 10,
      tabOrder: 17,
      location: { left: col3Left, top: row3Top },
      text: "Full House"
    },
    {
      kind: "ScoreButton",
      id: "five-o-kind",
      idx: 11,
      tabOrder: 18,
      location: { left: col4Left, top: row3Top },
      text: "Five O-Kind"
    },
    {
      kind: "ScoreButton",
      id: "chance",
      idx: 12,
      tabOrder: 19,
      location: { left: col3Left, top: row4Top },
      text: "Chance"
    },
    {
      kind: "Text",
      id: "leftscore",
      idx: -1,
      tabOrder: 0,
      location: { left: col1Left, top: row4Top },
      size: { width: 180, height: 75 },
      text: "^ total = 0",
      fontColor: "black",
      bind: true,
      hasBoarder: true
    },
    {
      kind: "Text",
      id: "infolabel",
      idx: -1,
      tabOrder: 0,
      location: { left: 10, top: row4Top + 80 },
      size: { width: 360, height: 25 },
      text: "123456",
      bind: true
    },
    {
      kind: "Popup",
      id: "popup",
      idx: 0,
      tabOrder: 0,
      location: { left: 20, top: 100 },
      size: { width: 350, height: 350 },
      fontSize: 24,
      text: ""
    }
  ]
};

// src/Views/Die.ts
var Die_exports = {};
__export(Die_exports, {
  default: () => Die
});

// src/ViewModels/dieFactory.ts
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
  const left4 = quarter;
  const top3 = quarter;
  const right = quarter * 3;
  const bottom = quarter * 3;
  const dotSize = size / 12;
  const doDot = drawDot;
  if (dieValue === 1) {
    doDot(ctx2, middle, center, dotSize);
  } else if (dieValue === 2) {
    doDot(ctx2, top3, left4, dotSize);
    doDot(ctx2, bottom, right, dotSize);
  } else if (dieValue === 3) {
    drawDot(ctx2, top3, left4, dotSize);
    drawDot(ctx2, middle, center, dotSize);
    drawDot(ctx2, bottom, right, dotSize);
  } else if (dieValue === 4) {
    drawDot(ctx2, top3, left4, dotSize);
    drawDot(ctx2, top3, right, dotSize);
    drawDot(ctx2, bottom, left4, dotSize);
    drawDot(ctx2, bottom, right, dotSize);
  } else if (dieValue === 5) {
    drawDot(ctx2, top3, left4, dotSize);
    drawDot(ctx2, top3, right, dotSize);
    drawDot(ctx2, middle, center, dotSize);
    drawDot(ctx2, bottom, left4, dotSize);
    drawDot(ctx2, bottom, right, dotSize);
  } else if (dieValue === 6) {
    drawDot(ctx2, top3, left4, dotSize);
    drawDot(ctx2, top3, right, dotSize);
    drawDot(ctx2, middle, left4, dotSize);
    drawDot(ctx2, middle, right, dotSize);
    drawDot(ctx2, bottom, left4, dotSize);
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

// src/Views/Die.ts
var needToBuild = true;
var Die = class {
  /** ctor that instantiates a new vitual Die view  and faces*/
  constructor(el) {
    this.id = 0;
    // assigned by activeViews.add()    
    this.index = 0;
    this.activeView = true;
    this.zOrder = 0;
    this.tabOrder = 0;
    this.enabled = true;
    this.hovered = false;
    this.focused = false;
    this.frozen = false;
    this.value = 0;
    if (needToBuild) {
      const { faces, frozenFaces } = buildDieFaces();
      Die.faces = faces;
      Die.frozenFaces = frozenFaces;
      needToBuild = false;
    }
    this.index = el.idx;
    this.tabOrder = el.tabOrder || 0;
    this.name = el.id;
    this.enabled = true;
    this.size = DIE_CFG.size;
    this.width = this.size.width;
    this.height = this.size.height;
    this.location = el.location;
    this.top = el.location.top;
    this.left = el.location.left;
    this.color = "transparent";
    this.path = this.buildPath(DIE_CFG.radius);
    this.render();
    on("UpdateDie", this.index.toString(), (data) => {
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
    fire(`DieTouched`, "", { index: this.index });
  }
  update() {
    this.render();
  }
  render() {
    ctx.save();
    const image = this.frozen ? Die.frozenFaces[this.value] : Die.faces[this.value];
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
__name(Die, "Die");
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

// src/Views/Popup.ts
var Popup_exports2 = {};
__export(Popup_exports2, {
  default: () => Popup2
});
var left3 = 1;
var top2 = 1;
var Popup2 = class {
  /** ctor that instantiates a new vitual Popup view */
  constructor(el) {
    this.id = 0;
    // assigned by activeViews.add() 
    this.index = -1;
    this.activeView = true;
    this.zOrder = 0;
    this.tabOrder = 0;
    this.name = "";
    this.enabled = true;
    this.hovered = false;
    this.focused = false;
    this.color = "black";
    this.text = [""];
    this.title = "";
    this.textAlign = "center";
    this.visible = true;
    this.buffer = null;
    this.fontSize = 28;
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
    left3 = this.location.left;
    top2 = this.location.top;
    this.path = this.shownPath;
    this.visible = true;
    this.saveScreenToBuffer();
    setHasVisiblePopup(true);
    this.render();
  }
  /** hide the virtual Popup view */
  hide() {
    if (this.visible) {
      left3 = 1;
      top2 = 1;
      this.path = this.hiddenPath;
      this.restoreScreenFromBuffer();
      this.visible = false;
      setHasVisiblePopup(false);
    }
  }
  /** takes a snapshot of our current canvas bitmap */
  saveScreenToBuffer() {
    const { left: left4, top: top3 } = this.location;
    const { width, height } = this.size;
    console.log(`Buffer = left:${left4}, top:${top3}, width:${width}, height:${height}`);
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
    if (this.visible)
      this.render();
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
    ctx.strokeText(this.title + " ", left3 + 175, top2 + 100);
    let txtTop = top2 + 100;
    this.text.forEach((str) => {
      ctx.strokeText(str + " ", left3 + 175, txtTop += 50);
    });
    ctx.restore();
    this.visible = true;
  }
};
__name(Popup2, "Popup");

// src/Views/ScoreButton.ts
var ScoreButton_exports = {};
__export(ScoreButton_exports, {
  default: () => ScoreButton
});

// src/ViewModels/pathFactory.ts
function buildRightScore(location, size2) {
  const { left: left4, right, top: top3, bottom, width, height, radius } = getPathGeometry(location, size2);
  const halfWidth = left4 + width * 0.3;
  const halfHeight = top3 + height * 0.5 + 5;
  const p = new Path2D();
  p.moveTo(halfWidth + radius, top3);
  p.arcTo(right, top3, right, top3 + radius, radius);
  p.arcTo(right, bottom, right - radius, bottom, radius);
  p.arcTo(left4, bottom, left4, bottom - radius, radius);
  p.arcTo(left4, halfHeight, left4 + radius, halfHeight, radius);
  p.arcTo(halfWidth, halfHeight, halfWidth, halfHeight - radius, radius);
  p.arcTo(halfWidth, top3, halfWidth + radius, top3, radius);
  return p;
}
__name(buildRightScore, "buildRightScore");
function buildLeftScore(location, size2) {
  const { left: left4, right, top: top3, bottom, width, height, radius } = getPathGeometry(location, size2);
  const halfWidth = left4 + width * 0.7;
  const halfHeight = top3 + height * 0.5 - 5;
  const p = new Path2D();
  p.moveTo(left4 + radius, top3);
  p.arcTo(right, top3, right, top3 + radius, radius);
  p.arcTo(right, halfHeight, right - radius, halfHeight, radius);
  p.arcTo(halfWidth, halfHeight, halfWidth, halfHeight + radius, radius);
  p.arcTo(halfWidth, bottom, halfWidth - radius, bottom, radius);
  p.arcTo(left4, bottom, left4, bottom - radius, radius);
  p.arcTo(left4, top3, left4 + radius, top3, radius);
  return p;
}
__name(buildLeftScore, "buildLeftScore");
var getPathGeometry = /* @__PURE__ */ __name((location, size2, radius = 10) => {
  const { left: left4, top: top3 } = location;
  const { width, height } = size2;
  return {
    left: left4,
    right: left4 + width,
    top: top3,
    bottom: top3 + height,
    width,
    height,
    radius
  };
}, "getPathGeometry");

// src/Views/ScoreButton.ts
var ScoreButton = class {
  /** Creates an instance of a virtual ScoreButton. */
  constructor(el) {
    this.id = 0;
    // assigned by activeViews.add()   
    this.zOrder = 0;
    this.tabOrder = 0;
    this.activeView = true;
    this.enabled = true;
    this.hovered = false;
    this.focused = false;
    this.path = new Path2D();
    this.color = "black";
    this.scoreText = "";
    this.available = false;
    this.tooltip = "";
    this.upperText = "";
    this.lowerText = "";
    this.upperName = null;
    this.lowerName = null;
    this.scoreBox = null;
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
    on(
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
    const { left: left4, top: top3 } = s.location;
    if (this.isLeftHanded) {
      s.path = buildRightScore(s.location, s.size);
      s.upperName = new Text_exports.default({
        kind: "text",
        idx: -1,
        tabOrder: 0,
        id: s.name + "-upperText",
        text: s.upperText,
        location: { left: left4 + 40, top: top3 + 10 },
        size: { width: 55, height: 30 },
        color: s.color,
        bind: false
      });
      s.lowerName = new Text_exports.default({
        kind: "text",
        idx: -1,
        tabOrder: 0,
        id: s.name + "-lowerText",
        text: s.lowerText,
        location: { left: left4 + 40, top: top3 + 40 },
        size: { width: 55, height: 30 },
        color: s.color,
        bind: false
      });
      s.scoreBox = new Text_exports.default({
        kind: "text",
        idx: -1,
        tabOrder: 0,
        id: s.name + "-score",
        text: "",
        location: { left: left4 + 5, top: top3 + 50 },
        size: { width: 24, height: 24 },
        color: s.color,
        padding: 10,
        bind: false
      });
    } else {
      s.path = buildLeftScore(s.location, s.size);
      s.upperName = new Text_exports.default({
        kind: "text",
        idx: -1,
        tabOrder: 0,
        id: s.name + "-upperText",
        text: s.upperText,
        location: { left: left4 + 10, top: top3 + 10 },
        size: { width: 55, height: 30 },
        color: s.color,
        bind: false
      });
      s.lowerName = new Text_exports.default({
        kind: "text",
        idx: -1,
        tabOrder: 0,
        id: s.name + "-lowerText",
        text: s.lowerText,
        location: { left: left4 + 10, top: top3 + 40 },
        size: { width: 55, height: 30 },
        color: s.color,
        bind: false
      });
      s.scoreBox = new Text_exports.default({
        kind: "text",
        idx: -1,
        tabOrder: 0,
        id: s.name + "-score",
        text: "",
        location: { left: left4 + 70, top: top3 + 3 },
        size: { width: 24, height: 24 },
        color: s.color,
        padding: 10,
        bind: false
      });
    }
  }
  /** called from Surface/canvasEvents when this element has been touched */
  touched() {
    fire("ScoreButtonTouched", this.index.toString(), this.index);
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
__name(ScoreButton, "ScoreButton");

// src/view_manifest.ts
var manifest = {
  Views: {
    "./Views/Die.ts": Die_exports,
    "./Views/Popup.ts": Popup_exports2,
    "./Views/ScoreButton.ts": ScoreButton_exports
  },
  baseUrl: import.meta.url
};
var view_manifest_default = manifest;

// src/main.ts
var diceSignals = buildSignalAggregator();
var { on, fire } = diceSignals;
initCloseButton("closebutton");
var AudioContext = globalThis.AudioContext;
var context2 = new AudioContext();
init(context2);
var cannvy = document.getElementById("surface");
containerInit(
  cannvy,
  cfg,
  view_manifest_default
);
App.init();
hydrateUI();
var thisPlayer = {
  id: "1",
  idx: 0,
  playerName: "Score:",
  color: "brown",
  score: 0,
  lastScore: ""
};
appInstance.resetTurn();
render();
export {
  fire,
  on,
  thisPlayer
};
