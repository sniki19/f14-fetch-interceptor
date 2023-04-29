import { AnyAction, Dispatch } from '@reduxjs/toolkit'
import { F14Response, F14Settings, RequestBody, RequestHeaders, RequestOptions } from './types'

type Store = {
  dispatch: Dispatch<AnyAction>,
  getState: () => any
}

class F14 {
  #apiUrl: string = '' // TODO: Add conditional type url | endpoint
  #defaultHeaders: RequestHeaders = {}
  #userHeaders: RequestHeaders = {}
  #store: Store = {
    dispatch: (() => void 0) as Dispatch<AnyAction>,
    getState: () => void 0
  }

  #getAuth: (dispatch: Dispatch<AnyAction>, getState: () => any) => string | void = () => void 0 // TODO: Add typing
  #interceptResponse: (dispatch: Dispatch<AnyAction>, getState: () => any) => Promise<boolean> =
    () => Promise.resolve(false) // TODO: Add typing

  settings({ apiUrl, headers }: F14Settings) {
    this.#apiUrl = apiUrl || ''
    this.#userHeaders = { ...headers }
    return this
  }

  injectStore<T extends Store>(store: T): void {
    this.#store = store
  }

  auth(cb: (dispatch: Dispatch<AnyAction>, getState: () => any) => string | void) {
    this.#getAuth = cb
    return this
  }

  intercept401(cb: (dispatch: Dispatch<AnyAction>, getState: () => any) => Promise<true>) {
    this.#interceptResponse = cb
    return this
  }

  #generateRequest( // TODO: Add conditional type url | endpoint
    method: string, endpoint: string, useAuth: boolean, headers?: RequestHeaders, body?: RequestBody
  ): Request {
    const options: RequestOptions = {
      method: method,
      headers: {
        ...this.#defaultHeaders,
        ...this.#userHeaders,
        ...headers
      }
    }

    if (useAuth) {
      const token = this.#getAuth(this.#store.dispatch, this.#store.getState)
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`
        }
      } else {
        throw new Error('Auth feature isn\'t implemented. Please, set auth().')
      }
    }

    if (body) {
      options.body = JSON.stringify(body)
    }

    const targetUrl = this.#apiUrl
      ? `${this.#apiUrl}${endpoint}`
      : endpoint

    return new Request(targetUrl, options)
  }

  async #executeRequest(req: () => Request): Promise<F14Response> {
    try {
      let response = await fetch(req())

      if (response.status === 401) {
        const result = await this.#interceptResponse(this.#store.dispatch, this.#store.getState)
        if (result) {
          response = await fetch(req())
        }
      }

      const result = await response.json()

      return {
        ok: response.ok,
        status: response.status,
        data: result
      }
    } catch (error: any) {
      return {
        ok: false,
        status: 400,
        data: error.message
      }
    }
  }

  /**
   * Execute GET fetch
   * @param endpoint String that set endpoint or url (in case ApiUrl is empty)
   * @param useAuth Boolean state that says use auth or no. Default: false
   * @param headers A Headers object
   * @returns
   */
  get<T extends F14Response>(
    endpoint: string, useAuth: boolean = false, headers?: RequestHeaders
  ): Promise<T> {
    const req = () => this.#generateRequest('GET', endpoint, useAuth, headers ?? {})
    const result = this.#executeRequest(req)
    return result as Promise<T>
  }

  /**
   * Execute POST fetch
   * @param endpoint String that set endpoint or url (in case ApiUrl is empty)
   * @param useAuth Boolean state that says use auth or no. Default: false
   * @param body: The body argument provides the request body
   * @param headers A Headers object
   * @returns
   */
  post<T extends F14Response>(
    endpoint: string, useAuth: boolean = false, body?: RequestBody, headers?: RequestHeaders
  ): Promise<T> {
    const req = () => this.#generateRequest('POST', endpoint, useAuth, headers ?? {}, body)
    const result = this.#executeRequest(req)
    return result as Promise<T>
  }

  /**
   * Execute PATCH fetch
   * @param endpoint String that set endpoint or url (in case ApiUrl is empty)
   * @param useAuth Boolean state that says use auth or no. Default: false
   * @param body: The body argument provides the request body
   * @param headers A Headers object
   * @returns
   */
  patch<T extends F14Response>(
    endpoint: string, useAuth: boolean = false, body?: RequestBody, headers?: RequestHeaders
  ): Promise<T> {
    const req = () => this.#generateRequest('PATCH', endpoint, useAuth, headers ?? {}, body)
    const result = this.#executeRequest(req)
    return result as Promise<T>
  }

  /**
   * Execute PUT fetch
   * @param endpoint String that set endpoint or url (in case ApiUrl is empty)
   * @param useAuth Boolean state that says use auth or no. Default: false
   * @param body: The body argument provides the request body
   * @param headers A Headers object
   * @returns
   */
  put<T extends F14Response>(
    endpoint: string, useAuth: boolean = false, body?: RequestBody, headers?: RequestHeaders
  ): Promise<T> {
    const req = () => this.#generateRequest('PUT', endpoint, useAuth, headers ?? {}, body)
    const result = this.#executeRequest(req)
    return result as Promise<T>
  }

  /**
   * Execute DELETE fetch
   * @param endpoint String that set endpoint or url (in case ApiUrl is empty)
   * @param useAuth Boolean state that says use auth or no. Default: false
   * @param headers A Headers object
   * @returns
   */
  delete<T extends F14Response>(
    endpoint: string, useAuth: boolean = false, headers?: RequestHeaders
  ): Promise<T> {
    const req = () => this.#generateRequest('DELETE', endpoint, useAuth, headers ?? {})
    const result = this.#executeRequest(req)
    return result as Promise<T>
  }
}

export default F14