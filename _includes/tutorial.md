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
{% elsif fixture_language == 'csharp' %}
{% assign java=false %}
{% assign csharp=true %}
{% assign fixture_language_desc = 'C#' %}
{% endif %}

_This page explains getting started with __{{ spec_type_desc }}__ specifications in __{{ fixture_language_desc }}__._  Click the buttons above to choose other options.

Creating a living document is a 4 step process:

1. Discussing
2. Documenting
3. Instrumenting
4. Coding

Depending on your skillset and role you might be involved in one or more of these steps.

{% if html %}
__TODO - create HTML tutorial__
{% endif %}
To follow along the tutorial, we've created a template project you can [download](https://github.com/concordion/concordion-tutorial-2.0/archive/master.zip), or clone using Git: `git clone https://github.com/concordion/concordion-tutorial-2.0`. This project contains folders for each stage of the tutorial. 

To start from scratch, start from the `initial` folder of the project.

## 1. Discussing

By collaboratively exploring requirements with realistic examples, teams build a shared understanding and detect issues and misunderstandings prior to developing a new feature.

For this tutorial, we are working on a system for creating marketing mailshots. We want to have the first name and last name of the customer. Unfortunately the customer data that we are supplied only contains full names, so we will need to split them.

We start off discussing a simple example:

![Hand-drawn diagram showing the full name Jane Smith split into Jane and Smith]({{ site.baseurl }}/img/tutorial-discuss-names.png)

When discussing examples, we need to consider the _context_ (preconditions), _actions_ and _outcomes_ for each example. In this example, the context is the name `Jane Smith`, the action is `split` and the outcomes are the first name `Jane` and last name `Smith`.

As we progress, we discuss more complex cases. We often find it convenient to use tables, timelines or other diagrams to quickly and concisely describe examples:

![Hand-drawn diagram showing a table of example names being split]({{ site.baseurl }}/img/tutorial-discuss-names-table.png)

[Find out more]({{ site.baseurl }}/discussing) about discussing examples.

## 2. Documenting

The next step is to create a specification of the new feature.

In the `src/test/resources/marketing/mailshots` folder of the tutorial project, edit the file `SplittingNames.md` to contain the following.

~~~markdown
# Splitting Names

To help personalise our mailshots we want to have the first name and last name of the customer. 
Unfortunately the customer data that we are supplied only contains full names.

The system therefore attempts to break a supplied full name into its constituents by splitting 
around whitespace.

### Example

The full name Jane Smith is broken into first name Jane and last name Smith.
~~~

This uses a formatting language called Markdown, which makes it easy to create rich documents using plain text. 
The `#` characters at the start of the line create headings, where the heading level is determined by the number of `#` characters.

Previewing our [specification](https://github.com/concordion/concordion-tutorial-2.0/blob/master/documented/src/test/resources/marketing/mailshots/SplittingNames.md) in Github, or in an editor that supports Markdown, we see it looks like ![preview of initial specification]({{ site.baseurl }}/img/tutorial-authored-preview.png)

The team are happy with the specification, so we share it (for example, by adding the file to our version control system).

[Find out more]({{ site.baseurl }}/documenting) about documenting specifications.

## 3. Instrumenting

In order to make the specification executable, it must be _instrumented_ with commands. The instrumentation is invisible to a browser, but is processed by the fixture code.

![How it works]({{ site.baseurl }}/img/how-it-works.png)

The first step is to select the words in the example that define the _context_ (preconditions), _actions_ and _outcomes_. In our example, the context is the name `Jane Smith`, the action is `broken` and the outcomes are the first name `Jane` and last name `Smith`. We select these parts of the example using Markdown's link syntax:

~~~markdown
The full name [Jane Smith]() is [broken]() into first name [Jane]() and last name [Smith]().
~~~

Previewing our [specification](https://github.com/concordion/concordion-tutorial-2.0/blob/master/instrumenting/src/test/resources/marketing/mailshots/SplittingNames.md), we now see the example looks like ![preview of specification with links]({{ site.baseurl }}/img/tutorial-instrument-links-preview.png)

Next, we add commands to the links:

~~~markdown
The full name [Jane Smith](- "#name") is [broken](- "#result = split(#name)") 
into first name [Jane](- "?=#result.firstName") and last name [Smith](- "?=#result.lastName").
~~~
{: #annotated-example}

These commands are:

1. setting our _context_, by setting a new variable `#name` to the value `Jane Smith`
2. executing our _action_, by executing the method `split()` with the variable `#name` and returning the value `#result`
3. verifying our _outcomes_, by checking whether `#result.firstName` is set to `Jane`, and `#result.lastName` is set to `Smith`.

Previewing our [specification](https://github.com/concordion/concordion-tutorial-2.0/blob/master/instrumented/src/test/resources/marketing/mailshots/SplittingNames.md), we can hover over the links to see the command on each link ![preview of instrumented specification]({{ site.baseurl }}/img/tutorial-instrumented-preview.png)

We also mark up the example header, to turn it into a named example. When the specification is run, this will show as a JUnit test named `basic`.

~~~markdown
### [Example](- "basic")
~~~

[Find out more]({{ site.baseurl }}/instrumenting) about instrumenting fixtures.

## 4. Coding

Finally we create some code, called a _fixture_, that links the instrumented specification with the system under test.

In the `src/test/java/marketing/mailshots` folder of the tutorial project, create the file `SplittingNamesFixture.java` containing the following:

~~~java
package marketing.mailshots;

import org.concordion.integration.junit4.ConcordionRunner;
import org.junit.runner.RunWith;

@RunWith(ConcordionRunner.class)
public class SplittingNamesFixture {

}
~~~

You may have noticed that the fixture uses a JUnit runner. If you run the fixture as a JUnit test, for example from an IDE or running `gradle test` from the command line, the location of the output will be shown on the console, such as:

~~~console
file:///tmp/concordion/marketing/mailshots/SplittingNames.html
~~~

Opening this URL in a browser, the output should look something like this:

![output broken due to missing code]({{ site.baseurl }}/img/tutorial-broken-due-to-missing-code.png)

The test of the example is failing since we haven't implemented the `split()` method. We'll flesh out our fixture code:

~~~java
package marketing.mailshots;

import org.concordion.integration.junit4.ConcordionRunner;
import org.junit.runner.RunWith;

@RunWith(ConcordionRunner.class)
public class SplittingNamesFixture {

    public Result split(String fullName) {
        return new Result();
    }

    class Result {
        public String firstName = "TODO";
        public String lastName = "TODO";
    }
}
~~~

Run it now and you get:

![output broken because not fully implemented]({{ site.baseurl }}/img/tutorial-not-fully-implemented.png)

Let's implement the function. Obviously the implementation should be in the real system not in the test case, but just for fun...

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


The test now passes:

![output of successful run]({{ site.baseurl }}/img/tutorial-successful.png)

[Find out more]({{ site.baseurl }}/coding) about coding fixtures.
