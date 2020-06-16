---
title: Important security concepts every developer should know 
date: "2020-06-28T22:12:03.284Z"
description: "Discuss all common aspects of website security to help you avoid common security flaws of the web"
keywords: "browser, javascript, security"
featured: "./network-package.png"
---
***

With the increasingly popularity of Javascript and frontend frameworks like Reactjs, Angular, or Vue...etc. More and more application logic is shifted into user browsers. As a results, personal data is exposed to greater risks of being exploited by attackers nowadays. For web developers, it's important to understand all the security fundamentals to protect web application. In this article, I will analyse common security risks and the approaches to prevent them. 

### 1.Overview

![Network package](./network-package.png)
*<center>Figure 1: Network packages</center>*

As we see in *Figure 1* networks packages are transfered from servers to users in order to display content on browsers. Security involves all parts of that process, from clients to servers. Let's look into each part to see what are the potential flaws and how to mitigate them. 

### 2. Secure network

On the internet, before one package could reach its destination, it may go through several hubs and switches. The package could be intercepted, and viewed by attackers (man in middle). One popular approach to fix it is encrypt packages that are sent on network.

#### HTTPS 
HTTPS (hypertext transfer protocol secure) is a secure version of HTTP. It uses SSL (secure sockets layer) to encrypt messages inside network package before send it to network. Before encryption progcess, servers have to obtain SSL certificate first. The certificate consists of public key, private key and all related information of websites. What happens when browser initialize HTTPS connection to server is described in following picture

*<center>Figure 2: SSL handshake</center>*
***
    - HSTS

### 3. why browser has security flaw
    - why
    - common XSS attacks
        - dynamic <img>, <script>, <link>


### 3. Secure browser
    - URL encode
    - Cookie: secure, HTTP only
    - CORS
    - CSRF prevention
    - No referer policy
    - X-frame-option
    - CSP
    - CSP-once
### 4. Front-end libraries
    - React auto encode

### 5. Summary

### 6. Reference
