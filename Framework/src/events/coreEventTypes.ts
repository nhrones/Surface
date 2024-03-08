// deno-lint-ignore-file no-explicit-any

import { TextLine } from "../types.ts";

/** 
 * Named Signal types    
 * Each signal-type \<name\> is unique    
 * Each signal-type registers a payload-type 
 * This payload-type is type-checked when coding event-handles or fire-signals
 */
export type CoreEvents = {
   
   /*======= System Signals =======*/

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
};