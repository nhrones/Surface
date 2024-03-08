
import type {CoreEvents} from './coreEventTypes.ts'
import type { SignalBroker, EventContract, EventHandler } from '../types.ts'


/** 
 * We use this factory function to create a new SignalBroker service.      
 * You can use intersection types for the generic type:     
 * @example buildSignalBroker<CoreEvents & LocalEvents>()
 */
export const signals = buildSignalBroker<CoreEvents>()

/** 
 * A factory function that returns a generic strongly-typed SignalBroker instance 
 * @typeParam T - type that extends EventContract\<T\>
 * @returns SignalBroker<T> - a strongly-typed SignalBroker object with the following two methods:   
 * @method on - registers a callback function to be called when the named signal is fired. 
 * @method fire - fires (emmits) the signal, triggering the execution of registered callbacks. 
 */
export function buildSignalBroker<T extends EventContract<T>>(): SignalBroker<T> {

   /** 
    * holds an array of eventhandler for each registered signal name 
    */
   const eventHandlers: Map<string, EventHandler[]> = new Map()

   const newSignalBroker: SignalBroker<T> = {

      /** 
       * on - registers a handler function to be executed when a signal is sent
       *  
       * @param {T} signalName - signal name (one of `TypedEvents` only)!
       * @param {string} id - id of a target element (may be an empty string)
       * @param {Handler} handler - eventhandler callback function
       */
      on<SignalName extends keyof T>(
         signalName: SignalName,
         id: string,
         handler: EventHandler<T[SignalName]>
      ): void {
         // create a keyName that combines the signalName and the target element id (if any)
         const keyName = signalName as string + '-' + id

         // if this keyName has already been registered
         if (eventHandlers.has(keyName)) {
            const handlers = eventHandlers.get(keyName)!
            // push this new handler to it. 
            handlers.push(handler)
         } else {  // keyName has yet to be registered
            // when first seen - create it with this handler
            eventHandlers.set(keyName, [handler])
         }

      },

      /** 
       * Execute all registered handlers for a typed signal (signalName)
       * @param {key} signalName - signal name - one of `TypedEvents` only!
       * @param {string} id - id of a target element (may be an empty string)
       * @param {TypedEvents[key]} data - data payload, typed for this category of signal
       */
      fire<SignalName extends keyof T>(
         signalName: SignalName,
         id: string,
         data: T[SignalName]
      ): void {
         // create a keyName that combines the signalName and the target element id (if any)
         const keyName = signalName as string + '-' + id

         // check for any registered handlers for this unique keyName
         const handlers = eventHandlers!.get(keyName);
         if (handlers) {
            // callback all registered handlers with any data payload
            for (const handler of handlers) {
               // call it!
               handler(data)
            }
         }
      }
      
   }
   return newSignalBroker
}
