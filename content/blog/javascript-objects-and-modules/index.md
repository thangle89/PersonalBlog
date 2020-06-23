---
title: Javascript objects and modules
date: "2020-07-06T22:12:03.284Z"
description: "Describe relationship between objects and modules in Javascript. Also explain different ways to load modules in JS applications"
keywords: "javascript, module, object, programming"
# featured: "./network-package.png"
---

Javascript (JS) is very popular due to its ability to run both on servers and on clients (browsers). It is a dynamic language and has support for both object-oriented and functional programming styles. However this flexibility makes developers confused at times, especially when they need to decide whether objects or functions should be used. In addition, for large JS applications, the ways JS code is extracted into modules also cause more headache for programmers. In this article, I will try to analyze objects and modules in JS. What is the relationship between them and how modules are loaded in different types of JS applications (e.g server or clientside applications)

### Objects
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

As you can see, the code is more concise when `Person` class help create objects easier and prevent code duplication. Unlike other languages, `class` in JS is not just meta data, it's actually complied into contructor functions. Those constructors function are also objects, which are called prototype objects.

```js
personA.__proto__ === personB.__proto__ // true
personB.__proto__ === personC.__proto__ // true
//even futher on the prototype chain
personA.__proto__.__proto__ === personB.__proto__.__proto__ // true
```

In JS, every object inherit from based object prototypes, because all the prototypes are objects, so it can be modified, remove in runtime. The prototype chain can be describes in following picture:

![prototype chain](./object-prototype.drawio.png)

Prototypes or classes help creating objects more efficients. However when application grows, we still need a way to organize codes such that it's easy to maintain and develop.

### IIFE (Immediately-invoke Function Expression)

### Modules
- Original way of define module
- New way of module
- Format: CommonJS, AMD, ES6
- Loaders in browsers
- namespace
### NPM modules
- main idead how to build and publish module in npm
- module scope
- module type check with typescript
### Webpack module loaders
- Loader in webpack
- dynamic splitting, importing modules
### Summary

### References