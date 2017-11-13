---
title: "Database Access | Cubano"
description: "Querying databases"
sitemap:
    priority: 0.6
---

# Automating Database Requests
There are a range of options:

**Low Level:**
* JDBC: will meet your needs but needs some work to get going

**Lightweight:** 

My personal preference would be to use either of these libraries for the flexibility they add with named parameter support and POJO mapping.  They get you up and running immediately 
and are simpler than JDBC.

* <a href="http://zsoltherpai.github.io/fluent-jdbc/" target="_blank">Fluent JDBC</a>: is a java library for operating with SQL queries conveniently
* <a href="http://jdbi.org/" target="_blank">JDBI</a>: a SQL convenience library for Java

**Other:**
Generally a full ORM package such as Hibernate or JPA will be overkill for your needs.  <a href="http://www.jooq.org/" target="_blank">jOOQ</a> looks like an interesting alternative but is still overkill for most testing requirements in my opinion.  
