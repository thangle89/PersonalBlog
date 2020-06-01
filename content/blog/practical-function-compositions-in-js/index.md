---
title: Practical function compositions in Javascript
date: "2020-06-07T22:12:03.284Z"
description: "A step by step guide to function composition in JS"
---

To work with Javascript(JS) effectively, you need to get used to the way functions are composed in the language. When I started learning JS, my background in C# made it a bit difficult to understand the way functions are passed around in JS applications. I hope this guide can ease the way for you. 

### Definition

A definition from mathematics for function composition (wikipedia)
> Function composition is an operation that takes two functions `f` and `g` and produces a function `h` such that `h(x) = g(f(x))`. In this operation the function `g` is applied to the result of applying the function `f` to `x`.

It's quite easy to understand when a function has normal values like objects or number as arguments e.g. `f(1)` or `g(1)`, things get more complicated when we need to compose a new function from multiple functional arguments.

### Handling functional arguments

map, filter, sort

example with sort

reduce
- reduce array
- reduce objects
- reduce functions
    -explainations
    -example in React - redux
Promises
-reverse engineer 

Common utilities
-once
-memoized
-debounce
-throttle