export type RequestHeaders = {
	[key: string]: string
}

export type RequestBody = string | number | Object | Array<any>

export type RequestOptions = {
	method: string
	headers?: RequestHeaders
	body?: RequestBody
}

export type F14Response = {
	ok: boolean
	status: number
	data: any
}