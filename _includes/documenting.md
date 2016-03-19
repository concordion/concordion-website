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


{% unless csharp %}

_This page introduces documenting specifications in __{{ spec_type_desc }}__._  Click the toggle buttons above to choose other options.

Once we have discussed the examples, we create a Concordion specification describing the feature with examples.

# Specification Structure

Concordion provides you the flexibility to structure your specifications however you like.

As a guideline, specifications are often based on individual features of a system. Larger features are normally broken down into smaller features, creating small, focussed specifications that are faster to check.

A common structure is:

{% if md %}
    # Feature title

    Feature description

    ## Business Rules or Acceptance Criteria


    - Rule 1
    - Rule 2

    ...

    ## Additional detail

    Any other background info

    ### Example 1

    details of example 1

    ### Example 2

    details of example 2

    ...

{% elsif html %}

    <h1>Feature title</h1>

    Feature description

    <h2>Business Rules or Acceptance Criteria</h2>

    - Rule 1
    - Rule 2

    ...

    <h2>Additional detail</h2>

    Any other background info

    <h3>Example 1</h3>

    details of example 1

    <h3>Example 2</h3>

    details of example 2

    ...

{% endif %}

## Example Structure

Concordion also provides the flexibility to write examples however you like.

When documenting the _context_, _action_ and _outcome_ of an example, you can write these three parts using the Gherkin "Given, When, Then" language. This is often a good way to get started. Once you become familiar with thinking about the context, action and outcome, you may find ways to describe your example in a more natural language.

For example, you could use either:

    Given a user with full name _John Smith_
    When the system splits the name
    Then the first name is _John_ and the last name is _Smith_

or:

    The full name _John Smith_ will be broken into first name _John_ and last name _Smith_

The [Hints and Tips]({{site.baseurl}}/technique/{{ page.fixture_language }}/{{ page.spec_type }}) page contains some good practices for writing specifications, including:

* Writing at a high level of abstraction
* Only reveal data the specification actually needs
* Create focussed examples

## Creating a suite

HTML links allow us to create a structured suite of specifications, with the pages nested under a hierarchical index

    Product
         Theme
              Feature
                  Sub-Feature
                  Sub-Feature
              Feature
              Feature
                  Sub-Feature
         Theme
              Feature
                  Sub-Feature
              Feature

At each level, the specification contains links to all the specifications below it. For example, a theme page would describe the theme and link to all the features in the theme. The specifiications can be nested arbitrarily deep.

By using this approach, and instrumenting the links to child specifications with the [run command]({{site.baseurl}}/instrumenting/{{ page.fixture_language }}/{{ page.spec_type }}#run-command), executing any specification will automatically execute all its child specifications, with the results aggregated upwards.

### Breadcrumbs

To make it easier to navigate around the results, and to remove the headache of having to maintain upward links manually, breadcrumbs are automatically added to output.

In order for breadcrumbs to be generated, certain conventions must be followed.

![Example of breadcrumbs]({{ site.baseurl }}/img/documenting-breadcrumbs.png)

[More details](https://concordion.github.io/concordion/latest/spec/results/breadcrumbs/Breadcrumbs.html)

### Styling your specifications

Concordion comes with a default style out of the box.

Should you wish to enhance your specifications, you can add CSS, JavaScript, images, or other resources to tweak or completely overhaul the existing styling. If applying additional styling, the fixture will need to [specify]({{site.baseurl}}/coding/{{ page.fixture_language }}/{{ page.spec_type }}#adding-resources) the resources to be copied to the output specification.

# Specification language

Concordion specifications can be written using either Markdown or HTML (alternatively you can use Excel with the [Excel Extension](https://github.com/concordion/concordion-excel-extension), or [write your own extension]({{site.baseurl}}/coding/{{ page.fixture_language }}/{{ page.spec_type }}#building-your-own-extension) to handle other formats).

{% if md %}

## Markdown

Markdown provides an easy-to-read and easy-to-write syntax for specifications.

As a crash course, typing the following:

    # Heading

    This is a __bold text__ in a paragraph

    ## Subheading

    | Name              | Age |
    | ---------------------- | --- |
    | Fred Flintstone | 35 |
    | Betty Rubble    | 27 |

results in:

-----------

# Heading

This is a __bold text__ in a paragraph

## Subheading

| Name              | Age |
| ---------------------- | --- |
| Fred Flintstone | 35 |
| Betty Rubble    | 27 |

-----------

For further details, read the Markdown [basics](https://daringfireball.net/projects/markdown/basics) and [syntax](https://daringfireball.net/projects/markdown/syntax).

In addition to standard Markdown, Concordion supports: 
* MultiMarkdown format [tables](http://fletcher.github.io/MultiMarkdown-4/tables.html). If using Github, you might want to limit yourself to Github Flavored Markdown [tables](https://help.github.com/articles/github-flavored-markdown/#tables).

* strikethrough format using `~~tildes around the words~~`.

For syntax that is not covered by Markdown, you can use inline HTML.

### Extending the Markdown syntax

Markdown extensions allow you to change and/or extend the behaviour of the Markdown parser, for example to change the behaviour of new lines, or to support definition lists.

See the [MarkdownExtensions](https://concordion.github.io/concordion/latest/javadoc/org/concordion/api/option/MarkdownExtensions.html) javadoc for a definition of the available extensions.

_Note that the Concordion fixture will need to be [configured](https://concordion.github.io/concordion/latest/spec/annotation/ConcordionOptions.html) to enable the markdown extensions._

### Markdown editors

While you can edit Markdown in a text editor, you'll get additional features such as preview, syntax highlighting and auto indent with a Markdown editor. There are lots of options available, including online editors, plugins to text editors such as Notepad++ and dedicated Markdown editors. If you wish to use any of the Markdown extensions (see above), you might want to make sure your editor supports it.

#### Github 
The syntax used for this extension is compatible with Github Flavored Markdown, allowing specifications to be edited and previewed in the Github editor.

#### IDEA
The official IntelliJ IDEA Markdown editor is not recommended since it does not support tables. 
Instead, the [Markdown](https://plugins.jetbrains.com/plugin?id=5970) plugin is recommended. 
This plugin uses the same underlying Pegdown library as the Concordion Markdown extension. 
After installing the plugin, you will need to configure the [settings](https://plugins.jetbrains.com/files/5970/screenshot_14568.png) to enable Tables and Strikethrough, plus any additional Markdown language extensions that you [configure](https://concordion.github.io/concordion/latest/spec/annotation/ConcordionOptions.html).

#### Eclipse
Available Eclipse plugins include:

| Plugin | Has editor? | Has viewer? | Viewer supports tables and strikethrough |
|--------|:-----------:|:-----------:|:----------------------------------------:|
|Mylyn Wikitext Editor| Y | Y | N |
|[Markdown Text Editor](https://marketplace.eclipse.org/content/markdown-text-editor)| Y | N | N |
|[Github Flavored Markdown Viewer](https://marketplace.eclipse.org/content/github-flavored-markdown-viewer-plugin)| N | Y | Y |

In order to have editing features and the ability to view with tables and strikethrough, you may want to install either of the first 2 editor plugins listed along with the viewer plugin.


_Please let us know what editor you are using, and what support you get from it. Either edit this page and raise a pull request or create an issue on this project to let us know. Thanks :)_

{% endif %}

{% if html %}

## HTML

Prior to Concordion 2.0, HTML was the only specification format available in Concordion core. It remains the canonical format.

While typically only a very small subset of HTML is needed (eg. &lt;p&gt;, &lt;table&gt;, &lt;b&gt;), HTML syntax provides more advanced formatting than Markdown should you need it.

Concordion requires that the HTML be well-structured XHTML, ie. each start tag must have a corresponding end tag.

### Crash Course in HTML

HTML documents are written in text with special start and end tags around items. For example:

    <p>This is a paragraph</p>

The tag &lt;p&gt; signals the start of the paragraph and &lt;/p&gt; signals the end.

You can nest tags.

    <p>This is <b>bold text</b> in a paragraph</p>

When the document is displayed in a web browser, it will be rendered like this:

This is __bold text__ in a paragraph

The syntax for a table is more complicated, but once you understand this, you'll have everything you need to write tests in Concordion.

A table uses the following tags: &lt;table&gt;, &lt;tr&gt; (table row) , &lt;th&gt; (table heading), &lt;td&gt; (table data). The table is expressed row by row. The first row contains the headings, the following rows are data. For example:

    <table>
        <tr>
            <th>Name</th>
            <th>Age</th>
        </tr>
        <tr>
            <td>Fred Flintstone</td>
            <td>35</td>
        </tr>
        <tr>
            <td>Betty Rubble</td>
            <td>27</td>
        </tr>
    </table>

Which produces:

----

<table>
    <tr>
        <th>Name</th>
        <th>Age</th>
    </tr>
    <tr>
        <td>Fred Flintstone</td>
        <td>35</td>
    </tr>
    <tr>
        <td>Betty Rubble</td>
        <td>27</td>
    </tr>
</table>

----

### HTML editors

While you can edit HTML in a text editor, you'll get additional features such as preview, syntax highlighting and auto indent with a HTML editor. There are lots of options available, including online editors, plugins to text editors such as Notepad++ and dedicated HTML editors.

{% endif %}

{% endunless %}