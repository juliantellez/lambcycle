const Joi = require('joi')
const lambcycle = require('lambcycle').default;
const bodyParser = require('lambcycle/dist/plugin-body-parser').default
const joiPlugin = require('lambcycle/dist/plugin-joi').default

const applicationLogic = (event, context, callback) => {
    const response = {}
    callback(null, response);
};

const schema = Joi.object().keys({
    date: Joi.date().required(),
})

const handler = lambcycle(applicationLogic)
.register([
    bodyParser({type: 'json'}),
    joiPlugin(schema)
])

module.exports = handler;
