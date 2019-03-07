<p align="center">
  <a href="https://github.com/juliantellez/lambcycle" target="_blank">
    <img alt="lambcycle" src="https://raw.githubusercontent.com/juliantellez/lambcycle/master/assets/lambcycle-logo.svg?sanitize=true" width="144">
  </a>
</p>

<p align="center">
  Lambcycle is a declarative <a href="https://aws.amazon.com/lambda/" target="_blank">lambda</a> middleware. Its main purpose is to let you focus on the specifics of your application by providing a configuration cycle.
</p>

<p align="center">
  🐑🛵 Read the introductory blog post <a href="https://medium.com/dazn-tech/handling-complexity-in-lambda-functions-e7acfbeb920a" target="_blank">here</a> 🐑🛵.
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
 - [Error Handling](#Error-handling)
 - [Plugins](#plugins)
 - [Creating a Plugin](#creating-a-plugin)
 - [Using a Plugin](#using-a-plugin)
 - [DevX](#devx)
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
[🎉 see some actual code 🎉 ](https://github.com/juliantellez/lambcycle/tree/develop/examples).


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
<img src="./assets/lambcycle-lifecycle.png" height=500>
</p>

Lambcycle enhances lambda functions with a few extension points (see graph), each of which can be used to interact with the event in a decomposed manner.

- The first extension point is `Request` which occurs immediately after the lambda is called. You can use this step for parsing, validation, etc...
Note: If you are thinking of auth, please consider a [lambda authoriser](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html) instead.

- The `Pre Handler` extension comes in handy when you need to adapt data to fit an interface. It is also a great place for fetching secrets.

- The `Handler`, where your beautiful business logic lives.

- Next up is the `Post Handler`, use this extension to validate and/or cache the output of your business logic.

- `Error` is an implicit extension for logging and tracing.

- And finally `Pre Response`, your chance to format a response to the consumer (which could be data or an error).

# Error Handling
The error object is a first class citizen that will stop the cycle and execute any error plugins declared in the register, it will then proceed to call the lambda handler's callback.
Have a look at the [Wrapper Interface](https://github.com/juliantellez/lambcycle/blob/master/src/Interfaces/IWrapper.ts) to see what's available for reporting.

`HINT: pretty much everything.`

```javascript
import lambcycle from 'lambcycle'
import notifyError from './myErrorNofifier'

const appLogic = async(event, context) => {
    const {error, data} = await amazingJob()
    if(error) {
        throw error
    }
}

const errorNotifier = {
    plugin: {
        onError: async (handler) => {
            /**
             * See IWrapper interface
            */
            await notifyError(handler.error)
        }
    }
}

const handler = lambcycle(appLogic).register([errorNotifier])

export default handler;
```


# Plugins

- [BodyParser](https://github.com/juliantellez/lambcycle/tree/master/src/Plugins/BodyParser): Parse incoming request bodies before your handler, available under the `handler.event.body` property.
- [Joi](https://github.com/juliantellez/lambcycle/tree/master/src/Plugins/Joi): Object schema description language and validator for JavaScript objects. Validate requests without the pain!

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

# DevX

Lambcycle ships with type definitions, making the dev experience smoother 🚀 (VScode only).

![typeintellisense](https://user-images.githubusercontent.com/4896851/51274743-db4db500-19c7-11e9-903c-cb50d127d933.gif)


# About the project

This project has been built with lots of ❤️ and [Typescript](https://www.typescriptlang.org) 🤣. It embraces the middleware pattern and uses types for consistency and documentation. If this approach seems familiar to you is because it was inspired by the awesome [hapijs](https://hapijs.com/api#request-lifecycle).

# Contributing
As you can see the possibilities are endless when it comes to plugins! Everyone is welcome to [contribute](https://github.com/juliantellez/lambcycle/blob/develop/contributing.md)! Feel free to create [issues](https://github.com/juliantellez/labmcycle/issues) or [prs](https://github.com/juliantellez/labmcycle/pulls).


# License
[MIT License](https://github.com/juliantellez/lambcycle/blob/master/LICENSE)


<a href="https://app.fossa.io/projects/git%2Bgithub.com%2Fjuliantellez%2Flambcycle?ref=badge_large" target="_blank">
    <img src="https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjuliantellez%2Flambcycle.svg?type=large" alt="FOSSA Status" style="max-width:100%; padding:3px;">
</a>
