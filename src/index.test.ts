import F14 from './'
import { apiEndpoint, apiUrl, fakeList, url } from './jest/data'
import { mockFetch, spyAndMockFetch, spyFetch } from './jest/helpers'

describe('F14 request options', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('use F14 and should check request url', async () => {
    const spy = spyAndMockFetch()

    const f14 = new F14()
    await f14.get(url)

    const call = spy.mock.calls[0][0] as Request
    expect(call.url).toEqual(url)
  })

  test('use F14 and should check settings api url and request endpoint', async () => {
    const spy = spyAndMockFetch()

    const f14 = new F14()
      .settings({
        apiUrl: apiUrl,
        headers: {}
      })
    await f14.get(apiEndpoint)

    const call = spy.mock.calls[0][0] as Request
    expect(call.url).toEqual(url)
  })

  test('request method type', async () => {
    const spy = spyFetch()

    const f14 = new F14()

    await f14.get(url)
    expect((spy.mock.calls[0][0] as Request).method).toEqual('GET')

    await f14.post(url)
    expect((spy.mock.calls[1][0] as Request).method).toEqual('POST')

    await f14.put(url)
    expect((spy.mock.calls[2][0] as Request).method).toEqual('PUT')

    await f14.patch(url)
    expect((spy.mock.calls[3][0] as Request).method).toEqual('PATCH')

    await f14.delete(url)
    expect((spy.mock.calls[4][0] as Request).method).toEqual('DELETE')
  })

  test('use F14 setting and should check headers', async () => {
    const spy = spyAndMockFetch()

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

  test('use F14 setting and should check auth header', async () => {
    const spy = spyAndMockFetch()

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
  afterEach(() => {
    jest.clearAllMocks()
  })

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
})
