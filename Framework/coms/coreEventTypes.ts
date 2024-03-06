// deno-lint-ignore-file no-explicit-any

import { TextLine } from "../types.ts";

/** 
 * Named Event types    
 * Each event-type \<name\> is unique    
 * Each event-type registers a payload-type 
 * This payload-type is type-checked when coding event-handles or fire-events
 */
export type CoreEvents = {
   
   /*======= System Events =======*/

   /** Focused state-changed event */
   Focused: boolean,

   /** View was added event */
   AddedView: {
      type: string,
      index: number,
      name: string
   },

   /** Delete Row */
   DeleteRow: {index: number},
   
   /** hide \<Popup\> command event */
   HidePopup: null,
   
   /** PopupReset */
   PopupReset: null,
   
   /** \<Popup\> view focus command event */
   FocusPopup: any,
   
   /** Show \<Popup\> view event */
   ShowPopup: {
      title: string,
      msg: string
   },
   
   /** Window Input event */
   WindowInput: any //HACK WindowInputEvent,

   /** Window KeyDown event */
   WindowKeyDown: any //HACK WindowKeyboardEvent,
     
   /*======= Base Events =======*/
   
   /** \<Button\> view touched event */
   ButtonTouched: null,
   
   /** CheckBox Touched */
   CheckBoxTouched:  {checked: boolean},

   /** Text Metrics update event */
   TextMetrics: {
      size: any, //HACK Size,
      capacity: {
         rows: number,
         columns: number
      }
   },

   /** Update \<Text\> view touched event */
   TextViewTouched: null,

   /** Update \<Button\> view event */
   UpdateButton: {
      text: string,
      color: string,
      enabled: boolean
   },

   /** Update \<CheckBox\> view event */
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
   
   /** update a \<TextArea\> view event */
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

   /** update a \<TextBox\> view event */
   UpdateTextBox: {
      viewport: string,
      viewportStart: number
      focused: boolean,
      insertionColumn: number,
      selectStart: number,
      selectEnd: number,
   },

   /** update static \<Text\> view event */
   UpdateText: {
      border: boolean,
      fill: boolean,
      fillColor: string,
      fontColor: string,
      text: string
   }
   
   /** mouse Scroll event */
   Scroll: { deltaY: number }
};