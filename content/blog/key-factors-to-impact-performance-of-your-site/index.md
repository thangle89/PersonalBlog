---
title: Key factors to impact performance of your site
date: "2020-06-20T22:12:03.284Z"
description: "A guide to understand how browsers manage its contents, running scripts and some tips to improve performances of websites"
---
***

At times you can heard people say ***"browsers can only run synchronous actions"***, some can say ***"browsers can run asynchronous Javascript"***, which is correct ?? If both are true, how do they all fit together ? 

In this article, besides trying to answer those questions, I also believe that if you can understand the way browsers work and how it run Javascript code, you can improve performance of many parts on your site.

### 1. General Flow

![Network overivew](./network-overview.png) 

As we see in the image [*(taken from MDN)*](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Client-Server_overview), when browsers need to display a website, it first need to download resources (usually html file, but can also be pdf, images,..etc) via HTTP requests and then display the content on clientside. Every part of the flow can affect performance of a website but in this article, we will be focus more on the clientside of the flow. Let's examine what happen inside browsers when it get a HTML page response from server.

### 2. Browser components

In short, when browsers get content from network requests, they render and display it on computer screen. To understand the rendering process in details, we need to know about what browsers are made of:

![Browser components](./browser-components.png) 
[*img source*](https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/)

***User Interface:*** its main purpose is to display the content of a site, and also contains all the features that help user interact with browsers, e.g. input URL, save history...etc.

***Browser engine, UI backend and rendering engine:*** responsible for parsing Html and css and displaying on users' screen.

***Javascript interpreter:*** parse and execute Javascript code.

***Networking:*** sending HTTP requests and get response from network.

***Data Persistence:*** is where browsers store cookies, localStorage, sessionStorage...

Browser engines and Javascript interpreter share the same thread and follows synchronous model, which means when browsers parsing the HTML it cannot execute scripts and vice versa. However, the networking component usually has 2-6 threads (depends on browsers), that's why it can send 2-6 HTTP requests in parallel. In short, **browsers can only run synchronous actions except when sending HTTP requests**. We will explore the Javascript intepreter in details to understand how it can run asynchronous actions. 

### 3.Javascript interpreter

![JS interpreter](./js-runtime.png) 

The original image is from [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop) which describe the runtime of general Javascript engine. In web context, it has connection to the Networking component of browser. You can find out the details how event loop works in the [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop) article. The main flow is after getting HTTP reponses, the networking component insert callbacks to handle the reponses into the Queue. The event loop and queue are the main reason Javascript can execute asynchronous code.

### 4. Rendering flow

![rendering flow](./rendering-flow.png) 
[Image source](https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/)

The rendering is a progressive progress, browsers try to display the content as soon as possible. Thus HTML document is usually broken down to multiple chunks of 8Kb and passed to rendering engine. 

At first step, HTML and css stylesheet are parsed to construct a DOM tree. Notice that during this step, if the parser encounter external link to stylesheet, images or javascript files, the parser will stop and wait for download, parse and run (for javascript files), then resume afterward.

> Performance tip 1: put Javascript file at the end of HTML to prevent blocking browser parsing the DOM

We could do the same for external stylesheets but styles are required to paint the DOM tree, if the style get updated, it will cause repainting of the corresponding DOM nodes.

>Performance tip 2: put stylesheets in <head> tag to allow browser to load it in first priority.

After pasrsing HTML and stylesheet in the first step, the results are a DOM tree and styles context tree. In the second step, a render tree is constructed based on the DOM tree and the style context. When finish this step, the document state will be complete and emit the `load` event.

In third step:

### Loading resources
- async and defer script tag
- Lazy load images (native, library)
- link prefech, preload, preconnect
- bundle splitting
- Dynamic load bundle (link vs script tag, dynamic import)
### Cookies
- reduce cookie
- free cookie request
### HTTP caching and ajax
- gzip
- cache control
### CORS(simple vs preflights)
### 9. Miscellaneous and Security
- Browser cache
- service worker
### Reference
- HTTPS
- CSP
- Cookies
- CORS(simple vs preflights)
