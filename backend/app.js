// import Koa from 'koa'
// import Router from 'koa-router'
// import cors from 'koa2-cors'
// import mysql from './db/index.js'
// import Redis from 'ioredis'
// import Sequelize  from 'sequelize'
// import 'dotenv/config'

// const app = new Koa();
// const router = new Router();
// const {SERVER_ADDRESS,DB_HOST,DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE, REDIS_HOST,REDIS_PORT,REDIS_PASSWORD,REDIS_SERVICE_NAME} = process.env

// // 配置Redis连接
// const redis = new Redis({
//   host: REDIS_HOST, // Redis服务器的主机名
//   port: REDIS_PORT, // Redis服务器的端口号
//   password: REDIS_PASSWORD, // 如果有密码的话
//   username: REDIS_SERVICE_NAME,
//   // TLS required when externally connecting to Render Redis
//   tls: true,
// });

// // 创建 Sequelize 实例并配置连接到 MySQL 数据库
// const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
//   host: DB_HOST,
//   port: DB_PORT,
//   dialect: 'mysql', // 指定使用的数据库类型
// });

// const User = sequelize.define('users', {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   username: Sequelize.STRING,
//   password: Sequelize.STRING
// }, {
//   timestamps: false // 不使用 createdAt 和 updatedAt 列
// });


// // 连接到数据库并同步模型
// sequelize.authenticate()
//   .then(() => {
//     console.log('Database connection established successfully.');
//   })
//   .catch((err) => {
//     console.error('Unable to connect to the database:', err);
//   });

// // 同步模型和数据库
// sequelize.sync()
//   .then(() => {
//     console.log('All models are synchronized with the database.');
//   });

// // 查询所有用户
// User.findAll().then((users) => {
//   console.log('All users:', JSON.stringify(users, null, 2));
// });

// // 插入新用户
// // User.create({
// //   username: 'John Doe', // 注意这里使用的是 `username` 字段
// //   password: '1'
// // }).then((user) => {
// //   console.log('New user has been created:', user.toJSON());
// // });

// // 根据条件查询用户
// User.findAll({ where: { username: 'John Doe' } }).then((users) => {
//   console.log('Users with username "John Doe":', JSON.stringify(users, null, 2));
// });



// app.use(cors());

// // 创建数据库连接中间件
// app.use(async (ctx, next) => {
//   // 在上下文中存储数据库连接
//   const dbConnection = await mysql.getConnection();
  
//   ctx.state.db = dbConnection;

//   await next(); //等待当前中间件的所有事务处理完成后 继续处理请求
// });

// router.get('/', (ctx) => ctx.body = `Server is running on ${SERVER_ADDRESS}`)

// router.get('/users', async (ctx) => {
//   try {
//     // 从上下文中获取数据库连接
//     const connection = ctx.state.db;

//     // 执行查询
//     const [rows, fields] = await connection.execute('SELECT * FROM user');

//     // 将查询结果发送给客户端
//     ctx.body = rows;
//   } catch (error) {
//     console.error('Database error:', error);
//     ctx.status = 500;
//     ctx.body = 'Database error';
//   }
// });

// // Koa路由示例
// router.get('/redis', async (ctx) => {
//   // 将数据存储到Redis中
//   await redis.set('exampleKey', 'exampleValue');

//   // 从Redis中获取数据
//   const value = await redis.get('exampleKey');
  
//   ctx.body = `Value from Redis: ${value}`;
// });

// // 在请求完成后关闭数据库连接
// app.use(async (ctx, next) => {
//   if (ctx.state.db) {
//     await ctx.state.db.release(); // 释放连接回连接池
//   }
//   await next(); // 继续处理请求
// });

// app.use(router.routes());
// app.use(router.allowedMethods());

// app.listen(8081, () => console.log(`Server is running on ${SERVER_ADDRESS}:8081`))

import run from './app/index.js'
import config from './app/config/index.js'
run(config.server.port)