Concordion commands are differentiated from other Markdown [links](https://daringfireball.net/projects/markdown/syntax#link) by using a hyphen (`-`) for the URL:

~~~ markdown
    [value](- "command")
~~~

As an alternative to inline links, reference style links are supported, for example:

    [value][id]
    
    [id]: - "command"

or

    [value][]
    
    [value]: - "command"

Reference style links can help improve readability of the Markdown document, especially for table headers or lengthy commands. 

Let's start with a really simple example...

## Assert Equals

Create a file `HelloWorld.md` containing:

~~~
[Hello World!](- "?=getGreeting()")
~~~

When run with a fixture that implements the `getGreeting()` method to return `Hello World!`, the output specification will show:

![successful specification](img/hello-world-success.png)

### Properties support

In the example above, the call to `getGreeting()` can be simplified to `greeting` since Concordion's expression language understands simple properties.

~~~
[Hello World!](- "?=greeting")
~~~

(Note that the `?=` syntax is short for `c:assert-equals`).

## set command

Given a specification like this:

~~~
The greeting for user Bob will be: Hello Bob!
~~~

We want the first name (`Bob`) to be a parameter and the greeting (`Hello Bob!`) to be verified against the result returned by the system.

To do this we place links around the two significant pieces of text in the document. When the specification is executed, these links will be changed into commands and will not show as links in the output specification.

~~~
The greeting for user [Bob]() will be: [Hello Bob!]()
~~~

Now we can instrument the document:

~~~
The greeting for user [Bob](- "#firstName") will be: [Hello Bob!](- "?=greetingFor(#firstName)")
~~~

When Concordion processes the document, it will set a specification variable `#firstName` to the value `Bob` and then call the `greetingFor()` method with that value and check that the result is equal to `Hello Bob!`.

(Note that the `#` syntax is short for `c:set=#`).

## example command

_since: 2.0.0_

To specify that a piece of the specification is an example, add a heading link with the name of the example set as the link title. For example:

~~~
## [Example 1](- "example1")

Example goes here
~~~

Each example is run and reported as a separate test. Any commands that are outside of named examples are executed in an anonymous "outer" example.

### "before" examples

To specify that a piece of the specification should be run before each example, add a heading link with the keyword `before` as the link title. For example

~~~
## [Per example setup](- "before")

Example goes here
~~~

### Closing an example
The example block continues until it is closed either implicitly or explicitly.

An example is implicitly closed on any of these conditions:

* another example starts, or
* a header is encountered that is at a higher level than the example header (eg. the example is a `h3` and a `h2` header is encountered), or
* the end of file is reached.

To explicitly close an example, create a header with the example heading struck-through. For example:  

~~~
## ~~Example 1~~
~~~

will close the example with the heading `Example 1`    

[Further details](http://concordion.github.io/concordion/latest/spec/command/example/Examples.html) and [Markdown grammar](http://concordion.github.io/concordion/latest/spec/specificationType/markdown/MarkdownGrammar.html).

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
If the time is [09:00AM](- "#time") [ ](- "setCurrentTime(#time)")
then the greeting will say:
[Good Morning World!](- "?=getGreeting()")
~~~

We can actually remove the need for the set command by using the special variable #TEXT (which contains the text of the current element). The abbreviated instrumentation looks like this:

~~~
If the time is [09:00AM](- "setCurrentTime(#TEXT)") 
then the greeting will say:
[Good Morning World!](- "?=getGreeting()")
~~~

An alternative would be to change the getGreeting() method signature to allow the time to be passed in as a parameter. This is the approach you should normally take. An execute with no return value often indicates a "bad smell" - e.g. you're writing a script or your specification contains too many variables and covers too many behaviours. However, the functionality is there if you need it.

(Note that in the execute command is deduced by the absence of a `#`, `?=` or `c:` prefix. It is equivalent to prefixing the command with `c:execute=`).

### Executing an instruction with an object result

Sometimes you need to check more than one result of a behaviour. For example, here we want to check that both the first name and the last name are correctly extracted from the full name:

~~~
# Splitting Names

To help personalise our mailshots we want to have the first name and last name of the customer. 
Unfortunately the customer data that we are supplied only contains full names.

The system therefore attempts to break a supplied full name into its constituents by splitting around whitespace.

### [Example](- "simple-name")

The full name [John Smith](- "#result = split(#TEXT)")
will be broken into first name [John](- "?=#result.firstName")
and last name [Smith](- "?=#result.lastName")
~~~

The variable `#result` is going to be an object returned by the `split()` method. This object will have `firstName` and `lastName` properties. 

Alternatively, the [MultiValueResult]() class makes it easy to return multiple values without creating a new object, or you can return a `Map` result.

### Handling unusual sentence structures

One of the great things about Concordion is that when you're writing the specifications you do not have to worry about how you're going to instrument it. You can just concentrate on making the document as readable as possible.

Most English sentences can be instrumented. If you can't work out how to instrument it then you can always tweak the wording, but in general this should not be necessary. 

The execute command provides flexibility - however, you will need to embed HTML in your Markdown specification to achieve this, so will need to weigh that up against changing the wording.

For example, say we have the specification:

~~~
Upon login, the greeting for user [Bob]() will be: [Hello Bob!]())
~~~

This is easy to instrument:

~~~
Upon login, the greeting for user [Bob](- "#firstName") will be: [Hello Bob!](- "?=greetingFor(#firstName)")
~~~

But what if our specification was written like this:

~~~
The greeting "[Hello Bob!]()" should be given to user [Bob]() when he logs in.
~~~

In this case, the input parameter Bob occurs after the output greeting we want to check. We can solve this problem by changing this sentence to HTML and using an execute command on the outer element (the <p>).

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
# Splitting Names

To help personalise our mailshots we want to have the first name and last name of the customer. 
Unfortunately the customer data that we are supplied only contains full names.

The system therefore attempts to break a supplied full name into its constituents by splitting around whitespace.

### [Examples](- "simple-names")

| Full Name | First Name | Last Name |
| --------------- | --------------- | --------------- |
| [John Smith][split] | [John][first] | [Smith][last] |
| [David Peterson][split] | [David][first] | [Peterson][last] |

[split]: - "#result = split(#TEXT)"
[first]: - "?=#result.firstName"
[last]:  - "?=#result.lastName"
~~~

However, this is repetitive so Concordion provides a shortcut by placing commands on each table header column, with an additional execute command at the start of the first column. For each row of the table, the commands from the table headers are run, with any set commands being run before the execute command, followed by the assert commands.

For example:

~~~
# Splitting Names

To help personalise our mailshots we want to have the first name and last name of the customer. 
Unfortunately the customer data that we are supplied only contains full names.

The system therefore attempts to break a supplied full name into its constituents by splitting around whitespace.

### [Examples](- "simple-names")

| [ ][split][Full Name][full] | [First Name][first] | [Last Name][last] |
| --------------- | --------------- | --------------- |
| John Smith | John] | Smith |
| David Peterson | David | Peterson |

[split]: - "#result = split(#fullName)"
[full]: - "#fullName"
[first]: - "?=#result.firstName"
[last]:  - "?=#result.lastName"
~~~

This instrumentation has identical behaviour to the previous example.

Note that we used the "reference-style" Markdown links for these examples. These can be used anywhere you wish to make more readable and avoid repetitition. 

### execute command on a list

TODO - Markdown variant

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

[setup]: - "setUpUser(#username)"
[user]:   - "#username"

Searching for [arr](- "#searchString") will return:

| [ ][search] [Matching Usernames][match]|
|------------------------------------------|
| george.harrison |
| ringo.starr |

[search]: - "c:verify-rows=#username:getSearchResultsFor(#searchString)"
[match]: - "?=#username"
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
[some link text](path/to/spec.html "c:run")
~~~

where `spec.html` is the name of the specification, with the relative path `path/to`.

[Further details](http://concordion.github.io/concordion/latest/spec/command/run/Run.html) and and [Markdown grammar](http://concordion.github.io/concordion/latest/spec/specificationType/markdown/MarkdownGrammar.html).

### assert-true and assert-false commands
These commands are useful for asserting boolean conditions. 

They should be used sparingly, since on failure they can only report true or false. For example, when the specification:

~~~
The completion date should be set to [today](- "c:assertTrue="isCompletionToday()")
~~~

is run with a `isCompletionToday()` method that returns false, the output shows:

![specification showing false result](img/instrument-assert-true.png)

As an alternative, use the `assert-equals` command to show better error messages. Reworking our example above:

~~~
The completion date should be set to [today](- "?=getCompletionDay()").
~~~

When the completion date is today, return "today" from `getCompletionDay()` to show success:

![specification showing today as success](img/instrument-assert-equals-success.png)

When the completion date is not today, return the actual date from `getCompletionDay()` to show the actual date in the output specification:

![specification showing the actual date as failure](img/instrument-assert-equals-failure.png)

[Further details](http://concordion.github.io/concordion/latest/spec/command/assertTrue/AssertTrue.html)

### echo command
The `echo` command evaluates an expression and inserts the result into the output HTML. One usage is to display environment details in a page footer.

For example:

~~~
Username:[ ](- "c:echo=username")
~~~

[Further details](http://concordion.github.io/concordion/latest/spec/command/echo/Echo.html)