{% assign spec_type=page.spec_type %}
{% if spec_type == 'html' %}
{% assign html=true %}
{% assign md=false  %}
{% assign spec_type_desc = 'HTML' %}
{% assign spec_ext='html' %}
{% elsif spec_type == 'markdown' %}
{% assign html=false %}
{% assign md=true    %}
{% assign spec_type_desc = 'Markdown' %}
{% assign spec_ext='md'    %}
{% endif %}

{% assign fixture_language=page.fixture_language %}
{% if fixture_language == 'java' %}
{% assign java=true %}
{% assign csharp=false  %}
{% assign fixture_language_desc = 'Java' %}
{% assign supports_2_0=true %}
{% assign method_name='split' %}
{% assign fixture_ext='java' %}
{% assign c='c' %}
{% assign d='d' %}
{% assign i='i' %}
{% elsif fixture_language == 'csharp' %}
{% assign java=false %}
{% assign csharp=true %}
{% assign fixture_language_desc = 'C#' %}
{% assign supports_2_0=false %}
{% assign method_name='Split' %}
{% assign fixture_ext='cs' %}
{% assign c='C' %}
{% assign d='D' %}
{% assign i='I' %}
{% endif %}

_This page explains getting started with __{{ spec_type_desc }}__ specifications in __{{ fixture_language_desc }}__._  Click the toggle buttons above to choose other options.

Creating a living document is a 4 step process:

1. Discussing
2. Documenting
3. Instrumenting
4. Coding

Depending on your skillset and role you might be involved in one or more of these steps.

To follow along the tutorial, we've created a project you can [download](https://github.com/concordion/concordion-tutorial-{{ page.fixture_language }}-{{ page.spec_type }}/archive/master.zip), or clone using Git: 

~~~console
git clone https://github.com/concordion/concordion-tutorial-{{ page.fixture_language }}-{{ page.spec_type }}
~~~ 

{% if csharp %}Under the `Marketing.Mailshot` folder, t{% elsif java %}T{% endif %}his project contains folders for each stage of the tutorial. You can either start from scratch with the `{{i}}nitial` folder of the project, jump some steps to the `{{d}}ocumented` or `{{i}}nstrumented` folders, or go straight to the `{{c}}ompleted` folder to see the final solution.

<a name="discussing"></a>
## 1. Discussing

By collaboratively exploring requirements with realistic examples, teams build a shared understanding and detect issues and misunderstandings prior to developing a new feature.

For this tutorial, we are working on a system for creating marketing mailshots. We want to have the first name and last name of the customer. Unfortunately the customer data that we are supplied only contains full names, so we will need to split them.

We start off discussing a simple example:

![Hand-drawn diagram showing the full name Jane Smith split into Jane and Smith]({{ site.baseurl }}/img/tutorial-discuss-names.png)

When discussing examples, we need to consider the _context_ (preconditions), _actions_ and _outcomes_ for each example. In this example, the context is the name `Jane Smith`, the action is `split` and the outcomes are the first name `Jane` and last name `Smith`.

As we progress, we discuss more complex cases. We often find it convenient to use tables, timelines or other diagrams to quickly and concisely describe examples:

![Hand-drawn diagram showing a table of example names being split]({{ site.baseurl }}/img/tutorial-discuss-names-table.png)

Find out more about [discussing examples]({{ site.baseurl }}/discussing/{{ page.fixture_language }}/{{ page.spec_type }}).

<a name="documenting"></a>
## 2. Documenting

The next step is to create a specification of the new feature. 

_If starting the tutorial from this stage, start with the `{{i}}nitial` folder of the tutorial project._

In the {% if java %}`src/test/resources/marketing/mailshots` folder of the {% endif %}tutorial project, edit the file `SplittingNames.{{ spec_ext }}` to contain the following.

{% if md %}
~~~markdown
# Splitting Names

To help personalise our mailshots we want to have the first name and last name of the customer. 
Unfortunately the customer data that we are supplied only contains full names.

The system therefore attempts to break a supplied full name into its constituents by splitting 
around whitespace.

### Example

The full name Jane Smith is broken into first name Jane and last name Smith.
~~~

{% elsif html %}
~~~html
<html>
<head>
    <link href="{% if java %}../{% endif %}../concordion.css" rel="stylesheet" type="text/css" />
</head>

<body>

   <h1>Splitting Names</h1>

   <p>To help personalise our mailshots we want to have the first name and last name
      of the customer. 
      Unfortunately the customer data that we are supplied only contains full names.</p>

   <p>The system therefore attempts to break a supplied full name into its constituents by 
      splitting around whitespace.</p>

   <h3>Example</h3>

   <p>The full name Jane Smith will be broken into first name Jane and last name Smith.</p>
</body>
</html>
~~~
{% endif %}

{% if md %}
This uses a formatting language called Markdown, which makes it easy to create rich documents using plain text. In the Markdown above:

- The `#` characters at the start of the line create headings, where the heading level is determined by the number of `#` characters. 
- The lines without a `#` character are treated as plain paragraphs.

{% elsif html %}

This uses HTML, which is the markup language that web pages are written in. It enables you to create rich documents using plain text. Typically, you only need a small subset of HTML for Concordion specifications. In the HTML above:

- The `<link>` element in the header tells the browser to use the `concordion.css` stylesheet.
- `<h1>` and `<h3>` are headings at level 1 and 3 respectively.
- `<p>` is a paragraph.

{% endif %}

Opening this {% if html %}specification{% elsif md %}[specification](https://github.com/concordion/concordion-tutorial-2.0/blob/master/documented/src/test/resources/marketing/mailshots/SplittingNames.md) in Github, or{% endif %} in {% if html %}a browser or {% endif %} an editor that supports {{ spec_type_desc }} preview, we see it looks like: ![preview of initial specification]({{ site.baseurl }}/img/tutorial-authored-preview.png)

{% if html %}
The tutorial project includes a [concordion.css](https://github.com/concordion/concordion-tutorial-java-html/blob/master/initial/src/test/resources/concordion.css) file containing the default Concordion styling, so that the preview looks similar to the actual Concordion output. 
{% endif %}

The team are happy with the specification, so we share it (for example, by adding the file to our version control system).

{% if md %}
_Note:_ Prior to v2.0, Concordion only supported [HTML specifications]({{site.baseurl}}/tutorial/{{ page.fixture_language }}/html#documenting), which are harder to read and write than Markdown. However, HTML provides a richer language, so may be preferred for complex scenarios.

{% elsif html %}
{% if supports_2_0 %}
_Note:_ Since v2.0, Concordion also supports [Markdown specifications]({{site.baseurl}}/tutorial/{{ page.fixture_language }}/markdown#documenting), which are easier to read and write than HTML. However, HTML provides a richer language, so may be preferred for complex scenarios.
{% endif %}

{% endif %}

Find out more about [documenting specifications]({{ site.baseurl }}/documenting/{{ page.fixture_language }}/{{ page.spec_type }}).

<a name="instrumenting"></a>
## 3. Instrumenting

_If starting the tutorial from this stage, start with the `{{d}}ocumented` folder of the tutorial project._

In order to make the specification executable, it must be _instrumented_ with commands. The instrumentation is invisible to a browser, but is processed by the fixture code.

![How it works]({{ site.baseurl }}/img/how-it-works-{{spec_type}}.png)
{:#how-it-works}

The first step is to select the words in the example that define the _context_ (preconditions), _actions_ and _outcomes_. In our example, the context is the name `Jane Smith`, the action is `broken` and the outcomes are the first name `Jane` and last name `Smith`. We select these parts of the example {% if md %}using Markdown's link syntax{% elsif html %}and create `<span>` tags around them (we can actually use any HTML tag){% endif %}:

{% if md %}
~~~markdown
The full name [Jane Smith]() is [broken]() into first name [Jane]() and last name [Smith]().
~~~
{% elsif html %}
~~~html
The full name <span>Jane Smith</span> will be <span>broken</span>
into first name <span>Jane</span> and last name <span>Smith</span>.
~~~
{% endif %}

{% if md %}
Previewing our [specification](https://github.com/concordion/concordion-tutorial-2.0/blob/master/instrumenting/src/test/resources/marketing/mailshots/SplittingNames.md), we now see the example looks like ![preview of specification with links]({{ site.baseurl }}/img/tutorial-instrument-links-preview.png)
{% endif %}

{% if md %}
Next, we add Concordion commands to the links:

~~~markdown
The full name [Jane Smith](- "#name") is [broken](- "#result = {{ method_name }}(#name)") 
into first name [Jane](- "?=#result.firstName") and last name [Smith](- "?=#result.lastName").
~~~
{: #annotated-example}

{% elsif html %}
Concordion commands use a "concordion" namespace. Change the opening `<html>` tag of your specification to add this namespace:

~~~html
<html xmlns:concordion="http://www.concordion.org/2007/concordion">
~~~

To use Unicode (in case of accents for example), specify the content type after the html tag as follows:

~~~html
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    </head>
~~~

Next, we add Concordion commands as attributes on elements in the XHTML document. Web browsers ignore attributes that they don't understand, so these commands are effectively invisible.

~~~html
The full name <span concordion:set="#name">Jane Smith</span>
will be <span concordion:execute="#result = {{method_name}}(#name)">broken</span>
into first name <span concordion:assert-equals="#result.firstName">Jane</span>
and last name <span concordion:assert-equals="#result.lastName">Smith</span>.
~~~
{: #annotated-example}

{% endif %}

These commands are:

1. setting our _context_, by setting a new variable `#name` to the value `Jane Smith`
2. executing our _action_, by executing the method `{{ method_name }}()` with the variable `#name` and returning the value `#result`
3. verifying our _outcomes_, by checking whether `#result.firstName` is set to `Jane`, and `#result.lastName` is set to `Smith`.

{% if md %}
Previewing our [specification](https://github.com/concordion/concordion-tutorial-2.0/blob/master/instrumented/src/test/resources/marketing/mailshots/SplittingNames.md), we can hover over the links to see the command on each link ![preview of instrumented specification]({{ site.baseurl }}/img/tutorial-instrumented-preview.png)
{% endif %}

{% if supports_2_0 %}
We also {% if md %}mark up the example header{% elsif html %}wrap the example in a `<div>` element with the concordion example command{% endif %}, to turn it into a named example. When the specification is run, this will show as a JUnit test named `basic`.

{% if md %}
~~~markdown
### [Example](- "basic")
~~~
{% elsif html %}
~~~html
<div concordion:example="basic">

    <h3>Example</h3>

    <p>
        The full name <span concordion:set="#name">Jane Smith</span>
        will be <span concordion:execute="#result = {{ method_name }}(#name)">broken</span>
        into first name <span concordion:assert-equals="#result.firstName">Jane</span>
        and last name <span concordion:assert-equals="#result.lastName">Smith</span>.
    </p>

</div>
~~~
{% endif %}

{% else %}

We also wrap the example in a `<div>` element with the class set to example, so that it is styled as a distinct example:

~~~html
<div class="example">

    <h3>Example</h3>

    <p>
        The full name <span concordion:set="#name">Jane Smith</span>
        will be <span concordion:execute="#result = {{ method_name }}(#name)">broken</span>
        into first name <span concordion:assert-equals="#result.firstName">Jane</span>
        and last name <span concordion:assert-equals="#result.lastName">Smith</span>.
    </p>

</div>
~~~

{% endif supports_2_0 %}


Find out more about [instrumenting specifications]({{ site.baseurl }}/instrumenting/{{ page.fixture_language }}/{{ page.spec_type }}).

<a name="coding"></a>
## 4. Coding

_If starting the tutorial from this stage, start with the `{{i}}nstrumented` folder of the tutorial project._

Finally we create some code, called a _fixture_, that links the instrumented specification with the system under test.

In the {% if java %}`src/test/java/marketing/mailshots` folder of the {% endif %}tutorial project, the file `SplittingNamesFixture.{{ fixture_ext }}` already contains the following:

{% if java %}
~~~java
package marketing.mailshots;

import org.concordion.integration.junit4.ConcordionRunner;
import org.junit.runner.RunWith;

@RunWith(ConcordionRunner.class)
public class SplittingNamesFixture {

}
~~~
{% else %}
~~~csharp
using Concordion.NET.Integration;

namespace Marketing.Mailshot.Instrumented
{
    [ConcordionTest]
    public class SplittingNamesFixture
    {
    }
}
~~~
_(where the last part of the namespace depends on which subfolder of the tutorial project you are using)._
{% endif %}

{% if java %}
You may have noticed that this fixture uses a JUnit runner. If you run the fixture as a JUnit test, for example from an IDE or running `gradlew test` from the command line, the location of the output will be shown on the console, such as:

~~~console
file:///tmp/concordion/marketing/mailshots/SplittingNames.html
~~~

{% elsif csharp %}

The tutorial project is already configured with the Concordion dependencies needed to run this fixture as a test. It also has a 'Concordion.Tutorial' solution file you can open with Visual Studio.

To be able to run the Concordion.NET tests with NUnit you need to copy Concordion.NUnit.dll from the `lib\Concordion` folder of the tutorial project to your installation of NUnit (eg. `<nunit-2.6.4-installation-path>\bin\addins\`). See [Test runners]({{ site.baseurl }}/integrations/{{ page.fixture_language }}/{{ page.spec_type }}) for further details.

If you run the fixture as a NUnit test, the console will show the test results, such as:

~~~console
------ Test started: Assembly: Marketing.Mailshot.dll ------

Test 'Executable Specification: SplittingNamesFixture' failed: NUnit.Core.NUnitException : Exception in Concordion test: please see Concordion test reports

TestFixture failed: NUnit.Core.NUnitException : Exception in Concordion test: please see Concordion test reports

0 passed, 1 failed, 0 skipped, took 0.78 seconds (NUnit 2.6.4).
~~~

The Concordion output is written to your temp folder, for example to 

~~~console
%TEMP%\Marketing\Mailshot\Initial\SplittingNames.html
~~~

, dependent on the folder that you are running the test from. By default, %TEMP% is set to your `%USERPROFILE%\AppData\Local\Temp` folder, for example `C:\Users\<your-windows-user>\AppData\Local\Temp`.

{% endif csharp %}

Opening this URL in a browser, the output should look something like this:

![output broken due to missing code]({{ site.baseurl }}/img/tutorial-broken-due-to-missing-code.png)

The test of the example is failing since we haven't implemented the `{{ method_name }}()` method. We'll flesh out our fixture code:

{% if java %}
~~~java
package marketing.mailshots;

import org.concordion.integration.junit4.ConcordionRunner;
import org.junit.runner.RunWith;

@RunWith(ConcordionRunner.class)
public class SplittingNamesFixture {

    public Result {{ method_name }}(String fullName) {
        return new Result();
    }

    class Result {
        public String firstName = "TODO";
        public String lastName = "TODO";
    }
}
~~~

{% elsif csharp %}
~~~csharp
...
    [ConcordionTest]
    public class SplittingNamesFixture
    {
        public Result Split(string fullName)
        {
            return new Result();
        }
    }

    public class Result
    {
        public string firstName = "TODO";
        public string lastName = "TODO";
    }
}
~~~
{% endif csharp %}

Run it now and you get:

![output broken because not fully implemented]({{ site.baseurl }}/img/tutorial-not-fully-implemented.png)

Let's implement the function. Obviously the implementation should be in the real system not in the test case, but just for fun...

{% if java %}
~~~java
package marketing.mailshots;
   
import org.concordion.integration.junit4.ConcordionRunner;
import org.junit.runner.RunWith;

@RunWith(ConcordionRunner.class)
public class SplittingNamesFixture {

    public Result split(String fullName) {
        Result result = new Result();
        String[] words = fullName.split(" ");
        result.firstName = words[0];
        result.lastName = words[1];
        return result;
    }

    class Result {
        public String firstName;
        public String lastName;
    }
}
~~~
{: #complete-code}

{% elsif csharp %}

~~~csharp
...
    [ConcordionTest]
    public class SplittingNamesFixture
    {
        public Result Split(string fullName)
        {
            Result result = new Result();
            string[] words = fullName.Split(' ');
            result.firstName = words[0];
            result.lastName = words[1];
            return result;
        }
    }

    public class Result
    {
        public string firstName;
        public string lastName;
    }
}
~~~
{: #complete-code}

{% endif csharp %}

The test now passes:

![output of successful run]({{ site.baseurl }}/img/tutorial-successful.png)

Find out more about [coding fixtures]({{ site.baseurl }}/coding/{{ page.fixture_language }}/{{ page.spec_type }}).

This is the end of the basic tutorial. Feel free to move straight onto [Next Steps]({{ site.baseurl }}/discussing/{{ page.fixture_language }}/{{ page.spec_type }}), or follow the advanced tutorial below.

----

## Advanced Tutorial
{: #advanced}

1. Now you understand the basics, alter your specification to [use a table]({{ site.baseurl }}/instrumenting/{{ page.fixture_language }}/{{ page.spec_type }}/#execute-table) to show several examples of behaviour.
2. To check a single example that returns a collection of results, you'll need to use the `verify-rows` command. Create a `PartialMatches.{{spec_ext}}` specification and add the example [verify-rows command]({{ site.baseurl }}/instrumenting/{{ page.fixture_language }}/{{ page.spec_type }}/#verify-rows-command). Implement a `getSearchResultsFor({% if java %}S{% else if csharp %}s{% endif %}tring searchString)` method in the `PartialMatchesFixture.{{fixture_ext}}` fixture class to make this specification pass
    {% if java %}
    ~~~java
    @RunWith(ConcordionRunner.class)
    public class PartialMatchesFixture {

        private Set<String> usernamesInSystem = new HashSet<String>();

        public void setUpUser(String username) {
            usernamesInSystem.add(username);
        }

        public Iterable<String> getSearchResultsFor(String searchString) {
            SortedSet<String> matches = new TreeSet<String>();
            for (String username : usernamesInSystem) {
                if (username.contains(searchString)) {
                    matches.add(username);
                }
            }
            return matches;
        }
    }
    ~~~
    {% else if csharp %}
    {% endif %}
3. We can build test suites by [running a specification]({{ site.baseurl }}/instrumenting/{{ page.fixture_language }}/{{ page.spec_type }}/#run-command) from another specification. In the `marketing.mailshots` package, create a new specification called `Mailshots.{{ spec_ext}}` with the following contents:
    {% if html %}
    ~~~html
    <html xmlns:concordion="http://www.concordion.org/2007/concordion">
        <body>
            <h1>Mailshots</h1>

            <p>Mailshots are produced on-demand.</p>

            <p>To help personalise the mailshots we <a concordion:run="concordion{% if csharp %}.net{% endif %}" href="SplittingNames.html">split names</a> into constituent parts.</p>
        </body>
    </html>
    ~~~
    {% else if md %}
    ~~~markdown
    # Mailshots

    Mailshots are produced on-demand.

    To help personalise the mailshots we [split names](SplittingNames.md "c:run") into constituent parts.
    ~~~
    {% endif %}

      In the `marketing.mailshots` package, create an empty fixture class, called MailshotsFixture.{{ fixture_ext }}:

    {% if java %}
    ~~~java
    package marketing.mailshots;

    import org.concordion.integration.junit4.ConcordionRunner;
    import org.junit.runner.RunWith;

    @RunWith(ConcordionRunner.class)
    public class MailshotsFixture {
    }
    ~~~
    {% else if csharp %}
    ~~~csharp
    using Concordion.NET.Integration;

    namespace Marketing.Mailshot.Comple
    {
        [ConcordionTest]
        public class MailshotsFixture
        {
        }
    }
    ~~~
    {% endif %}
    Running this fixture will run the linked `SplittingNames` fixture.

    Using links, we can create a [test suite]({{ site.baseurl }}/documenting/{{ page.fixture_language }}/{{ page.spec_type }}/#creating-a-suite), with [breadcrumbs]({{ site.baseurl }}/documenting/{{ page.fixture_language }}/{{ page.spec_type }}/#breadcrumbs) making it easier to navigate the results.

You've now seen all of the Concordion commands you're likely to need on a day-to-day basis. Feel free to browse through the rest of this documentation, learn good practices in the [Hints and Tips]({{ site.baseurl }}/technique/{{ page.fixture_language }}/{{ page.spec_type }}) section, try out our [Integrations]({{ site.baseurl }}/integrations/{{ page.fixture_language }}/{{ page.spec_type }}) or [Extensions]({{ site.baseurl }}/extensions/{{ page.fixture_language }}/{{ page.spec_type }}) or browse the [FAQ]({{ site.baseurl }}/questions/{{ page.fixture_language }}/{{ page.spec_type }}).
