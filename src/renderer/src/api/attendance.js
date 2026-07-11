import client from './client'

export const getAttendance = (classId, date) =>
  client.get(`/attendance/class/${classId}`, { params: { date } }).then((r) => r.data.data)
export const saveAttendance = (records) =>
  client.post('/attendance', { records }).then((r) => r.data.data)
