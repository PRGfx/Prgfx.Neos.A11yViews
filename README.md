# Prgfx.Neos.A11yViews

This package provides inspector integration for the Neos CMS to display accessibility information for the current page.

```
composer require prgfx/neos-a11y-views
```

The views in this package are made available as mixins.
In some parts this package showcases the use of [Prgfx.Neos.MarkdownView](https://github.com/Prgfx/Prgfx.Neos.MarkdownView) to create easy integrations for editors.

## Available Mixins

### Prgfx.Neos.A11yViews:HeadingLevelsMixin
Includes a view that will display the heading structure on the current page, highlighting gaps in the heading structure.

Showcases
* populating a markdown-view from translation
* populating a markdown-view from ClientEval with node context
* translating markdown-content from client evaluation

### Prgfx.Neos.A11yViews:ImageAltMixin
Includes a view that will list all images without alt attribute or `[role=presentation]`.

Showcases
* resolving data as promise; loads image names from FlowQuery endpoint
