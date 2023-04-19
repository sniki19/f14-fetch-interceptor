# f14-fetch-interceptor

A simple tool for fetch data and intercept 401 error

# Example

import F14 from 'f14-fetch-interceptor'

export const f14 = new F14()
	.settings({
		'Content-Type': 'application/json'
	}).auth(() => {
		const jwtToken = ... get token

		return jwtToken
	}).intercept401(async () => {
		... refresh Token

		return true
	})