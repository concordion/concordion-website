Let's start with a really simple example...

## Assert Equals

Create a file `HelloWorld.md` containing:

~~~
[Hello World!](?="getGreeting()")
~~~

When run with a fixture that implements the `getGreeting()` method to return `Hello World!`, the output specification will show:

![successful specification](img/hello-world-success.png)

### Properties support

In the example above, the call to `getGreeting()` can be simplified to `greeting` since Concordion's expression language understands simple properties.

~~~
[Hello World!](?="greeting")
~~~
