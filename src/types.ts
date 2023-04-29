export type RequestHeaders = {
  [key: string]: string
}

export type RequestBody = string | number | Object | Array<any>

export type RequestOptions = RequestInit & {
  method: string
}

export type F14Response = {
  ok: boolean
  status: number
  data: any
}

export type F14Settings = {
  apiUrl?: string
  headers?: RequestHeaders
}