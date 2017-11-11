---
title: "Selenium WebDriver Support | Cubano"
description: "Describes the options for configuring the Selenium WebDriver browser automation support with Cubano"
sitemap:
    priority: 0.6
---


# Automating Web Applications
This framework uses Selenium WebDriver and recommends abstracting the specifics of system under test away from the test using PageObjects. 

These patterns are widely written about and there are many resources available on the internet.  For developers and testers new to test automation I highly recommend looking at these two resources from Dave Haeffner:

1. <a href="https://seleniumguidebook.com" target="_blank">The Selenium Guidebook</a>: A guidebook into all things selenium including a guide to testers on what java they will need to learn 
1. <a href="http://elementalselenium.com" target="_blank">Elemental Selenium</a>: A weekly newsletter with different tips

While there are other patterns and approaches to test automation, the following patterns are those I've found to be most useful and can be developed with the minimum amount of effort and skill level.

## Page Object Pattern
The <a href="http://code.google.com/p/selenium/wiki/PageObjects" target="_blank">Page Object Pattern</a> is a pattern that abstracts a web page's UI into a reusable class. In addition to UI, functionality of the page is also described in this class. This provides a bridge between page and test.

The idea is to create a level of abstraction to separate the tests from the system under test, and to provide a simple interface to the elements on the page. Here are the main advantages of Page Object Pattern using:

* Centralised UI coupling - one place to make changes around the UI
* Simple and clear tests (a readable DSL)
* Code reuse
* Easy creation of new tests

Further Reading: <a href="http://martinfowler.com/bliki/PageObject.html" target="_blank">martinfowler.com/bliki/PageObject.html</a>

_Example of a login page object:_

```java
	public class LoginPage extends PageObject<LoginPage>  {
		// @FindBy not required as unannotated WebElement will default 
		// to matching the field name against id and name attributes 
		WebElement username;
		WebElement password;
		
		{@literal @FindBy(id = "log_in")}
		WebElement loginButton;
	
		public BpmLoginPage(TestDriveable test) {
			super(test);
		}
	
		{@literal @Override}
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
```

## Page Component Pattern
With single page applications and more advanced web applications with complex web controls the standard page object pattern can struggle.  As the test suite grows we may need to introduce other techniques to keep it maintainable and this is where the page component pattern fits in.

Page Components are classes that represent sections (header, footer, navigation bar), or complex controls, they are just like page objects... but littler.

We've included the open source project '<a href="https://github.com/yandex-qatools/htmlelements" target="_blank">Yandex HtmlElements</a>' that makes creating and using these components in a page object as simple as using any standard web element.

_Example of a simple component that would be used in place of the standard WebElement for a Dojo based WebApplication:_ 

	public class DijitWebElement extends HtmlElement {
		{@literal @FindBy(xpath = ".//input[contains(@class, 'dijitInputInner')]")}
		WebElement input;
		
		{@literal @Override}
		public String getText() {
			return input.getAttribute("value");
		}
		
		{@literal @Override}
		public void sendKeys(CharSequence... charSequences) {
			input.sendKeys(charSequences);
		}
	}

## Page Factory Pattern
In order to support the PageObject pattern, WebDriver's support library contains a factory class where we use the annotation @FindBy for making the WebElement object to know to which element it belongs to on web page. By using this pattern we need not to write the code for finding each and every Web Element.

This functionality is built into the framework, the only requirement is that you page objects inherit off BasePageObject - although I recommend you have an additional layer called PageObject so you can put any application specific custom functionality in this layer.  

## Fluent Pattern  
The idea behind a Fluent interface is that one can apply multiple properties to an object by connecting them with dots, without having to re-specify the object each time.

This applies to all reusable objects, not just page objects and probably should be highlighted earlier but for developers and testers new to this approach need to understand the above patterns first.

_Example of a test calling page objects implementing the fluent pattern:_

	{@literal @Test}
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

## Beyond The Page Object Pattern
I haven't used it, but I keep coming across the Screenplay Pattern (formerly known as the <a href="http://www.slideshare.net/RiverGlide/a-journey-beyond-the-page-object-pattern"  target="_blank">Journey Pattern</a>). 

Further Reading:

* https://ideas.riverglide.com/page-objects-refactored-12ec3541990#.cvqm92cpv
* https://fasterchaos.svbtle.com/journey-pattern
* https://confengine.com/selenium-conf-2016/proposal/2475/the-trouble-with-page-objects-things-you-always-knew-were-wrong-but-couldnt-explain-why




# Cubano WebDriver Manager

Provides a set of 'managed' browser providers that will automatically download and start the driver required for the browser your test is targeting.

The automatic Selenium WebDriver binaries management functionality is provided by the [https://github.com/bonigarcia/webdrivermanager](Bonigarcia WebDriver Manager) GitHub project.


# Configuration

All configuration is placed in the test project's config.properties or user.properties files (see cubano-config for more details) on these files.

Cubano will pick default settings where it can, but if you're behind a proxy then you'll need to supply the proxy settings if you wish to have the browser drivers automatically downloaded.


## Bonigarcia WebDriver Manager Configuration

If proxy settings have been configured for the project, WebDriver Manager will be configured to use the proxy settings.

WebDriver manager supports a number of settings to customise its behaviour. Any settings in the configuration files starting with 'wdm.' will be passed to WebDriver Manager, documentation for these settings can be found at [https://github.com/bonigarcia/webdrivermanager]( - ).

Some recommend settings for use in your project, particularly if you're on a corporate network where your user files end up on the network rather than your PC are:

    wdm.targetPath=/path/to/keep/WebDriverManager

If you do not wish to have the drivers downloaded and/or updated automatically you will need to set and place the required driver files in 'wdm.targetPath' yourself

    wdm.forceCache=true

Browser specific overrides can be added in the format `<browser>.wdm.architecture=x32`.  This feature is really only useful for `wdm.architecture` as WDM doesn't support browser specific settings for this.

## Selenium WebDriver Configuration

These settings apply to all browsers.

##### webdriver.browserProvider

The fully qualified name of the browser provider class, if using one of the built in provider classes the package name is not required as it will default to "org.concordion.cubano.driver.web.provider".
* This may be overridden by setting the system property browserProvider

*Local browser options:*
* [ChromeBrowserProvider](chrome)
* ChromeHeadlessBrowserProvider (TODO NOT YET DEVELOPED)
* [EdgeBrowserProvider](edge)
* [FirefoxBrowserProvider](firefox) (default if setting not supplied)
* FirefoxHeadlessBrowserProvider (TODO NOT YET DEVELOPED)
* [InternetExplorerBrowserProvider](ie)
* [OperaBrowserProvider](opera)
* [SafariBrowserProvider](safari)
    
These have been chosen as they are the most commonly used browsers and are supported by the Bonigarcia WebDriver Manager and will automatically download the driver executable required to drive the associated browser. 

If you wish to use an alternative browser you will need to download the browser driver and create a new class implementing the BrowserProvider interface.
    
*Local Selenium Grid:*

* SeleniumGridBrowserProvider (NOT YET DEVELOPED)
        
*Remote Selenium Grid:*

* BrowserStackBrowserProvider (NEEDS WORK)
* SauceLabsBrowserProvider (NEEDS WORK)


##### webdriver.browser.position

Specify a custom window location for browser in the format &lt;X&gt;x&lt;Y&gt;, eg 1x1

##### webdriver.browser.dimension

Specify a custom window size for browser in the format &lt;width&gt;x&lt;height&gt;, eg 192x192

##### webdriver.browser.maximized

If set to true will maximize the browser when it is first opened 
* Defaults to false, allowed values are true or false

##### webdriver.event.logging

If set to true will log all the actions the tests are making to Selenium WebDriver using  
* Defaults to true, allowed values are true or false

##### webdriver.timeouts.implicitlywait

If you wish to use implicit rather than explicit waits then configure this value
* Defaults to 0
* Refer to the documentation on Cubano's BasePageObject for more information on this setting
TODO Add documentation to BasePageObject on [Yandex HtmlElements](https://github.com/yandex-qatools/htmlelements) 
* WARNING: Do not mix with Selenium WebDriver's implicit or explicit waits as the timeout behaviour becomes unpredictable.

##### proxy.required

If true then the proxy will be set on the requested browser
* Defaults to false, valid options are true or false

See cubano-config for more proxy settings.


