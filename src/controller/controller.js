/* eslint-disable consistent-return */

exports.getController = async (req, res, next) => {
  try {
    res.json({
      message: 'My Rule-Validation API',
      status: 'success',
      data: {
        "name": "Olufemi Alabi",
        "github": "@femolacaster",
        "email": "femdomsteve@yahoo.com",
        "mobile": "07063183868"
      },
    });
  } catch (error) {
      if (!error.status) {
          error.status = 400
      }
      next(error)
  }
};

const index = (obj, i) => obj[i]

function evaluate({ fieldValue, condition, condition_value }) {
    switch (condition) {
    case 'neq': return fieldValue !== condition_value;
    case 'gt': return fieldValue > condition_value;
    case 'gte': return fieldValue >= condition_value;
    case 'contains': return fieldValue.indexOf(condition_value) > -1;
    default: return fieldValue === condition_value;
    }
  }

const evaluateCondition = async (data) => {
    try {
      const ruleFieldValue = data.rule.field.split('.').reduce(index, data.data);
  
      if (!ruleFieldValue) {
        const err = new Error('Missing field.');
        err.data = `field ${data.rule.field} is missing from data.`;
        err.status = 400;
        throw err;
      }
      data.rule.fieldValue = ruleFieldValue
      return evaluate(data.rule);
    } catch (error) {
        error.data = `field ${data.rule.field} is missing from data.`;
        error.status = 400;
        throw error;
    }
  };

exports.postController = async (req, res, next) => {
  try {
    const { body } = req;
    const result = await evaluateCondition(body);

    if (!result) {
      return res.status(400).json({
        message: `field ${body.rule.field} failed validation.`,
        status: "error",
        data: {
          validation: {
            error: true,
            field: body.rule.field,
            field_value: body.rule.field.split('.').reduce((obj, i) => obj[i], body.data),
            condition: body.rule.condition,
            condition_value: body.rule.condition_value,
          },
        },
      });

    }


     res.status(200).json({
        message: `field ${body.rule.field} successfully validated.`,
        status: "success",
        data: {
          validation: {
            error: false,
            field: body.rule.field,
            field_value: body.rule.field.split('.').reduce(index, body.data),
            condition: body.rule.condition,
            condition_value: body.rule.condition_value,
          },
        },
      });
  } catch (error) {
    if (!error.status) {
        error.status = 400
    }
    next(error)
  }
};