# Joi Plugin

<p align="center">
<a href="https://github.com/hapijs/joi" target="_blank">
<img src="https://camo.githubusercontent.com/9c20f86ee4df5f043a36e0bfc1ff6f5bc40e8401/68747470733a2f2f7261772e6769746875622e636f6d2f686170696a732f6a6f692f6d61737465722f696d616765732f6a6f692e706e67">
</a>
</p>


Object schema description language and validator for JavaScript objects.

```
joiPlugin.js: 2.02KB (no compression) ❤️
```


- [Install](#install)
- [Using the Plugin](#using-the-plugin)
- [Considerations](#considerations)
- [Contributing](#contributing)
- [License](#license)

# Install


```bash
# with npm
npm install --save lambcycle joi

# with yarn
yarn add lambcycle joi
```

# Using the plugin

```javascript
import Joi from 'joi'
import lambcycle from 'lambcycle'
import joiPlugin from 'lambcycle/dist/joiPlugin'

const appLogic = async (event, context) => {
    await amazingOperation()
}

const schema = Joi.object().keys({
    important: Joi.string().required(),
    data: Joi.number().required()
});

const handler = lambcycle(appLogic).register([
    joiPlugin(schema)
]);

```

# Considerations

- should only provide a valid Joi.Schema

```javascript

// bad
const schema = {
    foo: Joi.string().required(),
};

// good
 const schema = Joi.object().keys({
    foo: Joi.string().required()
});
```

- As long as its supported by Joi, it should be valid in the plugin.

# Contributing
As you can see the possibilities are endless when it comes to plugins! Everyone is welcome to [contribute](https://github.com/juliantellez/lambcycle/blob/develop/contributing.md)! Feel free to create [issues](https://github.com/juliantellez/labmcycle/issues) or [prs](https://github.com/juliantellez/labmcycle/pulls).


# License
[MIT License](https://github.com/juliantellez/lambcycle/blob/master/LICENSE)


<a href="https://app.fossa.io/projects/git%2Bgithub.com%2Fjuliantellez%2Flambcycle?ref=badge_large" target="_blank">
    <img src="https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjuliantellez%2Flambcycle.svg?type=large" alt="FOSSA Status" style="max-width:100%; padding:3px;">
</a>
