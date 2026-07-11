import client from './client'

export async function login(email, password) {
  const res = await client.post('/auth/login', { email, password })
  localStorage.setItem('token', res.data.token)
  localStorage.setItem('role', res.data.role)
  return res.data
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
}

export function getToken() {
  return localStorage.getItem('token')
}

export function getRole() {
  return localStorage.getItem('role')
}

export function isLoggedIn() {
  return !!getToken()
}
