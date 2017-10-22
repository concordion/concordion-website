---
title: "Internet Explorer | Cubano"
description: "Describes the options for configuring the Internet Explorer browser with Cubano"
sitemap:
    priority: 0.6
---

### Internet Explorer

Options for the various [InternetExplorerDriver](https://github.com/SeleniumHQ/selenium/wiki/InternetExplorerDriver) settings are at TODO ????

There is some configuration that must be done to ie https://github.com/SeleniumHQ/selenium/wiki/InternetExplorerDriver#required-configuration

Found that sendkeys can be very slow (1-2 seconds per character.
Mostly likely that is because the IE 32 bit version is being loaded and using 64 bit driver. Use wdm.architecture=32.  ie.capability.requireWindowFocus = true can also fix the problem.

InternetExplorerDriver properties describe many of the capabilities that can be configured.

##### ie.capability.&lt;any.valid.capability&gt;

Sets capabilities
