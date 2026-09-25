const { AppError } = require('./errorHandler');

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errorMessages = (result.error.issues || []).map(issue => ({
        field: issue.path.join('.') || 'body',
        message: issue.message
      }));

      const err = new AppError('Validation failed', 400);
      err.errors = errorMessages;
      return next(err);
    }

    req.body = result.data;
    next();
  };
}

module.exports = validate;
