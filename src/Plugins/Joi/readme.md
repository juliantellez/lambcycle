
should only provide a valid Joi.Schema

``
bad
const schema = {
            foo: Joi.string().required(),
        };


good
 const schema = Joi.object().keys({
            foo: Joi.string().required()
        });
``