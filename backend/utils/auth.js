import jwt from 'jsonwebtoken'
import config from "../app/config/index.js";

function sign(data) {
  // console.log(jwt.sign(data, Buffer.from(config.jwt.secret, 'utf-8'), { expiresIn: config.jwt.expiresIn }));
  return jwt.sign(data, config.jwt.secret, { expiresIn: config.jwt.expiresIn })
}

function verify(token) {
  try {
    // 去除Bearer前缀
    const tokenWithoutBearer = token.replace(/^Bearer\s+/, '');

    const decoded = jwt.verify(tokenWithoutBearer, config.jwt.secret)
    
    return {
      user: decoded,
      error: null
    }
  } catch (error) {
    return {
      user: null,
      error
    }
  }
}

export {
  sign,
  verify
}