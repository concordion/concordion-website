---
title: "Firefox | Cubano"
description: "Describes the options for configuring the Firefox browser with Cubano"
sitemap:
    priority: 0.6
---

### FireFox

Options for the various [FirefoxDriver](https://github.com/SeleniumHQ/selenium/wiki/FirefoxDriver) settings are at TODO ???? https://stackoverflow.com/questions/42529853/list-of-firefox-and-chrome-arguments-preferences
https://github.com/mozilla/geckodriver

Check https://github.com/mozilla/geckodriver/releases to ensure that driver you require is there

#### Firefox Portable

[Firefox Portable](https://portableapps.com/apps/internet/firefox_portable) can also be used and is a great choice if you need a different version than your installed Firefox version for any reason. 

As with Firefox, any versions prior to 48 will need the legacy flag set to true, see configuration section below for more details. Note: FirefoxPortable 47 has a bug an will not work with Selenium WebDriver. FirefoxPortable 47.0.1 works fine.
  
You will need to specify the location of the executable using the firefox.exe configuration property:

* In some corporate environments you may have to rename the executable to get around polices that block FirefoxPortable.exe.
* From version 48 onwards (ie when using the marionette/gecko driver) make sure you are pointing to "\path\to\FirefoxPortable\App\Firefox64\firefox.exe" and not just "\path\to\FirefoxPortable\FirefoxPortable.exe"

You'll may also want to configure Firefox Portable to run any time, regardless of how many other instances of Firefox or FirefoxPortable that are running:
  
1. Copy FirefoxPortable.ini from FirefoxPortable\Other\Source to FirefoxPortable\
1. Edit FirefoxPortable.ini and change AllowMultipleInstances=false to AllowMultipleInstances=true

#### Proxy Configuration

Proxy support in geckodriver is only arriving with Firefox 57.  There are however a couple of other ways to configure via the Firefox profile preferences.

Note: If you have `firefox.profile = none` in your configuration file you will not be able to use either of these techniques.

1. Place `firefox.profile = default` (or a named profile that you have created and configured) in your configuration file, FirefoxBrowserProvider will use that profile and automatically pick up whatever proxy settings you have configured in Firefox.
 
2. Place some of the following settings in your configuration file.  Note:
* Set proxy.required = false or else the FirefoxBrowserProvider will also try to configure the proxy settings
* To use these settings they will need to be prefixed with "firefox.profile." for the FirefoxBrowserProvider to pick them up.  
* Using firefox.profile.network.proxy.type = 4 should generally be enough

network.proxy.type

    0 - Direct connection (or) no proxy.
    1 - Manual proxy configuration
    2 - Proxy auto-configuration (PAC).
    4 - Auto-detect proxy settings.
    5 - Use system proxy settings.

network.proxy.http
network.proxy.http_port
network.proxy.ftp
network.proxy.ftp_port
network.proxy.ssl
network.proxy.ssl_port
network.proxy.autoconfig_url
network.proxy.no_proxies_on

 
#### Configuration

##### firefox.useLegacyDriver

Up to version 47, the driver used to automate Firefox was an extension included with each client. 

Marionette is the new driver that is shipped/included with Firefox. This driver has it's own protocol which is not directly compatible with the Selenium/WebDriver protocol.

The Gecko driver (previously named wires) is an application server implementing the Selenium/WebDriver protocol. It translates the Selenium commands and forwards them to the Marionette driver.

For older browsers (version 47 and below) set this property to true, for newer browsers set this to false (default).

##### firefox.disable.logs

Firefox is now logging screeds of debug entries and currently have a bug that prevents reducing the log level - this blocks all logging by firefox and geckoDriver.

Defaults to true.  If you're having problems starting Firefox set this to false to help track down the cause.

##### firefox.exe

Specify the location of browser if your firefox installation path is not automatically discoverable, eg:
* %USERPROFILE%/Documents/Mozilla FireFox Portable/FirefoxPortable.exe

##### firefox.profile

Specifies the profile name, or full path to a folder, of the firefox profile that you wish to use. There is a good write up on the subject at http://toolsqa.com/selenium-webdriver/custom-firefox-profile.

Values:
* (not specified): will create a new firefox profile using ``new FirefoxProfile()`` which is the recommended behaviour for firefox
* none: no profile will be created 
* default: will use the profile that all users typically use 
    * this will allow you to use any add ons such as firebug and firepath that you may have installed
    * it is a great option for test developers who may use the tests to navigate to a page where they can stop the tests and still have the add-ons they need to inspect the page     
* &lt;custom&gt;: name of any other profile you have configured in firefox - it must exist
* &lt;path&gt;: directory name of a custom profile: it must exist

WARNING: At present if a profile is created or used when using the gecko / marionette driver then it suffers from a memory leak. See https://github.com/mozilla/geckodriver/issues/983 and https://stackoverflow.com/questions/46503366/firefox-memory-leak-using-selenium-3-and-firefoxprofile 


These are automatically set to prevent firefox automatically upgrading when running tests (assuming profile is not set to none)

    firefox.profile.app.update.auto = false
    firefox.profile.app.update.enabled = false
        

##### firefox.profile.&lt;any.valid.profile.setting&gt;

If a profile has been chosen then firefox preferences can be set, for example:

    # Work around for FireFox not closing, fix comes from here: https://github.com/mozilla/geckodriver/issues/517
    firefox.profile.browser.tabs.remote.autostart = false
    firefox.profile.browser.tabs.remote.autostart.1 = false
    firefox.profile.browser.tabs.remote.autostart.2 = false
    firefox.profile.browser.tabs.remote.force-enable = false

##### firefox.capability.&lt;any.valid.capability&gt;

Sets capabilities, for example:
 
    firefox.capability.acceptSslCerts = false

##### firefox.extension.&lt;number&gt;

"number" is meaningless but must be unique. The path must point to a valid file

If the path contains "%PROJECT%" it will be replaced with root folder of project
