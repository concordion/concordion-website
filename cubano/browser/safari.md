### Safari

Unlike the other browsers, Safari 10 and above come with built-in [WebDriver support](https://webkit.org/blog/6900/webdriver-support-in-safari-10/). To use the Safari driver you need to configure Safari to allow automation. As a feature intended for developers, Safari’s WebDriver support is turned off by default. To turn on WebDriver support, do the following:

1. Ensure that the Develop menu is available. It can be turned on by opening Safari preferences (Safari > Preferences in the menu bar), going to the Advanced tab, and ensuring that the Show Develop menu in menu bar checkbox is checked.

1. Enable Remote Automation in the Develop menu. This is toggled via Develop > Allow Remote Automation in the menu bar.

1. The documentation states that you will also need to "authorize safaridriver to launch the WebDriver service which hosts the local web server. To permit this, run `/usr/bin/safaridriver --enable` once and complete the authentication prompt if it is shown.". However it appears to run just fine without this step.

When using Selenium WebDriver, Safari opens a window that does not get closed when the tests complete.

#### Configuration

Apart from the standard settings (proxy, size, etc) there appears to be very little that can be configured in Safari as per [Getting Started](https://github.com/SeleniumHQ/selenium/wiki/SafariDriver). 

Safari can have problems with the webdriver.browser.postion setting, so use this with care. 

===== option.useTechnologyPreview
Defaults to false

===== option.useCleanSession 
Defaults to false
