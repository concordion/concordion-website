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
{% assign fixture_ext='java' %}
{% assign test_library='JUnit' %}
{% assign supports_2_0 = true %}
{% elsif fixture_language == 'csharp' %}
{% assign java=false %}
{% assign csharp=true %}
{% assign fixture_language_desc = 'C#' %}
{% assign fixture_ext='cs' %}
{% assign test_library='NUnit' %}
{% assign supports_2_0 = false %}
{% endif %}

_This page describes coding fixtures in __{{ fixture_language_desc }}__._  Click the toggle buttons above to choose other options.

* TOC
{:toc}

## Overview 

Concordion fixtures find commands in the instrumented specification and use them to verify the system under test. 

Concordion is a test runner that can invoke your application code directly:

![Fixture calling application code directly]({{ site.baseurl }}/img/coding-application-layer.png)

It can also drive the interfaces of your deployed application:

![Fixture calling driver calling deployed application]({{ site.baseurl }}/img/coding-driver-layers.png)

It is good practice to create a separate driver layer for the code that drives your application interface, keeping the runner free of driver logic and the driver layer free of test assertions. Other libraries are required for the driver layer, such as [Selenium WebDriver](http://www.seleniumhq.org/projects/webdriver/) for web applications{% if java %}; [wslite](https://github.com/jwagenleitner/groovy-wslite), JAX/WS or JAX/RS for web services; JDBC for databases, etc. Any Java{% elsif csharp %}{% comment %} TODO - add dotnet libraries {% endcomment %} etc. Any .NET {% endif %} library can be used with Concordion, providing a lot of flexibility in how you use it. See the [FAQ]({{site.baseurl}}/questions/{{ page.fixture_language }}/{{ page.spec_type }}#webTesting) for further detail.

## Project Structure

### Dependencies
{% if csharp %}
Version 3.5 or higher of the .NET framework must be used as target framework in the project that contains your Concordion.NET fixture classes.
{% endif csharp %}

Concordion{% if csharp %}.NET{% endif %} requires a number of libraries to be present, including Concordion, {{ test_library }}, XOM and OGNL libraries. 

The best way to manage these dependencies is to use {% if java %}a build tool such as Gradle or Maven{% elsif csharp %}NuGet{% endif %}. See the [download]({{site.baseurl}}/download/{{ page.fixture_language }}/{{ page.spec_type }}) page for details{% if java %} of the dependencies section that must be added to the `build.gradle` or `pom.xml` file respectively{% endif %}. 

As an alternative, you can download the full distribution from the [download]({{site.baseurl}}/download/{{ page.fixture_language }}/{{ page.spec_type }}) page. After extracting the files, you must add references to all the downloaded libraries to the project{% if java %} classpath{% endif %}. 

{% if csharp %}
### Assembly Info
Add the attribute `[assembly: RequiredAddin("ConcordionNUnitAddin")]` to the `AssemblyInfo.cs` of your project. This tells NUnit that the Concordion-NUnit-Addin is required to run your Concordion.NET tests.
{% endif csharp %}

### Locating the Specification
{% if java %}
The fixture must be in the same package as the specification. It can be in a different source folder, as long as that folder is on the Java classpath. For instance the [tutorial]({{site.baseurl}}/tutorial/{{ page.fixture_language }}/{{ page.spec_type }}) uses the conventional `src/test/java` folder for the fixture class, and the `src/test/resources` folder for the specification:

![Folder structure of tutorial project]({{ site.baseurl }}/img/coding-folder-structure.png)

Some users prefer to have the specifications and fixture classes in the same folder, and adjust their build tool settings accordingly. Another common pattern is to create a distinct folder, such as `src/spec`, to keep the specifications and fixtures separate from unit tests.

{% elsif csharp %}

The fixture must be in the same namespace as the specification, where the namespace of the fixture is composed from the default namespace of the project plus the path to the specification.

For example, in the [tutorial]({{site.baseurl}}/tutorial/{{ page.fixture_language }}/{{ page.spec_type }}), the fixture with a namespace of `Marketing.Mailshot.Completed`:

![Fixture with namespace set to Marketing.Mailshot.Completed]({{ site.baseurl }}/img/coding-dotnet-fixture-namespace.png)

uses a specification with its namespace derived by taking the default namespace for the project - which is set to `Marketing.Mailshot`:

![Project properties showing default namespace]({{ site.baseurl }}/img/coding-dotnet-default-namespace.png)

and appending the `Completed` folder that the specification is in:

![Folder structure showing specification in the Completed folder]({{ site.baseurl }}/img/coding-dotnet-folder-structure.png)

As an alternative, you can [configure](#configuration-options) the BaseInputDirectory to specify the location of your specification documents.

### Including the Specification in the DLL

 In order for the specification to be found, it must be included in your DLL file: In Visual Studio, open the properties for the specification and set the value "Embedded Resource" on the property "Build Action":

![Properties for specification]({{ site.baseurl }}/img/coding-dotnet-spec-properties.png)

### Setup your NUnit Runner
Finally, if you haven't already added the current version of `Concordion.NUnit.dll` to your NUnit addins folder, you will need to [install the Concordion NUnit dll as a NUnit addin]({{site.baseurl}}/integrations/{{ page.fixture_language }}/{{ page.spec_type }}).

{% endif %}

## Fixture classes
Concordion fixtures use the {{ test_library }} library, with a {% if java %}specialised ConcordionRunner. Fixtures must be annotated with the `@RunWith(ConcordionRunner.class)` annotation{% elsif csharp %}Concordion addin. Fixtures must declare a class-level `ConcordionTest` attribute from the `Concordion.NET.Integration` namespace{% endif %}:

{% if java %}
~~~java
import org.concordion.integration.junit4.ConcordionRunner;
import org.junit.runner.RunWith;

@RunWith(ConcordionRunner.class)
public class SplittingNamesFixture {
}
~~~
{% elsif csharp %}
~~~csharp
using Concordion.NET.Integration;

namespace Marketing.Mailshot.Initial
{
    [ConcordionTest]
    public class SplittingNamesFixture
    {
    }
}
~~~
{% endif %}

A fixture class is required for each specification. The name of the fixture class and the specification share the same base name. The fixture has an optional suffix of "Fixture" or "Test" - for example, the fixture for the "SplittingNames.{{ spec_ext }}" specification could be named "SplittingNames.{{ fixture_ext }}", "SplittingNamesFixture.{{ fixture_ext }}" or "SplittingNamesTest.{{ fixture_ext }}".

Unlike {{ test_library }}, we don't {% if java %}annotate methods with `@Test`{% elsif csharp %}add a `[Test]` attribute to methods{% endif %}. Instead, the tests are determined from the specification. {% if supports_2_0 %}Each example in the specification that uses the [example command]({{site.baseurl}}/instrumenting/{{ page.fixture_language }}/{{ page.spec_type }}/#example-command) is created as a separate JUnit test, and an additional `[outer]` test is added for any commands that exist outside of examples. If the example command is not used, the{% else %}The{% endif supports_2_0 %} specification is run as a single {{ test_library }} test.

### Fixture methods

#### Parameter types

Methods in Concordion fixtures can take the following parameter types:

* Numeric types (int, long, float, double, decimal)
* string
* bool

When executed from a Concordion specification, Concordion will automatically convert the value to the parameter type. Boolean values must be specified as `true` or `false` in the specification.

#### Return types

Methods can return void, a primitive or an Object.

##### Returning a {% if java %}Map{% elsif csharp %}Dictionary{% endif %} result

As described in the tutorial, to check more than one result of a behaviour, you can return an Object from the execute command. An alternative is to return a {% if java %}Map{% elsif csharp %}Dictionary{% endif %} object, for example:

{% if java %}
~~~java
public Map split(String fullName) {
    String[] words = fullName.split(" ");
    Map<String, String> results = new HashMap<String, String>();
    results.put("firstName", words[0]);
    results.put("lastName", words[1]);
    return results;
}
~~~
{% elsif csharp %}
~~~java
public Dictionary<String, String> Split(string fullName)
{
    string[] words = fullName.Split(' ');
    Dictionary<String, String> result = new Dictionary<String, String>();
    result.Add("firstName", words[0]);
    result.Add("lastName", words[1]);
    return result;
}
~~~
{% endif csharp %}

This is particularly useful when calling existing methods that return {% if java %}Map objects, or when using a JVM language with native language support for Maps, such as Groovy{% elsif csharp %}Dictionary objects.{% endif %}

{% if java %}
##### Returning a MultiValueResult

The [MultiValueResult](https://github.com/concordion/concordion/blob/master/src/main/java/org/concordion/api/MultiValueResult.java) class makes it even simpler to return more than one result from the execute command. For example, [SplittingNamesTest]({{site.baseurl}}/tutorial/{{ page.fixture_language }}/{{ page.spec_type }}#complete-code) can be simplified to:

~~~java
package example;

import org.concordion.api.MultiValueResult;
import org.concordion.integration.junit4.ConcordionRunner;
import org.junit.runner.RunWith;

@RunWith(ConcordionRunner.class)
public class SplittingNamesFixture {

    public MultiValueResult split(String fullName) {
        String[] words = fullName.split(" ");
        return new MultiValueResult()
                .with("firstName", words[0])
                .with("lastName", words[1]);
    }
}
~~~

The specification can reference the properties of the `MultiValueResult` as if they were bean properties, as shown in the [Splitting Names specification]({{site.baseurl}}/tutorial/{{ page.fixture_language }}/{{ page.spec_type }}#annotated-example).

{% endif java %}

### Implementation status

{% if java %}
For specifications that don't use the example command. you can include partially-implemented specifications in your normal build without breaking the build, by annotating your fixture classes with one of the following annotations:

* `@ExpectedToPass`
* `@ExpectedToFail`
* `@Unimplemented`

For example:

~~~java
import org.concordion.api.ExpectedToFail;
import org.concordion.integration.junit4.ConcordionRunner;
import org.junit.runner.RunWith;

@ExpectedToFail
@RunWith(ConcordionRunner.class)
public class GreetingTest {

   public String greetingFor(String firstName) {
        return "TODO";
   }
}
~~~

Further details: [annotation specification](https://concordion.github.io/concordion/latest/spec/annotation/Annotation.html).

If you are using the example command, you must set the [implementation status]({{site.baseurl}}/instrumenting/{{ page.fixture_language }}/{{ page.spec_type }}/#implementation-status) on the individual examples in the specification.

{% elsif csharp %}

To allow you to include specifications in the build before they have been fully implemented, you can annotate a fixture class with the NUnit IgnoreAttribute. When you add the `[Ignore]` attribute at the top of your fixture class, NUnit will not run this particular active specification. Instead, the test will be marked yellow and added to your test reports. This helps to ensure that the test will not be forgotten in future.

{% endif csharp %}

{% if java %}
### Fail-fast

After an exception occurs, by default, Concordion continues processing the current specification so it can show all the problems not just the first one.

In cases where you want Concordion to stop processing the current specification after any exception occurs, add the `@FailFast` annotation to the fixture class.

The `@FailFast` annotation has an optional `onExceptionType` parameter that allows a list of specific exception types to be specified. In this case, Concordion will only stop processing if any of the specified exception types occur. For example:

~~~java
import org.concordion.api.FailFast;
import org.concordion.integration.junit4.ConcordionRunner;
import org.junit.runner.RunWith;

@FailFast(onExceptionType={DatabaseUnavailableException.class, IOException.class})
public class MyDataTest {

   public void connectToDatabase() {
        ....
   }
}
~~~

Further details: [Fail-Fast specification](https://concordion.github.io/concordion/latest/spec/common/command/execute/FailFast.html) and [Fail-Fast on specific exceptions specification](https://concordion.github.io/concordion/latest/spec/common/command/execute/FailFastOnSpecificExceptions.html).

If using the run command, adding the `@FailFast` annotation to the corresponding fixture will cause the specification to fail-fast if any of the specifications it runs fail-fast. For this to work, the `@FailFast` annotation is required on the fixture classes for both the calling and called specifications.

{% endif java %}

### Field Scope

Concordion encourages you to keep your examples completely independent of each other. This allows individual examples to be run in isolation. It also makes the specification easier to follow when you can read examples in isolation.

{% if supports_2_0 %}
To support this behaviour, Concordion reinitialises the fields in fixture objects for each Concordion example (where the example is using the [example command]({{site.baseurl}}/instrumenting/{{ page.fixture_language }}/{{ page.spec_type }}/#example-command)). This is standard JUnit behaviour (in fact, JUnit creates a new fixture object for each test).

However, we recognise that sometimes you will want to share fields across a specification when the field is expensive to initialise, for example a browser instance or database connection. Concordion provides support for specification scoped instance fields, in addition to the default example scope.

For example:

~~~java
@ConcordionScoped(Scope.SPECIFICATION)
private ScopedObjectHolder<AtomicInteger> specScopedCounter = new ScopedObjectHolder<AtomicInteger>() {
    @Override
    protected AtomicInteger create() {
        return new AtomicInteger();
    }
};
~~~

_Note:_ fields for [extensions](#adding-extensions) that are annotated with `@Extension` default to specification rather than example scope.

See the [ConcordionScoped](http://concordion.github.io/concordion/latest/spec/annotation/ConcordionScoped.html) specification for details.

The [concordion-scope-examples](https://github.com/concordion/concordion-scope-examples) project demonstrates the possible combinations of scope (suite, specification, example) and runner (serial, parallel) using a web test suite where the browser is created per example, per specification or once for the whole suite.
{% endif %}

{% if java %}

### Before and After hooks

The [before and after hooks](https://concordion.github.io/concordion/latest/spec/annotation/BeforeAndAfterMethodHooks.html) mark fixture methods to be invoked before or after an __example__, __specification__ or __suite__:

|                           | Before                     |After|
| ---------------------- | ----------------------------- | ----------------------------- |
|__Example__      |`@BeforeExample`       |`@AfterExample`      |
|__Specification__|`@BeforeSpecification`|`@AfterSpecification`|
|__Suite__            |`@BeforeSuite`            |`@AfterSuite`           |

Note:

1. the example hooks require you to use the [example command]({{site.baseurl}}/instrumenting/{{ page.fixture_language }}/{{ page.spec_type }}/#example-command).
2. the [suite]({{site.baseurl}}/documenting/{{ page.fixture_language }}/{{ page.spec_type }}/#creating-a-suite) hooks must be in the fixture that is being run directly by JUnit. Suite hooks on "child specifications" that are being run using the [run command]({{site.baseurl}}/instrumenting/{{ page.fixture_language }}/{{ page.spec_type }}#run-command) will be ignored.

   For example, assuming we have the following suite:

   ~~~  
        Product
            Theme 1
                 Feature 1
                     Sub-Feature 1
                     Sub-Feature 2
                 Feature 2
   ~~~

   where the specification at each level contains a run command that runs its child specifications. When the `Product` fixture is run, its suite hooks will be invoked. The suite hooks on the child specifications that are invoked by the run command will be ignored.

   A common pattern is to have a base fixture class that contains common suite hooks and is extended by all fixtures. This allows a fixture at any level of the suite (eg. `Product`, `Theme`, `Feature`, `Sub-Feature`) to be run with the common suite hooks invoked at the start and end of the suite.


See the [Concordion scope examples](https://github.com/concordion/concordion-scope-examples) project for example usage of before and after hooks.

{% elsif csharp %}
### Fixture Setup Methods

To run a method prior to executing the tests in the specification, mark that method with the NUnit attribute `[TestFixtureSetUp]`. See the [NUnit documentation](http://nunit.org/index.php?p=fixtureSetup&r=2.6.4) for further details.

{% endif csharp %}


### Configuration Options

{% if java %}

The [@ConcordionOptions](https://concordion.github.io/concordion/latest/spec/annotation/ConcordionOptions.html) annotation allows you to:

- configure extensions to the Markdown syntax, 
- add namespace declarations to Markdown specifications, and 
- output the source HTML that are generated for alternate specification types, which is useful for debug purposes.

{% elsif csharp %}

Concordion.NET is configured using a configuration file with the same name as the DLL file, but with the suffix `.dll` replaced by `.config`. The config file has to be located in the same directory as your DLL file to be loaded by Concordion.NET.

The following features can be configured:

- the [base input directory](https://concordion.org/dotnet/Concordion/Configuration/BaseInputDirectory.html) to read specifications from,
- the [base output directory](https://concordion.org/dotnet/Concordion/Configuration/BaseOutputDirectory.html) to write output specifications to,
- the [specification suffix](https://concordion.org/dotnet/Concordion/Configuration/SpecificationSuffix.html) to use for input specifications, and
- additional [runners](https://concordion.org/dotnet/Concordion/Configuration/Runner.html) that can be used with the run command.

{% endif csharp %}

{% if java %}

### Adding resources

The [@ConcordionResources](https://concordion.github.io/concordion/latest/spec/annotation/ConcordionResources.html) annotation can be used to add new CSS, JavaScript, images, or other resources to your specification in order to tweak or completely overhaul the existing styling.

This annotation:

- can be applied to all classes in the fixture's class hierarchy - specify the resources once and have them applied everywhere, or limit the changes to a single fixture
- includes wildcard support
- can be configured to either embed or link JavaScript and CSS files in the output specification
- can be configured to exclude Concordion's default styling from the output specification

As an example, executing the following fixture:

~~~java
package resources.test;

import org.concordion.api.ConcordionResources;
import org.concordion.integration.junit4.ConcordionRunner;
import org.junit.runner.RunWith;

@RunWith(ConcordionRunner.class)
@ConcordionResources( value = { "resources.*", "/resource?.c??" } )
public class ConcordionResourcesDemoTest {
}
~~~

adds the following resources to the generated specification:

- resources.js 
- resources.txt
- ../../resources.css

See the [ConcordionResources specification](https://concordion.github.io/concordion/latest/spec/annotation/ConcordionResources.html) for other examples.

{% endif java %}

{% if java %}

### Full OGNL

Concordion deliberately restricts the [expression language]({{site.baseurl}}/instrumenting/{{ page.fixture_language }}/{{ page.spec_type }}/#expression-language) for instrumenting specifications.

This can be overridden by annotating the fixture with `@FullOGNL` to allow [complex expresssions](https://concordion.github.io/concordion/latest/spec/common/command/expressions/ComplexExpressions.html).

{% endif java %}

### Adding Extensions

Extensions are added to Concordion fixtures by:

- Adding the {% if java %}`@org.concordion.api.extension.Extensions` annotation{% elsif csharp %}`[Extensions]` attribute{% endif %} to the fixture class. This {% if java %}annotation{% elsif csharp %}attribute{% endif %} is parameterised with a list of extension, and/or extension factory, classes to be installed. 

For example:

{% if java %}
~~~java
@RunWith(ConcordionRunner.class)
@Extensions({LoggingTooltipExtension.class, TimestampFormatterExtension.class})
public class MyTest {
...
~~~
{% elsif csharp %}
~~~csharp
[Extensions(typeof(LoggingTooltipExtension.class), typeof(TimestampFormatExtension.class))]
public class MyTest {
...
~~~
{% endif csharp %}

- __Or__ adding the {% if java %}`@org.concordion.api.extension.Extension` annotation{% elsif csharp %}`[Extension]` attribute{% endif %} to fields in the fixture class. This allows the extensions to be configured per class instance. For example:

{% if java %}
~~~java
...
@Extension
ConcordionExtension extension = new ScreenshotExtension().setScreenshotTaker(camera);
...
~~~
{% elsif csharp %}
~~~csharp
...
[Extension]
public ConcordionExtension extension = new ScreenshotExtension().SetScreenshotTaker(camera);
...
~~~
{% endif csharp %}


- __Or__ by {% if java %}setting the system property `concordion.extensions` to a comma separated list of{% elsif csharp %}adding `<Extension>` entries to the `<ConcordionExtensions>` section of the configuration file with{% endif %} extension, and/or extension factory, classes. For example:

{% if java %}

~~~
java -Dconcordion.extensions="org.concordion.ext.LoggingTooltipExtension,com.acme.Extra"
~~~

{% elsif csharp %}

~~~xml
<ConcordionExtensions>
    <Extension assembly="LoggingTooltipExtension" type="Ext.LoggingTooltipExtension" />
</ConcordionExtensions>
~~~

{% endif csharp %}

For further details see the [extension configuration specification]({% if java %}https://concordion.github.io/concordion/latest/spec/common/extension/ExtensionConfiguration.html{% elsif csharp %}https://concordion.org/dotnet/Concordion/Extension/Configuration/ExtensionConfiguration.html{% endif %}).

{% if java %}

## System Properties

### Concordion output location

The Concordion output location can be set using the system
property `concordion.output.dir`. If not
set, Concordion defaults to the value of the [java.io.tmpdir](https://docs.oracle.com/javase/8/docs/api/java/io/File.html#createTempFile-java.lang.String-java.lang.String-java.io.File-)
system property.

See [Gradle]({{site.baseurl}}/integrations/{{
page.fixture_language }}/{{ page.spec_type }}/#gradle) or
[Maven]({{site.baseurl}}/integrations/{{
page.fixture_language }}/{{ page.spec_type }}/#maven) for examples
of how to apply this using your build tool.

{% endif java %}

## Creating an extension

The Extensions API allows you to add functionality to Concordion, for example implementing new commands, listening to events, or modifying the Concordion output.   

{% if java %}

For full details, see the [extension specifications](https://concordion.github.io/concordion/latest/spec/common/extension/Extension.html) and the [extensions API](https://github.com/concordion/concordion/tree/master/src/main/java/org/concordion/api/extension). Refer also to the source code for the published [extensions]({{site.baseurl}}/extensions/{{ page.fixture_language }}/{{ page.spec_type }}/).

{% elsif csharp %}

A dedicated section of the executable specifications describe the [extensions API](https://concordion.org/dotnet/Concordion/Extension/Extension.html) of Concordion.NET. The [fixture classes](https://github.com/concordion/concordion.net/tree/master/Concordion.Spec/Concordion/Extension) demonstrate how to use the extensions API.

See also the [extensions]({{site.baseurl}}/extensions/java/{{ page.spec_type }}) of the Java version of Concordion for examples what can be achieved with the help of the extensions API.

{% endif csharp %}

Extensions must implement the [ConcordionExtension](https://concordion.github.io/concordion/latest/javadoc/org/concordion/api/extension/ConcordionExtension.html) interface, which allows extensions to hook into the Concordion{% if csharp %}.NET{% endif %} build phase through the [ConcordionExtender](https://concordion.github.io/concordion/latest/javadoc/org/concordion/api/extension/ConcordionExtender.html) interface.

{% if java %}
### Example: Adding a style to "set" commands

As a simple example, the [input style extension](https://github.com/concordion/concordion-input-style-extension) adds styling to set commands. To do this, it listens to set commands and adds some CSS:

~~~java
public class InputStyleExtension implements ConcordionExtension {

  private static final String INPUTSTYLE_CSS_SOURCE_PATH = "/org/concordion/ext/inputstyle/inputstyle.css";
  private static final Resource INPUTSTYLE_CSS_TARGET_RESOURCE = new Resource("/inputstyle.css");

  @Override
  public void addTo(ConcordionExtender extender) {
    InputStyleOutputter outputter = new InputStyleOutputter();
    extender
      .withSetListener(outputter)
      .withLinkedCSS(INPUTSTYLE_CSS_SOURCE_PATH, INPUTSTYLE_CSS_TARGET_RESOURCE);
  }
}
~~~

where `InputStyleOutputter` is:

~~~java
public class InputStyleOutputter implements SetListener {

    @Override
    public void setCompleted(SetEvent event) {
        event.getElement()
            .addStyleClass("inputvalue");
    }
}
~~~

{% elsif csharp %}

### Example: Adding custom CSS

Amongst other features, the `ConcordionExtender` interface provide a means for adding CSS, JavaScript or arbitrary resources to the Concordion.NET output folder.

The following example extension copies `/my_concordion.css` from the classpath to the root folder of the Concordion.NET output, and links to it from the Concordion.NET output HTML.

~~~csharp
using org.concordion.api.extension;

namespace Com.Acme
{
    public class MyCssExtension : ConcordionExtension {
        public void addTo(ConcordionExtender concordionExtender) {
            concordionExtender.withLinkedCSS("/my_concordion.css",
                new Resource("/my_concordion.css"));
        }
    }
}
~~~

Note: if you have already declared a link to the CSS file in your HTML, you should use `concordionExtender.withResource()` rather than `concordionExtender.withLinkedCSS()` to avoid a duplicate declaration.

{% endif %}

If you'd prefer to embed the CSS in the HTML, rather than link it, use `concordionExtender.withEmbeddedCSS()`. Similar methods exist for including JavaScript in the output, or you can use `withResource()` to copy images or other resources to the output.{% if supports_2_0 %} (Note: These methods are useful when writing extensions that also perform additional functionality. If all you want to do is add CSS, JS or resources, see the [adding resources](#adding-resources) section above.){% endif supports_2_0 %}

{% if java %}
For other examples, see the source code of the extensions listed on the [extensions]({{site.baseurl}}/extensions/{{ page.fixture_language }}/{{ page.spec_type }}) page.
{% endif java %}
