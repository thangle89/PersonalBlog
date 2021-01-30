---
title: State management for clientside of web application
date: '2021-02-10T22:12:03.284Z'
description: Best practices when handling state on web app
keywords: state management, website development, programming
# featured: ./clientDDD.png
---

>There are only two hard things in Computer Science: cache invalidation and naming things.
>
>-- Phil Karlton

### 1. Introduction

State management refers to the process of storing and retrieving user data that occurs when they interact with applications. e.g. users login messages, form data on checkout, shopping cart status...etc. The process greatly affects the scalability and experiences of users. If not done well, it also impacts website performance and maintainability of the applications. In this article, we will analyse some problem and possible solutions when dealing with states in web applications.

### 2. Why we need state on clientside

In the old days, web applications mostly constructed html pages on server side like (aspx or jsp), user data is prepared and built directly into webpages on the server. What users get on clientside is a complete presentation of their data. After interacting with the page like filling a form or checkout a shopping cart, all the necessary data is transfered and stored on serverside. 

With the development of AJAX technology and modern clientsides frameworks like React, Angular, Vue, users data is primarily kept on clientside to improve the users experience as they will get faster responses from the applications, as opposed to long waiting time when every user interaction required a full page reload as in tradditional websites.

Another important reason to have clientside state is the scalability of web servers. Imagine there's a webserver that store session data of users in its application state. Problem appears when we want to put multiple servers for different locations or regions to serve the website faster.

// picture 1 (server + state) => multiple (server+state) + (?shared state)

There will be a senario that one server is down and the load balancer need to redirect the server's traffic to different server. Consequently, we need to find a way to maintain the session state of the old server. Maintenaince server state is hard and it proves to be very complex, depending on what kind of state the they need to manage. A more simple and comon solution is to keep server stateless, which means whenever users send requests to servers, the request should have all the neccessary state information for server to process. Thus, reducing the need to store data on server. This principle holds true for any kind of web services and api application. 

### 3. How to transfer state from client to server

For web application, the most prevalent way to send data from clientside to servers is through Url params. Although, there's a limit on maximun url length, it's suitable for most of normal usecases in most applications. 

With more sensitive data of users like sessionId, access token, request cookie is a suitable place to carry the data. To enhance the security of data in cookies to prevent attack like XSS (cross site scripting) injection there are many flag that can be set in cookies from server or clientside. The rest of data can be put in body of ajax request.

### 4. How to manage state
// Overview picture of all kind of state: localState, serverstate


### 5. Summary