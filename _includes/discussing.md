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

----
Before developing a new feature, discussing behavioural examples enables teams to build the feature right first time. Issues and requirements gaps are detected and misunderstandings corrected before the team starts developing code and tests.

This collaborative discussion practice is a key aspect of the Specification by Example (SBE) and Behaviour Driven Development (BDD) approaches to software development.

## Acceptance Criteria and Examples
When discussing a feature, it helps to describe the desired behaviour in general terms as acceptance criteria, along with specific examples.

For instance, an acceptance criterion might be that “All orders of $50 or over receive free shipping”. Examples might be “a $49.99 order has to pay for shipping” and “a $50.00 order has free shipping”.

It is important that each example relates to an acceptance criterion and that each acceptance criterion has corresponding examples.

![Story mapping to many acceptance criteria mapping to many examples]({{ site.baseurl }}/img/discuss-3-levels.png).

By discussing examples, we often find gaps in acceptance criteria, or even missing stories. 

Switching back and forth between the acceptance criteria and examples helps us discover gaps and gain a deeper understanding of the requirements.

Further details: [Acceptance Criteria: Seeing the wood and some trees](http://assurity.co.nz/community/big-thoughts/acceptance-criteria-part-1-seeing-the-wood-and-some-trees/).

## Structure / Anatomy of an Example

For each example, you should consider the _context_, _action_ and _outcome_:

- The _context_ describes the preconditions that are in place for the example to take place. You should consider not only the application state, but also any relevant global conditions such as the day of week, or the location of the user.
- The _action_ describes the event you are testing.
- The _outcome_ describes the expected postconditions that should hold true.

During discussion we normally write these examples on a whiteboard or index cards. Rather than using lengthy sentences, we often find it convenient to use a shorthand form. 

Tables and visualisations such as [timelines](http://katrinatester.blogspot.co.nz/2014/11/visual-test-ideas.html) or [venn diagrams](http://assurity.co.nz/community/big-thoughts/visual-specification-by-example/) can quickly and concisely describe examples.

## Exploring examples

To benefit from the discussion, the team need to explore examples that might not otherwise have been considered. Liz Keogh describes a couple of conversational patterns that help:

### Context Questioning

Asking “Is there any other context which, when this event happens, will produce a different outcome?” helps us think of new scenarios.

### Outcome Questioning

Asking “Given this context, when this event happens, is there another outcome that’s important? Something we missed, perhaps?” helps us find other things that our software should do.

Further details: [Conversational Patterns in BDD](http://lizkeogh.com/2011/09/22/conversational-patterns-in-bdd/).


## Collaborative Specification Approaches

![team discussing a spec]({{ site.baseurl }}/img/discuss-spec.png)

Including a range of disciplines, including users, business analysts, developers and testers in the discussion is crucial to exploring examples from different angles, and gaining a shared understanding of the feature.

Common approaches to specifying collaboratively include:

* [Specification workshops](https://gojko.net/2008/11/12/specification-workshops-an-agile-way-to-get-better-requirements/) - when starting out, having the whole team attend specification workshops acts as a useful introduction to the approach. Over time, some teams decide to continue with a whole-team approach, while others reduce the number of people in each session.

* [3 Amigos](http://www.velocitypartners.net/blog/2014/02/11/the-3-amigos-in-agile-teams/) - suggests a minimum of 3 functional roles; developer(s), tester(s) and business analyst or product owner.

* [Example mapping](https://cucumber.io/blog/2015/12/08/example-mapping-introduction) - uses index cards as a means to engage all team members collaboratively and visually map the story, acceptance criteria or rules, and examples.

----
