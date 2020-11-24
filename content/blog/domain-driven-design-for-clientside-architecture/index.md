---
title: Domain driven design for clientside application 
date: "2020-11-05T22:12:03.284Z"
description: "clientside architecture for multiple domains application"
keywords: "architecture, domain driven design, react, redux"
featured: "./DDD.PNG"
---

### 1. Introduction

Clientside development is getting more and more complex as the number of frameworks and libraries increase. Especially with applications that need to interact with multiple domains. The clientside codebase of these applications are huge. Recently I grew interest on the topic and want to dive deeper into it. 

The problem in big applications with multiple domains is that it is very easy to add complexity into the growing application. If not careful, it will be unmanagable at some point. In my opinion, we can prevent the problem with good architecture and right structure of the codebase. It is not a new idea to apply Domain driven design (DDD) to clientside, just that there are not many dicussion on the topic in the community. We can only find the best solution if more people talk and discuss it. In this post, I will offer my view on how we can apply DDD to structure clientside codebase.

### 2. Domain driven design (DDD)
Definition of DDD on Wikipedia
>Domain-driven design is the concept that the structure and language of software code should match the business domain. (Wikipedia)

We can see more details in following example [picture](https://martinfowler.com/bliki/BoundedContext.html): 
![Domain driven design for microservice](./DDD.png)

One prominent application of DDD is in clean architecture which I described in the previous [post](https://thangledev.com/common-server-architectures-for-micro-serivce). Apply DDD correctly, we can gain a lot of benefits in developing applications. 

### 3. Why do we need DDD for clientside
- maintain domain knowledge
- keep flat complexity

### 4. DDD for clientside
-what unique on clientside DDD
-illustration picture of all components (layer) 
-illustration picture of folder structure
-when application grow, how is the complexity is kept constant
### 5. Summary