---
title: State management for clientside of web application
date: '2021-02-10T22:12:03.284Z'
description: Best practices when handling state on web app
keywords: state management, website development, programming
# featured: ./clientDDD.png
---
### 1. Introduction

State management refers to the process of storing and retrieving user data that occurs when they interact with applications. e.g. users login messages, form data on checkout, shopping cart status...etc. The process greatly affects the scalability and experiences of users. If not done well, it also impact website performance and maintainability of the applications. In this article, we will analyse some of the best practices when dealing with states in web applications.

### 2. Why we need state on clientside

In the past, web applications mostly constructed html pages on server side like (aspx or jsp), user data is prepared and built directly into webpages on the server. What users get on clientside is a complete presentation of their data. After interacting with the page like filling a form or checkout a shopping cart, all the necessary data is transfered and stored on serverside. 

With the development of AJAX technology and modern clientsides frameworks like React, Angular, Vue, users data is primarily kept on clientside to improve the users experience as they will get faster responses from the applications, as opposed to longer waiting time if every user interaction required a full page reload in tradditional storing all data on serverside .

### 3. What kind of state we need to manage

### 4. How to manage state

### 5. Summary