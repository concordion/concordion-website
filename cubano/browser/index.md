---
title: "Selenium WebDriver Support | Cubano"
description: "Describes the options for configuring the Selenium WebDriver browser automation support with Cubano"
sitemap:
    priority: 0.6
---

# Automating Web Applications
This framework uses Selenium WebDriver and recommends abstracting the specifics of the system under test away from the test using PageObjects. 

These patterns are widely written about and there are many resources available on the internet.  For developers and testers new to test automation I highly recommend looking at these two resources from Dave Haeffner:

1. <a href="https://seleniumguidebook.com" target="_blank">The Selenium Guidebook</a>: A guidebook into all things selenium including a guide to testers on what java they will need to learn 
1. <a href="http://elementalselenium.com" target="_blank">Elemental Selenium</a>: A weekly newsletter with different tips

While there are other patterns and approaches to test automation, the following patterns are those I've found to be most useful and can be developed with the minimum amount of effort and skill level.

## Page Object Pattern
The <a href="http://code.google.com/p/selenium/wiki/PageObjects" target="_blank">Page Object Pattern</a> is a pattern that abstracts a web page's UI into a reusable class. In addition to UI, the functionality of the page is also described in this class. This provides a bridge between page and test.

The idea is to create a level of abstraction to separate the tests from the system under test, and to provide a simple interface to the elements on the page. Here are the main advantages of Page Object Pattern using:

* Centralised UI coupling - one place to make changes around the UI
* Simple and clear tests (a readable DSL)
* Code reuse
* Easy creation of new tests

Further Reading: [martinfowler.com/bliki/PageObject.html](http://martinfowler.com/bliki/PageObject.html)

_Example of a login page object:_

~~~java
public class LoginPage extends PageObject<LoginPage>  {
    // @FindBy not required as unannotated WebElement will default 
    // to matching the field name against id and name attributes 
    WebElement username;
    WebElement password;
    
    @FindBy(id = "log_in")
    WebElement loginButton;

    public BpmLoginPage(TestDriveable test) {
        super(test);
    }

    @Override
    protected ExpectedCondition<?> pageIsLoaded(Object... params) {
        return ExpectedConditions.visibilityOf(loginButton);
    }

    public HomePage loginAs(User user) {
        if (user != null){
            this.username.sendKeys(user.getUsername());
            this.password.sendKeys(user.getPassword());
        }

        return navigateUsing(loginButton, HomePage.class);
    }
}
~~~

## Page Component Pattern
With single page applications and more advanced web applications with complex web controls the standard page object pattern can struggle.  As the test suite grows we may need to introduce other techniques to keep it maintainable and this is where the page component pattern fits in.

Page Components are classes that represent sections (header, footer, navigation bar), or complex controls, they are just like page objects... but littler.

We've included the open source project [Yandex Html Elements](https://github.com/yandex-qatools/htmlelements) that makes creating and using these components in a page object as simple as using any standard web element.

_Example of a simple component that would be used in place of the standard WebElement for a Dojo based WebApplication:_ 

~~~java
public class DijitWebElement extends HtmlElement {
    @FindBy(xpath = ".//input[contains(@class, 'dijitInputInner')]")
    WebElement input;
    
    @Override
    public String getText() {
        return input.getAttribute("value");
    }
    
    @Override
    public void sendKeys(CharSequence... charSequences) {
        input.sendKeys(charSequences);
    }
}
~~~

## Page Factory Pattern
In order to support the PageObject pattern, WebDriver's support library contains a factory class where we use the annotation `@FindBy` for making the WebElement object know which element it belongs to on web page. By using this pattern we need not to write the code for finding each and every Web Element.

This functionality is built into the framework, the only requirement is that your page objects inherit from BasePageObject - although I recommend you have an additional layer called PageObject so you can put any application specific custom functionality in this layer.  

## Fluent Pattern  
The idea behind a Fluent interface is that one can apply multiple properties to an object by connecting them with dots, without having to re-specify the object each time.

This applies to all reusable objects, not just page objects and probably should be highlighted earlier but developers and testers new to this approach need to understand the above patterns first.

_Example of a test calling page objects implementing the fluent pattern:_

~~~java
@Test
public void newLodgementPopulatesSummaryPage() {
    SummaryPage summaryPage = LoginPage
        .visit(driver)
        .fillDefaultUser()
        .login()

        .fillNewLodgementFields(data)
        .clickNextButton()

        .fillDeclaration(data);

    assertThat("Summary Page is populated correctly", summaryPage.checkData(data),  is(""));
}   
~~~

## Beyond The Page Object Pattern
I haven't used it, but I keep coming across the Screenplay Pattern (formerly known as the <a href="http://www.slideshare.net/RiverGlide/a-journey-beyond-the-page-object-pattern"  target="_blank">Journey Pattern</a>). 

Further Reading:

* https://ideas.riverglide.com/page-objects-refactored-12ec3541990#.cvqm92cpv
* https://fasterchaos.svbtle.com/journey-pattern
* https://confengine.com/selenium-conf-2016/proposal/2475/the-trouble-with-page-objects-things-you-always-knew-were-wrong-but-couldnt-explain-why


