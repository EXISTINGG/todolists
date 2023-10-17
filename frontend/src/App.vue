<template>
  <!-- 加载动画，解决以服务的方式调用动画不在中心的bug -->
  <i v-loading.fullscreen.lock="fullscreenLoading"></i>
    <div class="sticky top-0 z-50">
      <el-alert type="success" center closable class="flex items-center select-none z-999999">
        没数据?多刷新激活服务器 😀API接口文档: <a href="https://t21buj3g2v.apifox.cn" target="_blank" class="underline underline-offset-4 font-bold">点击这里🚀</a>
      </el-alert>
    </div>
  <router-view></router-view>
</template>

<script setup>
import {ref} from 'vue'
const fullscreenLoading = ref(false)
</script>
