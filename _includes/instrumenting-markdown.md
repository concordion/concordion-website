### execute command on a table

When you want to show several examples of a behaviour, repeating the same sentence structure over and over again probably isn't going to be very nice to read. It would be better to use a table.

For example:

![How the table is displayed (nice and neat)](img/instrument-table-example.png)

You can instrument this table, in a long-winded way, as follows:

~~~markdown
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

~~~markdown
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

~~~markdown
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

~~~markdown
[some link text](path/to/spec.html "c:run")
~~~

where `spec.html` is the name of the specification, with the relative path `path/to`.

[Further details](http://concordion.github.io/concordion/latest/spec/command/run/Run.html) and and [Markdown grammar](http://concordion.github.io/concordion/latest/spec/specificationType/markdown/MarkdownGrammar.html).

### assert-true and assert-false commands
These commands are useful for asserting boolean conditions. 

They should be used sparingly, since on failure they can only report true or false. For example, when the specification:

~~~markdown
The completion date should be set to [today](- "c:assertTrue="isCompletionToday()")
~~~

is run with a `isCompletionToday()` method that returns false, the output shows:

![specification showing false result](img/instrument-assert-true.png)

As an alternative, use the `assert-equals` command to show better error messages. Reworking our example above:

~~~markdown
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

~~~markdown
Username:[ ](- "c:echo=username")
~~~

[Further details](http://concordion.github.io/concordion/latest/spec/command/echo/Echo.html)