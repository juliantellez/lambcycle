<p align="center">
  <a href="https://github.com/juliantellez/lambcycle" target="_blank">
    <img alt="lambcycle" src="https://raw.githubusercontent.com/juliantellez/lambcycle/master/assets/lambcycle-logo.svg?sanitize=true" width="144">
  </a>
</p>

<p align="center">
  Lambcycle is a declarative <a href="https://aws.amazon.com/lambda/" target="_blank">lambda</a> middleware. Its main purpose is to let you focus on the specifics of your application by providing a configuration cycle.
</p>

<!---links--->

<p align="center">
<!---npm--->
<a href="https://www.npmjs.com/package/lambcycle" target="_blank">
    <img src="https://img.shields.io/npm/v/lambcycle.svg?style=flat-square" style="padding:3px">
</a>

<!---npm downloads--->
<a href="https://npmcharts.com/compare/lambcycle?minimal=true" target="_blank">
    <img src="https://img.shields.io/npm/dm/lambcycle.svg?style=flat-square" style="padding:3px">
</a>

<!---travis master build--->
<a href="https://travis-ci.org/juliantellez/lambcycle/" target="_blank">
    <img src="https://img.shields.io/travis/juliantellez/lambcycle/master.svg?style=flat-square" style="padding:3px">
</a>

<!---install size--->
<a href="https://packagephobia.now.sh/result?p=lambcycle" target="_blank">
    <img src="https://packagephobia.now.sh/badge?p=lambcycle"style="padding:3px">
</a>

<!---npm dependencies--->
<a href="https://david-dm.org/juliantellez/lambcycle" target="_blank">
    <img src="https://david-dm.org/juliantellez/lambcycle/status.svg" style="padding:3px">
</a>

<!---npm dev-dependencies--->
<a href="https://david-dm.org/juliantellez/lambcycle?type=dev" target="_blank">
    <img src="https://david-dm.org/juliantellez/lambcycle/dev-status.svg" style="padding:3px">
</a>

<!---coveralls--->
<a href="https://coveralls.io/github/juliantellez/lambcycle" target="_blank">
    <img src="https://coveralls.io/repos/github/juliantellez/lambcycle/badge.svg?branch=master" style="padding:3px">
</a>

<!---npm dependency updates--->
<a href="https://snyk.io/test/github/juliantellez/lambcycle?targetFile=package.json" target="_blank">
    <img src="https://snyk.io/test/github/juliantellez/lambcycle/badge.svg?targetFile=package.json" alt="Known Vulnerabilities" style="max-width:100%; padding:3px;">
</a>

<!---serverless--->
<a href="http://www.serverless.com" target="_blank">
    <img src="http://public.serverless.com/badges/v3.svg" alt="Serverless" style="max-width:100%; padding:3px;">
</a>

<!---MIT License--->
<a href="https://opensource.org/licenses/MIT" target="_blank">
    <img src="http://img.shields.io/badge/license-MIT-blue.svg?style=flat" alt="MIT License" style="max-width:100%; padding:3px;">
</a>

<!---FOSSA--->
<a href="https://app.fossa.io/projects/git%2Bgithub.com%2Fjuliantellez%2Flambcycle?ref=badge_shield" target="_blank">
    <img src="https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjuliantellez%2Flambcycle.svg?type=shield" alt="FOSSA Status" style="max-width:100%; padding:3px;">
</a>
</p>

 - [Install](#install)
 - [Introduction](#Introduction)
 - [Handler Lifecycle](#Handler-lifecycle)
 - [Plugins](#plugins)
 - [Creating a Plugin](#creating-a-plugin)
 - [Using a Plugin](#using-a-plugin)
 - [About the project](#about-the-project)
 - [Contributing](#contributing)
 - [License](#license)

# Install

```bash
# with npm
npm install --save lambcycle

# with yarn
yarn add lambcycle
```

# Introduction

Lambcycle is a middleware for lambda functions. It defines a configurable life-cycle and allows you to focus on your application's logic. It has a "Feature as Plugin" approach, so you can easily create your own plugins or reuse your favorite packages with very little effort 🐑 🛵.

Checkout the following example or follow the link to
[🎉 see some actual code 🎉 ](https://github.com/juliantellez/lambcycle/tree/master/examples).


```javascript
// with es6

import Joi from "joi";
import lambcycle from "lambcycle";

import pinoPlugin from './myPinoPlugin'
import joiPlugin from './myJoiPlugin'
import bodyParserPlugin from './myBodyParserPlugin'

import applicationLogic from "./mycode";

const processData = async (event, context) => {
  // beautiful application logic ...

  const manipulateData = event => {
    // ...
  };

  return await applicationLogic(manipulateData(event), context);
};

const schema = Joi.object()
  .keys({
    username: Joi.string().alphanum().min(5).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{5,30}$/),
    email: Joi.string().email({ minDomainAtoms: 2 })
  });

const handler = lambcycle(processData).register([
  pinoPlugin,
  bodyParserPlugin,
  joiPlugin(schema)
]);

export default handler;
```

# Handler lifecycle

The lifecycle provides a clear guideline to reason about your needs. Every step of the cycle can handle or throw errors making it easy to log, report or debug.

<p align="center">
<img src="https://raw.githubusercontent.com/juliantellez/lambcycle/master/assets/lifecycle.svg?sanitize=true" height=500>
</p>

# Plugins

- [BodyParser](https://github.com/juliantellez/lambcycle/tree/master/src/Plugins/BodyParser): Parse incoming request bodies before your handler, available under the `handler.event.body` property.
- [Joi](https://github.com/juliantellez/lambcycle/tree/master/src/Plugins/Joi): Object schema description language and validator for JavaScript objects. Validate request without the pain!

# Creating a plugin 

A plugin is an object that can attach its hooks to one or more event cycles, it may provide its own configuration object.

```typescript
type IPluginHookFunction = (
    wrapper: IWrapper,
    config: object,
    handleError?: Callback
) => void;
```

```typescript
import * as Sentry from '@sentry/node';
import MyAwesomeIntegration from './MyAwesomeIntegration'

const sentryPlugin = (config) => {
    Sentry.init({
        dsn: `https://config.key@sentry.io/${config.project}`,
        integrations: [new MyAwesomeIntegration()]
    });

    return {
        config,
        plugin: {
            onPreResponse: async (handlerWrapper, config) => {
                Sentry.captureMessage('some percentile log perhaps?')
            },
            onError: async (handlerWrapper, config) => {
                Sentry.captureException(handlerWrapper.error);
            }
        }
    }
}

export default sentryPlugin;
```

# Using a plugin

Let's reuse the example above. Make sure your lambdas follow the [Principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) and your secrets stay SECRET ㊙️

```typescript
import lambcycle from 'lambcycle'
import sentryPlugin from './sentryPlugin'

const myApplicationLogic = async (event, context) => {
    await someLogic()
}

const handler = lambcycle(myApplicationLogic)
.register([
    sentryPlugin({
        key: process.env.SENTRY_KEY,
        project: process.env.SENTRY_PROJECT,
    })
]);

export default handler;
```

# About the project

This project has been built with lots of ❤️ and [Typescript](https://www.typescriptlang.org) 🤣. It embraces the middleware pattern and uses types for consistency and documentation. If this approach seems familiar to you is because it was inspired by the awesome [hapijs](https://hapijs.com/api#request-lifecycle).

# Contributing
As you can see the possibilities are endless when it comes to plugins! Everyone is welcome to [contribute](https://github.com/juliantellez/lambcycle/blob/develop/contributing.md)! Feel free to create [issues](https://github.com/juliantellez/labmcycle/issues) or [prs](https://github.com/juliantellez/labmcycle/pulls).


# License
[MIT License](https://github.com/juliantellez/lambcycle/blob/master/LICENSE)


<a href="https://app.fossa.io/projects/git%2Bgithub.com%2Fjuliantellez%2Flambcycle?ref=badge_large" target="_blank">
    <img src="https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjuliantellez%2Flambcycle.svg?type=large" alt="FOSSA Status" style="max-width:100%; padding:3px;">
</a>
