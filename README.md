[![Build Status](https://travis-ci.com/concordion/concordion-website.svg?branch=gh-pages)](https://travis-ci.com/concordion/concordion-website)

<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>

# concordion-website
Concordion Website v2.0.0

Published to https://concordion.org.

The source for the old website is at https://github.com/concordion/concordion-website-1.0.

## Structure

* `_includes` - contains the source for the pages.
* `_layouts` - contains HTML layouts for the site
* `_posts` - contains wiki content
* `css` - contains the CSS styling
* `cubano` - contains the source for the Cubano pages
* `dotnet` - linked to the Concordion.NET specificaton output
* `fonts` - contains fonts
* `icons` - contains icons
* `img` - contains images
* `js` - contains JavaScript
* `404.md` - 404 page
* `_config.yml` - Jekyll site config
* `index.html` - home page

The remaining folders are generated, based on the files in the `_include` folder. We create 4 copies of each page with combinations of Java/C# (`page.fixture_language`) and HTML/Markdown (`page.spec_type`).

The pages in `_include` contain a header which contains some variable definitions, allowing content to be easily customised dependent on fixture language or specification type, eg:
```
{% if md %} This uses a formatting language called Markdown, which makes it easy to create rich documents using plain text.

{% elsif html %}

This uses HTML, which is the markup language that web pages are written in. 

{% endif %}
```

## Running the website
The website is built using Jekyll. To run the website locally, install Ruby Bundler, then run `bundle exec jekyll s`.

On Github, the website is automatically built using Github Pages and published to https://concordion.org. The Travis build checks that all links are working using `script/cibuild.sh`.

## Contributing
Please raise a pull request or an issue for any changes.
