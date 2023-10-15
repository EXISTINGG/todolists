import { verify } from "../../utils/auth.js";
import response from "../../utils/response.js";

function AuthMiddleware(ctx, next) {
  const token = ctx.headers.authorization
  
  if(token) {
    const {error, user} = verify(token)
    // 挂载一个解析后的id
    ctx.state._id = user.id
    if(error) {
      return response.error(ctx,error.message, [], 401)
    } else {
      return next()
    }
  }
  return response.error(ctx,'身份校验失败')
}

export default AuthMiddleware