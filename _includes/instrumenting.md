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
{% assign supports_2_0=true %}
{% assign supports_2_1=true %}
{% assign supports_full_ognl=true %}
{% assign g = "g" %}
{% assign i = "i" %}
{% assign s = "s" %}
{% elsif fixture_language == 'csharp' %}
{% assign java=false %}
{% assign csharp=true %}
{% assign fixture_language_desc = 'C#' %}
{% assign supports_2_0=false %}
{% assign supports_full_ognl=false %}
{% assign g = "G" %}
{% assign i = "I" %}
{% assign s = "S" %}
{% endif %}

_This page explains instrumenting __{{ spec_type_desc }}__ specifications._  Click the toggle buttons above to choose other formats.

* TOC
{:toc}

## Overview

{% if html %}
Concordion commands require a `concordion` namespace to be defined at the top of each HTML specification as follows:

~~~
<html xmlns:concordion="http://www.concordion.org/2007/concordion">
~~~

In the body of the HTML specification, Concordion commands are added as namespaced attributes on HTML elements.

_Note, you can choose any namespace prefix you want. Many users shorten the namespace to "c" to reduce the amount of typing._

{% elsif md %}
Concordion commands are added as links in Markdown documents.

Concordion commands are differentiated from other [Markdown links](https://daringfireball.net/projects/markdown/syntax#link) by using a hyphen (`-`) for the URL:

~~~markdown
[value](- "command")
~~~

As an alternative to inline links, reference style links are supported, for example:

~~~markdown
[value][id]
    
[id]: - "command"
~~~

or

~~~markdown
[value][]
    
[value]: - "command"
~~~

Reference style links can help improve readability of the Markdown document, especially for commands that are in table headers or are lengthy or repeated .
{% endif %}

----

Let's start with a really simple example...

## assert-equals command

Create a file `HelloWorld.{{ ext }}` containing:

{% if html %}
~~~html
<html xmlns:concordion="http://www.concordion.org/2007/concordion">
    <body>
        <p concordion:assert-equals="{{g}}etGreeting()">Hello World!</p>
    </body>
</html>
~~~
{% elsif md %}
~~~markdown
[Hello World!](- "?={{g}}etGreeting()")
~~~
{% endif %}

When run with a fixture that implements the `{{g}}etGreeting()` method to return `Hello World!`, the output specification will show:

![successful specification]({{site.baseurl}}/img/hello-world-success.png)

### Properties support

In the example above, the call to `{{g}}etGreeting()` can be simplified to `greeting` since Concordion's expression language includes properties support.

{% if html %}
~~~html
<html xmlns:concordion="http://www.concordion.org/2007/concordion">
    <body>
        <p concordion:assert-equals="greeting">Hello World!</p>
    </body>
</html>
~~~

_Note that either `assert-equals` or `assertEquals` can be used for the command name._
{% elsif md %}
~~~markdown
[Hello World!](- "?=greeting")
~~~

_Note that the `?=` syntax is short for `c:assert-equals`_
{% endif %}


Further details: [assert-equals command specification](https://concordion.github.io/concordion/latest/spec/command/assertEquals/AssertEquals.html){% if md %} and [Markdown grammar](https://concordion.github.io/concordion/latest/spec/specificationType/markdown/MarkdownAssertEqualsCommand.html){% endif %}

----

## set command

Given a specification like this:

{% if html %}
~~~html
<html>
    <body>
        <p>
            The greeting for user Bob will be: Hello Bob!
        </p>
    </body>
</html>
~~~
{% elsif md %}
~~~markdown
The greeting for user Bob will be: Hello Bob!
~~~
{% endif %}


We want the first name (`Bob`) to be a parameter and the greeting (`Hello Bob!`) to be verified against the result returned by the system.

{% if html %}
To do this we place `<span>` tags around the two significant pieces of text in the document. In HTML, `<span>` tags don't have any effect on the display of the output document.

~~~html 
<html>
    <body>
        <p>
            The greeting for user <span>Bob</span>
            will be: <span>Hello Bob!</span>
        </p>
    </body>
</html>
~~~
{% elsif md %}
To do this we place links around the two significant pieces of text in the document. When the specification is executed, these links will be changed into HTML attributes and will not show as links in the output specification.

~~~markdown
The greeting for user [Bob]() will be: [Hello Bob!]()
~~~
{% endif %}

Now we can instrument the document:

{% if html %}
~~~html
<html xmlns:concordion="http://www.concordion.org/2007/concordion">
    <body>
        <p>
            The greeting for user <span concordion:set="#firstName">Bob</span>
            will be:
            <span concordion:assert-equals="{{g}}reetingFor(#firstName)">Hello Bob!</span>
        </p>
    </body>
</html>
~~~
{% elsif md %}
~~~markdown
The greeting for user [Bob](- "#firstName") will be: [Hello Bob!](- "?={{g}}reetingFor(#firstName)")
~~~
{% endif %}

When Concordion processes the document, it will set a specification variable `#firstName` to the value `Bob` and then call the `{{g}}reetingFor()` method with that value and check that the result is equal to `Hello Bob!`.

{% if md %}
_Note that the `#` syntax is short for `c:set=#`_
{% endif %}

{% if supports_2_0 %}

Further details: [set command specification](https://concordion.github.io/concordion/latest/spec/command/set/Set.html){% if md %} and [Markdown grammar](https://concordion.github.io/concordion/latest/spec/specificationType/markdown/MarkdownSetCommand.html){% endif %}

----

## example command

_since: 2.0.0_

To specify that a piece of the specification is an example,{% if html %} annotate the enclosing HTML tag with the `concordion:example` tag, putting your example name in the expression{% elsif md %} add a heading link with the name of the example set as the link title{% endif %}. For example:

{% if html %}
~~~html
<div concordion:example="example1">
        Example goes here
</div>
~~~
{% elsif md %}
~~~markdown
## [Example 1](- "example1")

Example goes here
~~~

The example name is optional and will be generated from the heading text if not supplied. For example:

~~~markdown
## [Check 3 items](-)
~~~

will create an example named `check-3-items` with the heading `Check 3 items`.
{% endif %}

Each example is run and reported as a separate test. Any commands that are outside of named examples are executed in a single anonymous "outer" example that is run before the named examples.

Each row of a table can also be [run as an example](#run-each-row-as-an-example).

### "before" examples

To specify that a piece of the specification should be run before each example,{% if html %} annotate the enclosing HTML tag with the concordion:example tag, putting the keyword `before` in the expression{% elsif md %} add a heading link with the keyword `before` as the link title{% endif %}. For example:

{% if html %}
~~~html
<div concordion:example="before">
        ...Example goes here
</div>
~~~
{% elsif md %}
~~~markdown
## [Per example setup](- "before")

Example goes here
~~~
{% endif %}

{% if md %}
### Closing an example
The example block continues until it is closed either implicitly or explicitly.

An example is implicitly closed on any of these conditions:

* another example starts, or
* a header is encountered that is at a higher level than the example header (eg. the example is a `h3` and a `h2` header is encountered), or
* the end of file is reached.

To explicitly close an example, create a header with the example heading struck-through. For example:  

~~~markdown
## ~~Example 1~~
~~~

will close the example with the heading `Example 1`. The struck-through header will not appear in the output specification.
{% endif %}

### Implementation Status
As an alternative to setting the [implementation status]({{site.baseurl}}/coding/{{ page.fixture_language }}/{{ page.spec_type }}/#implementation-status) for the whole specification, you can set it for individual examples. This allows partially-implemented examples in the specification without breaking the build.

{% if html %}
~~~html
<div concordion:example="example3" concordion:status="ExpectedToFail">
        Example goes here
</div>
~~~
{% elsif md %}
~~~markdown
## [Example 3](- "example3 c:status=ExpectedToFail")
~~~
{% endif %}
The status can be either `ExpectedToFail` or `Unimplemented`.

Further details: [example command specification](https://concordion.github.io/concordion/latest/spec/command/example/Example.html){% if md %} and [Markdown grammar](https://concordion.github.io/concordion/latest/spec/specificationType/markdown/MarkdownExampleCommand.html){% endif %}

{% endif %}

----

## execute command

The execute command has three main uses:

1. Executing an instruction with a "void" result.
2. Executing an instruction with an object result (to allow multiple properties of the object to be checked).
3. Handling unusual sentence structures.

### Executing an instruction with a void result

It can occasionally be useful to execute an instruction that sets up some system state. Every time you do this, however, alarm bells should ring in your head and you should question yourself to make sure that you are not inadvertently writing a script instead of a specification. E.g. a call to "clearDatabase()" would be a blatant misuse (see [Hints and Tips]({{site.baseurl}}/technique/{{ page.fixture_language }}/{{ page.spec_type }}) for more on this topic).

As a rule of thumb, methods with a void result called from an execute should start with the word set or setUp. E.g. setUpUser(#username).

Take the following specification for example:

{% if html %}
~~~html
<html xmlns:concordion="http://www.concordion.org/2007/concordion">
    <body>
        <p>
            If the time is
            <span concordion:set="#time">09:00AM</span>
            <span concordion:execute="{{s}}etCurrentTime(#time)" />
            then the greeting will say:
            <span concordion:assert-equals="{{g}}etGreeting()">Good Morning World!</span>
        </p>
    </body>
</html>
~~~
{% elsif md %}
~~~markdown
If the time is [09:00AM](- "#time") [ ](- "{{s}}etCurrentTime(#time)")
then the greeting will say:
[Good Morning World!](- "?={{g}}etGreeting()")
~~~
{% endif %}


We can actually remove the need for the set command by using the special variable #TEXT (which contains the text of the current element). The abbreviated instrumentation looks like this:

{% if html %}
~~~html
<html xmlns:concordion="http://www.concordion.org/2007/concordion">
    <body>
        <p>
            If the time is
            <span concordion:execute="{{s}}etCurrentTime(#TEXT)">09:00AM</span>
            then the greeting will say:
            <span concordion:assert-equals="{{g}}etGreeting()">Good Morning World!</span>
        </p>
    </body>
</html>
~~~
{% elsif md %}
~~~markdown
If the time is [09:00AM](- "{{s}}etCurrentTime(#TEXT)") 
then the greeting will say:
[Good Morning World!](- "?={{g}}etGreeting()")
~~~
{% endif %}

An alternative would be to change the {{g}}etGreeting() method signature to allow the time to be passed in as a parameter. This is the approach you should normally take. An execute with no return value often indicates a "bad smell" - e.g. you're writing a script or your specification contains too many variables and covers too many behaviours. However, the functionality is there if you need it.

{% if md %}
(Note that the execute command is deduced by the absence of a `#`, `?=` or `c:` prefix in the link title. It is equivalent to prefixing the command with `c:execute=`).
{% endif %}

### Executing an instruction with an object result

Sometimes you need to check more than one result of a behaviour. For example, here we want to check that both the first name and the last name are correctly extracted from the full name:

{% if html %}
~~~html
 <html xmlns:concordion="http://www.concordion.org/2007/concordion">

    <head>
        <link href="../concordion.css" rel="stylesheet" type="text/css" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    </head>

    <body>

        <h1>Splitting Names</h1>

        <p>
            To help personalise our mailshots we want to have the first name
            and last name of the customer. Unfortunately the customer data
            that we are supplied only contains full names.
        </p>

        <p>
            The system therefore attempts to break a supplied full name into
            its constituents by splitting around whitespace.
        </p>

        <div {% if supports_2_0 %}concordion:example="simple-name"{% else %}class="example"{% endif %}>

            <h3>Example</h3>

            <p>
                The full name
                <span concordion:execute="#result = {{s}}plit(#TEXT)">Jane Smith</span>
                will be broken into first name
                <span concordion:assert-equals="#result.firstName">Jane</span>
                and last name
                <span concordion:assert-equals="#result.lastName">Smith</span>.
            </p>

        </div>
    </body>
</html>
~~~
{% elsif md %}
~~~ markdown
# Splitting Names

To help personalise our mailshots we want to have the first name and last name of the customer. 
Unfortunately the customer data that we are supplied only contains full names.

The system therefore attempts to break a supplied full name into its constituents by splitting around whitespace.

### [Example](- "simple-name")

The full name [Jane Smith](- "#result = split(#TEXT)")
will be broken into first name [Jane](- "?=#result.firstName")
and last name [Smith](- "?=#result.lastName")
~~~
{% endif %}

The variable `#result` is going to be an object returned by the `{{s}}plit()` method. This object will have `firstName` and `lastName` properties. 

Alternatively, to make it easier to return multiple values without creating a new object, you can {% if java %}[return a MultiValueResult]({{site.baseurl}}/coding/{{ page.fixture_language }}/{{ page.spec_type }}#returning-a-multivalueresult) or [return a Map result]({{site.baseurl}}/coding/{{ page.fixture_language }}/{{ page.spec_type }}#returning-a-map-result){% elsif csharp %}[return a Dictionary result]({{site.baseurl}}/coding/{{ page.fixture_language }}/{{ page.spec_type }}#returning-a-dictionary-result){% endif %}.

### Handling unusual sentence structures

One of the great things about Concordion is that when you're writing the specifications you do not have to worry about how you're going to instrument it. You can just concentrate on making the document as readable as possible.

Most English sentences can be instrumented. If you can't work out how to instrument it then you can always tweak the wording, but in general this should not be necessary. The execute command provides flexibility {% if md %} - however, you will need to embed HTML in your Markdown specification to achieve this, so will need to weigh that up against changing the wording{% endif %}.

For example, say we have the specification:

{% if html %}
~~~html
<p>
    Upon login, the greeting for user <span>Bob</span>
    will be: <span>Hello Bob!</span>
</p>
~~~
{% elsif md %}
~~~markdown
Upon login, the greeting for user [Bob]() will be: [Hello Bob!]())
~~~
{% endif %}

This is easy to instrument:

{% if html %}
~~~html
<p>
    Upon login, the greeting for user <span concordion:set="#firstName">Bob</span>
    will be:
    <span concordion:assert-equals="{{g}}reetingFor(#firstName)">Hello Bob!</span>
</p>
~~~
{% elsif md %}
~~~markdown
Upon login, the greeting for user [Bob](- "#firstName") will be: [Hello Bob!](- "?={{g}}reetingFor(#firstName)")
~~~
{% endif %}

But what if our specification was written like this:
{% if html %}
~~~html
<p>
    The greeting "<span>Hello Bob!</span>" should be given
    to user <span>Bob</span> when he logs in.
</p>
~~~
{% elsif md %}
~~~markdown
The greeting "[Hello Bob!]()" should be given to user [Bob]() when he logs in.
~~~
{% endif %}

In this case, the input parameter Bob occurs after the output greeting we want to check. We can solve this problem by{% if md %} changing this sentence to HTML, wrapping it in a `<div>` element and{% endif %} using an execute command on the outer element (the <p>).

{% if html %}
~~~html
<p concordion:execute="#greeting = {{g}}reetingFor(#firstName)">
    The greeting "<span concordion:assert-equals="#greeting">Hello Bob!</span>"
    should be given to user <span concordion:set="#firstName">Bob</span>
    when he logs in.
</p>
~~~
{% elsif md %}
~~~html
<div>
    <p concordion:execute="#greeting = {{g}}reetingFor(#firstName)">
        The greeting "<span concordion:assert-equals="#greeting">Hello Bob!</span>"
        should be given to user <span concordion:set="#firstName">Bob</span>
        when he logs in.
    </p>
</div>
~~~
{: #embedded-html}
{% endif %}

How does this work? It works because the execute command is designed to process commands on its child elements in a special order. First of all it processes any child set commands then it runs its own command, then any child execute commands and finally any child assert-equals commands.

Further details: [execute command specification](https://concordion.github.io/concordion/latest/spec/command/execute/Execute.html){% if md %} and [Markdown grammar](https://concordion.github.io/concordion/latest/spec/specificationType/markdown/MarkdownExecuteCommand.html){% endif %}

### execute command on a table

When you want to show several examples of a behaviour, repeating the same sentence structure over and over again probably isn't going to be very nice to read. It would be better to use a table.

For example:

![How the table is displayed (nice and neat)]({{site.baseurl}}/img/instrument-table-example.png)

You can instrument this table, in a long-winded way, as follows:

{% if html %}
~~~html
<div {% if supports_2_0 %}concordion:example="simple-names"{% else %}class="example"{% endif %}>

    <h3>Examples</h3>

    <table>
        <tr>
            <th>Full Name</th>
            <th>First Name</th>
            <th>Last Name</th>
        </tr>
        <tr concordion:execute="#result = {{s}}plit(#fullName)">
            <td concordion:set="#fullName">John Smith</td>
            <td concordion:assert-equals="#result.firstName">John</td>
            <td concordion:assert-equals="#result.lastName">Smith</td>
        </tr>
        <tr concordion:execute="#result = {{s}}plit(#fullName)">
            <td concordion:set="#fullName">David Peterson</td>
            <td concordion:assert-equals="#result.firstName">David</td>
            <td concordion:assert-equals="#result.lastName">Peterson</td>
        </tr>
    </table>

</div>
~~~
{% elsif md %}
~~~markdown
### [Examples](- "simple-names")

| Full Name               | First Name      | Last Name |
| ---------------         | --------------- | --------------- |
| [John Smith][split]     | [John][first]   | [Smith][last] |
| [David Peterson][split] | [David][first]  | [Peterson][last] |

[split]: - "#result = {{s}}plit(#TEXT)"
[first]: - "?=#result.firstName"
[last]:  - "?=#result.lastName"
~~~
{% endif %}

However, this is repetitive so Concordion provides a shortcut{% if html %}. When you place an execute command on a `<table>` element the commands on the header row (the row containing `<th>` elements) are copied to each detail row (rows containing `<td>` elements) and the execute command is run on each detail row.{% elsif md %} by placing commands on each table header column, with an additional execute command at the start of the first column. For each row of the table, the commands from the table headers are run, with any set commands being run before the execute command, followed by the assert commands.{% endif %}

For example:

{% if html %}
~~~html
<div {% if supports_2_0 %}concordion:example="simple-names"{% else %}class="example"{% endif %}>

    <h3>Examples</h3>

    <table concordion:execute="#result = {{s}}plit(#fullName)">
        <tr>
            <th concordion:set="#fullName">Full Name</th>
            <th concordion:assert-equals="#result.firstName">First Name</th>
            <th concordion:assert-equals="#result.lastName">Last Name</th>
        </tr>
        <tr>
            <td>John Smith</td>
            <td>John</td>
            <td>Smith</td>
        </tr>
        <tr>
            <td>David Peterson</td>
            <td>David</td>
            <td>Peterson</td>
        </tr>
    </table>

</div>
~~~
{% elsif md %}
~~~markdown
### [Examples](- "simple-names")

| [split][][Full Name][full] | [First Name][first] | [Last Name][last] |
| ---------------            | ---------------     | ---------------   |
| John Smith                 | John                | Smith             |
| David Peterson             | David               | Peterson          |

[split]: - "#result = {{s}}plit(#fullName)"
[full]: - "#fullName"
[first]: - "?=#result.firstName"
[last]:  - "?=#result.lastName"
~~~
{% endif %}

This instrumentation has identical behaviour to the previous example.

{% if supports_2_1 %}
#### Run each row as an example
_since: 2.1.0_

To run each row of the table as an example (which will be run and reported as a separate test), add an 'example' command to a column header. The text in that column will be used for the example name.

For example:

{% if html %}
~~~html
<table concordion:execute="#result = {{s}}plit(#fullName)">
    <tr>
        <th concordion:example="">Full Name</th>
        <th concordion:set="#fullName">Full Name</th>
        <th concordion:assert-equals="#result.firstName">First Name</th>
        <th concordion:assert-equals="#result.lastName">Last Name</th>
    </tr>
    <tr>
        <td>Simple name</td>
        <td>David Peterson</td>
        <td>David</td>
        <td>Peterson</td>
    </tr>
    <tr>
        <td>Double-barrelled name</td>
        <td>Mike Cannon-Brookes</td>
        <td>Mike</td>
        <td>Cannon-Brookes</td>
    </tr>
</table>
~~~
{% elsif md %}
~~~markdown
| [split][][Description](- "c:example") | [Full Name][full]   | [First Name][first] | [Last Name][last] |
| ---------------                       | -------------       | ---------------     | ---------------   |
| Simple name                           | David Peterson      | David               | Peterson          |
| Double-barrelled name                 | Mike Cannon-Brookes | Mike                | Cannon-Brookes    |

[split]: - "#result = {{s}}plit(#fullName)"
[full]: - "#fullName"
[first]: - "?=#result.firstName"
[last]:  - "?=#result.lastName"
~~~
{% endif %}

will run as two examples, named "Simple name" and "Double-barrelled name".

{% endif %}

Further details: [execute command on a table specification](https://concordion.github.io/concordion/latest/spec/command/execute/ExecutingTables.html){% if md %} and [Markdown syntax](https://concordion.github.io/concordion/latest/spec/specificationType/markdown/MarkdownExecuteCommand.html#execute-on-a-table){% endif %}

### execute command on a list

_since 1.4.6_

The `execute` command has special behavior when placed on a list element (`<ol>` or `<ul>`). Instead of executing once, it executes every list item in the list (and all its sub lists) and transfers the commands from the list element to each list item element. This feature can for example be used to setup a hierarchical structure of test data.

{% if md %}
There is currently no explicit support for this in the Concordion Markdown syntax. Instead the HTML version of this must be used, wrapped in a `<div>` element.
{% endif %}

Further details: [execute command on a list specification](https://concordion.github.io/concordion/latest/spec/command/execute/ExecutingList.html){% if md %} and [Markdown syntax](https://concordion.github.io/concordion/latest/spec/specificationType/markdown/MarkdownGrammar.html#execute-on-a-list){% endif %}

----

## verify-rows command

When you want to check the contents of a collection of results returned from the system, use the `verify-rows` command.

For example, while writing a user administration tool we might write a specification like this describing the behaviour of the search functionality:

![Original Specification]({{site.baseurl}}/img/instrument-original-verify-rows-table.png)

The idea is that in the fixture code we'll set up the users in the system, perform a search and then confirm that the right users (and only these users) were returned in the search results. If too many, too few, or the wrong users were returned we want the test to fail.

The instrumented source for the specification looks like this:

{% if html %}
~~~html
<html xmlns:concordion="http://www.concordion.org/2007/concordion">
<body>

<h1>Partial Matches</h1>

<p>
    Username searches return partial matches, i.e. all usernames containing
    the search string are returned.
</p>

<div {% if supports_2_0 %}concordion:example="beatles"{% else %}class="example"{% endif %}>

    <h3>Example</h3>

    <p>Given these users:</p>

    <table concordion:execute="{{s}}etUpUser(#username)">
        <tr><th concordion:set="#username">Username</th></tr>
        <tr><td>john.lennon</td></tr>
        <tr><td>ringo.starr</td></tr>
        <tr><td>george.harrison</td></tr>
        <tr><td>paul.mccartney</td></tr>
    </table>

    <p>Searching for "<b concordion:set="#searchString">arr</b>" will return:</p>

    <table concordion:verify-rows="#username : {{g}}etSearchResultsFor(#searchString)">
        <tr><th concordion:assert-equals="#username">Matching Usernames</th></tr>
        <tr><td>george.harrison</td></tr>
        <tr><td>ringo.starr</td></tr>
    </table>

</div>

</body>
</html>
~~~
{% elsif md %}
~~~markdown
# Partial Matches

Username searches return partial matches, i.e. all usernames containing the search string are returned.

### [Example](- "beatles")

Given these users:

| [ ][setup] [Username][user]|
|------------------------------------------|
| john.lennon |
| ringo.starr |
| george.harrison |
| paul.mccartney |

[setup]: - "{{s}}etUpUser(#username)"
[user]:   - "#username"

Searching for [arr](- "#searchString") will return:

| [ ][search] [Matching Usernames][match]|
|------------------------------------------|
| george.harrison |
| ringo.starr |

[search]: - "c:verify-rows=#username:{{g}}etSearchResultsFor(#searchString)"
[match]: - "?=#username"
~~~
{% endif %}

The syntax for a verify-rows command is:

~~~
#loopVar : expression
~~~

where `expression` returns an Iterable object with a predictable iteration order, (e.g. {% if java %}a List, LinkedHashSet or a TreeSet{% elsif csharp %}a collection extending ICollection{% endif %}), and `#loopVar` provides access to the current object during iteration and allows the assert-equals method to check its value.

{% if supports_2_0 %}By default, the{% else %}The{% endif %} order of the items in the table being verified must match the iteration order of the items returned by the expression. You may need to sort the items to ensure they are in a known and consistent order. In our example, we are using alphabetical order ("george" before "ringo"). {% if supports_2_0 %}As an alternative, you can apply a [match strategy](https://concordion.github.io/concordion/latest/spec/command/verifyRows/strategies/Strategies.html) to define how the rows are matched (_since: 2.0.0_).{% endif %}

When run with a fixture that returns an empty collection, we get:

![Two missing rows]({{site.baseurl}}/img/instrument-verify-rows-empty.png)

Two rows are missing because our search function is not implemented and returns an empty set.

After the feature is implemented, when we run it we get a success:

![Success]({{site.baseurl}}/img/instrument-verify-rows-success.png)

Note that either `verify-rows` or `verifyRows` can be used for the command name.

Further details: [verify-rows specification](https://concordion.github.io/concordion/latest/spec/command/verifyRows/VerifyRows.html){% if md %} and [Markdown grammar](https://concordion.github.io/concordion/latest/spec/specificationType/markdown/MarkdownVerifyRowsCommand.html){% endif %}

----

## run command
The `run` command lets you run another specification from this specification, and build up test suites. Executing the specification will automatically execute all its linked specifications (recursively), with the results aggregated up.

The format is:

{% if html %}
~~~
<a concordion:run="runner-name" href="path/to/Spec.{{ ext }}">some link text</a>
~~~
{% elsif md %}
~~~markdown
[some link text](path/to/Spec.{{ ext }} "c:run")
~~~
{% endif %}

where `Spec.{{ ext }}` is the name of the specification to be run, with the relative path `path/to`.

{% if supports_2_0 %}You can link to specifications with different file extensions (eg. `.md`, `.html`, `.xlsx` if the Excel extension is installed). Concordion will automatically update the `href` value to use the `.html` file extension in the output specification.{% endif supports_2_0 %}

The specification to be run must have a corresponding [fixture class]({{site.baseurl}}/coding/{{ page.fixture_language }}/{{ page.spec_type }}#fixture-classes) appropriately named (eg. `Spec`, `SpecTest` or `SpecFixture`).

{% if html %}
The `runner-name` should normally be `concordion{% if csharp %}.net{% endif %}`. 
{% endif %}

{% if csharp %}
To use a non-Concordion runner, you must [configure]({{site.baseurl}}/coding/{{ page.fixture_language }}/{{ page.spec_type }}#configuration-options) a [Runner](http://concordion.org/dotnet/Concordion/Configuration/Runner.html).
{% endif %}

Further details: [run command specification]({% if java %}https://concordion.github.io/concordion/latest/spec/command/run/Run.html{% elsif csharp %}http://concordion.org/dotnet/Concordion/Command/Run/Run.html{% endif %}){% if md %} and [Markdown grammar](https://concordion.github.io/concordion/latest/spec/specificationType/markdown/MarkdownRunCommand.html){% endif %}

----

## assert-true and assert-false commands
These commands are useful for asserting boolean conditions. 

They should be used sparingly, since on failure they can only report true or false. For example, when the specification:

{% if html %}
~~~html
<p>The completion date should be set to <span concordion:assert-true="{{i}}sCompletionToday()">today</span>.</p>
~~~
{% elsif md %}
~~~markdown
The completion date should be set to [today](- "c:assert-true={{i}}sCompletionToday()")
~~~
{% endif %}

is run with a `{{i}}sCompletionToday()` method that returns false, the output shows:

![specification showing false result]({{site.baseurl}}/img/instrument-assert-true.png)

As an alternative, use the `assert-equals` command to show better error messages. Reworking our example above:

{% if html %}
~~~html
<p>The completion date should be set to <span concordion:assert-equals="{{g}}etCompletionDay()">today</span>.</p>
~~~
{% elsif md %}
~~~markdown
The completion date should be set to [today](- "?={{g}}etCompletionDay()").
~~~
{% endif %}

When the completion date is today, return "today" from `{{g}}etCompletionDay()` to show success:

![specification showing today as success]({{site.baseurl}}/img/instrument-assert-equals-success.png)

When the completion date is not today, return the actual date from `{{g}}etCompletionDay()` to show the actual date in the output specification:

![specification showing the actual date as failure]({{site.baseurl}}/img/instrument-assert-equals-failure.png)

Further details: [assert-true command specification](https://concordion.github.io/concordion/latest/spec/command/assertTrue/AssertTrue.html)

----

## echo command
The `echo` command evaluates an expression and inserts the result into the output HTML. One usage is to display environment details in a page footer.

For example:

{% if html %}
~~~html
<p>
    Username: <span concordion:echo="username" />
</p> 
~~~
{% elsif md %}
~~~markdown
Username:[ ](- "c:echo=#username")
~~~
{% endif %}

Further details: [echo command specification](https://concordion.github.io/concordion/latest/spec/command/echo/Echo.html)

The echo command allows you to insert the results of evaluating an expression as text. Should you wish to insert HTML into the document, you will need to use the [embed extension](https://github.com/concordion/concordion-embed-extension).

----

## Expression language

In order to keep your specifications [simple and maintainable]({{site.baseurl}}/technique/{{ page.fixture_language }}/{{ page.spec_type }}#keepSpecsSimple), Concordion deliberately restricts the [expression language](https://concordion.github.io/concordion/latest/spec/command/expressions/Expressions.html) that is allowed when instrumenting specifications. 

{% if supports_full_ognl %}
This can be [overridden]({{site.baseurl}}/coding/{{ page.fixture_language }}/{{ page.spec_type }}/#full-ognl) to allow complex expressions.
{% endif supports_full_ognl %}