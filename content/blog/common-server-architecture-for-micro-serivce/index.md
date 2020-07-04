---
title: Common server architecture for micro service
date: "2020-07-19T22:12:03.284Z"
description: "Curated list of popular API architecture"
keywords: "design patterns, software designs, API architecture"
featured: "./ddd-microservice.png"
---
***

### 1. Introduction

Micro service is increasing popular in software development nowadays. The idea is to break big, monolithic systems into smaller services so that they can be managed or scaled easily. To work with these services, it is important to understand common server architectures and designs. In this article, I will compare and analyse Domain Driven Design (DDD) and Clean architecture, then discuss common patterns for micro services.

### 2. Domain driven design (DDD) for micro-services

Sotwares exist to solve human problems. How easy to develop and maintain applications is key to software design and architecture. DDD is an approach that bridge the gap between technical and bussiness knowledge, thus it can foster the communication between software developers and domain experts. DDD models classes and objects (bounded context) based on business domains. An example architecture for DDD with micro services can be described in following picture:

![Domain driven design for micro service](./ddd-microservice.png)

<center>Figure 1: Domain driven design for micro service</center> <br/>

As we can see, at the core of the architecture is the Domain Model Layer. It contains domain entities, aggregate roots or business services. These services generally should have interfaces and implementations to reflect business logic. Domain Model Layer also contains repository or external contracts and intefaces to ensure the dependency inversion principal. That is because application layer and infrastructure both depends on domain model layer, it makes domain model layer completely separated from the other two.

Application Layer is the main interface of API server, thus it should has Viewmodels for each api endpoints. In general, we should not expose domain objects directly to clientside. This layer depends on core (domain model layer) to use the business services, entity objects, repositories (ideally through dependency injection). From interfaces of repositories in domain model layers, application layer can use DI (dependency injection) to get the implementations from infrastructure layer.

Infrastructure Layer

### 3. Clean architecture (Onion architecture)

### 4. Micro services pattern

### 5. Summary

### References
https://github.com/lucasbento/graphql-pokemon/blob/master/src/type/PokemonType.js