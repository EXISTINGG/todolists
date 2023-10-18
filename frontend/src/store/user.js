import { defineStore } from 'pinia'
import {
  login,
  register,
  delAccount
} from '@/api/user.js'
import { success, warning } from '@/utils/message.js'
import { getItem, setItem, removeItem } from '@/utils/localStorage.js'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      // 用户信息
      user: getItem('user') || {},
      isLogin: false,
      isRegister: false
    }
  },

  actions: {
    async loginHandle(loginForm) {
      this.isLogin = false

      const {username, password, captcha} = loginForm
      
      const {data} = await login(username, password, captcha)

      if(data.status !== 200) {
        return warning(data.message || '登录失败')
      }

      success('登录成功')

      setItem('TOKEN', data.data.token)
      setItem('user', data.data.user)
      this.user = data.data.user
      this.isLogin = true
    },

    async registerHandle(registerForm) {
      this.isRegister = false

      const {username, password, captcha} = registerForm
      const {data} = await register(username, password, captcha)

      if(data.status !== 200) {
        return warning(data.message || '注册失败')
      }

      success('注册成功')

      this.isRegister = true
    },

    async delAccountHandle() {
      const {data} = await delAccount()
      if(data.status !== 200) {
        return warning(data.message || '注销失败')
      }

      success('注销成功')

      this.isLogin = false
      this.user = {}
      removeItem('TOKEN')
      removeItem('user')
      removeItem('item')
    }
  }
})
