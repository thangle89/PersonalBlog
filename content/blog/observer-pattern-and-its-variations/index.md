---
title: Observer pattern and its variations
date: '2020-12-28T22:12:03.284Z'
description: Distill observer pattern and compare its usages
keywords: programming, design pattern
featured: ./observer.png
---

In functional programming, there are two important concepts: composition and asynchronous flow. Observer pattern, I figured, is the best pattern to describe the asynchronous flow in functional programming. When I tried to learn the pattern, it was a bit difficult to grasp the concept because diferrent materials use different terminologies. Thus in this post, I aim to unify and give you the essence of the pattern, then compare its uages in a number of javascript implementations. 

### What is observer pattern about ?

The pattern, by its name, is a style of programming in which an application subscribe to a certain event of a subject. When the event happens, the subject will notify all subscribers. Each subscriber can then process the data from the subject based on its needs. 

![Observer pattern](./observer.png)

### Content