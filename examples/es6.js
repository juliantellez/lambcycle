import Joi from 'joi'
import lambcycle from 'lambcycle'
import joiPlugin from 'lambcycle/dist/plugin-joi'
import bodyParser from 'lambcycle/dist/plugin-body-parser'

const applicationLogic = (event, context) => {
    const response = {}

    return Promise.resolve()
        .then(() => response);
};

const schema = Joi.object().keys({
    date: Joi.date().required(),
})

const handler = lambcycle(applicationLogic)
.register([
    bodyParser({type: 'json'}),
    joiPlugin(schema)
])

export default handler