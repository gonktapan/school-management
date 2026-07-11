import client from './client'

export const getScheduleByClass = (classId) =>
  client.get(`/schedules/class/${classId}`).then((r) => r.data.data)
export const createSchedule = (data) => client.post('/schedules', data).then((r) => r.data.data)
export const deleteSchedule = (id) => client.delete(`/schedules/${id}`)
