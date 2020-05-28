---
title: Understanding `this` binding in javascript and React
date: "2020-06-06T22:12:03.284Z"
description: "Simple rules to undestand `this` binding with examples in React app"
---


**Introduction**

At some point when learning javascript, I think most people will be confused about the `this` object in javascript, let's see the following codes
```javascript
a.sum();
const temp = sum;
temp();
```
The outputs of `a.f()` and `temp()` can be unsuprisingly different, depend on the context of `this`. A more common case we can encouter if working in 
React applications

```javascript
class MyForm extends React.Component {
    constructor(){
        // something missing
        this.state = {
            isSubmited: false,
        }
    }
    handleSubmit() {
        this.setState({isSubmited: true});
    }
    render() {
        return <div>
            <input />
            <button type="submit" onSubmit={this.handleSubmit}/>
        </div>
    }
}
```
For the above code to work properly, we need to either have to write the constructor function 
```js
    constructor() {
        this.handleSubmit = this.handleSubmit.bind(this)
    }
```
or using ES6 fat arrow function for `handlSubmit` 
```js
    handleSubmit = () => {
        this.setState({isSubmited: true});
    }
```
To understand why it needs to bind `this` object, let's examine what happens when javascript engine execute functions or expressions.

**Javascript execution context**

In javascript, functions are objects (ES6 classes are also functions, it's just the syntactic sugar for constructor function). After parse and 
evaluate expressions in function, javascript binds all the values of arguments and creates an environment object that consists of `this` , `arguments`
for that function.

```js
var a = 1
function sum(b) { 
    return this.a + b
    };
sum(2);
// 3
```
With this simple function, we can visualize the environment being created like

![javascript function's environment](./js-env.png)

**\`This\` in environment**

**Example with react app**
