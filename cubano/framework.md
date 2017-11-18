---
title: "Framework | Cubano"
description: "Cubano is a 'ready-made' test framework that provides everything at your fingertips. It's ideal for software delivery teams who want to collaborate around living documentation."
sitemap:
    priority: 0.7
---

Cubano is a test automation framework written in Java that provides a structure for developing acceptance and regression tests so your team can hit the ground running and not have to waste time needlessly building and maintaining your own framework.

While Cubano can be used to write standard JUnit and TestNG tests, the real power comes when when you use it's integration with Concordion to create beautiful living documentation that can drive the system under test - whether that system runs in a browser, service or device.

# Core Third Party Components

* <a href="http://concordion.org" target="_blank">Concordion</a>: an open source tool for automating living documentation (aka Specification by Example, Acceptance Test Driven Development, etc)
* <a href="http://www.seleniumhq.org/projects/webdriver" target="_blank">Selenium WebDriver</a>: an API for automating user actions on a browser
* <a href="https://github.com/yandex-qatools/htmlelements" target="_blank">Yandex Html Elements</a>: a framework providing easy-to-use way of interaction with web-page elements
* <a href="http://www.slf4j.org/" target="_blank">SLF4J</a> and <a href="http://logback.qos.ch/" target="_blank">Logback</a>: logging framework 
* <a href="http://junit.org" target="_blank">JUnit</a>: a simple framework to write repeatable tests, it is an instance of the xUnit architecture for unit testing frameworks
* <a href="http://gradle.org" target="_blank">Gradle</a>: a build and dependency management tool, this can be replaced with Maven if you're already using Maven and don't want two different build tools 


# Writing the Specifications and Tests
This framework uses Concordion to produce living documentation as it gives a lot of flexibility in formatting the specification over tools like <a href="https://cucumber.io" target="_blank">Cucumber</a>.

There are books written on the subject of what makes a good specification so I'm not going to attempt to cover that here, I will point you to a couple of good resources:

* <a href="https://gojko.net/books/specification-by-example/" target="_blank">Specification by Example: How Successful Teams Deliver the Right Software by Gojko Adzic</a> - the bible for Specification by Example
* <a href="http://concordion.org/technique/java/markdown/" target="_blank">Concordion's Hints and Tips</a>

When developing the test suite there are a few goals we want to achieve:

* Readable: tests should be easily understood and allow for the fact that it will have different audiences with different needs: some just want an overview of what the system does, others will want a more technical understanding and others need to know exactly what the test did to diagnose issues
* Robust: a screen change in the application under test should not mean the test suite has to be changed in multiple places
 
To meet these goals there are a few patterns that we will need to use, these have been documented below.  The patterns all follow a theme, and that theme is _abstraction_.

## Specification
Concordion supports writing a specification in both <a href="http://concordion.org/instrumenting/java/html/" target="_blank">HTML</a> and <a href="http://concordion.org/instrumenting/java/markdown/" target="_blank">Markdown</a>.  I recommend markdown as it is much quicker to write than html and non developers generally will pick it up quicker.

Avoid writing tests that read like scripts and don't get too involved in the implementation details of the system under test.  These lead to specifications that require changing as the system under test is changed.  

Avoid copying code into tests, eg if asserting that an error is displayed just assert that the element is visible rather checking the contents of the message as this may change at any time leading to brittle tests - unless the content of the message is important and worth validating.

Aim for a level of abstraction away from the implementation of the system under test.

## Test
Concordion runs on top of JUnit but you'll find that your test 'fixtures' (the class your specification uses) don't look anything like a standard JUnit test suite.  

The code in here should not contain any system implementation details and provides another level of abstraction.

## Driver
The driver is the bit that talks to the system under test.  This could be a PageObject for a Web Application or a class to call the Web Services the system under test exposes.  It could also be wrapper around the database or email system.

The objective behind these classes is to group related action in one place so that if the system under test changes then there is only one place to fix and test code to reflect that change. 

## Workflow
Often there are repeated actions that the tests perform, such as logging into an application.  These can get abstracted out into a workflow class to avoid repeating the same sequence of actions in all your tests. 



# Framework
## Configuration Settings

The framework includes a [Config](https://github.com/concordion/cubano/blob/master/cubano-config/src/main/java/org/concordion/cubano/config/Config.java) class which scans config.properties for the properties the framework exposes.  For applications specific properties create an AppConfig class that extends off config and expose these via that class.  

## HttpEasy
[HttpEasy](./api/httpeasy): provides a fluent style wrapper around HttpURLConnection.  It can:

* handle most HTTP methods (GET, POST, HEAD, etc)
* upload and download files
* perform REST and SOAP requests
* handle corporate proxies 

## ActionWait
[ActionWait](https://github.com/concordion/cubano/blob/master/cubano-core/src/main/java/org/concordion/cubano/driver/action/ActionWait.java): Similar to Selenium's [FluentWait](https://seleniumhq.github.io/selenium/docs/api/java/org/openqa/selenium/support/ui/FluentWait.html) implementation but designed for long running tasks such as querying a database until some data appears and unlike FluentWait it handles exceptions other than RuntimeExceptions.

## ActionTimer
[ActionTimer](https://github.com/concordion/cubano/blob/master/cubano-core/src/main/java/org/concordion/cubano/driver/action/ActionTimer.java): a simple utility for logging duration of a task

## Exception Handling
As a general rule of thumb - don't!

The framework will catch and log all exceptions, so only catch an exception if you need to perform a special action in the event an exception is thrown.

## Logging
The framework uses the [Concordion Logback extension](https://github.com/concordion/concordion-logback-extension) to keep a separate log per test and a link to the log is added to the bottom right of the page.  

Actual implementation is a combination of [SLF4J](http://www.slf4j.org/) and [Logback](http://logback.qos.ch/). 

~~~java
	import org.slf4j.Logger;
	import org.slf4j.LoggerFactory;
	
	public abstract class YourClass {
		private static final Logger logger = LoggerFactory.getLogger(YourClass.class);
		
		...
	}
~~~
_Do not use System.out.println() or java.util.logging._
  
### Log level usage:

* Exception: are automatically caught and logged so you do not need to explicitly handle those
* Warning: use as needed
* Info: should only be used for very high level concepts so that they don't show up on the Jenkins console, I try to keep that to a minimum
* Debug: should use for test steps eg. going to a page
* Trace: should use for finer level eg. filling field on a page

## Storyboard
The framework uses the [Concordion Storyboard extension](https://github.com/concordion/concordion-storyboard-extension) to record the steps taken to perform the test, such as screenshots and SOAP or REST requests and response data.  

This serves several purposes:
* It is a nice addition to the documentation
* It is a fantastic debugging tool

If you use the navigateUsing() method in your page objects when an element is about to be clicked that performs a page navigation then screenshots will be added to the storyboard automatically, eg `navigateUsing(loginButton)`. This has the added advantage that way if any actions have been performed on the screen (eg data entered) then those details are available in the screenshots. 

## HtmlElement
The framework includes [Yandex Html Elements](https://github.com/yandex-qatools/htmlelements) as means of providing easy-to-use way of breaking complex web pages into page components that also works seamlessly with the page factory.

We also provide a couple of interfaces that your component can implement that allow it to work with the framework more easily:

* [WebDriverAware](https://github.com/concordion/cubano/blob/master/cubano-webdriver/src/main/java/org/concordion/cubano/driver/web/pagefactory/WebDriverAware.java): will supply the WebDriver to the component
* [PageObjectAware](https://github.com/concordion/cubano/blob/master/cubano-webdriver/src/main/java/org/concordion/cubano/driver/web/pagefactory/PageObjectAware.java): will supply page object the component is on to the component 

# Guidelines
These are general recommendations rather than hard and fast rules.

## Coding Standards
Treat test code as a first class citizen - it needs the same level of code quality as your application code otherwise tests will become unmaintainable.

## Configuration
Tests must be environment independent in that they must be able run in any environment (with the possible exception of production) by only changing the URL the tests are running against. Plan for this by:
* have a configuration file for environment settings
* having tests validate required data exists and set it up if its missing
* DO NOT have tests use manually setup data - it won't exist in the next environment

## Run Tests in Parallel
Eventually the test suite is going to take too long to run, and tests will need to run in parallel.  I suggest we should start out doing this straight away so any issues are caught early - it can take a very long time to refactor existing tests if you do this down the track.  This will require Selenium Grid.

## Fail Fast
If something fails, it's usually a good idea to [fail fast](http://concordion.org/coding/java/markdown/#fail-fast) and exit the specific test immediately rather than allow the test to muddle along.

## Test Inheritance
Tests inheriting from or calling other test should be kept to a minimum, in my experience this leads to hard to understand tests and a fragile test suite that is not easily modified.

## Asserts
Asserts belong in the specification and not the tests.

## What to Test
Don't try to automate everything, there needs to be a return on investment.  If it's going to take too long to develop or run maybe it should remain a manual step.  Functional tests are one component in the stack of: unit, integration, functional, exploratory (manual), and performance testing.

Test pyramid <a href ="http://martinfowler.com/bliki/TestPyramid.html" target="_blank">http://martinfowler.com/bliki/TestPyramid.html</a>

## Exceptions vs Failures
An exception should prevent running any further tests in the spec, a failure will allow the rest of the spec to complete.  In Concordion this is implemented by the `@FailFast` annotation.


# How To...
## Choose your browser
For developing tests, use whatever browser works for you... or go with Firefox.  It is the industry standard for developing automated test suites in WebDriver and Selenium WebDriver comes with support for Firefox out of the box.  Firefox also has a couple of great plugins (Firebug and FirePath) that make finding and testing element locators a breeze.  

For running tests in your CI server then this will depend on the project.  Are you developing in house for a specific browser and version?  Is it a public web application running on multiple browsers and devices?  Cubano can run either local desktop browsers with support out of the box for Firefox, Chrome and Internet Explorer, or on a remote Selenium Grid with support for [BrowserStack](https://www.browserstack.com/) or [SauceLabs](https://saucelabs.com/).

## Create a PageObject
When starting with a new page you're going to want to create a page object as your first step.  

Navigate to the page and use a combination of Firebug and FirePath Firefox plugins (or use the inbuilt Developer Tools) to find the locaters for the WebElements you wish to use. This can be rather tedious on a page with lots of elements but there is not a lot of options:

1. Right click on an element and select 'Inspect Element'
1. On highlighted html in Firebug right click and select 'Copy Unique Selector'
1. Use this value in your PageObject
1. Use FirePath to validate your CSS selector

Other options:
* Use the test suite to navigate to the page you're after.  
* Develop a page object generator using WebDriver to parse the page and generate an initial page object.

## Use a selector for page elements
Generally the preferred method of finding elements on a page is by their Id, if that's not available then use a CSS selector and finally XPath if all else fails.

If using CSS / XPath don't specify parent controls if it can be helped, this has the following benefits:

* Less brittle - the page object should withstand some page refactoring without breaking 
* Readability

If the id / class name that you are selecting on is not unique then put the minimum number of parents that you can.
Examples of CSS selectors can be found here: 

* [W3 Schools CSS Selectors](http://www.w3schools.com/cssref/css_selectors.asp )
* [Guru99 XPath Contains, Sibling and Ancestor functions](http://www.guru99.com/using-contains-sbiling-ancestor-to-find-element-in-selenium.html)

It's worth considering wrapping the complex web controls or section of pages that are repeated across other pages as page components. 

## Wait for a page element
_NEVER_ use thread.sleep().  Ever!

_DO NOT_ use WebDrivers implicit wait feature - it's too broad reaching for our needs and doesn't play well with explicit waits.

_DO_ use WebDriverWait, FluentWait 

_DO_ use @timeout field annotation:

* this performs an implicit wait on any element it's applied to
* don't apply it to an element that you are also performing an explicit wait on  

## Wait for anything else
_NEVER_ use thread.sleep().  Ever!

Use the frameworks built in [ActionWait](https://github.com/concordion/cubano/blob/master/cubano-core/src/main/java/org/concordion/cubano/driver/action/ActionWait.java) utility.
