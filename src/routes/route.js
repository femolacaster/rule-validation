const express = require('express');

const router = express.Router();
const { getController, postController } = require('../controller/controller');

const { validator } = require('../validator/validator');

const typeValidator = (Schema) => {
    function validateMessage(errorData) {
      let err = errorData[0].replace(/"/g, '');
      err = err.replace(/must be of type/g, 'should be an');
      return `${err}.`;
    }
  
    return (req, _res, next) => {
      try {
        const { error } = Schema.validate(req.body);
        if (!error) return next();
        const err = new Error('Error.');
        err.data = validateMessage(error.details.map((errorObject) => errorObject.message));
        err.statusCode = 400;
        next(err);
      } catch (error) {
        next(error);
      }
    };
  };

router.get('/', getController);
router.post('/validate-rule', typeValidator(validator), postController);

module.exports = router;