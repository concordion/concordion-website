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

_This page introduces the extensions for __{{ fixture_language_desc }}__._  Click the toggle buttons above to choose other options.

Concordion includes a flexible extension mechanism for adding functionality, for example implementing new commands, listening to events, or modifying the output documentation. It's simple to [write your own](coding#building-your-own-extension){% if csharp %}.{% else %}, or use one of the following:{% endif %}

{% if csharp %}

At this time, there are no extensions ported to .NET. We'd love your help on porting them across. Please get in touch on the [concordion-dev](http://groups.google.com/forum/#!forum/concordion-dev) list. Alternatively, please subscribe to our twitter feed for announcements of new extensions.

For inspiration, have a look at the [Java-based extensions]({{ site.baseurl }}/{{ page.subject }}/java/{{ page.spec_type }}).

{% else %}

<h4>Alternate Specification Types</h4>
<!-- EXCEL -->
<div class="col s12 m6 offset-m3">
    <div class="card blue-grey darken-1 white-text">
        <div class="card-image">
            <a href="https://github.com/concordion/concordion-excel-extension-tutorial/blob/master/README.md" alt="Excel spreadsheet with Concordion commands as comments">
                <img src="https://github.com/concordion/concordion-excel-extension-tutorial/raw/master/tutorial/images/ExcelConcordionSetDistance.png"/>
            </a>
        </div>
        <div class="card-content">
            <span class="card-title">Excel</span>
            <span class="card-title right">
                <a class="github-button" href="https://github.com/concordion/concordion-excel-extension" data-count-href="/concordion/concordion-excel-extension/stargazers" data-count-api="/repos/concordion/concordion-excel-extension#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star concordion/concordion-excel-extension on GitHub">Star</a>
            </span>
            <p>write your specifications in Excel</p>
        </div>
        <div class="card-action">
            <a href="https://github.com/concordion/concordion-excel-extension/blob/master/README.md">README</a>
            <a href="https://github.com/concordion/concordion-excel-extension-tutorial">Tutorial</a>
        </div>
    </div>
</div>
    
<div class="divider"></div>

<div class="section">
    <div class="row">
        <h4>Runners</h4>
        <!-- PARALLEL RUN -->
        <div class="col s12 m6 offset-m3">
            <div class="card blue-grey darken-1">
                <div class="card-content white-text">
                    <i class="mdi small mdi-shuffle-disabled"></i>
                    <span class="card-title">Parallel Run</span>
                    <span class="card-title right">
                        <!-- Place this tag where you want the button to render. -->
                        <a class="github-button" href="https://github.com/concordion/concordion-parallel-run-extension" data-count-href="/concordion/concordion-parallel-run-extension/stargazers" data-count-api="/repos/concordion/concordion-parallel-run-extension#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star concordion/concordion-parallel-run-extension on GitHub">Star</a>
                    </span>
                    <p>runs specifications in parallel</p>
                </div>
                <div class="card-action">
                    <a href="https://github.com/concordion/concordion-parallel-run-extension/blob/master/README.md">README</a>
                    <a href="https://github.com/concordion/concordion-scope-examples">Demo</a>
                </div>
            </div>
        </div>
    </div>
</div>
    
<div class="divider"></div>

<div class="section">
    <div class="row">
        <h4>Documentation Enhancers</h4>
        <!-- STORYBOARD -->
        <div class="col s12 m6">
            <div class="card blue-grey darken-1 white-text">
                <div class="card-image">
                    <a href="https://concordion.github.io/concordion-storyboard-extension-demo/spec/org/concordion/ext/demo/StoryboardDemo.html" alt="Example of output specification with storyboard">
                        <img src="{{ site.baseurl }}/img/extensions-storyboard.png"/>
                    </a>
                </div>
                <div class="card-content">
                    <span class="card-title">Storyboard</span>
                    <span class="card-title right">
                        <a class="github-button" href="https://github.com/concordion/concordion-storyboard-extension" data-count-href="/concordion/concordion-storyboard-extension/stargazers" data-count-api="/repos/concordion/concordion-storyboard-extension#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star concordion/concordion-storyboard-extension on GitHub">Star</a>
                    </span>
                    <p>embeds a card sequence with screenshots or data</p>
                </div>
                <div class="card-action">
                    <a href="https://github.com/concordion/concordion-storyboard-extension/blob/master/README.md">README</a>
                    <a href="https://github.com/concordion/concordion-storyboard-extension-demo">Demo</a>
                </div>
            </div>
        </div>

        <!-- SCREENSHOT -->
        <div class="col s12 m6">
            <div class="card blue-grey darken-1 white-text">
                <div class="card-image">
                    <a href="https://concordion.github.io/concordion-screenshot-extension-demo/spec/ScreenshotDemo.html" alt="Example of output specification with screenshot showing when hovering over failure">
                        <img src="{{ site.baseurl }}/img/extensions-screenshot.png"/>
                    </a>
                </div>
                <div class="card-content">
                    <span class="card-title">Screenshot</span>
                    <span class="card-title right">
                        <a class="github-button" href="https://github.com/concordion/concordion-screenshot-extension" data-count-href="/concordion/concordion-screenshot-extension/stargazers" data-count-api="/repos/concordion/concordion-screenshot-extension#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star concordion/concordion-screenshot-extension on GitHub">Star</a>
                    </span>
                    <p>embeds screenshots on failure or on demand</p>
                </div>
                <div class="card-action">
                    <a href="https://github.com/concordion/concordion-screenshot-extension/blob/master/README.md">README</a>
                    <a href="https://github.com/concordion/concordion-screenshot-extension-demo">Demo</a>
                </div>
            </div>
        </div>

        <!-- LOGGING TOOLTIP -->
        <div class="col s12 m6">
            <div class="card blue-grey darken-1 white-text">
                <div class="card-image">
                    <a href="https://concordion.github.io/concordion-logging-tooltip-extension-demo/spec/org/concordion/ext/demo/selenium/LoggingTooltipDemo.html" alt="Example of output specification with logging info showing when hovering over tooltip">
                        <img src="{{ site.baseurl }}/img/extensions-logging-tooltip.png"/>
                    </a>
                </div>
                <div class="card-content">
                    <span class="card-title">Logging Tooltip</span>
                    <span class="card-title right">
                        <a class="github-button" href="https://github.com/concordion/concordion-logging-tooltip-extension" data-count-href="/concordion/concordion-logging-tooltip-extension/stargazers" data-count-api="/repos/concordion/concordion-logging-tooltip-extension#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star concordion/concordion-logging-tooltip-extension on GitHub">Star</a>
                    </span>
                    <p>adds logging information as tooltips</p>
                </div>
                <div class="card-action">
                    <a href="https://github.com/concordion/concordion-logging-tooltip-extension/blob/master/README.md">README</a>
                    <a href="https://github.com/concordion/concordion-logging-tooltip-extension-demo">Demo</a>
                </div>
            </div>
        </div>

        <!-- LOGBACK -->
        <div class="col s12 m6">
            <div class="card blue-grey darken-1 white-text">
                <div class="card-image">
                    <a href="https://concordion.github.io/concordion-logback-extension-demo/spec/org/concordion/ext/demo/LogbackLoggingDemo.html" alt="Example of logging info">
                        <img src="{{ site.baseurl }}/img/extensions-logback.png"/>
                    </a>
                </div>
                <div class="card-content">
                    <span class="card-title">Logback</span>
                    <span class="card-title right">
                        <a class="github-button" href="https://github.com/concordion/concordion-logback-extension" data-count-href="/concordion/concordion-logback-extension/stargazers" data-count-api="/repos/concordion/concordion-logback-extension#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star concordion/concordion-logback-extension on GitHub">Star</a>
                    </span>
                    <p>adds Logback logs as tooltips and as a link</p>
                </div>
                <div class="card-action">
                    <a href="https://github.com/concordion/concordion-logback-extension/blob/master/README.md">README</a>
                    <a href="https://github.com/concordion/concordion-logback-extension-demo">Demo</a>
                </div>
            </div>
        </div>

        <!-- RUN TOTALS -->
        <div class="col s12 m6  offset-m3">
            <div class="card blue-grey darken-1 white-text">
                <div class="card-image">
                    <a href="https://github.com/concordion/concordion-run-totals-extension/blob/master/README.md" alt="Example of run totals showing on specification">
                        <img src="{{ site.baseurl }}/img/extensions-run-totals.png"/>
                    </a>
                </div>
                <div class="card-content">
                    <span class="card-title">Run Totals</span>
                    <span class="card-title right">
                        <a class="github-button" href="https://github.com/concordion/concordion-run-totals-extension" data-count-href="/concordion/concordion-run-totals-extension/stargazers" data-count-api="/repos/concordion/concordion-run-totals-extension#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star concordion/concordion-run-totals-extension on GitHub">Star</a>
                    </span>
                    <p>shows number of child tests passing and failing</p>
                </div>
                <div class="card-action">
                    <a href="https://github.com/concordion/concordion-run-totals-extension/blob/master/README.md">README</a>
                    <a href="https://github.com/concordion/concordion-run-totals-extension-demo">Demo</a>
                </div>
            </div>
        </div>

        <!-- INPUT STYLE -->
        <div class="col s12 m6">
            <div class="card blue-grey darken-1 white-text">
                <div class="card-image">
                    <a href="https://concordion.github.io/concordion-input-style-extension/spec/spec/concordion/ext/inputstyle/InputStyle.html" alt="Example of input style showing on specification">
                        <img src="{{ site.baseurl }}/img/extensions-input-style.png"/>
                    </a>
                </div>
                <div class="card-content">
                    <span class="card-title">Input Style</span>
                    <span class="card-title right">
                        <a class="github-button" href="https://github.com/concordion/concordion-input-style-extension" data-count-href="/concordion/concordion-input-style-extension/stargazers" data-count-api="/repos/concordion/concordion-input-style-extension#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star concordion/concordion-input-style-extension on GitHub">Star</a>
                    </span>
                    <p>adds CSS styling for input elements</p>
                </div>
                <div class="card-action">
                    <a href="https://github.com/concordion/concordion-input-style-extension/blob/master/README.md">README</a>
                    <a href="https://concordion.github.io/concordion-input-style-extension/spec/spec/concordion/ext/inputstyle/InputStyle.html">Specification</a>
                </div>
            </div>
        </div>

        <!-- COLLAPSE OUTPUT -->
        <div class="col s12 m6">
            <div class="card blue-grey darken-1 white-text">
                <div class="card-image">
                    <a href="https://concordion.github.io/concordion-timestamp-formatter-extension/spec/spec/concordion/ext/collapse/usage/Usage.html" alt="Example of specification with content collapsed">
                        <img src="{{ site.baseurl }}/img/extensions-collapse-output.png"/>
                    </a>
                </div>
                <div class="card-content">
                    <span class="card-title">Collapse Output</span>
                    <span class="card-title right">
                        <a class="github-button" href="https://github.com/concordion/concordion-collapse-output-extension" data-count-href="/concordion/concordion-collapse-output-extension/stargazers" data-count-api="/repos/concordion/concordion-collapse-output-extension#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star concordion/concordion-collapse-output-extension on GitHub">Star</a>
                    </span>
                    <p>makes sections of the documentation collapsible</p>
                </div>
                <div class="card-action">
                    <a href="https://github.com/concordion/concordion-collapse-output-extension/blob/master/README.md">README</a>
                    <a href="https://concordion.github.io/concordion-collapse-output-extension/spec/spec/concordion/ext/collapse/usage/Usage.html">Demo</a>
                </div>
            </div>
        </div>

        <!-- TIMESTAMP FORMATTER -->
        <div class="col s12 m6">
            <div class="card blue-grey darken-1 white-text">
                <div class="card-content">
                    <span class="card-title right">
                        <a class="github-button" href="https://github.com/concordion/concordion-timestamp-formatter-extension" data-count-href="/concordion/concordion-timestamp-formatter-extension/stargazers" data-count-api="/repos/concordion/concordion-timestamp-formatter-extension#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star concordion/concordion-timestamp-formatter-extension on GitHub">Star</a>
                    </span>
                    <span class="card-title">Timestamp Formatter</span>
                    <p>shows duration in hour, min, sec rather than milliseconds</p>
                </div>
                <div class="card-action">
                    <a href="https://github.com/concordion/concordion-timestamp-formatter-extension/blob/master/README.md">README</a>
                </div>
            </div>
        </div>

        <!-- EXCEPTION TRANSLATOR -->
        <div class="col s12 m6">
            <div class="card blue-grey darken-1 white-text">
                <div class="card-image">
                    <a href="https://concordion.github.io/concordion-exception-translator-extension-demo/spec/ExceptionTranslatorDemo.html" alt="Example of exception message being translated">
                        <img src="{{ site.baseurl }}/img/extensions-exception-translator.png"/>
                    </a>
                </div>               
                <div class="card-content">
                    <span class="card-title right">
                        <a class="github-button" href="https://github.com/concordion/concordion-exception-translator-extension" data-count-href="/concordion/concordion-exception-translator-extension/stargazers" data-count-api="/repos/concordion/concordion-exception-translator-extension#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star concordion/concordion-exception-translator-extension on GitHub">Star</a>
                    </span>
                    <span class="card-title">Exception Translator</span>
                    <p>modifies exception message text</p>
                </div>
                <div class="card-action">
                    <a href="https://github.com/concordion/concordion-exception-translator-extension/blob/master/README.md">README</a>
                    <a href="https://github.com/concordion//concordion-exception-translator-extension-demo">Demo</a>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="divider"></div>

<div class="section">
    <div class="row">
        <h4>Additional Commands</h4>

        <!-- EMBED -->
        <div class="col s12 m6">
            <div class="card blue-grey darken-1 white-text">
                <div class="card-content">
                    <span class="card-title">Embed</span>
                    <span class="card-title right">
                        <a class="github-button" href="https://github.com/concordion/concordion-embed-extension" data-count-href="/concordion/concordion-embed-extension/stargazers" data-count-api="/repos/concordion/concordion-embed-extension#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star concordion/concordion-embed-extension on GitHub">Star</a>
                    </span>
                    <p>embeds HTML in the documentation</p>
                </div>
                <div class="card-action">
                    <a href="https://github.com/concordion/concordion-embed-extension/blob/master/README.md">README</a>
                </div>
            </div>
        </div>

        <!-- EXECUTE ONLY IF -->
        <div class="col s12 m6">
            <div class="card blue-grey darken-1 white-text">
                <div class="card-content">
                    <span class="card-title">Execute only if</span>
                    <span class="card-title right">
                        <a class="github-button" href="https://github.com/concordion/concordion-executeonlyif-extension" data-count-href="/concordion/concordion-executeonlyif-extension/stargazers" data-count-api="/repos/concordion/concordion-executeonlyif-extension#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star concordion/concordion-executeonlyif-extension on GitHub">Star</a>
                    </span>
                    <p>conditionally executes child commands</p>
                </div>
                <div class="card-action">
                    <a href="https://github.com/concordion/concordion-executeonlyif-extension/blob/master/README.md">README</a>
                </div>
            </div>
        </div>
    </div>

</div>

Note: Additional contributions are welcome. Please get in touch on the [concordion-dev](http://groups.google.com/forum/#!forum/concordion-dev) list.

<!-- Place this tag right after the last button or just before your close body tag. -->
<script async defer id="github-bjs" src="https://buttons.github.io/buttons.js"></script>

{% endif %}