import response from "../../utils/response.js"
import vaildate from "../../utils/vaildate.js"
import UserService from '../service/UserService.js'
import valipwd from "../../utils/valipwd.js"
import redis from '../db/redis.js';
import {sign} from '../../utils/auth.js'

const rules = {
  username: [
    {
      type: 'string',
      required: true,
      message: '用户名不能为空'
    },
    {
      min: 1,
      max: 7,
      message: '用户名长度为1-7位'
    }
  ],
  password: [
    {
      type: 'string',
      required: true,
      message: '密码不能为空'
    },
    {
      min: 6,
      max: 15,
      message: '密码长度为6-15位'
    }
  ]
}

class UserController {
  // 注册账号
  async registerAccount(ctx) {
    // const userCaptcha = ctx.request.body.captcha; // 用户提交的验证码
    // const actualCaptcha = ctx.session.captcha; // 存储在会话中的验证码
    
    // if (userCaptcha !== actualCaptcha) {
    //   return response.error(ctx, {}, '验证码错误')
    // }

    // // 删除验证码
    // delete ctx.session.captcha;

    const {data, error} = await vaildate(ctx, rules)

    if(error) {
      return response.error(ctx, error)
    }

    const user = await UserService.getUserByName(data.username)

    if(user?.id) {
      return response.error(ctx, '用户名已存在')
    }

    // 密码加密存储
    data.password = valipwd.encrypt(data.password);
    const {id, username, password} = await UserService.registerAccount(data)
    if(id > 0) {
      // 注册成功，将用户信息存入Redis
      const userInfo = {
        id,
        username,
        password
      }
      await redis.set(username, JSON.stringify(userInfo));

      response.success(ctx, {id, username}, '注册成功')
    } else {
      response.error(ctx, {}, '注册失败')
    }
  }

  // 登录账号
  async login(ctx) {
    const {data, error} = await vaildate(ctx, rules)

    if(error) {
      return response.error(ctx, error)
    }

    const user = await UserService.getUserByName(data.username)
    

    if(!user?.id) {
      return response.error(ctx, '用户不存在')
    }

    // 验证密码
    const isMatch = valipwd.decrypt(data.password, user.password)
    if(!isMatch) {
      return response.error(ctx, '密码错误')
    }

    // 验证通过，颁发token
    const {password, ...userInfo} = user // 剔除密码

    const token = sign(userInfo)

    response.success(ctx, {user: userInfo, token: `Bearer ${token}`}, '登录成功')
  }

  // 注销账号
  async deleteAccount(ctx) {
    // const id = ctx.params.id
    const id = ctx.state._id
    
    // 是否是删除自己的账号
    // if(ctx.state._id != id) {
    //   return response.error(ctx, '无权限')
    // }
    
    const user = await UserService.getUserById(id)

    if(!user?.id) {
      return response.error(ctx, '用户不存在')
    }

    // 验证通过,注销账号(不考虑软删除)
    const number = await UserService.deleteAccount(user.id)

    if(number > 0) {
      // 从删除redis
      await redis.del(user.username);
      await redis.del(`item:${id}`)
      response.success(ctx, [], '注销成功')
    } else {
      response.error(ctx, '注销失败')
    }
  }
}

export default new UserController;
