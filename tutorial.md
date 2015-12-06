# Tutorial

This runs through the basics of creating living documents using Concordion. 

To kickstart the tutorial, we've created a template project you can [download](https://github.com/concordion/concordion-tutorial-2.0/archive/master.zip) or [fork](https://github.com/concordion/concordion-tutorial-2.0#fork-destination-box) if you have a Github account.

## Authoring

The first step is to create a specification of the new feature. In the `src/test/resources/marketing/mailshots` folder of the project, edit the file `SplittingNames.md` to contain the following.

    # Splitting Names
    
    To help personalise our mailshots we want to have the first name and last name of the customer. 
    Unfortunately the customer data that we are supplied only contains full names.
    
    The system therefore attempts to break a supplied full name into its constituents by splitting around whitespace.
    
    ### Example
    
    The full name Jane Smith will be broken into first name Jane and last name Smith.

This uses a formatting language called Markdown, which makes it easy to create rich documents using plain text. 
The `#` characters at the start of the line create headings, where the heading level is determined by the number of `#` characters.

Previewing our specification in Github, or in an editor that supports Markdown, we see it looks like ![preview of rendered specification](img/tutorial-authored-preview.png)

The team are happy with the specification, so we share it (for example, by adding the file to our version control system).