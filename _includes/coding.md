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
{% assign supports_2.0 = true %}
{% elsif fixture_language == 'csharp' %}
{% assign java=false %}
{% assign csharp=true %}
{% assign fixture_language_desc = 'C#' %}
{% assign supports_2.0 = false %}
{% endif %}

_This page describes writing fixtures in __{{ fixture_language_desc }}__._  Click the toggle buttons above to choose other options.

{% if csharp %}
----
__TODO:__ This page has not been translated to C# yet.

----

{% endif %}

* TOC
{:toc}

## Overview 

{% unless csharp %}
Concordion fixtures find concrete examples in the specification and use them to verify the system under test. 

Concordion is a test runner that can invoke your application code directly:

![Fixture calling application code directly]({{ site.baseurl }}/img/coding-application-layer.png)

It can also drive the interfaces of your deployed application:

![Fixture calling driver calling deployed application]({{ site.baseurl }}/img/coding-driver-layers.png)

It is good practice to create a separate driver layer for the code that drives your application interface, keeping the runner free of driver logic and the driver layer free of test assertions. Other libraries are required for the driver layer, such as [Selenium WebDriver](http://www.seleniumhq.org/projects/webdriver/) for web applications; [wslite](https://github.com/jwagenleitner/groovy-wslite), JAX/WS or JAX/RS for web services; JDBC for databases, etc. Any Java library can be used with Concordion, providing a lot of flexibility in how you use it.

## Project Structure

The fixture must be in the same package as the specification. It can be in a different source folder, as long as that folder is on the Java classpath. For instance the [tutorial]({{site.baseurl}}/tutorial/{{ page.fixture_language }}/{{ page.spec_type }}) uses the conventional `src/test/java` folder for the fixture class, and the `src/test/resources` folder for the specification:

![Folder structure of tutorial project]({{ site.baseurl }}/img/coding-folder-structure.png)

Some users prefer to have the specifications and fixture classes in the same folder, and adjust their build tool settings accordingly. Another common pattern is to create a distinct folder, such as `src/spec`, to keep the specifications and fixtures separate from unit tests.

The name of the fixture class and the specification share the same base name. The fixture has an optional suffix of "Fixture" or "Test" - for example, the fixture for the "SplittingNames.md" specification could be named "SplittingNames.java", "SplittingNamesFixture.java" or "SplittingNamesTest.java".

## Fixture classes
Concordion fixtures use the JUnit library, with a specialised ConcordionRunner:

~~~java
import org.concordion.integration.junit4.ConcordionRunner;
import org.junit.runner.RunWith;

@RunWith(ConcordionRunner.class)
public class SplittingNamesFixture {
}
~~~

A fixture class is required for each specification.

Unlike JUnit, we don't annotate methods with `@Test`. Instead, the tests are determined from the specification. Each example in the specification that uses the [example command]({{site.baseurl}}/instrumenting/{{ page.fixture_language }}/{{ page.spec_type }}/#example-command) is created as a separate JUnit test. If the example command is not used, the specification is run as a single JUnit test.

### Fixture methods

#### Parameter types

Methods in Concordion fixtures can take the following parameter types:

* Numeric types (Integer, Long, Short, Double, Float, BigInteger, BigDecimal, and their primitive equivalents), 
* String types (String, Character), 
* Boolean and boolean

When executed from a Concordion specification, Concordion will automatically convert the value to the parameter type. Boolean values must be specified as `true` or `false` in the specification.

#### Return types

Methods can return void, a primitive or an Object.

##### Returning a Map result

As described in the tutorial, to check more than one result of a behaviour, you can return an Object from the execute command. An alternative is to return a Map Object, for example:

~~~java
public Map split(String fullName) {
    String[] words = fullName.split(" ");
    Map<String, String> results = new HashMap<String, String>();
    results.put("firstName", words[0]);
    results.put("lastName", words[1]);
    return results;
}
~~~

This is particularly useful when calling existing methods that return Maps, or when using a JVM language with native language support for Maps, such as Groovy.

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

The specification can reference the properties of the MultiValueResult as if they were bean properties, as shown in the [Splitting Names]({{site.baseurl}}/tutorial/{{ page.fixture_language }}/{{ page.spec_type }}#annotated-example) specification.




### Implementation status

You can include partially-implemented specifications in your normal build without breaking the build, by annotating your fixture classes with one of the following annotations:

* @ExpectedToPass
* @ExpectedToFail
* @Unimplemented

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

See [here](https://concordion.github.io/concordion/latest/spec/annotation/Annotation.html) for an explanation of the semantics of each annotation.

You can also set the [implementation status]({{site.baseurl}}/instrumenting/{{ page.fixture_language }}/{{ page.spec_type }}/#implementation-status) for individual examples in the specification.

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

See [here](https://concordion.github.io/concordion/latest/spec/command/execute/FailFast.html) and [here](https://concordion.github.io/concordion/latest/spec/command/execute/FailFastOnSpecificExceptions.html) for further details.

If using the concordion:run command, adding the @FailFast annotation to the corresponding fixture will cause the specification to fail-fast if any of the specifications it runs fail-fast. For this to work, the @FailFast annotation is required on the fixture classes for both the calling and called specifications.

### Before and After hooks

The [before and after hooks](https://concordion.github.io/concordion/latest/spec/annotation/BeforeAndAfterMethodHooks.html) mark fixture methods to be invoked before or after an __example__, __specification__ or __suite__:

|                           | Before                     |After|
| ---------------------- | ----------------------------- | ----------------------------- |
|__Example__      |`@BeforeExample`       |`@AfterExample`      |
|__Specification__|`@BeforeSpecification`|`@AfterSpecification`|
|__Suite__            |`@BeforeSuite`            |`@AfterSuite`           |

Note:
1. the example hooks require you to use the [example command]({{site.baseurl}}/instrumenting/{{ page.fixture_language }}/{{ page.spec_type }}/#example-command).
2. the suite hooks must be in the fixture that is being run directly by JUnit. It won't be invoked on "child specifications" that are being run using the run command. A common pattern is to have a top level base class that contains the suite hooks and is extended by all fixtures.

### Configuration Options

The [@ConcordionOptions](https://concordion.github.io/concordion/latest/spec/annotation/ConcordionOptions.html) annotation allows you to:

- configure extensions to the Markdown syntax, 
- add namespace declarations to Markdown specifications, and 
- output the source HTML that are generated for alternate specification types, which is useful for debug purposes.

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

See the [specification](https://concordion.github.io/concordion/latest/spec/annotation/ConcordionResources.html) for other examples.

### Full OGNL

Concordion deliberately restricts the [expression language]({{site.baseurl}}/instrumenting/{{ page.fixture_language }}/{{ page.spec_type }}/#expression-language) for instrumenting specifications.

This can be overridden by annotating the fixture with `@FullOGNL` to allow [complex expresssions](https://concordion.github.io/concordion/latest/spec/command/expressions/ComplexExpressions.html).

### Adding Extensions

Extensions are added to concordion fixtures by:

- Annotating the fixture class with `@org.concordion.api.extension.Extensions`. This annotation is parameterised with a list of extension, and/or extension factory, classes to be installed. 

For example:

~~~java
@RunWith(ConcordionRunner.class)
@Extensions({LoggingTooltipExtension.class, TimestampFormatterExtension.class})
public class MyTest {
...
~~~

- __Or__ annotating fields in the fixture class with `@org.concordion.api.extension.Extension`. This allows the extensions to be configured per class instance. For example:

~~~java
...
@Extension
ConcordionExtension extension = new ScreenshotExtension().setScreenshotTaker(camera);
...
~~~

- __Or__ by setting the system property `concordion.extensions` to a comma separated list of extension, and/or extension factory, classes. For example:

~~~
java -Dconcordion.extensions="org.concordion.ext.LoggingTooltipExtension,com.acme.Extra"
~~~

For further details see the [extension configuration](https://concordion.github.io/concordion/latest/spec/extension/ExtensionConfiguration.html) specification.

## Building your own extension

The Extensions API allows you to add functionality to Concordion, for example implementing new commands, listening to events, or modifying the Concordion output.

For full details, see the [specifications](https://concordion.github.io/concordion/latest/spec/extension/Extension.html), the classes in [org.concordion.api.extension](https://github.com/concordion/concordion/tree/master/src/main/java/org/concordion/api/extension) and the [fixtures](https://github.com/concordion/concordion/tree/master/src/test/resources/spec/concordion/extension) that demonstrate it.

See also the source code of the extensions listed on the [extensions]({{site.baseurl}}/extensions/{{ page.fixture_language }}/{{ page.spec_type }}) page.

Extensions must implement the [ConcordionExtension](https://concordion.github.io/concordion/latest/javadoc/org/concordion/api/extension/ConcordionExtension.html) interface, which allows extensions to hook into the Concordion build phase through the [ConcordionExtender](https://concordion.github.io/concordion/latest/javadoc/org/concordion/api/extension/ConcordionExtender.html) interface.

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

If you'd prefer to embed the CSS in the HTML, use concordionExtender.withEmbeddedCSS(). Similar methods exist for including JavaScript in the output, or you can use withResource() to copy images or other resources to the output.
{% endunless %}