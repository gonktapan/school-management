import client from './client'

export const getGradesByStudent = (studentId) =>
  client.get(`/grades/student/${studentId}`).then((r) => r.data.data)
export const createGrade = (data) => client.post('/grades', data).then((r) => r.data.data)
export const deleteGrade = (id) => client.delete(`/grades/${id}`)
