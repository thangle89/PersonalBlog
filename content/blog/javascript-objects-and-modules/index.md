---
title: Javascript objects and modules
date: "2020-07-01T22:12:03.284Z"
description: "Describe relationship between objects and modules in Javascript. Also explain different ways to load modules in JS applications"
keywords: "javascript, module, object, programming"
featured: "./object-prototype.png"
---

Javascript (JS) is very popular due to its ability to run both on servers and on clients (browsers). It is a dynamic language and has support for both object-oriented and functional programming styles. However this flexibility makes developers confused at times, especially when they need to decide whether objects or functions should be used. In addition, for large JS applications, the ways JS code is extracted into modules also cause more headache for programmers. In this article, I will try to analyze objects and modules in JS. What is the relationship between them and how modules are loaded in different types of JS applications (e.g server or clientside applications)

### 1.Objects
At atomic level, all applications contains only objects during runtime. Functions are also objects in Javascript. In its simplest form, we can program any application using objects

```js
const personA = {
    name: 'A',
    getName: function() {
        return this.name;
    }
};
const personB = {
    name: 'B',
    getName: function(){
        return this.name;
    }
};
const program = {
    main: function(people) {
        people.forEach(person => console.log(person.getName()));
    }
};
program.main([personA, personB]); // output: AB 
```

The above example mimics a small program which loops through all people and print their names. As we see, all of the elements are of the program are just objects. But soon, this will become problem of code duplication if we have more than thousand of people for instance. `Class` is the solution for that problem, we can rewrite the example as: 

```js

class Person {
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name
    }
}

const personA = new Person('A');
const personB = new Person('B');
const personC = new Person('C');

const program = {
    main: function(people) {
        people.forEach(person => console.log(person.getName()));
    }
};
program.main([personA, personB, personC]); // output: ABC

```

As you can see, the code is more concise when `Person` class help create objects easier and prevent code duplication. Unlike other languages, `class` in JS is not just meta data, it's actually complied into constructor functions. Those constructors function are also objects, which are called prototype objects.

```js
personA.__proto__ === personB.__proto__ // true
personB.__proto__ === personC.__proto__ // true
//even futher on the prototype chain
personA.__proto__.__proto__ === personB.__proto__.__proto__ // true
```

In JS, every object inherits from based object prototype, because all the prototypes are objects, so it can be modified, removed in runtime. When accessing any property or method on an object, JS runtime will first look for the property or method on current object instance, if cannot find, it will go up in the prototype chain. The prototype chain can be described in following picture:

![prototype chain](./object-prototype.png)

Prototypes or classes help creating objects more efficient. However when application grows, we still need a way to organize codes such that it's easy to maintain and develop.

### 2.Modules pattern

The early way to organize modules in JS is through function factory. This method enables developer to isolate independent logic into separate chunks. Let's see an example:

```js
const program = function() {
    let count = 0;
    const run = function(items) {
        items.forEach(_ => count++);
        return count;
    }
    return {
        run,
    }
};
const myApp1 = program();
myApp1.run(['a','b']); // 2

const myApp2 = program();
myApp2.run(['a','b','c']); // 3
```

As we see, `program` is a function factory which helps create multiple independent `myApp1` and `myApp2` objects. These objects have different scope and closure. 

With this function factory, we can separate application logic into different modules. However, when applications grow, it needs to load only necessary modules instead of defining all modules in a single file. When JS code is divided into multiple files, the way to load modules will define what format modules should have. Environment is also a factor to affect the way JS code are loaded, e.g. servers or clients (browsers).

### 3.Module formats and loaders

Each environment of JS needs different module formats and hence different loaders. On servers where every JS file can be stored locally, there is no need to wait for network to download any files. Thus servers often employ synchronous loaders i.e. all JS scripts can be loaded at once. On the contrary, clientsides like browsers cannot save JS files. Therefore when loading scripts, browsers need to download the files before parse and execute. As browsers have to wait for download JS files, it'd better to have asynchronous loaders i.e. while waiting for file downloading, browsers can continue parsing DOM or handle users' events. 

- **CommonJS:** is the module format that's used for servers side JS (i.e. Nodejs). Example module format in CommonJS as following

```js
//calculator.js
function sum(a, b) {
    return a + b;
}
function multiply(a,b) {
    return a*b;
}
module.exports = {
    sum: sum,
    multiply: multiply
}

//app.js
var sum = require('calculator').sum;
var muliply = require('calculator').multiply;
```
Module in CommonJS returns an `exports` object and in consumers (e.g. `app.js`), they call `require` function to load the module. To understand the characteristics of CommonJS modules, let's see an simple implementation of the module loader: 

```js
require.cache = Object.create(null);
function require(name) {
  if (!(name in require.cache)) {
    let code = readFile(name);
    let module = {exports: {}};
    require.cache[name] = module;
    let wrapper = Function("require, exports, module", code);
    wrapper(require, module.exports, module);
  }
  return require.cache[name].exports;
}
```
The function `require` caches modules after they are loaded. As we see in the code above, every module is loaded by a simple `readFile` function, then the raw text is converted to JS functions by `Function` constructor. Finally the `wrapper` function is applied with `require` and `module` as parameters. 

From the implementation, it shows that CommonJS modules is synchronously loaded and the imported module is a new instance that's detached from its source. Hence, consumer can treat imported module as normal object and it's possible to modify or update value of that object. 

- **AMD (Asynchronous Module Definition):** 

In browsers context, loading files requires downloading them via network requests. It's better for browsers performance when loading JS files can happen asynchronously. AMD is a format that comforts those requirements. RequireJS is the most popular implementation for AMD loader. Example for usage of AMD and RequireJS:

```js
// index.html
<script data-main="js/app.js" src="js/require.js"></script>

// app.js
requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app'
    }
});

requirejs(['jquery', 'app/myModule'],
function   ($, myModule) {
    //jQuery, myModule module are all
    //loaded and can be used here now.
    //...
});

//app/myModule.js
define(function () {
    //Do setup work here

    return {
        color: "black",
        size: "unisize"
    }
});
```
There are many ways to dynamically load JS in browsers, the way RequireJS loads JS files is as following:

```js
var head = document.getElementsByTagName('head')[0],
script = document.createElement('script');

script.src = url;
head.appendChild(script);
```

The basic idea is to create new script tag for each dependency, then attach them back to DOM later to avoid blocking browsers. The actual implementation is more complex as it needs to handle the order of loading dependencies, to ensure that all dependencies are loaded before main function executed in each module.

There is a module format called UMD (Universal Module Definition) with the purpose to unify the common loader for both AMD and commonJS. However, the latest module format ES6 deprecates the idea of UMD.

- **ES6 Module** is a native format that's built inside JS. It supports cyclic dependencies and can be statically analyzed for static checking and optimization (tree shaking in webpack). ES6 have direct support for asynchronous loading and configurable module loading in browsers. Example usage:

```js
//------ lib.js ------
export const sqrt = Math.sqrt;
export function square(x) {
    return x * x;
}
export function diag(x, y) {
    return sqrt(square(x) + square(y));
}

//------ main.js ------
import { square, diag } from 'lib';
console.log(square(11)); // 121
console.log(diag(4, 3)); // 5
```
Unlike CommonJS, `import` and `export` in ES6 module has a live connection with original module code. In the example above, the imported `square` and `diag` are the same function objects from `lib.js`. Because of this live connection, imported module in ES6 is treated as constant, i.e. you cannot change the values of the imported functions or classes. 

ES6 modules can be conditionally loaded by using `import` as function. For example:

```js
//------ main.js ------
import { square } from 'lib';
if(square(11) > 100) {
    import('lib').then(lib => {
        lib.diag(4,3);
    })
}
```
This feature is very useful for dynamically splitting bundles for JS modules.

Modern browsers also support ES6 module `import` and `export` natively. For example:

```js
//normal script tag, load synchronously
<script src='./main.js' />

//module script tag with ES6 support, load asynchronously
<script src='./main.mjs' type='module'/>
```
To distinguish `module` script with normal script, it's recommended to use `.mjs` when naming the files. There're a lot of small differences between normal scripts and module scripts. However with modern frameworks like React with Webpack everything just works without you paying much attention to the module formats. ES6 module has much more advantages over CommonJS. Later version of Nodejs has the support for loading ES6 modules. 

### 4.Summary

Javascript is a dynamic language, there is no type check during runtime of applications. Every object in JS has a prototype chain, which is the basis for properties and methods inheritance. Prototypes are also objects, thus they can be modified or updated during runtime. When application grows, bigger objects that contain independent logic are created and form modules. The most common formats for modules now is ES6 for browsers. Modern bundler tools like Webpack or Rollup can be configured to use with different formats of Javascript module.

### References
https://requirejs.org/docs/api.html

https://github.com/umdjs/umd

https://exploringjs.com/es6/ch_modules.html

https://v8.dev/features/modules
