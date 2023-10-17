import {request} from '@/utils/request.js'

export const getItems = (pageSize,nextPage) => {
  const params = {pageSize,nextPage}
  return request.get('/get',{params})
}

export const addItem = title => {
  const data = {title}
  return request.post('/add',data)
}

export const refershDate = () => request.get('/refresh-data')

export const deleteItem = id => request.delete(`/delitem/${id}`)

export const updateItem = (id,status,title) => {
  const data = {id,status,title}
  return request.patch('/update',data)
}

export const findItem = title => request.get(`/find/?title=${title}`)