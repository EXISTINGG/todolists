<template>
  <div
    class="w-full h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex justify-center items-center"
  >
    <div
      class="md:w-2/4 md:h-2/4 w-4/5 h-3/5 flex flex-col items-center bg-white shadow-lg shadow-blue-500/50 rounded-xl p-4"
    >
      <header>
        <h1 class="text-2xl font-sans">注册账号</h1>
      </header>

      <main class="my-3">
        <el-form
          ref="regFormRef"
          :model="regForm"
          label-position="top"
          :rules="rules"
          label-width="120px"
          class="demo-regForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model.trim="regForm.username"
              type="text"
              show-word-limit
              maxlength="7"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model.trim="regForm.password"
              type="password"
              :minlength="6"
              maxlength="15"
              show-password
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="验证码" prop="captcha">
            <el-input v-model.trim="regForm.captcha" maxlength="4" class="!w-20"/>
            <img :src="captchaUrl" title="看不清?点击更换" class="cursor-pointer ml-2 mb-2" @click="changeCaptcha">
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitregForm(regFormRef)">注册</el-button>
            <router-link class="ml-5 text-xs text-sky-500 underline decoration-sky-500 underline-offset-4 cursor-pointer" to="/login">已有账号?去登录</router-link>
          </el-form-item>
        </el-form>
      </main>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref , onMounted} from 'vue'
import {warning} from '@/utils/message.js'
import { useRouter } from 'vue-router'
import {useUserStore} from '@/store/user.js'

const router = useRouter()
const userStore = useUserStore()


// 验证码url
const captchaUrl = ref('')
// 表单
const regFormRef = ref(null)
// 表单数据
const regForm = reactive({
  username: '',
  password: '',
  captcha: '',
})
// 验证规则
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 1, max: 7, message: '长度应该在1~7个字符之间', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 15, message: '长度应该在6~15个字符之间', trigger: 'blur' },
  ],
  captcha: [
    {required: true, message: '请输入验证码', trigger: 'blur'},
    { min: 4, max: 4, message: '长度应该为4个字符', trigger: 'blur' },
  ],
})

// 注册并校验所有数据
const submitregForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    // 验证通过
    if (valid) {
      await userStore.registerHandle(regForm)
      // 注册成功，跳转到登录页
      // if(userStore.isRegister) {setTimeout(() => {router.replace('/login')}, 1000);}
      if(userStore.isRegister) {
        router.replace('/login')
      } else {
        changeCaptcha()
      }
    } else {
      warning('请输入相关信息')
    }
  })
}

// 更换验证码
// const changeCaptcha = () => captchaUrl.value = `https://todolist.hxq-001.top/api/captcha?time=${Date.now()}`
const changeCaptcha = () => captchaUrl.value = `//47.113.146.58:8081/api/captcha?time=${Date.now()}`

onMounted(() => changeCaptcha())
</script>