import { F14Response, RequestBody, RequestHeaders, RequestOptions } from './types'

class F14 {
	#defaultHeaders: RequestHeaders = {}
	#userHeaders: RequestHeaders = {}

	#getAuth: () => string | void = () => undefined
	#interceptResponse: () => Promise<boolean> = () => Promise.resolve(false)

	settings(headers: RequestHeaders) {
		this.#userHeaders = { ...headers }
		return this
	}

	auth(cb: () => string | void) {
		this.#getAuth = cb
		return this
	}

	intercept401(cb: () => Promise<true>) {
		this.#interceptResponse = cb
		return this
	}

	#generateRequest(method: string, url: string, useAuth: boolean, headers?: RequestHeaders, body?: RequestBody) {
		const options: RequestOptions = {
			method: method,
			headers: {
				...this.#defaultHeaders,
				...this.#userHeaders,
				...headers
			}
		}
		if (body) {
			options.body = JSON.stringify(body)
		}
		if (useAuth) {
			const token = this.#getAuth()
			options.headers = {
				...options.headers,
				Authorization: `Bearer ${token}`
			}
		}

		return new Request(url, options as any)
	}

	async #executeRequest(req: () => Request): Promise<F14Response> {
		try {
			let response = await fetch(req())

			if (response.status === 401) {
				const result = await this.#interceptResponse()
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

	get<T extends F14Response>(url: string, useAuth: boolean = false, headers?: RequestHeaders): Promise<T> {
		const req = () => this.#generateRequest('GET', url, useAuth, headers ?? {})
		const result = this.#executeRequest(req)
		return result as Promise<T>
	}

	post<T extends F14Response>(url: string, useAuth: boolean = false, body?: RequestBody, headers?: RequestHeaders): Promise<T> {
		const req = () => this.#generateRequest('POST', url, useAuth, headers ?? {}, body)
		const result = this.#executeRequest(req)
		return result as Promise<T>
	}

	patch<T extends F14Response>(url: string, useAuth: boolean = false, body?: RequestBody, headers?: RequestHeaders): Promise<T> {
		const req = () => this.#generateRequest('PATCH', url, useAuth, headers ?? {}, body)
		const result = this.#executeRequest(req)
		return result as Promise<T>
	}

	delete<T extends F14Response>(url: string, useAuth: boolean = false, headers?: RequestHeaders): Promise<T> {
		const req = () => this.#generateRequest('DELETE', url, useAuth, headers ?? {})
		const result = this.#executeRequest(req)
		return result as Promise<T>
	}
}

export default F14