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

* TOC
{:toc}

# Technique

## Write specifications, not scripts

Hide all scripting activity in the Java fixture code.

<a name="scripts"> </a>

### Scripts over-specify
{:.no_toc}

Test scripts are a list of instructions to be followed. For example:

<blockquote class="example bad">
    <img src="{{ site.baseurl }}/img/bad.png" alt="bad practice"/>
    Clear database
    <br/>Load database from "sample-data.sql"
    <br/>Start webserver
    <br/>Open URL: http://localhost:8080/myapp
    <br/>Enter username: admin
    <br/>Enter password: admin1
    <br/>Click the "Login" button
    <br/>Click the "User Administration" link
    <br/>Click the "Create User" button:
    <br/>Enter name: John Smith
    <br/>Enter username: john
    <br/>Enter password: john99
    <br/>Click the "OK" button
    <br/>Click the "Logout" link
    <br/>Enter username: john
    <br/>Enter password: john99
    <br/>Click the "Login" button
    <br/>Check page contains text: Hello John!
</blockquote>

Concealed inside the script is a behaviour that the test is trying to demonstrate. But because the requirement is not explicit, it's hard to know what it is (e.g. "Can we change this link to a button, or is the link part of the requirement?").

Scripts also tend to suffer badly from duplication. If we introduce an extra step into the authentication process then all the scripts that mention logging-in will need modification. This is exactly the kind of duplication that programming languages are designed to address and why plain English is not a good language for scripting.

<a name="specFreedom"> </a>

### Specifications give you freedom
{:.no_toc}

Specifications tell you the requirements explicitly. They are written at a higher level of abstraction to test scripts. For example:

<blockquote class="example good">
    <img src="{{ site.baseurl }}/img/good.png" alt="good practice"/>
    When John logs in, a greeting "Hello John!" is displayed.
</blockquote>

This can be implemented in multiple ways. All of the details about how to test the requirement are hidden inside the fixture code where they can be refactored as the system evolves.

----

<a name="specStable"> </a>

## Specifications should be stable

The specifications themselves should rarely change. Even on agile projects, though new behaviour is added frequently, existing behaviour is normally maintained from iteration to iteration.
    
### Decouple using the fixture as a go-between
{:.no_toc}

Let the fixture code act as a buffer so that the specifications stay very stable. Anything implementation-specific should be hidden in the fixture code. You should find that the majority of specifications are written once and never changed.

<img id="specFixtureSystem" class="inline" src="{{ site.baseurl }}/img/technique-spec-fixture-system-gray.png" alt="Fixture in between specification and system"/>

<a name="instrumentationStable"> </a>

### Instrumentation should not change either
{:.no_toc}

The job of the instrumentation is to translate the examples in the specification into method calls into the fixture. The instrumentation should be very simple and should not show any knowledge of how the behaviour is actually implemented in the system. Once written, the public interface of the fixture should not change; the implementation of its methods may change though.

<a name="keepSpecsSimple"> </a>

### Only reveal data the specification actually needs
{:.no_toc}

In general, it's better not to return domain objects directly from fixture methods, but return strings or small objects containing just the values needed for the examples in the specification. The interfaces of domain objects may change and we want to avoid having to make changes to the instrumentation.

For example, don't reference a deep property of a domain object from the instrumentation:

<blockquote class="example bad">
<img src="{{ site.baseurl }}/img/bad.png" alt="bad practice"/>
<code>order.phoneLine.phoneNumber</code>
<br/><code>order.phoneLine.location.postcode</code>
</blockquote>

But, instead create a new inner class in the fixture that has the exact properties needed, and populate it from the domain object. This decouples the specifications from the domain model and gives you the flexibility to improve the model.

<blockquote class="example good">
<img src="{{ site.baseurl }}/img/good.png" alt="good practice"/>
<code>phoneNumber</code>
<br/><code>postcode</code>
</blockquote>

----

<a name="evolveDSL"> </a>

## Evolve a domain-specific language

As you write the fixture code, and refactor it to remove duplication, you'll find you gradually build up a scripting API &#150; a domain-specific language (DSL) &#150; that lets you manipulate the system under test. Eventually, the fixture code will become very stable too.

<img id="specFixtureScriptSystem" class="inline" src="{{ site.baseurl }}/img/technique-spec-fixture-scripting-system-gray.png"  alt="Scripting DSL in between fixture and system"/>

----

<a name="isolateBehaviours"> </a>

## Isolate behaviours

Each active specification should have a narrow focus and cover a single behaviour as independently as possible from other behaviours. For example, one specification might describe how text searches are case-insensitive, another will describe how date searches work, and another will describe how search results are to be presented (what data is displayed). The idea is to keep each specification very simple and to avoid overlaps, so that we can change the specification about the way search results are presented without having to make changes to the other specifications.

If you want to test a combination of behaviours, write a separate specification of the behaviour for the combination. But always write the specifications for the individual behaviours first. When you combine behaviours there is a penalty in terms of complexity &#150; of both the specification and the fixture code to support it.

----

<a name="thinkGWT"> </a>

## Think "Given-When-Then"

This is an excellent way of structuring the concrete examples in the specifications, and getting into the mindset of specifying instead of scripting. I believe it was [Dan North](http://dannorth.net) and [Chris Matts](https://twitter.com/papachrismatts) who came up with the template:

<blockquote>
<b>Given</b> (some context)
<br/><b>When</b> (something happens)
<br/><b>then</b> (some behaviour)
</blockquote>

Example:

<blockquote class="example good">
<img src="{{ site.baseurl }}/img/good.png" alt="good practice"/>
Given a user called John;
<br/>When John logs in,
<br/>then a greeting is displayed saying "Hello John!".
</blockquote>

Once you've written or thought about your behaviour using the Given-When-Then template, you can reword the sentence to make it less clunky. For example, in this case we can deduce that John is a user from the phrase "John logs in", so we can drop the "Given" part and write something more readable like this:

<blockquote class="example good">
<img src="{{ site.baseurl }}/img/good.png" alt="good practice"/>
When John logs in, a greeting
"Hello John!" is displayed.
</blockquote>

<a name="commonSmells"> </a>
<img class="smelly bin" src="{{ site.baseurl }}/img/smelly-rubbish-bin.png" alt="smells"/>

# Common Smells

<a name="specsChange"> </a>

## Existing specifications are often changed

### You're tied to an implementation
{:.no_toc}

If you find you're having to change the contents of specifications / instrumentation, on a regular basis, this is a strong indicator that the specifications are too closely coupled to the implementation.

### So, pretend there are multiple implementations
{:.no_toc}

The solution is to describe the underlying behaviour in a more abstract way. It might help to imagine that there are several different implementations - a web application, a Swing application, and a command-line executable, for example. Only describe behaviour that is _required_ so that you leave as many options open as possible for alternative implementations.

----

<img class="smelly fish" src="{{ site.baseurl }}/img/smelly-fish.png" alt="smell"/>
<a name="lotsOfExecutes"> </a>

## Lots of "execute" commands


### You're writing a script
{:.no_toc}

If you have lots of "execute" commands you are probably writing a script instead of a specification.

### So, hide the scripting in the fixture
{:.no_toc}

Avoid describing the steps of how to test the behaviour and simply state the context (as a sentence), and the behaviour you expect to see. Don't explain how to get into that context, don't explain how to perform the operation and don't explain how to extract the results. All of these things are implementation-specific and should be hidden in the fixture code.

----

<img class="smelly fish" src="{{ site.baseurl }}/img/smelly-fish.png" alt="smell"/>
<a name="complicatedInstrumentation"> </a>

## Complicated instrumentation

### You're testing too much in one go
{:.no_toc}

As a rule of thumb, well-written fixtures should have no more than three public methods and no method should have more than one or two parameters. Complicated instrumentation is usually a sign of trying to test too many things at once.

### So, decompose the behaviour
{:.no_toc}

Focus on one tiny behaviour at a time. Break the behaviour into smaller and smaller pieces until you cannot break it down any further. Then write separate specifications for each piece.

----

<img class="smelly fish" src="{{ site.baseurl }}/img/smelly-fish.png" alt="smell"/>
<a name="complicatedFixtures"> </a>

## Complicated fixture code

### Your fixture code is verbose and hard to follow
{:.no_toc}

All the scripting should be done in the fixture code, but this can make the code seem complicated.

### So, create classes to help with the scripting
{:.no_toc}

Begin to create objects to help with the scripting activity - push the implementation details into them. Eventually you'll create a little domain specific language (DSL).

----

<img class="smelly fish" src="{{ site.baseurl }}/img/smelly-fish.png" alt="smell"/>
<a name="sameStructure"> </a>

## Examples all have the same structure

### Your examples are too generic
{:.no_toc}

If the examples in your specifications look very similar (i.e. they have the same kind of context set-up, the same kind of checks etc.) this is a strong sign that the examples are too generic.

### So, focus the examples more carefully
{:.no_toc}

The examples should demonstrate the particular behaviour you are describing and should not include any irrelevant details. Push everything you can into the fixture code.

<blockquote class="example bad">
    <img src="{{ site.baseurl }}/img/bad.png" alt="bad practice"/>
    Given the following orders:
    <br/>
    <br/>
    <table class="bordered responsive">
        <tr>
            <th>Order ID</th>
            <th>Status</th>
            <th>Requester</th>
            <th>Date</th>
            <th>Service Level</th>
        </tr>
        <tr>
            <td>1</td>
            <td>Active</td>
            <td>john.smith</td>
            <td>13-Oct-2007</td>
            <td>High</td>
        </tr>
    </table>
    <br />When order <b>1</b> is <b>cancelled</b>,
    <br />Then the orders become:
    <br/>
    <br/>
    <table class="bordered responsive">
        <tr>
            <th>Order ID</th>
            <th>Status</th>
            <th>Requester</th>
            <th>Date</th>
            <th>Service Level</th>
        </tr>
        <tr>
            <td>1</td>
            <td>Cancelled</td>
            <td>john.smith</td>
            <td>13-Oct-2007</td>
            <td>High</td>
        </tr>
    </table>
</blockquote>

The layout above is "one size fits all". It contains lots of context that is not relevant to the behaviour we want to show.

Focusing the examples improves their clarity and reduces duplication:

<blockquote class="example good">
    <img src="{{ site.baseurl }}/img/good.png" alt="good practice"/>
    When an <b>Active</b> order is cancelled,
    its status is displayed as <b>Cancelled</b>.
</blockquote>