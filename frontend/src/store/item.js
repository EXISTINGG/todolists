import { defineStore } from 'pinia'
import {
  getItems,
  addItem,
  refershDate,
  deleteItem,
  updateItem,
  findItem
} from '@/api/item.js'
import { success, warning } from '@/utils/message.js'
import { getItem, setItem } from '@/utils/localStorage.js'

export const useItemStore = defineStore('item', {
  state: () => {
    return {
      itemList: [],
      // 下一页
      nextPage: 1,
      // 禁止加载
      isDisabled: false,
      // 展示修改待办名的弹窗
      renameItemDialog: false,
      // 新的待办名
      newItemName: '',
      // 现在操作的待办id
      currentItemId: '',
      // 现在操作的待办名
      currentItemName: '',
      // 搜索到的待办
      findItemList: [],
    }
  },

  actions: {
    async getItemsHandle(pageSize, nextPage, refersh) {
      const items = getItem('item')
      if(items) {
        return this.itemList = items
      }
      
      if (refersh) {
        this.isDisabled = false
        this.itemList = []
      }

      const { data } = await getItems(pageSize, nextPage)

      if (data.status !== 200) {
        return warning(data.message || '获取待办失败')
      }

      if (data.data.items.length === 0) {
        this.isDisabled = true
        return success('没有更多了')
      }

      this.itemList.splice(this.itemList.length, 0, ...data.data.items)
      this.nextPage = data.data.nextPage

      success('获取成功')
      setItem('item', this.itemList)
    },

    async addItemHandle(title) {
      const { data } = await addItem(title)
      if (data.status !== 200) {
        return warning(data.message || '添加失败')
      }
      console.log(data.data.item)
      this.itemList.splice(0, 0, data.data.item)
      success('添加成功')
      setItem('item', this.itemList)
    },

    async refershDateHandle(cb) {
      const { data } = await refershDate()

      if (data.status !== 200) {
        return warning(data.message || '刷新失败')
      }

      cb && cb()

      success('刷新成功')
    },

    async deleteItemHandle(id) {
      const { data } = await deleteItem(id)
      if (data.status !== 200) {
        return warning(data.message || '删除失败')
      }

      const index = this.itemList.findIndex((item) => item.id === id)
      this.itemList.splice(index, 1)

      success('删除成功')
      setItem('item', this.itemList)
    },

    // 修改事件(修改title或status,title优先,不能同时进行)
    async updateItemHandle(id, status, title) {
      const { data } = await updateItem(id, status, title)

      if (data.status !== 200) {
        return warning(data.message || '修改失败')
      }

      const item = this.itemList.find((item) => item.id === id)

      if (status) {
        item.status = status
      } else if (title) {
        item.title = title
        this.renameItemDialog = false
        this.newItemName = ''
      }

      success('修改成功')
      setItem('item', this.itemList)
    },

    // 重命名待办处理
    renameItemHandle() {
      if(!this.newItemName) {
        return
      }
      
      if(this.newItemName.length > 50) {
        return warning('不能超过50个字')
      }

      if(this.newItemName === this.currentItemName) {
        return warning('新名称不能和旧名称相同')
      }

      this.updateItemHandle(this.currentItemId, undefined, this.newItemName)
    },

    // 从数据库搜索事项
    async findItemHandle(keyWord) {
      const {data} = await findItem(keyWord)

      if(data.status !== 200) {
        return warning(data.message || '搜索失败')
      }

      if(data.data.length === 0) {
        return warning('没有找到待办')
      }

      this.findItemList = data.data.items
    }
  }
})
