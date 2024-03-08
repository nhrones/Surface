
export type DieIndex = 0 | 1 | 2 | 3 | 4 | 5
export type Size = {width:number, height: number}

/** 
 * Named Signal types    
 * Each signal-type \<name\> is unique    
 * Each signal-type registers a payload-type 
 * This payload-type is type-checked when coding eventhandles or fire-signals
 */
export type DiceSignals = {
   
   /** Button touched signal */
   ButtonTouched: null,

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