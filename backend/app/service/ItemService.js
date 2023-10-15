import Item from "../model/Item.js";
import redis from '../db/redis.js';
import { Op } from "sequelize";

class ItemService {
  addItem(item) {
    return Item.create(item);
  }

  async getItem(id, start, end) {
    const cachedItem = await redis.lrange(`item:${id}`, start, end)
    
    if(cachedItem) {
      // 遍历数组并将每个元素解析为对象
      const objectsArray = cachedItem.map((jsonString) => JSON.parse(jsonString));
      console.log('objectsArray',objectsArray);
      return objectsArray
    } else {
      const items = await Item.findAll({
        where: {userID: id},
        raw: true,
        order: [['id', 'DESC']], // 根据 id 列的倒序排列
        offset: start,
        limit: end - start + 1 // 因为Sequelize的`limit`是要返回的行数，所以需要计算出要返回的行数
      })
      console.log('items',items);
      return items
      // redis没有,建议缓存到redis
    }
  }

  async findItem(id, title) {
    
    const cachedItem = await redis.lrange(`item:${id}`, 0, -1)
    if(cachedItem) {
      // 模糊查找关键词
      const objectsArray = cachedItem.map((jsonString) => JSON.parse(jsonString)).filter((item) => item.title.includes(title));
      console.log(objectsArray);
      return objectsArray
    } else {
      const items = await Item.findAll({
        where: {
          title: {
            [Op.like]: `%${title}%`, // % 表示匹配任意字符，可以在关键词前后使用,不区分大小写
          },
        },
        raw: true,
      });
      console.log(items);
      return items
    }
  }

  async findItemById(userID, itemId) {
    const cachedItem = await redis.lrange(`item:${userID}`, 0, -1)
    if(cachedItem) {
      const item = cachedItem.map((jsonString) => JSON.parse(jsonString)).filter((item) => item.id == itemId && item.userID == userID);
      console.log('item',item[0]);
      return item[0]
    } else {
      const item = await Item.findOne({
        where: {id: itemId, userID},
        raw: true,
      });
      console.log(item);
      return item
    }
  }

  delItem(userID, itemId) {
    return Item.destroy({where: {id: itemId, userID}, raw: true})
  }

  updateItem(title,status,userID,id) {
    return Item.update({title, status}, {where: {id, userID}, raw: true})
  }

  getAllItem(id) {
    return Item.findAll({
      where: {userID: id},
      raw: true,
    });
  }
}

export default new ItemService;