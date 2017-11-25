---
title: "HTTP Easy | Cubano"
description: "Library for API requests"
sitemap:
    priority: 0.7
---

# Automating Services (REST / SOAP / HTTP )

HttpEasy provides a fluent style wrapper around HttpURLConnection. It can:

* handle most HTTP methods (GET, POST, HEAD, etc)
* upload and download files
* perform REST and SOAP requests
* handle corporate proxies, including NTLM proxies which is something that I've seen several popular libraries struggle with 

HttpEasy has full support for HTTP methods such as GET, POST, HEAD, etc
and supports the REST and SOAP protocols and parsing JSON and XML responses.

This is been designed with a fluent REST API similar to RestEasy and
RestAssurred with the only real difference being that it has great proxy
support.

There are two starting points for creating a rest request:

* `HttpEasy.withDefaults()` - allows you to set some settings that apply to all requests such as configuring a proxy
* `HttpEasy.request()` - performs the actual call, these HTTP methods are implemented: GET, HEAD, POST, PUT, DELETE

Note: if your url can contain weird characters you will want to encode it,
something like this: myUrl = URLEncoder.encode(myUrl, "UTF-8");
 
__Example__
~~~java
HttpEasyReader r = HttpEasy.request()
    .baseURI(someUrl)
    .path(viewPath + "?startkey=\"{startkey}\"&endkey=\"{endkey}\"")
    .urlParameters(startKey[0], endKey[0])
    .get();

String id = r.jsonPath("rows[0].doc._id").getAsString();
String rev = r.jsonPath("rows[0].doc._rev").getAsString();
~~~

## Error Handling

An IOException is thrown whenever a call returns a response code that is not part of the SUCCESS
family (ie 200-299).

In order to prevent an exception being thrown for an expected response use
one of the following methods:

* request().doNotFailOn(Integer... reponseCodes)
* request().doNotFailOn(Family... responseFamily)


## Authentication

Supports two formats

* http://username:password@where.ever
* request().authorization(username, password)


## Host and Certificate Verification


There is no fine grained control, its more of an all or nothing approach:

~~~java
HttpEasy.withDefaults()
    .allowAllHosts()
    .trustAllCertificates();
~~~

## Proxy

Only basic authentication is supported, although I believe the domain can be added by included "domain/"
in front of the username (not tested)

~~~java
HttpEasy.withDefaults()
    .proxy(new Proxy(Proxy.Type.HTTP, new InetSocketAddress(user, password))))
    .proxyAuth(userName, password)
    .bypassProxyForLocalAddresses(true);
~~~

## Redirects


Redirects are NOT automatically followed - at least for REST base calls - even though the documentation
for HttpURLConnection says that it should...

~~~java
HttpEasyReader response = HttpEasy.request()
    .doNotFailOn(Family.REDIRECTION)
    .path(url)
    .head();

if (response.getResponseCodeFamily() == Family.REDIRECTION) {
    url = response.getHeaderField("Location");
    ...
}
~~~

## Logging

Logging of requests and responses can be enabled by calling `logRequestDetails()` or, if using Eclipse, the TCP/IP Monitor utility.

