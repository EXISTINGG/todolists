import Redis from 'ioredis'
import config from '../config/index.js';

const { service_name, port, host, password } = config.redis;

// 配置Redis连接
const redis = new Redis({
  host, // Redis服务器的主机名
  port, // Redis服务器的端口号
  password, // 如果有密码的话
  username: service_name,
  // TLS required when externally connecting to Render Redis
  tls: true,
});

export default redis;
