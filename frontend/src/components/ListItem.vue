<template>
  <transition name="el-fade-in-linear">
    <div class="my-3 p-2 border-solid border-2 border-sky-600 rounded-lg flex items-center justify-between">
      <!-- left -->
      <div class="flex items-center truncate">
        <input type="checkbox" class="accent-green-500" :checked="item.status == 1" @change="changeStatus(item.id,item.status)">
        <h5 class="ml-2">{{ item.title }}</h5>
      </div>

      <!-- right -->
      <div class="flex items-center ml-1">
        <el-tag class="mr-2 select-none" type="success" size="small" effect="dark" round v-show="item.status == 1">完成</el-tag>
        <el-tag class="mr-2 select-none" type="warning" size="small" effect="dark" round v-show="item.status == 0">未完成</el-tag>
        <el-dropdown @command="handleCommand">
          <el-button type="primary" :icon="Operation" circle />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :icon="Edit" :command="{select: 1, id: item.id, name: item.title}">修改</el-dropdown-item>
              <el-dropdown-item :icon="Delete" :command="{select: 2, id: item.id, name: item.title}">删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        
      </div>
    </div>
  </transition>
</template>

<script setup>
import {
  Edit,
  Delete,
  Operation
} from '@element-plus/icons-vue'
import {useItemStore} from '@/store/item.js'
import {warning} from '@/utils/message.js'

const itemStore = useItemStore()

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

// 待办操作
const handleCommand = (command) => {
  const {select, id, name} = command
  
  if(!select || !id) {
    return warning('缺少参数')
  }

  if(select == 1) {
    // 修改待办名
    if(!name) {
      return
    }
    itemStore.renameItemDialog = true
    itemStore.currentItemId = id
    itemStore.currentItemName = name
  } else if(select == 2) {
    // 删除
    itemStore.deleteItemHandle(id)
  } else {
    // 未知
    return warning('未知错误')
  }
}

// 改变待办状态
const changeStatus = (id, status) => {
  if(status == 0) {
    // 修改为已完成
    itemStore.updateItemHandle(id, '1')
  } else if(status == 1) {
    // 修改为未完成
    itemStore.updateItemHandle(id, '0')
  }
}
</script>