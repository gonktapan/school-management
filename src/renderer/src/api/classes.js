import client from './client'

export const getClasses = () => client.get('/classes').then((r) => r.data.data)
export const getClass = (id) => client.get(`/classes/${id}`).then((r) => r.data.data)
export const createClass = (data) => client.post('/classes', data).then((r) => r.data.data)
export const updateClass = (id, data) => client.put(`/classes/${id}`, data).then((r) => r.data.data)
export const deleteClass = (id) => client.delete(`/classes/${id}`)
