import response from "../../utils/response.js"
import vaildate from "../../utils/vaildate.js"
import redis from "../db/redis.js"
import ItemService from "../service/ItemService.js"

const rules = {
  title: [
    {
      type: 'string',
      required: true,
      message: '事项不能为空'
    },
    {
      min: 1,
      max: 50,
      message: '事项长度为1-50位'
    }
  ],
}

class ItemController {
  // 增加事件
  async addItem(ctx) {
    const {data, error} = await vaildate(ctx, rules)
    // return console.log(ctx.state._id);
    if(error) {
      return response.error(ctx, error)
    }
    // 默认为0(未完成)
    data.status = '0'
    data.userID = ctx.state._id
    
    const item =  await ItemService.addItem(data)
    
    if(item.dataValues.id > 0) {
      item.dataValues.status = '0'
      await redis.lpush(`item:${data.userID}`, JSON.stringify(item.dataValues));

      response.success(ctx, item.dataValues, '新增事项成功')
    } else {
      response.error(ctx, '新增事项失败')
    }
  }

  // 删除事件
  async delItem(ctx) {
    const itemId = ctx.params.id

    const item = await ItemService.findItemById(ctx.state._id, itemId)
    
    if(!item) {
      return response.error(ctx, '事项不存在')
    }

    const delRes = await ItemService.delItem(ctx.state._id, itemId)
    console.log(delRes);

    if(delRes > 0) {
      await redis.lrem(`item:${ctx.state._id}`, 1, JSON.stringify(item))
      return response.success(ctx, '删除事项成功')

    } else {
      response.error(ctx, '删除事项失败')
    }
  }

  // 修改事件(修改title或status,不能同时进行)
  async updateItem(ctx) {
    const {data, error} = await vaildate(ctx, rules)
    const {id, title, status} = data
    console.log(id, title, status);

    if(!id) {
      return response.error(ctx, 'id不能为空')
    }

    const item = await ItemService.findItemById(ctx.state._id, id)
    
    if(!item) {
      return response.error(ctx, '事项不存在')
    }
    
    if(title) {
      // 修改title
      if(error) {
        return response.error(ctx, error)
      }
      
      if(title == item.title) {
        return response.error(ctx, '与旧事项名相同')
      }

      const [titleRes] = await ItemService.updateItem(title,item.status,ctx.state._id, id)
      // const titleRes = 1
      if(titleRes > 0) {
        // 更新redis
        const cachedItem = await redis.lrange(`item:${ctx.state._id}`, 0, -1)
        
        const item = cachedItem.map((jsonString) => JSON.parse(jsonString))
        const [index] = item.map((item,i) => {
          if(item.id == id  && item.userID == ctx.state._id) {
            return i
          }
        })
        .filter(index => index !== undefined);
        console.log('index',index);

        const GetRes = await redis.lindex(`item:${ctx.state._id}`, index) 
  
        // GetRes 是获取到的元素值
        const resItem = JSON.parse(GetRes);
      
        // 在这里对 item 进行修改
        resItem.title = title;
      
        // 将修改后的元素重新设置回列表中
        await redis.lset(`item:${ctx.state._id}`, index, JSON.stringify(resItem));

        return response.success(ctx, '修改事项成功')
      } else {
        return response.error(ctx, '修改事项失败')
      } 

    } else if (status && (status == 0 || status == 1)) {
      // 修改状态
      
      if(status == item.status) {
        return response.error(ctx, '与旧事项状态相同')
      }

      const [statusRes] = await ItemService.updateItem(item.title,status,ctx.state._id, id)
      
      if(statusRes > 0) {
        // 更新redis
        const cachedItem = await redis.lrange(`item:${ctx.state._id}`, 0, -1)
        
        const item = cachedItem.map((jsonString) => JSON.parse(jsonString))
        const [index] = item.map((item,i) => {
          if(item.id == id  && item.userID == ctx.state._id) {
            return i
          }
        })
        .filter(index => index !== undefined);
        console.log('index',index);

        const GetRes = await redis.lindex(`item:${ctx.state._id}`, index) 
  
        // GetRes 是获取到的元素值
        const resItem = JSON.parse(GetRes);
      
        // 在这里对 item 进行修改
        resItem.status = status;
      
        // 将修改后的元素重新设置回列表中
        await redis.lset(`item:${ctx.state._id}`, index, JSON.stringify(resItem));

        return response.success(ctx, '修改事项成功')
      } else {
        return response.error(ctx, '修改事项失败')
      } 

    } else {
      response.error(ctx, '参数错误')
    }
  }

  // 查找事件
  async findItem(ctx) {
    const usp  =  new URLSearchParams(ctx.querystring)

    const title = usp.get('title')

    const {data, error} = await vaildate(ctx, rules, {title})
    
    if(error) {
      return response.error(ctx, error)
    }

    const item =  await ItemService.findItem(ctx.state._id, data.title)

    if(item.length == 0) {
      return response.error(ctx, '未找到事项')
    }

    response.success(ctx, item, '查询事项成功')
  }

  // 获取事件
  async getItem(ctx) {
    const usp  =  new URLSearchParams(ctx.querystring)

    const pageSize = 20 // 每页显示的项目数量
    const page = usp.get('nextPage') || 1 // 当前页码

    const start = (page - 1) * pageSize; // 计算起始索引
    const end = start + pageSize - 1; // 计算结束索引

    const items = await ItemService.getItem(ctx.state._id, start, end)
    
    if(items.length == 0) {
      return response.success(ctx, [], '没有事项了')
    }

    response.success(ctx, {items, nextPage: page-0+1}, '获取事项成功')
  }

  // 删除redis缓存,重新从数据库获取
  async updateFromDB(ctx) {
    const id = ctx.state._id

    try {
      const items = await ItemService.getAllItem(id)

      console.log(items);
      if(items.length == 0) {
        return response.error(ctx, '未找到事项')
      }

      // 清空 Redis 列表
      await redis.del(`item:${id}`);

      for(const item of items) {
        await redis.lpush(`item:${id}`, JSON.stringify(item));
      }
      
      return response.success(ctx, [], '更新数据成功')
    } catch (error) {
      response.error(ctx, error, '更新数据失败')
    }
  }
}

export default new ItemController;