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

Let start with some simple array methods: `reduce` or `sort` are very common in array manipulation. They all accept a function as argument and then apply the function to the array. Let see an example with `sort`
```js
const orderAscending = (a,b) => a - b;
const numbers = [7,8,2,3,6];
numbers.sort(orderAscending);
console.log(numbers); //output: [2,3,6,7,8]
```
`sort` use a comparer function to compare two values of the array, this comparer can return only `(1,-1,0)`. Zero is equal,`-1` means `a` is less than `b`,and conversely `1` means `a` is greater than `b`. By this api, we can change the compare into descending by just use `orderDescending = (a,b) => b - a`.

With the same `numbers` array, what if we want to calculate the total of it? Array `reduce` can help us do that, it accepts a reducer function and apply that function to every item in the array while also keep track of the accumulated result.
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

In my first post about `this` and closure in JS, I mentioned that we can pass functions arround in JS applications. Then instead of data array, suppose that we have an array of functions and need to apply all the functions to a value 

```js
const add = (a) => a + 1;
const multiple = (a) => a * 10;
const minus = (a) => a - 2;
const operations = [minus, add, multiple];
```

Javascript follows *declarative* programming mechanism, most of the time it would need to write one final function like 
```js
calculate(x)
```
to apply all the functions in `operations` to a number instead of the imperative style 
```js
minus(add(multiple(1)))
```
even though the twos can yield the same result. At first attemp to compose a single function, we can try to use `reduce` to apply each function to a value:
```js
const result = operations.reduceRight((acc, f) => { 
    // reduceRight is similar to reduce, but it can keep the order from right to left  
    return f(acc);
},1); 
console.log(result); //output: 9
console.log(minus(add(multiple(1)))) //ouput: 9
```
Notice that we don't have a final function like `calculate(x)` yet, what if we need to apply the list of functions to more values e.g. `calculate(1), calculate(3)... `? 

At second attempt, instead of apply `f()` immediately, it returns a new function

```js
const calculate = operations.reduceRight((acc, f) => {   
    return (value) => f(acc(value));
});
calculate(1); //output 9
```
Now we have a single function that composed from an array of functions. Then at final step, we can remove the intermediate `operations` and create an utility function that can be reuse for different arrays of functions.
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

The utility function `compose` is what we need, it can compose other list of functions easily. Infact,`compose` is so useful that many libraries have their own implementation for it e.g. [Underscore](https://devdocs.io/underscore/index#compose) or [Redux](https://redux.js.org/api/compose). If you work in React Redux app, the second form of function `compose(minus,add)(1)` can be familiar to you. Assum that we have a React component that has many Higher-Order Component (HOC) wrappers, we can use `compose` to have a concise structure

```js
export default compose(
    React.memo,
    HOCWrapper1,
    HOCWrapper2,
    connect(mapStateToProps, mapDispatchToProsp)
)(MyComponent)

// if don't use `compose`, we'd have to write
export default React.memo(HOCWrapper1(HOCWrappe2(connect(mapStateToProps, mapDispatchToProsp)(MyComponent))))
```
The first style is much cleaner to describe all the wrappers around the component. 

### Closure in functional composition

Closure in JS revolves around state of functions. We need closure when we want to retrieve some state in the execution context. Assume that we need to call a `chargeCredit` function at the final step of checkout, because this function is critial, we need to make sure it is called only once time.

```js
const once = (fn) => {
    let isExecuted = false;
    return (value) => {
        if(isExecuted){
            return undefined;
        }
        isExecuted = true;
        return fn(value)
    }
}
const chargeCredit = once((value) => {
    console.log("deduct balance: ", value)
});
chargeCredit(10); // output: deduct balance: 10
chargeCredit(5); // output: undefined
```

As we can see, when calling function at the second time `chargeCredit(5)`, it returns `undefined` which is what we expected. In essense, what `once` does is just create a closure for the input function. Inside closure, it can check whether the function is already executed. Things work well until we need to use `once` on a method of an object

```js
const bankAccount = {
    balance: 50,
    chargeCredit: once(function(value) {
        this.balance -= value;
    })
};
bankAccount.chargeCredit(10); 
console.log(bankAccount.balance) //output: 50 ??
```
Apparently, current implementation of `once` does not work for objects. What just happened is that we use the utility `once` on a method of an object, this method need to access to `this` context when it execute, but in current implementation what we have is 

![problem in once ](./once-problem.png)

Let's fix those two problems by passing `this` context.

```js
const once = (fn) => {
    let isExecuted = false;
    return function (value) {
        if(isExecuted){
            return undefined;
        }
        isExecuted = true;
        fn.call(this, value);
    }
}

// apply it to bankAccount again
const bankAccount = {
    balance: 50,
    chargeCredit: once(function(value) {
        this.balance -= value;
    })
};
bankAccount.chargeCredit(10);
console.log(bankAccount.balance); //output: 40
bankAccount.chargeCredit(10);
console.log(bankAccount.balance); //output: 40
```
At this point, some might have question about `compose` and `once`, why `once` takes into account `this` context when apply the function while `compose` does not? 

If we look at function arguments of `compose`, we can see they are context agnostic. For example, if we have

```js
const calculate = compose(objA.minus, objB.add, objC.multiple)
```
then the new function `calculate` need to be executed on another object, which doesn't need to be either `objA`, `objB` or `objC`. In constrast, `once` accepts a function, thus it acts as a function decorator of the function argument. To make `once` works for all cases, it must pass `this` context when executing.

### Closure with objects

As we see in the implementation of `once`, it just has a simple flag `isExecuted` inside closure. Suppose that we use object instead of a boolean flag, we can store many more data. A common use case is caching results of function calculation, in JS this technique is called *memoization*. 

```js
const memoize = (fn) => {
    const result = {};
    return function(...args) {
        const key = JSON.stringify(args);
        if(!result[key]) {
            result[key] = fn.apply(this,args)
        }
        return result[key];
    }
}
```

Similiar to `once`, the `memoize` function need to handle input function and return another function with a wrapped closure. In the closure, it has an object to cache the results for the original function. Let's try it with a functions.

```js
const longOperation = (value) => {
    let i = 1000;
    while(i > 0) {
        i -= 1;
    }
    console.log('operation executed');
    return value;
}
const fastOperation = memoize(longOperation);
fastOperation(5); //output: operation executed 5
fastOperation(5); //output: 5
fastOperation(7); //output: operation executed 7
```

This `memoization` is quite helpful to improve performance in some cases, but we need to use it with a good consideration. For example in the serializing `key`, in this implementation it uses `JSON.stringify`, but if the array is big, `JSON.stringify` will slow down the computation, and the memmory need to spend to cache results also increases. 

In React 
---TODO: describe React.memo, reselect

### Javascript Promise

`Promise` is a built in object in JS, much like `Array`, which ecapsulate asynchronous operation in our app. With the guide from function composition and closure, let try to do reverse engineering for `Promise`. At the first draft, we know when using `Promise` it needs to be a new object, and it needs to handle wrapped asynchronous function.

```js
class MyPromise {
    constructor(fn) {
        this.state = 'Pending'; // possible value: 'Resolved', `Rejected'
    }
}
```
With this basic class, let's compare with a simple usage of Promise.
```js
const myAsync = new MyPromise((resolve, reject) => {
    setTimeout(()=> {
        resolve(10);
    },4000);
})
myAsync.then(value => console.log(value));
```
The current `MyPromise` class does not have api `then` and the way to store value, thus let's revise the class

```js
class MyPromise {
    constructor(fn) {
        this.state = 'Pending'; // possible value: 'Resolved', `Rejected'
        this.value = null;
        this.handlers = [];
        this.resolve = this.resolve.bind(this);
        this.reject = this.reject.bind(this);
        fn(this.resolve, this.reject);
    }
    then(func) {
        this.handlers.push(func);
    }
    resolve(value) {
        this.value = value;
        this.state = 'Resolved';
        this.handlers.forEach(f => f.call(null, value));
    }
    reject() {
        this.state = 'Rejected';
        //...
    }
    // need to implement reject, catch...
}
```
As show in the code, now `MyPromise` class can store `value` whenever promise is resolved. What the `then` api does is just accept a function, and push it into the list of `handlers` inside promise. Later, when we call `resolve()`, these handlers can be triggered with the `value` from promise. Notice that when we create a new promise, the `fn` input need to be executed to resolve the state of promise, that's why we have 
```js
fn(this.resolve, this.reject)
```
 Let's run the example again
```js
const myAsync = new MyPromise((resolve, reject) => {
    setTimeout(()=> {
        console.log('Resolved');
        resolve(10);
    },4000);
})
myAsync.then(value => console.log(value)); //output: Resolved 10
```
Note: this is implemented based on my understanding of Promise in JS, for complete implementation please refer to [Implementing JS](promisejs.org/implementing/), there are certaint differences, but the idea remains the same.

### Conclusion

In this article, we went from some simple composition of functions to Array `reduce`, from that we can build a utility `compose` which can combine many functions. Moving to closure, it shows that we can use `closure` to create useful methods like `once` and `memoize`. Finally with the reverse engineering of `promise`, it gives more practical picture of how JS objects are constructed, in the atomic level, they all contains `objects` and `functions`.

### References

[Array sort, reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
[Declarative vs imperative programming](https://codeburst.io/declarative-vs-imperative-programming-a8a7c93d9ad2)
[Underscore compose](https://devdocs.io/underscore/index#compose)
