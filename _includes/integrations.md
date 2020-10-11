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

_This page shows the integrations for __{{ fixture_language_desc }}__._  Click the toggle buttons above to choose other options.

* TOC
{:toc}

{% if java %}
# IDEs

## IntelliJ IDEA

The excellent [Concordion support](https://plugins.jetbrains.com/plugin/7978?pr=idea) plugin for IDEA provides support such as autocompletion, 2-way navigation between specifications and fixtures, run test from specification, surround with Concordion command, go to declaration and renaming. See the [home page](https://github.com/concordion/idea-concordion-support/blob/master/README.md) for documentation of the features and keyboard shortcuts.

This plugin supports both HTML and Markdown format specifications.

For Markdown format specifications, a Markdown plugin is also required. The official IntelliJ IDEA [Markdown Support](https://plugins.jetbrains.com/plugin/7793?pr=idea) plugin is recommended. The [Markdown Navigator](https://plugins.jetbrains.com/plugin/7896?pr=idea) plugin is also supported.

<a class="github-button" href="https://github.com/concordion/idea-concordion-support" data-count-href="/concordion/idea-concordion-support/stargazers" data-count-api="/repos/concordion/idea-concordion-support#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star concordion/idea-concordion-support on GitHub">Star</a>

## Eclipse

The [concordion-eclipse](https://github.com/sunix/org.concordion.ide.eclipse) plugin provides content assist and validation for Concordion specifications, integrated into Eclipse's HTML and Web Page (Source) editors.

This plugin currently supports HTML format specifications (not Markdown). It has not been updated with the Concordion 2.0 commands yet, so will show these as errors, but still works well.

----

# Build tools

## Gradle

Concordion tests can be run using the standard test task. A typical build script is:

~~~groovy
apply plugin: 'java'

repositories {
  mavenCentral()
}

dependencies {
  testCompile "org.concordion:concordion:x.y.z"
}

test {
  testLogging.showStandardStreams = true   // display test output on console
  systemProperties['concordion.output.dir'] = "$reporting.baseDir/spec"  // write output to build/reports/spec
  outputs.upToDateWhen { false }   // force tests to run even if code hasn't changed
}
~~~

where _x.y.z_ is replaced by the Concordion version, for example 2.0.0.

If you have created a suite of specifications using the run command, you may want to run only your main fixture class by adding this line inside the `test` block:

~~~groovy
  include '**/MainFixture.*' 
~~~

where <i>MainFixture.java</i> is the fixture class corresponding to the main index page.

(This is not strictly necessary since Concordion will cache test results so that tests are not run multiple times within a single test run. The number of tests reported will be less if you only run the main fixture class.)

### Gradle Bug
The gradle command line option "--tests" does not currently work correctly with Concordion and will:

* prevent @AfterSuite annotated methods from running
* construct all test classes (but not run them)

Until this is corrected either use the older command line option "-DtaskName.single = testNamePattern" or use includes as shown above.

## Maven

Concordion tests can be run using the surefire plugin. For example:

~~~xml
<build>
  <plugins>
    ......
    <plugin>
      <artifactId>maven-surefire-plugin</artifactId>
      <version>2.19.1</version>
      <configuration>
        <systemPropertyVariables>
          <concordion.output.dir>target/concordion</concordion.output.dir>
        </systemPropertyVariables>
      </configuration>
    </plugin>
    ......
  </plugins>
</build>
~~~

Note that the Surefire plugin, by default, only includes test classes with filenames that start or end with `Test` or end with `TestCase`. If your Concordion fixture class names don't end with `Test` or you want to limit the fixture classes that are run, you will need to specify the fixtures you want to include. For example:

~~~xml
  <includes>
    <include>**/MainFixture.java</include>
  </includes>
~~~

There is also a [maven-concordion-reporting-plugin](https://github.com/bassman5/maven-concordion-reporting-plugin) which allows you to incorporate Concordion reports into a Maven site report in the project reports section.

## Command Line

Should you wish to run your tests from the command line, you will need to:

1. Download and unzip the [full distribution]({{site.baseurl}}/download/{{ page.fixture_language }}/{{ page.spec_type }}/#download).
2. From the unzipped folder, copy the `lib` folder to be located alongside your source code, and copy `concordion-<x.y.z>.jar` files to this `lib` folder (where `<x.y.z>` is the version number of Concordion).
3. Compile your Java source code (adding the `lib` folder to your classpath)
4. Run Concordion as a `JUnit` test, for example:

    `java -cp lib/*:bin org.junit.runner.JUnitCore path/to/my/fixture.class`

----

# Build servers

## Jenkins

The [HTML Publisher plugin](https://wiki.jenkins-ci.org/display/JENKINS/HTML+Publisher+Plugin) can publish the Concordion results, maintain a per-build history, and let you download the output as a zip file.

__Note:__ as of Jenkins 1.641 / 1.625.3, Jenkins enforces a [Content Security Policy](https://developers.google.com/web/fundamentals/security/csp/) which results in Concordion reports no longer being fully functional in Jenkins by default. The policy [defaults](https://wiki.jenkins-ci.org/display/JENKINS/Configuring+Content+Security+Policy) to `sandbox; default-src 'none'; img-src 'self'; style-src 'self';` which forbids inline CSS and does not allow JavaScript. Concordion reports use inline CSS and Javascript.

We are looking to resolve this with [issue 151](https://github.com/concordion/concordion/issues/151). In the meantime, the only workaround is to restore the security vulnerability. Before doing so, check the considerations for [relaxing the rules](https://wiki.jenkins.io/display/JENKINS/Configuring+Content+Security+Policy#ConfiguringContentSecurityPolicy-RelaxingTheRules). If safe to do so in your context, relax the policy to allow `script-src 'unsafe-inline'` and `style-src 'unsafe-inline'` by appending 

~~~console
-Dhudson.model.DirectoryBrowserSupport.CSP=\"default-src 'none'; img-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'unsafe-inline';\"
~~~

to the value of the `JAVA_ARGS` variable in the Jenkins startup script (/etc/default/jenkins on Linux) and restarting Jenkins.

NOTE: Jul 2017, removed `sandbox;` from the start of the CSP setting since it was causing issues with displaying screenshots, similar to [Jenkins issue 33653](https://issues.jenkins-ci.org/browse/JENKINS-33653).

----

# Frameworks

## Spring

The [chiiknrice/concordion-spring-runner](https://github.com/chiknrice/concordion-spring-runner) provides integration between Concordion and Spring Framework.

<!-- JUnit 5 will have a flexible [extension model](http://junit.org/junit5/#extension-model) to allow combinations of runners to work together. We're aiming to support this in Concordion 2.x. -->

{% elsif csharp %}

# Test Runners

Concordion.NET provides the Concordion.NUnit addin to run Concordion.NET tests with any NUnit test environment. The Concordion.NUnit addin is compatible with NUnit 2.6.4 as well as any NUnit 3.x.

## NUnit runners integrated in Visual Studio

There are several ways to run Concordion.NET automated tests within Visual Studio (e.g. TestDriven.NET, ReSharper, Test Adapter, etc.).

### TestDriven.NET

You can use [TestDriven.NET](http://testdriven.net) to execute Concordion.NET tests within Visual Studio.

1. [Download]({{site.baseurl}}/download/{{ page.fixture_language }}/{{ page.spec_type }}) Concordion.NET
2. Install [TestDriven.NET](http://testdriven.net/)
3. Copy `Concordion.NUnit.dll` into the TestDriven.NET folder under `<testdriven.net-installation-path>\NUnit\2.6\addins`. 
    (Concordion.NUnit.dll is available in the `tools` folder of Concordion.NET download package, or as a separate download, or from the `lib\Concordion` folder of the tutorial project)
    When updating Concordion.NET, make sure you update this DLL.
4. To run a test, use the "Run Test(s)" command of TestDriven.NET on your Concordion.NET fixture class ([http://testdriven.net/quickstart.aspx](http://testdriven.net/quickstart.aspx)).

When you run Concordion.NET tests with TestDriven.NET in Visual Studio, you should see an output similar to:

~~~console
------ Test started: Assembly: Kickstart.Spec.dll ------ 
Processed specifications : C:\concordion-test\Kickstart\Spec\HelloWorld\HelloWorld.html
1 passed, 0 failed, 0 skipped, took 0,82 seconds
~~~

### NUnit Test Adapter

Since version 2012, Visual Studio supports [3rd party test runners](https://docs.microsoft.com/en-us/visualstudio/test/install-third-party-unit-test-frameworks?view=vs-2019) to execute their tests right inside Visual Studio. This allows the NUnit Test Adapter for Visual Studio to run Concordion.NET tests.

Please note that at the time of writing an [issue of the NUnit Test Adapter](https://github.com/nunit/nunit3-vs-adapter/issues/222) prevents the execution of Concordion.NET tests based on the NUnit addin. Until the issue is fixed by the NUnit team, you will need to adapt your fixture to extend `ExecutableSpecification` as follows:

~~~csharp
using Concordion.Runners.NUnit;
using NUnit.Framework;

namespace Kickstart.Spec.HelloWorld
{
    [TestFixture]
    public class HelloWorldTest : ExecutableSpecification
...
~~~

When you want to use the Test Runner, make sure to remove the `[assembly: RequiredAddin("ConcordionNUnitAddin")]` from the projects AssemblyInfo.cs. Otherwise the issue in the NUnit Test Adapter prevents your Concordion.NET tests being found by the NUnit Test Adapter.

To run Concordion.NET tests without the need for addins, you have to derive your test fixtures from the Concordion.Runners.NUnit.ExecutableSpecification class and annotate it with the standard NUnit [TestFixture] annotation.

### Resharper

You can run Concordion.NET acceptance tests within Visual Studio with [ReSharper](https://www.jetbrains.com/resharper/)

1. [Download]({{site.baseurl}}/download/{{ page.fixture_language }}/{{ page.spec_type }}) Concordion.NET.
2. Install ReSharper.
3. Under Resharper > Options > Tools > Unit Testing > NUnit, select the option "Enable NUnit 2x support" and in "Load NUnit Addins" select "Always".
4. If you are using the built-in NUnit, under Resharper > Options > Tools > Unit Testing > NUnit, take note of the NUnit 2.6.4 folder. Create the subfolder addins if it does not exist, and copy Concordion.NUnit.dll to that folder (Concordion.NUnit.dll is available in the `tools` folder of Concordion.NET download package, or as a separate download, or from the `lib\Concordion` folder of the tutorial project).
    When updating Concordion.NET, make sure you update this DLL.
5. If you aren't using the built-in NUnit, but your specified NUnit installation (ReSharper > Options > Tools > Unit Testing > NUnit), you have to copy Concordion.NUnit.dll into the used NUnit installation (&lt;nunit-installation-path&gt;\bin\addins\). Make sure you are using NUnit version 2.6.4. 
6. Run your Concordion.NET acceptance tests with ReSharper
    * To run a single test directly from the editor: Click on the ReSharper testing icon next to the line of your fixture class definition and select the Run or Debug option in the context menu.
    * To run multiple tests: Right click on the element containing the tests of interest in the Solution Explorer and select either the Run Unit Tests or Debug Unit Tests option in the context menu.

When running the automated tests with ReSharper you can see the progress and results in the Unit Test Sessions window:

![ReSharper Unit Test Session]({{ site.baseurl }}/img/integration-resharper-test-session.jpg)

----

## Standalone NUnit Runners

NUnit provides different runners, which can be used to run your Concordion.NET tests.

### NUnit GUI runner

The [GUI runner for NUnit 3 is under development](https://github.com/nunit/docs/wiki/Gui-Release-Notes). Until it is finished you can use the [NUnit GUI runner of version 2.6.4](http://www.nunit.org/index.php?p=installation&r=2.6.4).

1. [Download]({{site.baseurl}}/download/{{ page.fixture_language }}/{{ page.spec_type }}) Concordion.NET.
2. Download and [install NUnit](http://nunit.org/index.php?p=download).
3. Copy into the addin directory of your NUnit installation (`<NUnit-installation-path>\addins`).
    (Concordion.NUnit.dll is available in the `tools` folder of Concordion.NET download package, or as a separate download, or from the `lib\Concordion` folder of the tutorial project)
   When updating Concordion.NET, make sure you update this DLL as well.
4. Load your tests with the NUnit GUI runner.
  Tip: You can open your Visual Studio solutions and/or projects in NUnit, when you activate the [IDE Support Settings - Visual Studio](http://nunit.org/index.php?p=settingsDialog&r=2.6.4).
5. Select the Concordion.NET test you want to run in the tree view and press the Run button.

The GUI Runner will show the test results, for example:

![Display of test results]({{ site.baseurl }}/img/integration-nunit-result.jpg)

The Concordion output specifications can be found in the temp directory (on Windows defined by the environment variable %TEMP%, which by default points to is set to your `%USERPROFILE%\AppData\Local\Temp` folder, for example `C:\Users\<your-windows-user>\AppData\Local\Temp`). Concordion.NET can also be [configured]({{site.baseurl}}/coding/{{ page.fixture_language }}/{{ page.spec_type }}#configuration-options) to use a different output directory. 


### Console runner
NUnit provides a [command line client](https://github.com/nunit/docs/wiki/Console-Runner) for test execution, which can be useful for the automation of test execution and integration into other systems (e.g. build systems). You can run your Concordion.NET tests with the NUnit console runner as follows:

1. [Download]({{site.baseurl}}/download/{{ page.fixture_language }}/{{ page.spec_type }}) Concordion.NET
2. Download and [install NUnit](http://nunit.org/index.php?p=download)
3. Copy into the addin directory of your NUnit installation (`<NUnit-installation-path>\nunit-console\addins`).
    (Concordion.NUnit.dll is available in the `tools` folder of Concordion.NET download package, or as a separate download, or from the `lib\Concordion` folder of the tutorial project)
   When updating Concordion.NET, make sure you update this DLL.
4. In the command line window, [run the nunit-console application](https://github.com/nunit/docs/wiki/Console-Runner) and pass in the DLL containing your Concordion.NET specifications and tests.

### Debugging Concordion.NET tests

You can debug your Concordion.NET tests as you would for standard NUnit tests, as described in this [debugging NUnit tests article](http://erraticdev.blogspot.co.at/2012/01/running-or-debugging-nunit-tests-from.html).

{% endif %}
