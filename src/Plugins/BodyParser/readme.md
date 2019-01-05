# Body Parser Plugin

Inspired by the amazing [express body parser](https://github.com/expressjs/body-parser) and [content type](https://github.com/jshttp/content-type) modules

Parse incoming request bodies before your handler, available under the handler.event.body property. This Plugin is attached to the [Request Cycle](https://github.com/juliantellez/lambcycle#handler-lifecycle) hook.



```
plugin-body-parser.min.js: 5.61KB (no compression) ❤️
```


- [Install](#install)
- [Using the Plugin](#using-the-plugin)
- [Considerations](#considerations)
- [Contributing](#contributing)
- [License](#license)

# Install


```bash
# with npm
npm install --save lambcycle

# with yarn
yarn add lambcycle
```

# Using the plugin

```javascript
import lambcycle from 'lambcycle'
import bodyParserPlugin from 'lambcycle/dist/plugin-body-parser'

const appLogic = async (event, context) => {
    await amazingOperation(event.body)
}

const bodyParserConfig = {
    type: 'json'
};

const handler = lambcycle(appLogic).register([
    bodyParserPlugin(bodyParserConfig)
]);

```

# Considerations

- The initial idea was too attach the actual body-parser module from express. However since we don't need streams here, as the data is already available, it made more sense to extract just the parsing section. enjoy!

- This plugin relies on content-type to parse the headers.

# Contributing
As you can see the possibilities are endless when it comes to plugins! Everyone is welcome to [contribute](https://github.com/juliantellez/lambcycle/blob/develop/contributing.md)! Feel free to create [issues](https://github.com/juliantellez/labmcycle/issues) or [prs](https://github.com/juliantellez/labmcycle/pulls).


# License
[MIT License](https://github.com/juliantellez/lambcycle/blob/master/LICENSE)


<a href="https://app.fossa.io/projects/git%2Bgithub.com%2Fjuliantellez%2Flambcycle?ref=badge_large" target="_blank">
    <img src="https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjuliantellez%2Flambcycle.svg?type=large" alt="FOSSA Status" style="max-width:100%; padding:3px;">
</a>
