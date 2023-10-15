import Sequelize from 'sequelize';
import config from '../config/index.js'
// import path from 'path'

const {host, port, user, password, database} = config.db

// 获取当前文件的目录路径
// const __dirname = path.dirname(new URL(import.meta.url).pathname);

// 创建 Sequelize 实例并配置连接到 MySQL 数据库
const sequelize = new Sequelize(database, user, password, {
  host,
  port: port,
  dialect: 'mysql', // 指定使用的数据库类型
  // models: [path.join(__dirname, '..', 'model/**/*.js')],
  pool: {
    max: 5, // 连接池最大连接数量
    min: 0, // 最小连接数量
    idle: 10000 // 如果一个线程10s内没有被用过就释放
  },
  define: {
    timestamps: false,
  },
});

// const db = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
// }

export default sequelize;