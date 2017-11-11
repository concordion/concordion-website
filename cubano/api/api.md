---
title: "API Automation | Cubano"
description: "API automation of REST, SOAP & HTTP end points"
sitemap:
    priority: 0.7
---

# API Test Automation (REST / SOAP / HTTP)

This framework includes [HttpEasy](./httpeasy/overview), a fluent wrapper built around HttpUrlConnection.  The primary driver for this library was to create something that would work through corporate proxies - especially NTLM proxies, which is something that I've seen many libraries struggle with. 


## Alternatives:

* [RestAssured](http://rest-assured.io) is a very popular option
* [RestEasy](http://resteasy.jboss.org)
* https://github.com/jcabi/jcabi-http
* https://github.com/kevinsawicki/http-request
* wsimport
* SOAP with Attachments API for Java (SAAJ)
* Java API for XML Web Services (JAX-WS)
* Apache Camel. Camel will help you to:
    * Consume data from any source/format
    * Process this data
    * Output data to any source/format

    Apache Camel is developed with <a href="https://en.wikipedia.org/wiki/Enterprise_application_integration"  target="_blank">Enterprise Integration Patterns</a>.
    
    There are some <a href="http://tools.jboss.org/features/apachecamel.html" target="_blank">eclipse plugins</a> that offer drag and drop support for building and testing.
