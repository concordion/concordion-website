---
title: "Concordion | Runners and Drivers"
heading: "Runners and Drivers"
description: "Layering test code with Runners and Drivers"
identifier: "runners-drivers"
author: "Nigel Charman"
homepage: http://tutansblog.blogspot.co.nz/
---

This article describes the Runners and Drivers pattern which enables test code to be layered with clean interfaces. This enhances maintainability of the code and leads to effective reuse of the application drivers across test suites. In addition, it opens up the drivers for use in exploratory and maintenance scripting. It also avoids lock-in to any specific test runner or driver, opening up the potential for future migration to new test runners or drivers.

![Visual representation of Layering test code with Runners and Drivers]({{ site.baseurl }}/img/runners-drivers.png)

## Application Drivers
An Application Driver is responsible for manipulating an application through one of its interfaces (eg. web app, web service, database, desktop application, host, message queue). 

The Driver will normally require a 3rd party library to interface with the application, such as Selenium WebDriver. (In some cases, it is also possible to interface directly with the service layer of the application.)

A basic driver may expose its functionality in terms of actions on the interface - eg. enter first name, click OK, get error message. 

It is often worthwhile to add functionality to group the actions into workflows that represents the business intent, eg. update payee details, make one-off payment.

A common pattern used for Application Drivers is the [Page Object](https://github.com/SeleniumHQ/selenium/wiki/PageObjects) pattern. This encapsulates the logic for driving a page in one place so that it is simple to change, and provides an easy interface for users.  Example usage (using Groovy) might be:

```groovy
def loginPage = gotoLoginPage()
def landingPage = loginPage.loginAs("user123", "password")
def oneOffPaymentPage = landingPage.selectOneOffPayment()
oneOffPaymentPage.pay(230.50, "06-9952-5439870-01")
```

It is good practice to break the test fixtures into separate Action and Page objects. The Action objects implement user actions, such as "Transfer money between accounts". The Page objects abstract operations on the web page, for instance "Click on Transfer button". The acceptance and automated tests should use the Action objects where possible, but may need to use the Page objects for some operations. The Page objects isolate the tester from changes to the web page (for example if the location or name of the Transfer button are changed). The Action objects isolate the tester from higher level changes, such as "Transfer money" being implemented using a different workflow or metaphor (eg drag and drop).

## Runners
Once you have implemented Application Drivers, they can be reused for a number of use cases, for example:

* running tests,
* data setup,
* scripting 

You can use a wide variety of frameworks for running the tests, including basic xUnit style, Specification by Example (such as Concordion), data-driven, keyword-driven etc. These frameworks run the tests and report test results for the user.

Data setup could be spreadsheet-driven, and could be one-off (eg. data migration) or part of a regular test setup.

Scripting would use a language such as Groovy, VBScript, Python or Ruby to perform custom actions on the application. When performing exploratory testing, you can speed up repetitive actions (eg. logon and navigation) through scripting.

## Advantages of using Runners and Drivers
By separating drivers and runners, you achieve a high degree of reuse. 

It is important to never include test logic in the Application Drivers, otherwise your Driver becomes tied to the particular test runner framework that you are using. Similarly don’t expose driver specifics to the test layer - for example, you should return `Strings` or domain objects rather than return `WebElements`. 

With the right level of abstraction, you minimise the changes required to test code when the application changes - with the goal of only needing one change to test code for each application change. As the organisation grows a library of drivers, you are able to capitalise upon the work of others to quickly create new tests.
