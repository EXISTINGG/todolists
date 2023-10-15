import KoaRouter from 'koa-router'
import UserController from '../controller/UserController.js'
import svgCaptcha from 'svg-captcha';
import captchaMiddleware from '../middleware/CaptchaMiddleware.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import ItemController from '../controller/ItemController.js';

const router = new KoaRouter({prefix: '/api'}) // 路由前缀

// 生成验证码
router.get('/captcha', (ctx) => {
  const captcha = svgCaptcha.create();
  ctx.session.captcha = captcha.text; // 将验证码保存在用户的会话中
  console.log(captcha.text);
  ctx.type = 'image/svg+xml';
  ctx.body = captcha.data;
});
router.post('/reg', captchaMiddleware, UserController.registerAccount)
router.post('/login', captchaMiddleware, UserController.login)
// 验证身份中间件
router.use(AuthMiddleware)
router.delete('/del/:id', UserController.deleteAccount)
router.post('/add', ItemController.addItem)
router.get('/get', ItemController.getItem)
router.get('/find', ItemController.findItem)
router.delete('/delitem/:id', ItemController.delItem)
router.patch('/update', ItemController.updateItem)
// 用于更新redis数据,
router.get('/refresh-data', ItemController.updateFromDB)

export default router