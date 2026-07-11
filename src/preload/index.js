import { contextBridge } from 'electron'

// Renderer communicates directly with backend via axios — no IPC needed
contextBridge.exposeInMainWorld('api', {})
