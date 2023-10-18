<template>
  <div class="bg-slate-50 h-full box-border">
    <el-container class="md:p-8 py-5">
      <!-- 头部 -->
      <el-header class="drop-shadow-md">
        <header
          class="w-full flex justify-between items-center bg-white md:p-4 rounded-md py-5 px-2 ring-2 ring-blue-500/50"
        >
        <!-- 账号 -->
          <div>
            <el-dropdown split-button type="primary">
              <p>{{`${userStore.user.username.substring(0,4)}${userStore.user.username.length > 4 ? '...' : ''}`}}</p>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :icon="SwitchButton" @click="logout"
                    >退出登录</el-dropdown-item
                  >
                  <el-dropdown-item :icon="CircleCloseFilled" @click="delUserDialog = true"
                    >注销账号</el-dropdown-item
                  >
                  <el-dropdown-item :icon="Delete" @click="refreshLocal"
                    >清除本地缓存</el-dropdown-item
                  >
                  <el-dropdown-item :icon="RefreshRight" @click="refershDate"
                    >清除服务端缓存</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <!-- 搜索框pc md:block hidden-->
          <div class="md:block hidden">
            <el-input
              v-model="keyWord"
              placeholder="事项名"
            >
              <template #append>
                <el-button :icon="Search" @click="searchItemDialog = true"/>
              </template>
            </el-input>
          </div>
          <!-- 搜索框mobile -->
          <div class="md:hidden block">
            <el-input
              v-model="keyWord"
              placeholder="事项名"
              style="width: 180px;"
            >
            <template #append>
                <el-button :icon="Search" @click="searchItemDialog = true"/>
              </template>
            </el-input>
          </div>
          <!-- 按钮 -->
          <!-- <div>
            <el-popconfirm
              title="当数据不一致时,清除缓存,获取最新数据"
              confirm-button-text="清除"
              cancel-button-text="取消"
              @confirm="refershDate"
            >
              <template #reference>
                <el-button type="primary" :icon="RefreshRight" circle />
              </template>
            </el-popconfirm>
          </div> -->
        </header>
      </el-header>
      <!-- 主要内容 -->
      <el-main class="drop-shadow-md">
        <div class="flex flex-col items-center drop-shadow-md bg-white md:p-4 rounded-xl py-5 px-2 mt-4 ">
          <!-- 添加待办 -->
          <section class="flex items-center justify-between w-full">
            <span>我的待办</span>
            <div class="flex items-center">
              <el-input v-model.trim="addItemName" maxlength="50" placeholder="今朝何事待我迎"/>
              <el-button type="primary" class="ml-1 md:w-20 w-10" @click="addItem">添加</el-button>
            </div>
          </section>
          <!-- 待办展示区 -->
          <div class="flex flex-col items-center mt-5 w-full">
            <!-- 状态分类 -->
            <div>
              <el-badge :value="itemStore.itemList.length" :hidden="itemStore.itemList.length == 0" :max="99" type="primary" class="item">
                <el-button type="info" :class="itemIndex === 0 ? '!bg-sky-700': ''" @click="changeItemIndex(0)">全部</el-button>
              </el-badge>
              <el-badge :value="completeCount" :hidden="completeCount == 0" :max="99" type="success" class="md:mx-10 mx-5">
                <el-button type="info" :class="itemIndex === 1 ? '!bg-green-700': ''" @click="changeItemIndex(1)">已完成</el-button>
              </el-badge>
              <el-badge :value="itemStore.itemList.length - completeCount" :hidden="itemStore.itemList.length - completeCount == 0" :max="99" type="warning" class="item">
                <el-button type="info" :class="itemIndex === 2 ? '!bg-orange-500': ''"  @click="changeItemIndex(2)">未完成</el-button>
              </el-badge>
            </div>
            <!-- 待办列表 -->
            <div class="mt-5 w-full">
              <el-scrollbar height="340px" class="w-full" v-show="filterItem.length != 0">
                <div class="p-3" v-infinite-scroll="getMore" :infinite-scroll-immediate="false" :infinite-scroll-disabled="itemStore.isDisabled">
                  <ListItem v-for="item in filterItem" :key="item.id" :item="item"/>
                </div>
              </el-scrollbar>
              <el-empty :image-size="200" description="还没有待办" v-show="filterItem.length == 0"/>
            </div>
          </div>
        </div>
      </el-main>
      <!-- 页脚 -->
      <el-footer class="flex items-center justify-center !h-8 fixed bottom-0 md:w-11/12 w-full">
        <footer>TodoList | @Existing</footer>
      </el-footer>
    </el-container>
  </div>

  <!-- 修改待办名 -->
    <el-dialog
    v-model="itemStore.renameItemDialog"
    title="修改待办事项"
    align-center
    class="md:!w-1/3 !w-3/4"
  >
    <el-form>
      <el-form-item label="新的待办名" label-width="100px">
        <el-input v-model.trim="itemStore.newItemName" maxlength="50" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="itemStore.renameItemDialog = false">取消</el-button>
        <el-button type="primary" @click="itemStore.renameItemHandle"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 从数据库搜索的数据 -->
  <el-dialog
    v-model="searchItemDialog"
    align-center
    center
    draggable
    class="md:!w-1/3 !w-4/5"
    @close="closeSearchItemDialog"
  >
    <template #header="{ close, titleId, titleClass }">
        <div class="flex flex-col items-center box-border">
          <h4 :id="titleId" :class="titleClass">搜索待办事项(服务器搜索)</h4>
          <div class="flex items-center mt-4">
            <el-input v-model.trim="keyWordByDB" placeholder="事项名" maxlength="50" class="caret-sky-500"/>
            <el-button :icon="Search" type="primary" @click="searchItemByDBHandle"/>
          </div>
        </div>
    </template>
    <section >
          <el-scrollbar height="300px" class="w-full" v-show="itemStore.findItemList.length != 0">
                <div class="p-3">
                  <ListItem v-for="item in itemStore.findItemList" :key="item.id" :item="item"/>
                </div>
              </el-scrollbar>
              <el-empty :image-size="200" description="还没有待办" v-show="itemStore.findItemList.length == 0"/>
        </section>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="searchItemDialog = false"> 关闭 </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 注销账号询问框 -->
  <el-dialog
    v-model="delUserDialog"
    title="确认注销账号"
    align-center
    class="md:!w-1/3 !w-3/4"
  >
    <span>此操作不可逆，请三思</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="delUserDialog = false">取消</el-button>
        <el-button type="danger" @click="delAccount">
          删除
        </el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script setup>
import {ref,computed, onMounted} from 'vue'
import {
  Search,
  RefreshRight,
  SwitchButton,
  Delete,
  CircleCloseFilled
} from '@element-plus/icons-vue'
import ListItem from '@/components/ListItem.vue';
import {useItemStore} from '@/store/item.js'
import {useUserStore} from '@/store/user.js'
import {warning} from '@/utils/message.js'
import {removeItem } from '@/utils/localStorage.js'
import {useRouter} from 'vue-router'


const itemStore = useItemStore()
const userStore = useUserStore()
const router = useRouter()

// 搜索关键词
const keyWord = ref('')
// 添加待办名
const addItemName = ref('')
// 展示待办状态索引
const itemIndex = ref(0)
// 展示的待办
const itemStatus = ref('')
// 从数据库搜索的数据弹窗
const searchItemDialog = ref(false)
// 从数据库搜索的关键词
const keyWordByDB = ref('')
// 注销账号弹窗
const delUserDialog = ref(false)

// 切换待办状态
const changeItemIndex = i => {
  if(i === itemIndex) {
    return
  }
  console.log(i);
  itemIndex.value = i

  if(i == 1) {
    itemStatus.value = '1'
  } else if(i == 2) {
    itemStatus.value = '0'
  } else {
    itemStatus.value = ''
  }
}

// 初始待办
const initItemData = () => itemStore.getItemsHandle(1000, 1, true)

// 获取更多
const getMore = () => itemStore.getItemsHandle(20,itemStore.nextPage)

// 添加待办
const addItem = async () => {
  if(!addItemName.value) {
    return
  }

  if(addItemName.value.length > 50) {
    return warning('不能超过50个字')
  }

  await itemStore.addItemHandle(addItemName.value)

  addItemName.value = ''
}

// 清除服务端缓存,获取最新数据
const refershDate = () => itemStore.refershDateHandle(initItemData)

// 清除本地缓存
const refreshLocal = () => {
  removeItem('item')
  initItemData()
}

// 从数据库搜索待办
const searchItemByDBHandle = () => {
  if(!keyWordByDB.value) {
    return 
  }

  if(keyWordByDB.value.length > 50) {
    return warning('不能超过50个字')
  }

  itemStore.findItemHandle(keyWordByDB.value)
}

// 关闭搜索待办弹窗
const closeSearchItemDialog = () => {
  keyWordByDB.value = ''
  itemStore.findItemList = []
}

const logout = () => {
  removeItem('user')
  removeItem('TOKEN')
  removeItem('item')
  router.replace('/login')
}

const delAccount = async () => {
  await userStore.delAccountHandle()
  if(!userStore.isLogin) {
    router.replace('/login')
  }
}

// 展示的数据,搜索后的数据
const filterItem = computed(() =>
  itemStore.itemList.filter(data => data.status.includes(itemStatus.value) && (!keyWord.value  || data.title.includes(keyWord.value)))
)

// 已完成的数量
const completeCount = computed(() => itemStore.itemList.filter(data => data.status == 1).length)

onMounted(() => initItemData())
</script>
