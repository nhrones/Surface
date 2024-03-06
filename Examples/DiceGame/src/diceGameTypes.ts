
export type DieIndex = 0 | 1 | 2 | 3 | 4 | 5
export type Size = {width:number, height: number}

/** 
 * Named Event types    
 * Each event-type \<name\> is unique    
 * Each event-type registers a payload-type 
 * This payload-type is type-checked when coding event-handles or fire-events
 */
export type DiceEvents = {
   
   /** Button touched event */
   ButtonTouched: null,

   /** Die Touched event */
   DieTouched: { index: DieIndex },
   
   /** \<ScoreButton\> touched-event */
   ScoreButtonTouched: number,

   /** \<ScoreElement\> Reset-Turn event */
   ScoreElementResetTurn: null,

   /** fire message event */
   //fire: null,

   /** Update \<Die\> view event */
   UpdateDie: {
      index: number,
      value: number,
      frozen: boolean
   },

   /** Update \<Player\> view event */
   UpdatePlayer: {
      index: number,
      color: string,
      text: string
   },

   /** Update \<RollButton\> view event */
   UpdateRoll: string,

   /** Update \<Player\> view event */
   UpdateScore: number,

   /** update a \<ScoreElement\> view event */
   UpdateScoreElement: {
      index: number,
      renderAll: boolean,
      fillColor: string,
      value: string,
      available: boolean
   },

   // UpdateLabel: {
   //    state: number
   //    color: string,
   //    textColor: string,
   //    text: string
   // }

   /** update \<Tooltip\> view event */
   UpdateTooltip: {
      index: number,
      hovered: boolean
   },
};