## EDA 
Event Driven Architecture - This is designing a system so that it reacts to events rather than chaining together processes directly. It is important that the event-triggering mechanism supports multiple subscribers, such as leveraging a publish and subscribe pattern.

## Event Bus
An event bus is the service that takes the events from the producer and makes them available to the subscribers.

## Producer
This is the service or system that adds events to the Event Bus. It is also known as a publisher or source.

## Consumer
This is the service or system that receives or retrieves the events from the Event Bus. It is also known as a listener, subscriber, client, sink, or target.  There can be many subscribers per producer.   


# What Is An Event Bus?

EventBus allows publish-subscribe-style communication between components without requiring the components to explicitly register with one another (and thus be aware of each other). 

```
An Eventbus is a mechanism that allows different components to communicate with each other without knowing about each other. A component can send an Event to the Eventbus without knowing who will pick it up or how many others will pick it up. Components can also listen to Events on an Eventbus, without knowing who sent the Events. That way, components can communicate without depending on each other. Also, it is very easy to substitute a component. As long as the new component understands the Events that are being sent and received, the other components will never know.
```
Events are defined as types, instead of as members in some class or as string IDs. (Event Type is a Filter)

Built-in support for targeting events to specific objects.

With targeted events, objects can raise events that are meant to be heard by a specific target object (targetID).

You can raise non-targeted events by providing an empty string for the targetID parameter of the on, and fire methods.

This pattern allows you to have objects communicate with each other in a very decoupled way. If no one is listening for the targetID, the event is ignored.

Any listeners that don't specify a targetID will simply get all events for that event-type.

Abstracting behavior to reflect only receivable events, components can be free of needing to know the internals of other objects and can rely on the event bus to transmit intent across the application. 

The event bus works by registering a handler for a given event, and then emitting events on the bus in response to interactions with the application or transmitting results from service layer components. In this way, additional behavior can be added into an application by registering another event handler to the event bus. 

The sender of events is neatly abstracted away from receiver, reducing coupling between components.

The serialization of tasks is limited to the tasks in a single dispatch queue.
Serial dispatch queues run their tasks in a first-in-first-out (FIFO) fashion. 