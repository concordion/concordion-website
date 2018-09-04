{% assign spec_type=page.spec_type %}
{% if spec_type == 'html' %}
{% assign html=true %}
{% assign md=false  %}
{% assign spec_type_desc = 'HTML' %}
{% assign ext='html' %}
{% elsif spec_type == 'markdown' %}
{% assign html=false %}
{% assign md=true    %}
{% assign spec_type_desc = 'Markdown' %}
{% assign ext='md'    %}
{% endif %}

{% assign fixture_language=page.fixture_language %}
{% if fixture_language == 'java' %}
{% assign java=true %}
{% assign csharp=false  %}
{% assign fixture_language_desc = 'Java' %}
{% assign supports_full_ognl = true %}
{% elsif fixture_language == 'csharp' %}
{% assign java=false %}
{% assign csharp=true %}
{% assign fixture_language_desc = 'C#' %}
{% assign supports_full_ognl = false %}
{% endif %}

_This page shows the FAQ for __{{ fixture_language_desc }}__._  Click the toggle buttons above to choose other options.

* TOC
{:toc}

<a name="webTesting"> </a>

### How do I automate web browser testing with Concordion?

Concordion integrates well with [Selenium WebDriver](http://www.seleniumhq.org/projects/webdriver/) for specification and testing of web browser applications.{% if java %} It provides rich output, allowing you to view screenshots on failure, create storyboards and add logging information. To speed up testing, you can run tests in parallel.

You can choose to create a new browser per example, per specification or just once for the whole test run.

To see the range of options available for browser management, download the [concordion-scope-examples](https://github.com/concordion/concordion-scope-examples/blob/master/README.md) project. This provides sample code for each permutation of browser scope, and parallel or serial testing. It runs tests against the Google home page and generates specifications that show a screenshot on failure (see the Arithmetic specification). You might also want to add other [extensions]({{site.baseurl}}/extensions/{{ page.fixture_language }}/{{ page.spec_type }}), such as Storyboard, Logback or others.

The [Cubano]({{site.baseurl}}/cubano) framework integrates Concordion with a number of Concordion extensions, Selenium WebDriver and other open-source projects to provide a ready-made framework for web and API testing that creates beautiful living documentation.

{% endif %}

<a name="comparisonWithSelenium"> </a>

### How does Concordion differ from Selenium?

[Selenium](http://docs.seleniumhq.org) is a test scripting tool for driving web browsers.
Concordion is a specification tool and hides scripting activity inside Java fixture code. For tests that exercise the browser, we recommend  [Selenium WebDriver](http://docs.seleniumhq.org/projects/webdriver/) with Concordion.

<a name="interfaceTesting"> </a>

### How do I automate my web service / database / desktop app / green screen / other app with Concordion?

Concordion acts as a test runner and integrates with any {% if java %}Java{% elsif csharp %}.NET{% endif %} library to drive other interfaces. {% if java %}Examples include [wslite](https://github.com/jwagenleitner/groovy-wslite), CXF, JAX/RS, JAX/WS for REST and SOAP web services, JDBC for databases, FEST for Swing desktop apps and [FreeHost](http://freehost3270.sourceforge.net/) for green screens.{% endif %}

<a name="ownDogFood"> </a>

### Does Concordion itself have active specifications?

Yes, see the [Concordion{% if csharp %}.NET{% endif %} specifications]({% if java %}http://concordion.github.io/concordion/latest/spec/Concordion.html{% elsif csharp %}https://concordion.org/dotnet/Concordion/Concordion.html{% endif %}).

{% if supports_full_ognl %}
<a name="complexExpressions"> </a>

### How do I use complex expressions in my Concordion specifications?

In order to [keep your specifications simple]({{site.baseurl}}/technique/{{ page.fixture_language }}/{{ page.spec_type }}#keepSpecsSimple) and maintainable, Concordion deliberately restricts the expression format that is allowed when instrumenting specifications. Complexity should be moved into the fixture code, and then [evolved into a DSL]({{site.baseurl}}/technique/{{ page.fixture_language }}/{{ page.spec_type }}#evolveDSL), where it is easier to maintain. The idea is to have the fixture do all the work of fetching and munging the data and then return exactly the data that the spec needs, which helps to decouple the spec from the implementation.

However, if you really want to remove this restriction you can apply the annotation @FullOGNL to your fixture class. This would allow you to do things like [pass property values of Java beans into methods](http://stackoverflow.com/questions/23658633/use-result-object-of-first-concordion-call-as-arg-in-secound-concordion-call), or [use constant values in concordion:execute commands](http://stackoverflow.com/questions/19681470/sending-a-constant-parameter-to-concoridion-execute-call). 

{% endif %}

<a name="whoDevelopedIt"> </a>

### Who developed Concordion{% if csharp %}.NET{% endif %}?

Concordion (for Java) was originally developed by David Peterson. The idea was sparked by conversations with testers and developers, in particular Nat Pryce and Steve Freeman while working at Easynet (BSkyB) in 2006.

In 2013, Nigel Charman took over as project lead, having developed the Concordion extensions mechanism. 

Version 2.0 of Concordion was released in 2016 by a team of contributors.

{% if csharp %}

Concordion.NET was originally ported from the Java version by Jeffrey Cameron.

In 2013, ShaKaRee took over as project lead, and updated the code base. In 2016, ShaKaRee brought the code to parity with the Java version by cross-compiling it using IKVM.NET and performance tuning it to be faster than the previous natively compiled version.

{% endif %}

Concordion has been ported and further extended by several other developers.

See the <a class="modal-trigger" href="#modal-contributors">Concordion team</a>.

<a name="licensing"> </a>

### How is Concordion licensed?

Concordion is licensed under the Apache License, v2.0.

See <a href="https://github.com/concordion/concordion{% if csharp %}.net{% endif %}/blob/master/LICENSE.{% if csharp %}md{% elsif java %}txt{% endif %}">here</a> for the license text.

<a name="mailingList"> </a>

### Is there a mailing list?
Yes, on Google Groups. [Join here](http://groups.google.com/d/forum/concordion{% if csharp %}-for-net{% endif %}).

We also have a [developer list](http://groups.google.com/d/forum/concordion-dev) for discussing development of Concordion core and extension code. 

<a name="twitter"> </a>

### Is there a twitter account?

Yes!

<a class="twitter-timeline" height="250px" data-chrome="nofooter" href="https://twitter.com/concordion" data-widget-id="526560172584341504">Tweets by @concordion</a>
<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>


<a name="issueList"> </a>

### How do I report defects or submit enhancement requests?

In Concordion{% if csharp %}.NET{% endif %}'s [Issues List](https://github.com/concordion/concordion{% if csharp %}.net{% endif %}/issues).


<a name="sourceCode"> </a>

### Where is the source code repository?

It is hosted on GitHub: [Main Project Page](https://github.com/concordion/concordion{% if csharp %}.net{% endif %}), [all Concordion projects](https://github.com/concordion). The current development version (potentially unstable) can be cloned as follows:

~~~command
git clone https://github.com/concordion/concordion{% if csharp %}.net{% endif %}.git
~~~

<a name="collaborate"> </a>

### How do I collaborate with development of Concordion?

Firstly, you should [create an issue](#issueList) for your enhancement request.

Concordion uses a "Fork &amp; Pull" model for collaborative development. If you have changes that you would like us to consider for introduction to Concordion, you will need to [fork](https://help.github.com/articles/fork-a-repo) the repository, commit and push your changes to your forked project, and send us a [pull request](https://help.github.com/articles/using-pull-requests) referencing the URL of the issue that you created.

Please note that, in order to keep Concordion clean and minimal, we consider all enhancement requests carefully. Should your enhancement not be appropriate for Concordion core, you may wish to package it as a Concordion [extension]({{site.baseurl}}/coding/{{ page.fixture_language }}/{{ page.spec_type }}#creating-an-extension). 

{% if java %}

See README-DEVELOPERS.txt in the concordion repository for the development standards.

{% endif %}


{% if csharp %}
<a name="nunitDll"> </a>
### Why do I get the error "The target type doesn't contain tests from a known test framework or a 'Main' method"?

Possible causes are:

* `Concordion.NUnit.dll` is not in the NUnit addins folder. See how to [install the Concordion NUnit dll as a NUnit addin]({{site.baseurl}}/integrations/{{ page.fixture_language }}/{{ page.spec_type }}).
* An old version of `Concordion.NUnit.dll` is in the NUnit addins folder. [Download]({{site.baseurl}}/download/{{ page.fixture_language }}/{{ page.spec_type }}) the latest version and [install it as a NUnit addin]({{site.baseurl}}/integrations/{{ page.fixture_language }}/{{ page.spec_type }}).
* The attribute `[assembly: RequiredAddin("ConcordionNUnitAddin")]` is not in the `AssemblyInfo.cs` file of the project. See [Assembly Info]({{site.baseurl}}/coding/{{ page.fixture_language }}/{{ page.spec_type }}#assembly-info) for further information.

<a name="noSpecificationExtensions"> </a>
### Why do I get the error "no specification extensions defined for: Concordion.NET.Internal.SpecificationConfig"?

The Concordion.NET runner is unable to find a matching specification for the fixture. Possible causes are:

* The default namespace + path of the specification does not match the namespace of the fixture. See [locating the specification]({{site.baseurl}}/coding/{{ page.fixture_language }}/{{ page.spec_type }}#locating-the-specification) for more details.
* The specification isn't included in the DLL. You need to set the value “Embedded Resource” on the property “Build Action” to [include the specification in the DLL]({{site.baseurl}}/coding/{{ page.fixture_language }}/{{ page.spec_type }}#including-the-specification-in-the-dll).

{% endif %}

<a name="furtherQuestions"> </a>

### I've got a question that hasn't been answered. How do I get further help?

If you believe the question should be answered on this website, please raise a [website issue](https://github.com/concordion/concordion-website/issues).

For more general questions, start a discussion on our Google Group (see link below), or ask on [Stack Overflow](http://stackoverflow.com/questions/tagged/concordion).