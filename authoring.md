---
layout: sidenav
title: "Concordion | Authoring Specifications"
description: ""
heading: "Authoring Specifications"
subheading: "Introduction to Markdown or HTML for authoring specifications."
---
Concordion specifications can be authored using either Markdown or HTML (alternatively you can use Excel with the [Excel Extension](github.com/concordion/concordion-excel-extension), or [write your own extension](ExtensionsAPI.html) to handle other formats).

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
* MultiMarkdown format [tables](http://fletcher.github.io/MultiMarkdown-4/tables.html). If using Github, you might want to limit yourself to github flavored markdown tables.
* strikethrough format using `~~tildes around the words~~`.

For syntax that is not covered by Markdown, you can use inline HTML.

### Extending the Markdown syntax

Markdown extensions allow you to change and/or extend the behaviour of the Markdown parser, for example to change the behaviour of new lines, or to support definition lists.

See the [MarkdownExtensions](http://concordion.github.io/concordion/latest/javadoc/org/concordion/api/option/MarkdownExtensions.html) javadoc for a definition of the available extensions.

_Note that the Concordion fixture will need to be [configured](http://concordion.github.io/concordion/latest/spec/annotation/ConcordionOptions.html) to enable the markdown extensions._

### Markdown editors

While you can edit Markdown in a text editor, you'll get additional features such as preview, syntax highlighting and auto indent with a Markdown editor. There are lots of options available, including online editors, plugins to text editors such as Notepad++ and dedicated Markdown editors. If you wish to use any of the Markdown extensions (see above), you might want to make sure your editor supports it.

#### Github 
The syntax used for this extension is compatible with Github Flavored Markdown, allowing specifications to be edited and previewed in the Github editor.

#### IDEA
The official IntelliJ IDEA Markdown editor is not recommended since it does not support tables. 
Instead, the [Markdown](https://plugins.jetbrains.com/plugin?id=5970) plugin is recommended. 
This plugin uses the same underlying Pegdown library as the Concordion Markdown extension. 
After installing the plugin, you will need to configure the [settings](https://plugins.jetbrains.com/files/5970/screenshot_14568.png) to enable Tables and Strikethrough, plus any additional Markdown language extensions that you [configure](../../annotations/ConcordionOptions.html).

#### Eclipse
Available Eclipse plugins include:

| Plugin | Has editor? | Has viewer? | Viewer supports tables and strikethrough |
|--------|:-----------:|:-----------:|:----------------------------------------:|
|Mylyn Wikitext Editor| Y | Y | N |
|[Markdown Text Editor](https://marketplace.eclipse.org/content/markdown-text-editor)| Y | N | N |
|[Github Flavored Markdown Viewer](https://marketplace.eclipse.org/content/github-flavored-markdown-viewer-plugin)| N | Y | Y |

In order to have editing features and the ability to view with tables and strikethrough, you may want to install either of the first 2 editor plugins listed along with the viewer plugin.


_Please let us know what editor you are using, and what support you get from it. Either edit this page and raise a pull request or create an issue on this project to let us know. Thanks :)_


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

TODO - add details of IDEA and Eclipse extensions to instrumentation.md when available..