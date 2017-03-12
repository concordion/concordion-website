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

_This page shows the downloads for __{{ fixture_language_desc }}__._  Click the toggle buttons above to choose other options.

<div class="github-fork-ribbon-wrapper right-bottom">
    <div class="github-fork-ribbon">
        <a href="https://github.com/concordion/concordion{% if csharp %}.net{% endif %}">Fork me on GitHub</a>
    </div>
</div>

<div class="row">
    <h1>Latest Release</h1>
    <ul class="collection">
{% if java %}
        <li class="collection-item avatar" id="gradle">
            <img src="{{ site.baseurl }}/img/download-gradle.jpg" alt="gradle image" class="circle">
            <span class="download title">Gradle</span>
            <pre>
 testCompile 'org.concordion:concordion:2.1.0'
            </pre>
        </li>
        <li class="collection-item avatar" id="maven">
            <img src="{{ site.baseurl }}/img/download-maven.png" alt="maven image" class="circle">
            <span class="download title">Maven</span>
            <pre>
 &lt;dependency&gt;
   &lt;groupId&gt;<b>org.concordion</b>&lt;/groupId&gt;
   &lt;artifactId&gt;<b>concordion</b>&lt;/artifactId&gt;
   &lt;version&gt;<b>2.1.0</b>&lt;/version&gt;
   &lt;scope&gt;test&lt;/scope&gt;
 &lt;/dependency&gt;
            </pre>
        </li>
{% elsif csharp %}
        <li class="collection-item avatar" id="nuget">
            <img src="{{ site.baseurl }}/img/download-nuget.png" alt="nuget image" class="circle">
            <span class="download title">NuGet</span>
        <p><b><a href="https://www.nuget.org/packages/Concordion.NET">https://www.nuget.org/packages/Concordion.NET/</a></b></p>
        <br/>
        <p>The latest Concordion.NUnit.dll must also be downloaded and <a href="{{site.baseurl}}/integrations/{{ page.fixture_language }}/{{ page.spec_type }}">copied to your NUnit addin folder</a>:</p>
        <p><b><a href="https://github.com/concordion/concordion.net/releases/download/v1.5.1/Concordion.NUnit.dll">Concordion.NUnit.dll</a></b></p>
        </li>
{% endif %}
        <li class="collection-item avatar" id="download">
        <i class="material-icons circle green">file_download</i>
        <span class="download title">Download</span>
        <p>Full distribution including {% if java %}source code{% elsif csharp %}documentation{% endif %} and all dependencies:</p>
{% if java %}
        <p><b><a href="http://dl.bintray.com/concordion/downloads/concordion-2.1.0.zip">concordion-2.1.0.zip</a></b></p>
{% elsif csharp %}
        <p><b><a href="https://github.com/concordion/concordion.net/releases/download/v1.5.1/Concordion.NET-1.5.1.zip" id="download-link">Concordion.NET-1.5.1.zip</a></b></p>
        <p>Note: the latest Concordion.NUnit.dll from the tools folder of this package must also be <a href="{{site.baseurl}}/integrations/{{ page.fixture_language }}/{{ page.spec_type }}">copied to your NUnit addin folder</a>.</p>
{% endif %}
        </li>
    </ul>
</div>

<div class="row">
    <h1>Release notes</h1>
    <div>
        <p>See our <a href="https://github.com/concordion/concordion{% if csharp %}.net{% endif %}/releases">Github release notes</a>.</p>
    </div>
</div>

{% if java %}
<div class="row">
    <h1>Extension downloads</h1>
    <div>
        <p>See the Concordion <a href="{{site.baseurl}}/extensions/{{ page.fixture_language }}/{{ page.spec_type }}">extensions</a> page for download and installation details for extensions.</p>
    </div>
</div>
{% endif %}