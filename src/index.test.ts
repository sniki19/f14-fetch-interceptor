import configureStore from 'redux-mock-store'
import F14 from './'
import { apiEndpoint, apiUrl, fakeList, url } from './jest/data'
import { crashFetch, mockFetch, spyAndMockFetch } from './jest/helpers'

beforeEach(() => {
  jest.resetAllMocks()
})

afterAll(() => {
  jest.clearAllMocks()
})

describe('F14 request options', () => {
  test('should check request url', async () => {
    const spy = spyAndMockFetch({})

    const f14 = new F14()
    await f14.get(url)

    const call = spy.mock.calls[0][0] as Request
    expect(call.url).toEqual(url)
  })

  test('should check settings api url and request endpoint', async () => {
    const spy = spyAndMockFetch({})

    const f14 = new F14()
      .settings({
        apiUrl: apiUrl
      })
    await f14.get(apiEndpoint)

    const call = spy.mock.calls[0][0] as Request
    expect(call.url).toEqual(url)
  })

  test('fetch should be called with request method type', async () => {
    const spy = spyAndMockFetch({})

    const f14 = new F14()

    await f14.get(url)
    expect(spy.mock.calls[0][0]).toHaveProperty('method', 'GET')

    await f14.post(url)
    expect(spy.mock.calls[1][0]).toHaveProperty('method', 'POST')

    await f14.put(url)
    expect(spy.mock.calls[2][0]).toHaveProperty('method', 'PUT')

    await f14.patch(url)
    expect(spy.mock.calls[3][0]).toHaveProperty('method', 'PATCH')

    await f14.delete(url)
    expect(spy.mock.calls[4][0]).toHaveProperty('method', 'DELETE')
  })

  test('should check settings and request headers', async () => {
    const spy = spyAndMockFetch({})

    const f14 = new F14()
      .settings({
        apiUrl: apiUrl,
        headers: {
          'Content-type': 'application/json'
        }
      })

    await f14.get(apiEndpoint)
    const call1 = spy.mock.calls[0][0] as Request
    expect(Array.from(call1.headers.keys()).length).toBe(1)
    expect(call1.headers.get('Content-type')).toEqual('application/json')

    await f14.get(apiEndpoint, false, {
      Accept: '*/*'
    })
    const call2 = spy.mock.calls[1][0] as Request
    expect(Array.from(call2.headers.keys()).length).toBe(2)
    expect(call2.headers.get('Content-type')).toEqual('application/json')
    expect(call2.headers.get('Accept')).toEqual('*/*')
  })

  test('should check auth header', async () => {
    const spy = spyAndMockFetch({})

    const f14 = new F14()
      .auth(() => {
        return 'token'
      })

    await f14.get(url, true)
    const call = spy.mock.calls[0][0] as Request
    expect(Array.from(call.headers.keys()).length).toBe(1)
    expect(call.headers.get('Authorization')).toEqual('Bearer token')
  })
})

describe('F14 response', () => {
  test('should return F14Response result with data', async () => {
    mockFetch(fakeList)

    const f14 = new F14()
    const result = await f14.get(url)

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(result).toEqual({
      ok: true,
      status: 400,
      data: fakeList
    })
  })

  test('should return F14Response result with error', async () => {
    mockFetch(undefined, {
      ok: false,
      status: 404
    })

    const f14 = new F14()
    const result = await f14.get(apiUrl + '/wrong-path')

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(result).toEqual({
      ok: false,
      status: 404,
      data: undefined
    })
  })

  test('should return F14Response with error message when smth went wrong', async () => {
    crashFetch('fetch error')

    const f14 = new F14()
    const result = await f14.get(apiUrl)

    expect(result).toEqual({
      ok: false,
      status: 400,
      data: 'fetch error'
    })
  })
})

describe('F14 with store', () => {
  const mockStore = configureStore()
  const initialState = {
    token: 'token_from_store'
  }
  const store = mockStore(initialState)

  test('should return token', async () => {
    const spy = spyAndMockFetch({})

    const f14 = new F14()
      .auth((dispatch, getState) => {
        return getState().token
      })
    f14.injectStore(store)

    await f14.get(url, true)
    const call = spy.mock.calls[0][0] as Request
    expect(Array.from(call.headers.keys()).length).toBe(1)
    expect(call.headers.get('Authorization')).toEqual('Bearer token_from_store')
  })

  test('should intercept 401 error', async () => {
    const spy = spyAndMockFetch({}, {
      ok: false,
      status: 401
    })

    const f14 = new F14()
      .intercept401((dispatch, getState) => {
        spyAndMockFetch(fakeList, {
          ok: true,
          status: 200
        })

        return Promise.resolve(true)
      })
    f14.injectStore(store)

    const result = await f14.get(url)
    expect(result).toEqual({
      ok: true,
      status: 200,
      data: fakeList
    })
    expect(spy).toHaveBeenCalledTimes(2)
  })

  test('should get 401 error in case interceptor is not implemeted', async () => {
    const spy = spyAndMockFetch({}, {
      ok: false,
      status: 401
    })

    const f14 = new F14()
    f14.injectStore(store)

    const result = await f14.get(url)
    expect(result).toEqual({
      ok: false,
      status: 401,
      data: undefined
    })
    expect(spy).toHaveBeenCalledTimes(1)
  })
})