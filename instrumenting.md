---
layout: sidenav
title: "Concordion | Instrumenting"
description: ""
heading: "Instrumenting"
subheading: "Linking the examples to the fixture code"
---

The format of the instrumentation depends on the format of the specification:

<ul class="collapsible collapsible-accordion" data-collapsible="accordion">
  <li>
    <div class="collapsible-header"><i class="mdi mdi-markdown"></i>Markdown</div>
    <div class="collapsible-body">
        <p>Markdown specifications use links:</p>
        <pre><code class="markdown">
When [Bob](- "#firstName") logs in 
a greeting [Hello Bob!](- <b>"?=greetingFor(#firstName)"</b>) should be displayed.
        </code></pre>
    </div>
</li>
  <li>
    <div class="collapsible-header"><i class="mdi mdi-code-tags"></i>HTML</div>
    <div class="collapsible-body">
        <p>HTML specifications use attributes:</p>
        <pre><code class="html">
&lt;p>
    When &lt;<b>span concordion:set="#firstName"</b>>Bob&lt;/span> logs in a greeting
    &lt;span <b>concordion:assert-equals="greetingFor(#firstName)"</b>>Hello Bob!&lt;/span>
    should be displayed.
&lt;/p>        
        </code></pre>
    </div>
</li>
</ul>

The common theme is that the instrumentation is effectively invisible when the specification is previewed. The Markdown format has the added benefit that you can hover over the link to see the instrumentation.

{::options parse_block_html="true" /}
<div class="row">
<div class="col s12">
  <ul class="tabs">
    <li class="tab col s3"><a href="#markdown"><i class="mdi mdi-markdown"> </i>  Markdown</a></li>
    <li class="tab col s3"><a href="#html"><i class="mdi mdi-code-tags"></i>  HTML</a></li>
  </ul>
</div>
<div id="markdown" class="col s12">
{% include instrumenting-markdown.md %}
</div>
<div id="html" class="col s12">
{% include instrumenting-html.md %}
</div> <!-- html -->
</div> <!-- row -->


If needed, additional commands can be implemented as [extensions][TODO].
 
TODO - add details of IDEA and Eclipse extensions to instrumentation.md when available..

These are the essential features of Concordion and should be all you need to get started. Read the page on Technique for advice on the approach to writing the specifications, or see below if you wish to look at advanced features.