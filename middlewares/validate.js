module.exports = (schema, type) => (req, res, next) => {

  let data;

  if (type === "body") data = req.body;
  if (type === "query") data = req.query;
  if (type === "params") data = req.params;

  const { error, value } = schema.validate(data);

  if (error) {
    return res.status(400).json({
      error: error.details[0].message      
    });
  }

  if (type === "body") req.body = value;
  if (type === "query") req.query = value;
  if (type === "params") req.params = value;

  next();
};
