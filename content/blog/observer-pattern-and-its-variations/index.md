---
title: Observer pattern and its variations
date: '2020-12-28T22:12:03.284Z'
description: Distill observer pattern and compare its usages
keywords: programming, design pattern, nodejs, javascript, rxjs
featured: ./observer.png
---

In functional programming, there are two important concepts: composition and asynchronous flow. Observer pattern, I figured, is the best pattern to describe the asynchronous flow in functional programming. When I tried to learn the pattern, it was a bit difficult to grasp the concept because diferrent materials use different terminologies. Thus in this post, I aim to unify and give you the essence of the pattern, then compare its uages in a number of javascript implementations. 

### What is observer pattern about ?

The pattern, by its name, is a style of programming in which an application subscribe to a certain event of a subject. When the event happens, the subject will notify all subscribers. Each subscriber can then process the data from the subject based on its needs. 

![Observer pattern](./observer.png)

There a two main component in the picture: `Subject` and `Listener`, or `Observerable` and `observer` as called in [Rxjs](http://reactivex.io/). The observable can be seen as a wrapper for some asynchronous operations that may have an stream of data. What observable does is encapsulate that data let all observers knows when the data is ready. Observable has an interface i.e. `subscribe` or `on` to let observers register their handlers. 

### Event Emitter
Let us see an example using `Event Emitter` from Nodejs and implement observer pattern for a file reading action.
```js
    const events = require('events');
    const fs = require('fs');
    ...
    function readFileEvent(fileName) {
        // create new emitter instance
        const emitter = new events.EventEmitter();
        // asynchronous action
        fs.readFile(fileName, 'utf8', (error, data) => {
            if(error) {
                emitter.emit('error', error);
            }
            emitter.emit('data', data);
        });
        return emitter;
    }
```
The key thing to notice here is how `readFileEvent` create a wrapper i.e. event emitter around the asynchronous `fs.readFile` method. The wrapper in this case is the `Subject` or `Observerable`. Any client that use `readFileEvent` can later subscribe to `error` or `data` events from the wrapper.
```js
    const dataReader = readFileEvent('.\\bookings.json');
    const bookingSummaryListener = dataReader.on('data', renderData);
    const logListener = dataReader.on('error', logError);
```

As we can see here, a subject can be subscribed from many different listeners. In the example two listeners subscribe to different events on the subject. This is the true power of observer pattern, it wraps an asynchronous action and notify all listeners when certain events happen. 

### Promise

Most of the usecases in asynchronous flow require only success and failure events. The `Promise` object in javascript is built to fullfill that usecase. For the same example, we can update the implementation using `Promise`
```js
```

### RxJs