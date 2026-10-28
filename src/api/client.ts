import axios, { type AxiosError } from 'axios'
import { API_BASE } from '@/data/site'

/** 统一 axios 实例：baseURL = VITE_API_BASE + /v1，超时 15s，携带 Cookie */
export const http = axios.create({
  baseURL: `${API_BASE}/v1`,
  withCredentials: true,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
  },
})

/** 公开接口错误 → 面向用户的中文提示 */
export function describeApiError(error: unknown): string {
  const axiosError = error as AxiosError<{ error?: { code?: string; message?: string } }>
  const status = axiosError?.response?.status
  const serverMessage = axiosError?.response?.data?.error?.message

  if (!axiosError?.response) {
    return '网络连接失败，请检查网络后重试。'
  }
  if (status === 429) {
    return '提交太频繁，请稍后再试。'
  }
  if (status === 422 || status === 400) {
    return serverMessage || '提交内容未通过校验，请检查后重试。'
  }
  if (status === 502 || status === 503) {
    return '服务暂时不可用，请稍后再试。'
  }
  if (typeof status === 'number' && status >= 500) {
    return '服务出错了，请稍后再试。'
  }
  return serverMessage || '提交失败，请稍后再试。'
}
