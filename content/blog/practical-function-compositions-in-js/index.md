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

### Array `sort`, `reduce`

Let start with some simple array methods: `reduce` or `sort` are very common in array manipulation. They all accept a function as argument and then apply the function to the array.
```js
const orderAscending = (a,b) => a - b;
const numbers = [7,8,2,3,6];
numbers.sort(orderAscending);
console.log(numbers); //output: [2,3,6,7,8]
```
With the same `numbers` array, what if we want to calculate the total of it? Array `reduce` can help us do that, it accept and reducer function and apply that function to every item in the array while also keep track of the accumulated result.
```js
const totalReducer = (total, num) => total + num;
console.log(numbers.reduce(totalReducer,0)) //output: 26
```
`Reduce` has some others interesting usage, assume that we have a very big array of api data and want to transform it to a dictionary for faster access and update we can do
```js
const data = [
    {id: 1, name: 'computer1', count: 3 },
    {id: 2, name: 'computer2', count: 2 },
    {id: 3, name: 'computer3', count: 5 },
    {id: 4, name: 'computer4', count: 6 },
];
const dictionary = data.reduce((acc, item) => {
    // loop through every item in array and add them into the dictionary
    acc[item.id] = item; 
    return acc;
}, {})
console.log(dictionary);
...
//output
{
    1: {id: 1, name: 'computer1', count: 3},
    2: {id: 2, name: 'computer2', count: 2 },
    3: {id: 3, name: 'computer3', count: 5 },
    4: {id: 4, name: 'computer4', count: 6 },
}
```
Now we have a dictionary of data that can be use easier. As an exercise for you, what if we want to convert `dictionary` back to an array of data again? (*hint* uses `Object.keys` and `reduce`)

### Reducing functions

If you read my first post about `this` and closure in JS, you know that we can pass functions arround in JS applications. Then instead of data array, what if we have an arrays of functions and need to apply all the functions to a value ? 

```js
const add = (a) => a + 1;
const multiple = (a) => a * 10;
const minus = (a) => a - 2;
const operations = [minus, add, multiple];
```

Javascript follows descriptive programming mechanism, so most of the time we would prefer to write one final function like 
```js
calculate(x)
```
to apply all the functions in `operations` to a number, instead of the imperative style 
```js
minus(add(multiple(1)))
```
even though the two can yield the same result. At first attemp to compose a single function, we can try to use `reduce` to apply each functions to a value:
```js
const result = operations.reduceRight((acc, f) => { 
    // reduceRight is similar to reduce, but it can keep the order from right to left  
    return f(acc);
},1); 
console.log(result); //output: 9
console.log(minus(add(multiple(1)))) //ouput: 9
```
Notice that we don't have a final function like `calculate(x)` yet, what if we need to apply the list of functions to more values? A second attempt, instead of apply `f()` immediately, it needs to return a function

```js
const calculate = operations.reduceRight((acc, f) => {   
    return (value) => f(acc(value));
});
calculate(1); //output 9
```
Now we have a single function that composed from an array of functions. But in practise, we usually need to have an utility function that can be reuse for different arrays of functions. Let's get rid of the `operations`
```js
const compose = (...fns) => {
    return (value) => {
        return fns.reduceRight((acc,fn) => fn(acc), value)
    }
}
// Now we can write calculate function as 
const calculate = compose(minus,add,multiple);
calculate(1): //output 9
compose(minus,add)(1) //output 0
```

The utility function `compose` now can be re-used with other functions. Infact,`compose` is so useful that many library has their own implementation for it like [Underscore](https://devdocs.io/underscore/index#compose) or [Redux](https://redux.js.org/api/compose). If you work in React Redux app, the second form of function `compose(minus,add)(1)` can be familiar to you. If we have a React component that has many Higher-Order Component (HOC) wrappers, we can use `compose` to have a concise structure

```js
export default compose(
    React.memo,
    HOCWrapper1,
    HOCWrapper2,
    connect(mapStateToProps, mapDispatchToProsp)
)(MyComponent)

// if don't use compose we have to write
export default React.memo(HOCWrapper1(HOCWrappe2(connect(mapStateToProps, mapDispatchToProsp)(MyComponent))))
```
The first style is much cleaner to describe all the wrappers around the component. 

### Closure in functional composition



Promises
-reverse engineer 

Common utilities
-once
-memoized
-debounce
-throttle