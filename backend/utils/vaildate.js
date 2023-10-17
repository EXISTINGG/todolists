import validator from "async-validator";
import response from './response.js';
const { default: Schema } = validator

async function validate(ctx, rules, dataValues) {
  const validator = new Schema(rules);
  let data;

  switch (ctx.method) {
    case 'GET':
      data = dataValues;
      break;
    case 'POST':
      data = getFormData(ctx);
      break;
    case 'PATCH':
      data = getFormData(ctx);
      break;
  }

  try {
    await validator.validate(data);
    return {
      data,
      error: null
    };
  } catch (err) {
    return {
      data,
      error: err.errors && err.errors.length > 0 && err.errors[0].message
    };
  }
}

function getFormData(ctx) {
  if (!ctx.request.body) {
    return response.error(ctx, '请求参数错误');
  }
  return ctx.request.body;
}

export default validate;
