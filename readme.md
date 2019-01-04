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
</p>
<!---links--->

<p align="center">
    <a href="https://opensource.org/licenses/MIT" target="_blank">
<img src="https://opensource.org/files/osi_keyhole_300X300_90ppi_0.png" height=50 alt="MIT License">
    </a>
</p>

<!---icons--->

<h2 align="center">Getting Started</h2>

<h3>Install</h3>

```bash

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjuliantellez%2Flambcycle.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjuliantellez%2Flambcycle?ref=badge_large)

# with npm
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjuliantellez%2Flambcycle.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjuliantellez%2Flambcycle?ref=badge_shield)

npm install --save lambcycle

# with yarn
yarn add lambcycle
```

```javascript
// with es6

import lambcycle, { bodyParser, joi as lambcycleJoi, pino } from "lambcycle";
import Joi from "joi";

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
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    access_token: [Joi.string(), Joi.number()],
    birthyear: Joi.number()
      .integer()
      .min(1900)
      .max(2013),
    email: Joi.string().email({ minDomainAtoms: 2 })
  })
  .with("username", "birthyear")
  .without("password", "access_token");

const handler = lambcycle(processData).register([
  pino,
  bodyParser,
  lambcycleJoi(schema)
]);

export default handler;
```