---
title: "Browser Providers | Cubano"
description: "Describes the options for configuring the Selenium WebDriver browser automation support with Cubano"
sitemap:
    priority: 0.6
---

To drive a browser using Seleniun WebDriver we need several things:

1. A browser
2. A browser driver
3. A handle to the browser in the form of the Selenium WebDriver class

Cubano's browser providers are what gives us all of this.

They also come in several two flavours:

## Local Providers

Browsers running on the local PC.

## Selenium Grid Providers

Browser(s) running on remotely.

* Home grown (ie something that you or your company are running)
* Browser Stack
* Sauce Labs

 
# Cubano WebDriver Manager

Provides a set of 'managed' browser providers that will automatically download and start the driver required for the browser your test is targeting.

The automatic Selenium WebDriver binaries management functionality is provided by the [Bonigarcia WebDriver Manager](https://github.com/bonigarcia/webdrivermanager) GitHub project.


# Configuration

All configuration is placed in the test project's config.properties or user.properties files (see cubano-config for more details) on these files.

Cubano will pick default settings where it can, but if you're behind a proxy then you'll need to supply the proxy settings if you wish to have the browser drivers automatically downloaded.


## Bonigarcia WebDriver Manager Configuration

If proxy settings have been configured for the project, WebDriver Manager will be configured to use the proxy settings.

WebDriver manager supports a number of settings to customise its behaviour. Any settings in the configuration files starting with 'wdm.' will be passed to WebDriver Manager, documentation for these settings can be found at [https://github.com/bonigarcia/webdrivermanager](https://github.com/bonigarcia/webdrivermanager).

Some recommend settings for use in your project, particularly if you're on a corporate network where your user files end up on the network rather than your PC are:

    wdm.targetPath=/path/to/keep/WebDriverManager

If you do not wish to have the drivers downloaded and/or updated automatically you will need to set and place the required driver files in `wdm.targetPath` yourself

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
* Refer to the documentation on Cubano's BasePageObject for more information on this setting<br/>
TODO Add documentation to BasePageObject on [Yandex Html Elements](https://github.com/yandex-qatools/htmlelements) 
* WARNING: Do not mix with Selenium WebDriver's implicit or explicit waits as the timeout behaviour becomes unpredictable.

##### webdriver.browser.restartAfterXTests
Number of tests to run before restarting browser.  Firefox 48+ with gecko driver is prone to memory leaks and restarting the browser will clear the consumed memory.

* Defaults to 0 - Only close browser once all tests are completed

##### webdriver.browserdriver.cleanup
If set to true will run taskkill on windows, or pkill on linux based systems to terminate any running Selenium browser drivers. Note, this will not close any browsers, just the drivers. 
* Defaults to false, allowed values are true or false

##### proxy.required

If true then the proxy will be set on the requested browser
* Defaults to false, valid options are true or false

See cubano-config for more proxy settings.


