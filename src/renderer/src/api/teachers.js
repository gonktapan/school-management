import client from './client'

export const getTeachers = () => client.get('/teachers').then((r) => r.data.data)
export const getTeacher = (id) => client.get(`/teachers/${id}`).then((r) => r.data.data)
export const createTeacher = (data) => client.post('/teachers', data).then((r) => r.data.data)
export const updateTeacher = (id, data) => client.put(`/teachers/${id}`, data).then((r) => r.data.data)
export const deleteTeacher = (id) => client.delete(`/teachers/${id}`)
