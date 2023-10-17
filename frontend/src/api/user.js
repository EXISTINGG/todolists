import {request} from '@/utils/request.js'

export const login = (username, password, captcha) => {
  
  const data = {username, password, captcha}
  
  return request.post('/login',data, { withCredentials: true})
}

export const register = (username, password, captcha) => {

  const data = {username, password, captcha}

  return request.post('/reg',data, { withCredentials: true})
}

export const delAccount = () => request.delete(`/del`)