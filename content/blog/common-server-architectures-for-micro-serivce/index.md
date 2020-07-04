---
title: A review of common server architectures for micro service
date: "2020-07-19T22:12:03.284Z"
description: "Curated list of popular API architecture"
keywords: "design patterns, software designs, API architecture"
featured: "./clean-ddd.png"
---
***

### 1. Introduction

Micro service is increasingly popular in software development nowadays. The idea is to break large, monolithic systems into smaller services so that they can be managed or scaled easily. To work with these services, it is important to understand common server architectures and designs. In this article, I will compare and analyse common server architectures, then discuss popular patterns for microservice.

### 2. Domain driven design (DDD) for microservice

Sotwares exist to solve human problems. How easy it is to develop and maintain applications is key to software design and architecture. DDD is the approach that bridge the gap between technical and bussiness knowledge. It can foster the communication between software developers and domain experts. DDD models classes and objects (bounded context) based on business domains. An example architecture for DDD with micro services can be described in following picture:

![Domain driven design for micro service](./ddd-microservice.png)

<center>Figure 1: Domain driven design for microservice</center> <br/>

As we can see, at the core of the architecture is the **Domain Model Layer**. It contains domain entities, aggregate roots or business services. These services generally should have interfaces and implementations to reflect business logic. Domain Model Layer also contains repository or external contracts and intefaces to ensure the dependency inversion principal. It is because application layer and infrastructure both depend on domain model layer, which makes domain model layer completely separated from the other two.

**Application Layer** is what clients interact with, it should has viewmodels for api endpoints. In general, we should not expose domain objects directly to clientside. Therefore, mappers are used to convert domain entities to viewmodels and return only needed data for clientside. This layer depends on core (domain model layer) to use the business services, entity objects, repositories (ideally through dependency injection). From interfaces of repositories in domain model layers, application layer can use DI (dependency injection) to get the implementations from infrastructure layer.

**Infrastructure Layer** depends on domain model layer to use entities and repository contracts and interfaces. This layer contains actual implementation of repositories. By this separation, it will be easy to switch external dependencies (e.g. change MySQL server to MongoDB, or add caching layer for external dependencies). As described above, application layer can refer to this layer for injecting repository implementations. In practice, Infrastructure layer often has a caching layer to improve speed when accessing external services.

This DDD architecture is language agnostic, it can be applied in many programming languages such as C#, Java, Scala, or even Nodejs. Nodejs run on Javascript engine and doesn't have typecheck (i.e interfaces), but the structure can still be used for separation of concerns. In my opinion this structure makes more sense than the clean architecture (or Onion architecture).

### 3. Clean architecture (Onion architecture)

In Uncle Bob blog for clean architecture, he describe API systems should have dependencies flow inwards. Inner layers should not know any thing about outer ones. That structure still maintain the separation of concerns for each layer and follow the dependency inversion principals. To compare DDD for micro service and the Onion architecture, Let's see them together in the following picture:

![Clean architecture vs DDD](./clean-ddd.png)
<center>Figure 2: Clean architecture and Domain driven design</center> <br/>

As you can see in Figure 2, after redrawing DDD in onion styles, we see an incorrect point of Clean architecture is that, when using dependencies injection, the application layer in fact need to have reference to infrastructure layer for repository implementations. Clean architecture still has good points to ensure separation of concerns and dependency inversion. But in practise, I think it's not completely correct in terms of dependencies between outer layers and inside ones.

### 4. Microservice gateway pattern

In large applications with many micro services, they usually employ and intermediate api gateway layer to incooporate relevant micro services together as following picture:

![micro service pattern](./microservice-pattern.png)

<center>Figure 3: API gateway pattern</center> <br/>

In the example, each clients (e.g mobile or desktop) has a separate api gateway layer. Api gateway handle requests from clientside then compose `account`, `inventory` and `shiping` service to process requests.

Api gateway layer provides additional abstraction layer which help sclients interact with api services easier. Different type of clients can have different api gateway endpoints in order to return only needed data for clientside (backend for frontend approach).

### 5. Message queuing architecture

In Api services that require long operations (e.g payment, reservation api), to ensure the scalability in these systems, meassage queuing is often employed. The main concept of this architecture is similar to asynchronous actions, when receive a request, api service just push them in a First-in-first-out queue. Sub-services will then subscribe to the queue and start to process each request. An example in following picture

![message queue architecture](./message-queue.png)
<center>Figure 4: Message queue architecture</center> <br/>

A main api service (e.g. api gateway layer) can receive requests then publish messages into multiple queues, after that the smaller micro services can subscribe to corresponding queue and process requests from the queue. When systems have heavy traffic from frontend, they can deploy more instances of `microservice A` and `microservice B` accordingly. This architecture unblock resources both on client and server side, while waiting for messages to be processed by sub-systems, servers can handle other requests.

### 6. Summary

Domain driven design for microservice is widely used to structure api applications. Besides the benefits of smoother communication between technical and domain experts, DDD and clean architecture ensure the separation of concerns and dependency inversion principal for api systems. Those characteristics help maintain and develop api system easier. In large applications, a gateway layer or message queue can be used to provide more abstraction layer and increase the scalability for applications. 

### References

[Clean architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

[Domain driven design for microservice](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/ddd-oriented-microservice)

[Microservice pattern](https://microservices.io/patterns/microservices.html)

[Message queuing architecture](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/multi-container-microservice-net-applications/rabbitmq-event-bus-development-test-environment)
