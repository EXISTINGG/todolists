import response from "../../utils/response.js";

const captchaMiddleware = async (ctx, next) => {
  const userCaptcha = ctx.request.body?.captcha; // 用户提交的验证码
  const actualCaptcha = ctx.session?.captcha; // 存储在会话中的验证码
  console.log('user',userCaptcha, 'seseion',actualCaptcha);
  if (!userCaptcha || !actualCaptcha || userCaptcha !== actualCaptcha) {
    return response.error(ctx, '验证码错误');
  }

  // 删除验证码
  delete ctx.session.captcha;

  await next();
};

export default captchaMiddleware;
