// deno-lint-ignore-file no-explicit-any
export type DieIndex = 0 | 1 | 2 | 3 | 4 | 5
export type Size = {width:number, height: number}
import { TextLine } from "../types.ts";

/** 
 * Named Signal types    
 * Each signal-type \<name\> is unique    
 * Each signal-type registers a payload-type 
 * This payload-type is type-checked when coding event-handles or fire-signals
 */
export type CoreEvents = {
   
   /*======= System Signals =======*/

   /** a caret blink signal */
   Blink: boolean,

   /** Focused state-changed signal */
   Focused: boolean,

   /** View was added signal */
   AddedView: {
      type: string,
      index: number,
      name: string
   },

   /** Delete Row */
   DeleteRow: {index: number},
   
   /** hide \<Popup\> command signal */
   HidePopup: null,
   
   /** PopupReset */
   PopupReset: null,
   
   /** \<Popup\> view focus command signal */
   FocusPopup: any,
   
   /** Show \<Popup\> view signal */
   ShowPopup: {
      title: string,
      msg: string[]
   },
   
   /** Window Input signal */
   WindowInput: InputEvent,

   /** Window KeyDown signal */
   WindowKeyDown: KeyboardEvent,
     
   /*======= Base Events =======*/
   
   /** \<Button\> view touched signal */
   ButtonTouched: null,
   
   /** CheckBox Touched */
   CheckBoxTouched: { checked: boolean },

   /** Text Metrics update signal */
   TextMetrics: {
      size: {width: number, height: number},
      capacity: {
         rows: number,
         columns: number
      }
   },

   /** Update \<Text\> view touched signal */
   TextViewTouched: null,

   /** Update \<Button\> view signal */
   UpdateButton: {
      text: string,
      color: string,
      enabled: boolean
   },

   /** Update \<CheckBox\> view signal */
   UpdateCheckBox: {
      text: string,
      color: string,
      checked: boolean
   },
   
   UpdateLabel: {
      state: number
      color: string,
      textColor: string,
      text: string
   }
   
   /** update a \<TextArea\> view signal */
   UpdateTextArea: {
      reason: string
      text: string
      lines: TextLine[],
      focused: boolean,
      insertionColumn: number,
      insertionRow?: number,
      selectStart: number,
      selectEnd: number,
   },

   /** update a \<TextBox\> view signal */
   UpdateTextBox: {
      viewport: string,
      viewportStart: number
      focused: boolean,
      insertionColumn: number,
      selectStart: number,
      selectEnd: number,
   },

   /** update static \<Text\> view signal */
   UpdateText: {
      border: boolean,
      fill: boolean,
      fillColor: string,
      fontColor: string,
      text: string
   }
   
   /** mouse Scroll signal */
   Scroll: { deltaY: number }

   /**===================================================
    * Dice Game Signals
    =====================================================*/

   /** Die Touched signal */
   DieTouched: { index: DieIndex },
   
   /** \<ScoreButton\> touched-signal */
   ScoreButtonTouched: number,

   /** \<ScoreElement\> Reset-Turn signal */
   ScoreElementResetTurn: null,

   /** fire message signal */
   //fire: null,

   /** Update \<Die\> view signal */
   UpdateDie: {
      index: number,
      value: number,
      frozen: boolean
   },

   /** Update \<Player\> view signal */
   UpdatePlayer: {
      index: number,
      color: string,
      text: string
   },

   /** Update \<RollButton\> view signal */
   UpdateRoll: string,

   /** Update \<Player\> view signal */
   UpdateScore: number,

   /** update a \<ScoreElement\> view signal */
   UpdateScoreElement: {
      index: number,
      renderAll: boolean,
      fillColor: string,
      value: string,
      available: boolean
   },

   /** update \<Tooltip\> view signal */
   UpdateTooltip: {
      index: number,
      hovered: boolean
   },
};