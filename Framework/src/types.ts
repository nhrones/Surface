// deno-lint-ignore-file no-explicit-any

export const DEBUG = true

type PrimitiveType = string | number | boolean | symbol;
type ValueType = PrimitiveType | ObjectType | ArrayType;
type ObjectType = Record<string, undefined>;
type ArrayType = PrimitiveType[] | ObjectType[];

export type Point = number | { row: number, col: number };

export type TextLine = {
   index: number
   text: string
   start: number
   end: number
   length: number
   hasSelection: boolean
};

export type payload = ValueType;

export type callbackFunction = (arg0: ValueType) => void;

/** 
 * strongly-typed index values for 5 die 0-4
 */
export type DieIndex = 0 | 1 | 2 | 3 | 4;

/** 
 * type for generic Event-Handler callbacks 
 */
export type EventHandler<T = any> = (data: T) => void;

/** 
 * validate each Event Types callback parameters 
 */
export type EventContract<T> = { [K in keyof T]: T[K] }

/** 
 * An SignalBroker interface with typed signals and callbacks 
 */
export interface SignalBroker<T extends EventContract<T>> {
   /** 
    * Registers a handler function to be executed when a signal is fired
    */
   on<K extends keyof T>(signal: K, id: string, handler: EventHandler<T[K]>): void,

   /** 
    * Fire a specific named signal with an appropriate payload 
    * and execute all registered handlers for a named signal.
    */
   fire<K extends keyof T>(signal: K, id: string, args: T[K]): void
}



/** 
 * manifest interface 
 */
export interface Manifest {
   Views: Record<string, any>[];
   baseUrl: string;
}


/** 
 * View interface 
 */
export interface View {
   activeView: boolean
   index: number
   tabOrder: number
   zOrder: number
   name: string
   size: Size
   location: Location
   enabled: boolean
   hovered: boolean
   focused: boolean
   path: Path2D
   radius?: number
   textAlign?: string
   update(): void
   render(): void
   touched(): void
}

/** 
 * Size Type 
 */
type Size = {
   width: number
   height: number
}

/**
 *  Location type
 */
export type Location = {
   left: number
   top: number
}

export type TextBaseline = "top" | "middle" | "bottom" | "hanging" | "alphabetic" | "ideographic"
export type TextLocation = "top" | "middle" | "bottom"
export type TextAlign = "center" | "left" | "right" | "start" | "end"
/**
 *  A type used to describe an `ActiveNode` object 
 */
export type ElementDescriptor = {
   kind: string
   id: string
   idx: number
   tabOrder: number
   location: Location
   size?: Size
   radius?: number
   text?: string
   textAlign?: TextAlign
   textBaseline?: TextBaseline
   TextLocation?:TextLocation
   fontSize?: number
   color?: string
   fontColor?: string
   padding?: number
   boarderWidth?: number
   bind?: boolean
   multiLine?: boolean
   hasBoarder?: boolean
   fill?: boolean
}

/**
 *  Window configuration type
 */
export type WinCFG = {
   size: Size,
   containerColor: string,
   textColor: string,
}

/**
 *  Configuration File Type
 */
export type Configuration = {
   winCFG: WinCFG
   nodes: ElementDescriptor[]
}

/**
 *  Editor Type
 */
export type Editor = {
   containerSize: { width: number, height: number }
   focused: boolean,
   fullText: string,
   hasText: () => boolean,
   id: string,
   //insertChar: (char: string) => void,
   insertionColumn: number,
   insertionIndex: number,
   insertionRow?: number,
   lastLineIndex: () => number,
   lines: TextLine[],
   refreshLines: (inserAt?: string) => void,
   resetSelectionState: () => void,
   rowCapacity: number
   selectStart: number,
   selectStartRow?: number,
   selecting: boolean,
   selectEnd: number,
   selectEndRow?: number,
   testForSelection: (line: TextLine) => void,
   textCapacity: number,
   updateInsertionPoint: (from: string, inserAt: string) => void
   updateText: (id: string, focused: boolean, reason: string) => void
   viewportStart?: number,
}

// /**
//  * Scrollbar
//  */
// type ScrollbarType = {
//    host: ScrollableContainer,
//    render(top: number, ItemsLength: number, capacity: number): void,
//    scroll( ScrollY: number ): void
// }

// /**
//  * Scrollable Container
//  */
// export type ScrollableContainer = {
//    scrollBar: ScrollbarType
//    scrollBarWidth: number, 
//    size: { height: number, width: number}, 
//    location: { top: number, left: number}
//    name: string
//    render(top: number): void    
// }
