With the HTML format, commands use a `concordion` namespace defined at the top of each document as follows:

~~~
<html xmlns:concordion="http://www.concordion.org/2007/concordion">
~~~

Let's start with a really simple example...

## assert-equals command

Create a file `HelloWorld.html` containing:

~~~
<html xmlns:concordion="http://www.concordion.org/2007/concordion">
    <body>
        <p concordion:assert-equals="getGreeting()">Hello World!</p>
    </body>
</html
~~~

When run with a fixture that implements the `getGreeting()` method to return `Hello World!`, the output specification will show:

![successful specification](img/hello-world-success.png)

### Properties support

In the example above, the call to `getGreeting()` can be simplified to `greeting` since Concordion's expression language includes properties support.

~~~
<html xmlns:concordion="http://www.concordion.org/2007/concordion">
    <body>
        <p concordion:assert-equals="greeting">Hello World!</p>
    </body>
</html>
~~~

Note that either `assert-equals` or `assertEquals` can be used for the command name.

[Further details](http://concordion.github.io/concordion/latest/spec/command/assertEquals/AssertEquals.html)

## set command

Given a specification like this:

~~~
<html>
    <body>
        <p>
            The greeting for user Bob will be: Hello Bob!
        </p>
    </body>
</html>
~~~

We want the first name (`Bob`) to be a parameter and the greeting (`Hello Bob!`) to be verified against the result returned by the system.

To do this we place `<span>` tags around the two significant pieces of text in the document. In HTML, `<span>` tags don't have any effect on the display of the output document.

~~~
<html>
    <body>
        <p>
            The greeting for user <span>Bob</span>
            will be: <span>Hello Bob!</span>
        </p>
    </body>
</html>
~~~

Now we can instrument the document:

~~~
<html xmlns:concordion="http://www.concordion.org/2007/concordion">
    <body>
        <p>
            The greeting for user <span concordion:set="#firstName">Bob</span>
            will be:
            <span concordion:assert-equals="greetingFor(#firstName)">Hello Bob!</span>
        </p>
    </body>
</html>
~~~

When Concordion processes the document, it will set a specification variable `#firstName` to the value `Bob` and then call the `greetingFor()` method with that value and check that the result is equal to `Hello Bob!`.

## example command

_since: 2.0.0_

To specify that a piece of HTML is an example, annotate the enclosing HTML tag with the `concordion:example` tag, putting your example name in the expression. For example:

~~~
<div concordion:example="example1">
        Example goes here
</div>
~~~

Each example is run and reported as a separate test. Any commands that are outside of named examples are executed in an anonymous "outer" example.

### "before" examples

To specify that a piece of the specifications should be run before each example, annotate the enclosing HTML tag with the concordion:example tag, putting the keyword `before` in the expression. For example

~~~
<div concordion:example="before">
        ...Example goes here
</div>
~~~

[Further details](http://concordion.github.io/concordion/latest/spec/command/example/Examples.html)

## execute command

The execute command has three main uses:

1. Executing an instruction with a "void" result.
2. Executing an instruction with an object result (to allow multiple properties of the object to be checked).
3. Handling unusual sentence structures.

### Executing an instruction with a void result

It can occasionally be useful to execute an instruction that sets up some system state. Every time you do this, however, alarm bells should ring in your head and you should question yourself to make sure that you are not inadvertently writing a script instead of a specification. E.g. a call to "clearDatabase()" would be a blatant misuse (see [Technique](TODO) for more on this topic).

As a rule of thumb, methods with a void result called from an execute should start with the word set or setUp. E.g. setUpUser(#username).

Take the following specification for example:

~~~
<html xmlns:concordion="http://www.concordion.org/2007/concordion">
    <body>
        <p>
            If the time is
            <span concordion:set="#time">09:00AM</span>
            <span concordion:execute="setCurrentTime(#time)" />
            then the greeting will say:
            <span concordion:assert-equals="getGreeting()">Good Morning World!</span>
        </p>
    </body>
</html>
~~~

We can actually remove the need for the concordion:set command by using the special variable #TEXT (which contains the text of the current element). The abbreviated instrumentation looks like this:

~~~
<html xmlns:concordion="http://www.concordion.org/2007/concordion">
    <body>
        <p>
            If the time is
            <span concordion:execute="setCurrentTime(#TEXT)">09:00AM</span>
            then the greeting will say:
            <span concordion:assert-equals="getGreeting()">Good Morning World!</span>
        </p>
    </body>
</html>
~~~

An alternative would be to change the getGreeting() method signature to allow the time to be passed in as a parameter. This is the approach you should normally take. An execute with no return value often indicates a "bad smell" - e.g. you're writing a script or your specification contains too many variables and covers too many behaviours. However, the functionality is there if you need it.

### Executing an instruction with an object result

Sometimes you need to check more than one result of a behaviour. For example, here we want to check that both the first name and the last name are correctly extracted from the full name:

~~~
 <html xmlns:concordion="http://www.concordion.org/2007/concordion">

    <head>
        <link href="../concordion.css" rel="stylesheet" type="text/css" />
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

        <div concordion:example="simple-name">

            <h3>Example</h3>

            <p>
                The full name
                <span concordion:execute="#result = split(#TEXT)">John Smith</span>
                will be broken into first name
                <span concordion:assert-equals="#result.firstName">John</span>
                and last name
                <span concordion:assert-equals="#result.lastName">Smith</span>.
            </p>

        </div>
    </body>
</html>
~~~

The variable `#result` is going to be an object returned by the `split()` method. This object will have `firstName` and `lastName` properties. 

Alternatively, the [MultiValueResult]() class makes it easy to return multiple values without creating a new object, or you can return a `Map` result.

### Handling unusual sentence structures

One of the great things about Concordion is that when you're writing the specifications you do not have to worry about how you're going to instrument it. You can just concentrate on making the document as readable as possible.

Most English sentences can be instrumented. If you can't work out how to instrument it then you can always tweak the wording, but in general this should not be necessary. The execute command provides flexibility.

For example, say we have the specification:

~~~
<p>
    Upon login, the greeting for user <span>Bob</span>
    will be: <span>Hello Bob!</span>
</p>
~~~

This is easy to instrument:

~~~
<p>
    Upon login, the greeting for user <span concordion:set="#firstName">Bob</span>
    will be:
    <span concordion:assert-equals="greetingFor(#firstName)">Hello Bob!</span>
</p>
~~~

But what if our specification was written like this:

~~~
<p>
    The greeting "<span>Hello Bob!</span>" should be given
    to user <span>Bob</span> when he logs in.
</p>
~~~

In this case, the input parameter Bob occurs after the output greeting we want to check. We can solve this problem by using an execute command on the outer element (the <p>).

~~~
<p concordion:execute="#greeting = greetingFor(#firstName)">
    The greeting "<span concordion:assert-equals="#greeting">Hello Bob!</span>"
    should be given to user <span concordion:set="#firstName">Bob</span>
    when he logs in.
</p>
~~~

How does this work? It works because the execute command is designed to process commands on its child elements in a special order. First of all it processes any child set commands then it runs its own command, then any child execute commands and finally any child assert-equals commands.

### execute command on a table

When you want to show several examples of a behaviour, repeating the same sentence structure over and over again probably isn't going to be very nice to read. It would be better to use a table.

For example:

![How the table is displayed (nice and neat)](img/instrument-table-example.png)

You can instrument this table, in a long-winded way, as follows:

~~~
<html xmlns:concordion="http://www.concordion.org/2007/concordion">

    <head>
        <link href="../concordion.css" rel="stylesheet" type="text/css" />
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

        <div concordion:example="simple-names">

            <h3>Examples</h3>

            <table>
                <tr>
                    <th>Full Name</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                </tr>
                <tr concordion:execute="#result = split(#fullName)">
                    <td concordion:set="#fullName">John Smith</td>
                    <td concordion:assert-equals="#result.firstName">John</td>
                    <td concordion:assert-equals="#result.lastName">Smith</td>
                </tr>
                <tr concordion:execute="#result = split(#fullName)">
                    <td concordion:set="#fullName">David Peterson</td>
                    <td concordion:assert-equals="#result.firstName">David</td>
                    <td concordion:assert-equals="#result.lastName">Peterson</td>
                </tr>
            </table>

        </div>
    </body>
</html>
~~~

However, this is repetitive so Concordion provides a shortcut. When you place an execute command on a `<table>` element the commands on the header row (the row containing `<th>` elements) are copied to each detail row (rows containing `<td>` elements) and the execute command is run on each detail row.

~~~
<html xmlns:concordion="http://www.concordion.org/2007/concordion">

    <head>
        <link href="../concordion.css" rel="stylesheet" type="text/css" />
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

        <div concordion:example="simple-names">

            <h3>Examples</h3>

            <table concordion:execute="#result = split(#fullName)">
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
    </body>
</html>
~~~

This instrumentation has identical behaviour to the previous example.

### execute command on a list

_since 1.4.6_

The `execute` command has special behavior when placed on a list element (`<ol>` or `<ul>`). Instead of executing once, it executes every list item in the list (and all its sub lists) and transfers the commands from the list element to each list item element. This feature can for example be used to setup a hierarchical structure of test data.

[Further details](http://concordion.github.io/concordion/latest/spec/command/execute/ExecutingList.html)

### verify-rows command

When you want to check the contents of a collection of results returned from the system, use the `verify-rows` command.

For example, while writing a user administration tool we might write a specification like this describing the behaviour of the search functionality:

![Original Specification](img/instrument-original-verify-rows-table.png)

The idea is that in the fixture code we'll set up the users in the system, perform a search and then confirm that the right users (and only these users) were returned in the search results. If too many, too few, or the wrong users were returned we want the test to fail.

The instrumented HTML source for the specification looks like this:

~~~
<html xmlns:concordion="http://www.concordion.org/2007/concordion">
<body>

<h1>Partial Matches</h1>

<p>
    Username searches return partial matches, i.e. all usernames containing
    the search string are returned.
</p>

<div concordion:example="beatles">

    <h3>Example</h3>

    <p>Given these users:</p>

    <table concordion:execute="setUpUser(#username)">
        <tr><th concordion:set="#username">Username</th></tr>
        <tr><td>john.lennon</td></tr>
        <tr><td>ringo.starr</td></tr>
        <tr><td>george.harrison</td></tr>
        <tr><td>paul.mccartney</td></tr>
    </table>

    <p>Searching for "<b concordion:set="#searchString">arr</b>" will return:</p>

    <table concordion:verify-rows="#username : getSearchResultsFor(#searchString)">
        <tr><th concordion:assert-equals="#username">Matching Usernames</th></tr>
        <tr><td>george.harrison</td></tr>
        <tr><td>ringo.starr</td></tr>
    </table>

</div>

</body>
</html>
~~~

The syntax for a verify-rows command is:

~~~
#loopVar : expression
~~~

Where expression returns an Iterable object with a predictable iteration order, (e.g. a List, LinkedHashSet or a TreeSet). And #loopVar provides access to the current object during iteration and allows the assert-equals method to check its value.

By default, the order of the items in the table being verified must match the iteration order of the items returned by the expression. You may need to sort the items to ensure they are in a known and consistent order. In our example, we are using alphabetical order ("george" before "ringo"). 

(As an alternative, you can apply a [match strategy](http://concordion.github.io/concordion/latest/spec/command/verify-rows/strategies/Strategies.html) to define how the rows are matched).

When run with a fixture that returns an empty collection, we get:

![Two missing rows](img/instrument-verify-rows-empty.png)

Two rows are missing because our search function is not implemented and returns an empty set.

After the feature is implemented, when we run it we get a success:

![Success](img/instrument-verify-rows-success.png)

Note that either `verify-rows` or `verifyRows` can be used for the command name.

[Further details](http://concordion.github.io/concordion/latest/spec/command/verifyRows/VerifyRows.html)

### run command
The `run` command lets you run another specification from this specification, and build up test suites. Executing the specification will automatically execute all its linked specifications (recursively), with the results aggregated up.

The format is:

~~~
<a concordion:run="runner-name" href="relative-link">some link text</a>
~~~

The runner-name should normally be `concordion`. 

[Further details](http://concordion.github.io/concordion/latest/spec/command/run/Run.html)

### assert-true and assert-false commands
These commands are useful for asserting boolean conditions. 

They should be used sparingly, since on failure they can only report true or false. For example, when the specification:

~~~
<p>The completion date should be set to <span concordion:assertTrue="isCompletionToday()">today</span>.</p>
~~~

is run with a `isCompletionToday()` method that returns false, the output shows:

![specification showing false result](img/instrument-assert-true.png)

As an alternative, use the `assert-equals` command to show better error messages. Reworking our example above:

~~~
<p>The completion date should be set to <span concordion:assertEquals="getCompletionDay()">today</span>.</p>
~~~

When the completion date is today, return "today" from `getCompletionDay()` to show success:

![specification showing today as success](img/instrument-assert-equals-success.png)

When the completion date is not today, return the actual date from `getCompletionDay()` to show the actual date in the output specification:

![specification showing the actual date as failure](img/instrument-assert-equals-failure.png)

[Further details](http://concordion.github.io/concordion/latest/spec/command/assertTrue/AssertTrue.html)

### echo command
The `echo` command evaluates an expression and inserts the result into the output HTML. One usage is to display environment details in a page footer.

[Further details](http://concordion.github.io/concordion/latest/spec/command/echo/Echo.html)