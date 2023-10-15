import 'dotenv/config'

const config = {
  server: {
    port: process.env.SERVER_PORT
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  },
  redis: {
    service_name: process.env.REDIS_SERVICE_NAME,
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN
  },
  session_secret: process.env.SESSION_SECRET
}

export default config;