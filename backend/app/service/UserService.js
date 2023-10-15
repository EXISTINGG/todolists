import User from '../model/User.js';
import redis from '../db/redis.js';

class UserService {
  // 查找用户是否存在
  async getUserByName(username) {
    // 从Redis中获取数据
    const cachedUsers = await redis.get(username);
    
    if(cachedUsers) {
      return JSON.parse(cachedUsers)
    } else {
      const user = await User.findOne({where: {username}})
      return user?.dataValues
    }
  }

  getUserById(id) {
    return User.findOne({where: {id}});
  }

  // 注册
  registerAccount(user) {
    return User.create(user);
  }

  // 删除用户
  deleteAccount(username) {
    return User.destroy({where: {username}});
  }
}

export default new UserService;