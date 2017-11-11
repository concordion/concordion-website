---
title: "Opera | Cubano"
description: "Describes the options for configuring the Opera browser with Cubano"
sitemap:
    priority: 0.6
---

# Opera

There is a known issue with Opera whereby it can't find opera.exe path by default, and the path must be set to `C:\Program Files\Opera\<version>\opera.exe` 

[https://github.com/operasoftware/operachromiumdriver/issues/9]()

[https://github.com/operasoftware/operachromiumdriver/issues/19]()


## Configuration

##### opera.exe

Specify the location of the browser executable, eg:

    opera.exe = C:\Program Files\Opera\48.0.2685.52\opera.exe

##### opera.capability.&lt;any.valid.capability&gt;

