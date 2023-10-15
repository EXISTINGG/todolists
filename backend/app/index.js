import Koa from 'koa';
import router from './router/index.js';
// import db from './db/index.js';
// db()
import {koaBody} from 'koa-body';
import 'dotenv/config';
import cors from 'koa2-cors'
import session from 'koa-session'
import ErrorMiddleware from './middleware/ErrorMiddleware.js'
import config from './config/index.js';


const app = new Koa();
app.keys = [config.session_secret]; // 用于加密会话数据的密钥
app
.use(cors())
.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
  }
}))
.use(session({}, app))
// 注册错误中间件
.use(ErrorMiddleware)
.use(router.routes())
.use(router.allowedMethods());

const run = port => app.listen(port, () => console.log(`Server is running at ${process.env.SERVER_ADDRESS}:${port}`))

export default run