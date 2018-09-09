---
title: "Chrome | Cubano"
description: "Describes the options for configuring the Chrome browser with Cubano"
sitemap:
    priority: 0.6
---

Documentation for the various [ChromeDriver](https://github.com/SeleniumHQ/selenium/wiki/ChromeDriver) options is at <https://sites.google.com/a/chromium.org/chromedriver/capabilities>.

One thing to watch out for with Chrome is that the tests will not be able to run if Chrome is already open. This issue happens because chromedriver will not be able to launch with the same profile if there is another open instance using the same profile. For example, if chrome.exe is already open with the default profile, chromedriver.exe will not be able to launch the default profile because chrome.exe is already open and using the same profile.

To fix this, you will need to create a separate profile for automation by copying the default profile so that chromedriver.exe and chrome.exe don't share the same default profile.

The default chrome profile is in this location:

`C:\Users\yourUserName\AppData\Local\Google\Chrome\User Data\`

Copy all files from User Data folder to a new folder and call it AutomationProfile

After you copy the files to the new folder then you can use it for your scripts.

~~~java
String userProfile= "C:\\Users\\YourUserName\\AppData\\Local\\Google\\Chrome\\AutomationProfile\\";
ChromeOptions options = new ChromeOptions();
options.addArguments("user-data-dir="+userProfile);
options.addArguments("--start-maximized");

driver = new ChromeDriver(options);
~~~

Make sure you use driver.quit() at the end of your test so that you don't keep chromedriver.exe open.
 
## Configuration

##### chrome.argument.&lt;number&gt;

"number" is meaningless but must be unique. The value must be a valid chrome argument.

A full list can be found here: [https://peter.sh/experiments/chromium-command-line-switches/](https://peter.sh/experiments/chromium-command-line-switches/)

For example, to prevent the popup "Chrome is being controlled by automated test software" from appearing when running automated tests use this: 

    chrome.argument.1 = disable-infobars
		
##### chrome.capability.&lt;any.valid.capability&gt;

Set desired capabilities.

##### chrome.extension.&lt;number&gt;

"number" is meaningless but must be unique. The path must point to a valid file

If the path contains `%PROJECT%` it will be replaced with root folder of project

##### chrome.option.&lt;any.valid.option&gt;

Some options you may want to consider:

[https://stackoverflow.com/questions/43797119/failed-to-load-extension-from-popup-box-while-running-selenium-scripts](https://stackoverflow.com/questions/43797119/failed-to-load-extension-from-popup-box-while-running-selenium-scripts)

	chrome.option.useAutomationExtension = false

##### chrome.preference.&lt;any.valid.preference&gt;

Some preferences you may want to consider:

[https://stackoverflow.com/questions/43797119/failed-to-load-extension-from-popup-box-while-running-selenium-scripts](https://stackoverflow.com/questions/43797119/failed-to-load-extension-from-popup-box-while-running-selenium-scripts)

	chrome.preference.useAutomationExtension = false
