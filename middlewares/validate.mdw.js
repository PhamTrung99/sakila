const Ajv = require('ajv').default;
/*ajv là thư viện giúp so sánh kiểm tra data từ body gửi lên 
 có khớp với các thuộc tính của schema object mình tự định nghĩa trong các .json trong folder schemas không*/

module.exports = schema => (req, res, next) => {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(req.body);
  if (!valid) {
    return res.status(400).json(validate.errors);
  }
  next();
}